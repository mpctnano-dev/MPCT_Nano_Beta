<?php

require_once __DIR__ . '/RateLimitStoreInterface.php';

class JsonFileRateLimitStore implements RateLimitStoreInterface
{
    private string $directory;

    public function __construct(string $directory)
    {
        $this->directory = rtrim($directory, '/\\');
        if (!is_dir($this->directory) && !mkdir($this->directory, 0775, true) && !is_dir($this->directory)) {
            throw new RuntimeException('Unable to create rate limit storage directory: ' . $this->directory);
        }
    }

    public function load(string $key): ?array
    {
        $path = $this->pathForKey($key);
        if (!is_file($path)) {
            return null;
        }

        $raw = file_get_contents($path);
        if ($raw === false) {
            return null;
        }

        $data = json_decode($raw, true);
        if (!is_array($data)) {
            $this->delete($key);
            return null;
        }

        if (!isset($data['count'], $data['window_start'], $data['last_seen'])) {
            $this->delete($key);
            return null;
        }

        return [
            'count' => (int) $data['count'],
            'window_start' => (int) $data['window_start'],
            'last_seen' => (int) $data['last_seen'],
        ];
    }

    public function save(string $key, array $record): void
    {
        $payload = [
            'key' => $key,
            'count' => (int) $record['count'],
            'window_start' => (int) $record['window_start'],
            'last_seen' => (int) $record['last_seen'],
        ];

        $path = $this->pathForKey($key);
        $tmp = $path . '.tmp.' . getmypid();
        $encoded = json_encode($payload, JSON_PRETTY_PRINT);
        if ($encoded === false) {
            throw new RuntimeException('Unable to encode rate limit record.');
        }

        if (file_put_contents($tmp, $encoded, LOCK_EX) === false) {
            throw new RuntimeException('Unable to write rate limit record.');
        }

        if (!rename($tmp, $path)) {
            @unlink($tmp);
            throw new RuntimeException('Unable to persist rate limit record.');
        }
    }

    public function delete(string $key): void
    {
        $path = $this->pathForKey($key);
        if (is_file($path)) {
            @unlink($path);
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
                @unlink($file);
                continue;
            }

            if ((int) $data['last_seen'] < $cutoff) {
                @unlink($file);
            }
        }
    }

    private function pathForKey(string $key): string
    {
        return $this->directory . '/' . hash('sha256', $key) . '.json';
    }
}
