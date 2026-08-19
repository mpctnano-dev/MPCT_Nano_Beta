<?php

require_once __DIR__ . '/RateLimitStoreInterface.php';

class JsonFileRateLimitStore implements RateLimitStoreInterface
{
    private string $directory;

    public function __construct(string $directory)
    {
        $this->directory = rtrim($directory, '/\\');
        if (!is_dir($this->directory) && !mkdir($this->directory, 0775, true) && !is_dir($this->directory)) {
            throw new RuntimeException('Unable to create rate limit storage directory');
        }
    }

    public function consume(string $key, int $max, int $windowSec, int $retentionDays): bool
    {
        $path = $this->pathForKey($key);
        $fh = fopen($path, 'c+b');
        if ($fh === false) {
            throw new RuntimeException('Unable to open rate limit record.');
        }

        try {
            if (!flock($fh, LOCK_EX)) {
                throw new RuntimeException('Unable to lock rate limit record.');
            }

            $raw = stream_get_contents($fh);
            if ($raw === false) {
                throw new RuntimeException('Unable to read rate limit record.');
            }

            $record = $this->parseRecord($raw);
            $next = RateLimitDecision::next($record, $max, $windowSec, $retentionDays);
            if ($next === null) {
                return false;
            }

            $this->writeHandle($fh, $key, $next);
            return true;
        } finally {
            flock($fh, LOCK_UN);
            fclose($fh);
        }
    }

    public function load(string $key): ?array
    {
        $path = $this->pathForKey($key);
        if (!is_file($path)) {
            return null;
        }

        $fh = fopen($path, 'rb');
        if ($fh === false) {
            throw new RuntimeException('Unable to open rate limit record.');
        }

        try {
            if (!flock($fh, LOCK_SH)) {
                throw new RuntimeException('Unable to lock rate limit record.');
            }

            $raw = stream_get_contents($fh);
            if ($raw === false) {
                throw new RuntimeException('Unable to read rate limit record.');
            }

            return $this->parseRecord($raw);
        } finally {
            flock($fh, LOCK_UN);
            fclose($fh);
        }
    }

    public function save(string $key, array $record): void
    {
        $path = $this->pathForKey($key);
        $fh = fopen($path, 'c+b');
        if ($fh === false) {
            throw new RuntimeException('Unable to open rate limit record.');
        }

        try {
            if (!flock($fh, LOCK_EX)) {
                throw new RuntimeException('Unable to lock rate limit record.');
            }

            $this->writeHandle($fh, $key, $record);
        } finally {
            flock($fh, LOCK_UN);
            fclose($fh);
        }
    }

    public function delete(string $key): void
    {
        $path = $this->pathForKey($key);
        if (is_file($path) && !@unlink($path)) {
            throw new RuntimeException('Unable to delete rate limit record.');
        }
    }

    public function cleanupExpired(int $retentionDays): void
    {
        $cutoff = time() - ($retentionDays * 86400);
        $files = glob($this->directory . '/*.json');
        if ($files === false) {
            return;
        }

        foreach ($files as $file) {
            $raw = @file_get_contents($file);
            if ($raw === false) {
                continue;
            }

            $data = json_decode($raw, true);
            if (!is_array($data) || !isset($data['last_seen'])) {
                continue;
            }

            if ((int) $data['last_seen'] < $cutoff) {
                @unlink($file);
            }
        }
    }

    public function describe(): string
    {
        return 'json:' . $this->directory;
    }

    /**
     * @param array{count:int,window_start:int,last_seen:int} $record
     * @param resource $fh
     */
    private function writeHandle($fh, string $key, array $record): void
    {
        $encoded = json_encode([
            'key' => $key,
            'count' => (int) $record['count'],
            'window_start' => (int) $record['window_start'],
            'last_seen' => (int) $record['last_seen'],
        ], JSON_PRETTY_PRINT);
        if ($encoded === false) {
            throw new RuntimeException('Unable to encode rate limit record.');
        }

        if (fseek($fh, 0) !== 0 || !ftruncate($fh, 0)) {
            throw new RuntimeException('Unable to persist rate limit record.');
        }
        if (fwrite($fh, $encoded) === false) {
            throw new RuntimeException('Unable to persist rate limit record.');
        }
        if (!fflush($fh)) {
            throw new RuntimeException('Unable to persist rate limit record.');
        }
    }

    /**
     * @return array{count:int,window_start:int,last_seen:int}|null
     */
    private function parseRecord(string $raw): ?array
    {
        if (trim($raw) === '') {
            return null;
        }

        // A truncated or corrupt file is treated as "no record" so the next
        // write repairs it. Throwing here would lock that email or IP out
        // permanently, with no way back short of deleting the file by hand.
        $data = json_decode($raw, true);
        if (!is_array($data) || !isset($data['count'], $data['window_start'], $data['last_seen'])) {
            return null;
        }

        return [
            'count' => (int) $data['count'],
            'window_start' => (int) $data['window_start'],
            'last_seen' => (int) $data['last_seen'],
        ];
    }

    private function pathForKey(string $key): string
    {
        return $this->directory . '/' . hash('sha256', $key) . '.json';
    }
}
