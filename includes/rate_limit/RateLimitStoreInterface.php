<?php

interface RateLimitStoreInterface
{
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
}
