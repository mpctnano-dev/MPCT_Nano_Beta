<?php

require_once __DIR__ . '/JsonFileRateLimitStore.php';
require_once __DIR__ . '/SqliteRateLimitStore.php';

class RateLimitStoreFactory
{
    private static ?RateLimitStoreInterface $instance = null;

    public static function create(): RateLimitStoreInterface
    {
        if (self::$instance instanceof RateLimitStoreInterface) {
            return self::$instance;
        }

        $baseDir = defined('RATE_LIMIT_DATA_DIR')
            ? RATE_LIMIT_DATA_DIR
            : dirname(__DIR__, 2) . '/data/rate-limits';

        $driver = defined('RATE_LIMIT_STORAGE')
            ? strtolower((string) RATE_LIMIT_STORAGE)
            : strtolower((string) (getenv('RATE_LIMIT_STORAGE') ?: 'sqlite'));

        if ($driver === 'sqlite') {
            self::$instance = new SqliteRateLimitStore($baseDir . '/rate_limits.sqlite');
            return self::$instance;
        }

        // JSON file storage — kept for future use; set RATE_LIMIT_STORAGE=json to enable.
        // if ($driver === 'json') {
        //     self::$instance = new JsonFileRateLimitStore($baseDir . '/json');
        //     return self::$instance;
        // }

        throw new RuntimeException('Unsupported rate limit storage driver: ' . $driver);
    }

    public static function reset(): void
    {
        self::$instance = null;
    }
}
