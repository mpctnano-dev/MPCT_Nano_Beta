<?php

interface RateLimitStoreInterface
{
    /**
     * Atomically load, apply the window/count rules, and persist.
     * Returns false when the key is already at max for the current window.
     *
     * @throws RuntimeException on I/O failure
     */
    public function consume(string $key, int $max, int $windowSec, int $retentionDays): bool;

    /**
     * @return array{count:int,window_start:int,last_seen:int}|null
     */
    public function load(string $key): ?array;

    /**
     * @param array{count:int,window_start:int,last_seen:int} $record
     */
    public function save(string $key, array $record): void;

    public function delete(string $key): void;

    public function cleanupExpired(int $retentionDays): void;

    public function describe(): string;
}

final class RateLimitDecision
{
    /**
     * @param array{count:int,window_start:int,last_seen:int}|null $record
     * @return array{count:int,window_start:int,last_seen:int}|null Null means reject this request.
     */
    public static function next(?array $record, int $max, int $windowSec, int $retentionDays): ?array
    {
        $now = time();

        if ($record !== null) {
            $retentionCutoff = $now - ($retentionDays * 86400);
            if ($record['last_seen'] < $retentionCutoff) {
                $record = null;
            }
        }

        if ($record === null) {
            return [
                'count' => 1,
                'window_start' => $now,
                'last_seen' => $now,
            ];
        }

        if (($now - $record['window_start']) >= $windowSec) {
            return [
                'count' => 1,
                'window_start' => $now,
                'last_seen' => $now,
            ];
        }

        if ($record['count'] >= $max) {
            return null;
        }

        $record['count']++;
        $record['last_seen'] = $now;

        return $record;
    }
}
