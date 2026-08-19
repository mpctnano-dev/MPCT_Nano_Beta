<?php

require_once __DIR__ . '/RateLimitStoreInterface.php';

class SqliteRateLimitStore implements RateLimitStoreInterface
{
    private PDO $pdo;
    private string $databasePath;

    public function __construct(string $databasePath)
    {
        $this->databasePath = $databasePath;
        $directory = dirname($databasePath);
        if (!is_dir($directory) && !mkdir($directory, 0775, true) && !is_dir($directory)) {
            throw new RuntimeException('Unable to create rate limit storage directory');
        }

        if (!in_array('sqlite', PDO::getAvailableDrivers(), true)) {
            throw new RuntimeException('Rate limit storage driver is not available');
        }

        $this->pdo = new PDO('sqlite:' . $databasePath);
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->pdo->exec('PRAGMA busy_timeout = 5000');
        $this->initializeSchema();
    }

    public function consume(string $key, int $max, int $windowSec, int $retentionDays): bool
    {
        // Must go through PDO's own transaction API. Opening one with a raw
        // exec('BEGIN') leaves PDO's internal flag unset, and commit() then
        // throws "There is no active transaction".
        $this->pdo->beginTransaction();
        try {
            $record = $this->load($key);
            $next = RateLimitDecision::next($record, $max, $windowSec, $retentionDays);
            if ($next !== null) {
                $this->save($key, $next);
            }

            $this->pdo->commit();

            return $next !== null;
        } catch (Throwable $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            throw $e;
        }
    }

    public function load(string $key): ?array
    {
        $stmt = $this->pdo->prepare(
            'SELECT count, window_start, last_seen FROM rate_limits WHERE rate_key = :rate_key LIMIT 1'
        );
        $stmt->execute(['rate_key' => $key]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            return null;
        }

        return [
            'count' => (int) $row['count'],
            'window_start' => (int) $row['window_start'],
            'last_seen' => (int) $row['last_seen'],
        ];
    }

    public function save(string $key, array $record): void
    {
        // INSERT OR REPLACE, not ON CONFLICT ... DO UPDATE: UPSERT needs
        // SQLite 3.24+ and nano.nau.edu ships 3.7.17, where it is a syntax
        // error. Every column is written here, so the two are equivalent.
        $stmt = $this->pdo->prepare(
            'INSERT OR REPLACE INTO rate_limits (rate_key, count, window_start, last_seen)
             VALUES (:rate_key, :count, :window_start, :last_seen)'
        );

        $stmt->execute([
            'rate_key' => $key,
            'count' => (int) $record['count'],
            'window_start' => (int) $record['window_start'],
            'last_seen' => (int) $record['last_seen'],
        ]);
    }

    public function delete(string $key): void
    {
        $stmt = $this->pdo->prepare('DELETE FROM rate_limits WHERE rate_key = :rate_key');
        $stmt->execute(['rate_key' => $key]);
    }

    public function cleanupExpired(int $retentionDays): void
    {
        $cutoff = time() - ($retentionDays * 86400);
        $stmt = $this->pdo->prepare('DELETE FROM rate_limits WHERE last_seen < :cutoff');
        $stmt->execute(['cutoff' => $cutoff]);
    }

    public function describe(): string
    {
        return 'sqlite:' . $this->databasePath;
    }

    private function initializeSchema(): void
    {
        $this->pdo->exec(
            'CREATE TABLE IF NOT EXISTS rate_limits (
                rate_key TEXT PRIMARY KEY,
                count INTEGER NOT NULL,
                window_start INTEGER NOT NULL,
                last_seen INTEGER NOT NULL
            )'
        );
        $this->pdo->exec(
            'CREATE INDEX IF NOT EXISTS idx_rate_limits_last_seen ON rate_limits(last_seen)'
        );
    }
}
