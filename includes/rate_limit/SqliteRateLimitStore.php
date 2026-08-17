<?php

require_once __DIR__ . '/RateLimitStoreInterface.php';

class SqliteRateLimitStore implements RateLimitStoreInterface
{
    private PDO $pdo;

    public function __construct(string $databasePath)
    {
        $directory = dirname($databasePath);
        if (!is_dir($directory) && !mkdir($directory, 0775, true) && !is_dir($directory)) {
            throw new RuntimeException('Unable to create rate limit storage directory: ' . $directory);
        }

        $this->pdo = new PDO('sqlite:' . $databasePath);
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->initializeSchema();
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
        $stmt = $this->pdo->prepare(
            'INSERT INTO rate_limits (rate_key, count, window_start, last_seen)
             VALUES (:rate_key, :count, :window_start, :last_seen)
             ON CONFLICT(rate_key) DO UPDATE SET
                count = excluded.count,
                window_start = excluded.window_start,
                last_seen = excluded.last_seen'
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
