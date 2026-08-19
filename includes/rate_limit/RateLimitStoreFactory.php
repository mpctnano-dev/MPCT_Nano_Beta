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

        $tempDir = rtrim(sys_get_temp_dir(), '/\\') . '/mpct-rate-limits';
        $lastError = null;

        foreach (self::candidates($driver, $baseDir, $tempDir) as $make) {
            try {
                self::$instance = $make();
                error_log('MPCT rate limit store ready: ' . self::$instance->describe());
                return self::$instance;
            } catch (Throwable $e) {
                $lastError = $e;
                error_log('MPCT rate limit store init failed: ' . $e->getMessage());
            }
        }

        throw $lastError ?? new RuntimeException('Unable to initialize rate limit storage.');
    }

    /**
     * Preferred store first, then fallbacks that still rate-limit when
     * pdo_sqlite is missing or data/rate-limits is not writable.
     *
     * @return array<int, callable(): RateLimitStoreInterface>
     */
    private static function candidates(string $driver, string $baseDir, string $tempDir): array
    {
        $sqliteThenJson = [
            static fn () => new SqliteRateLimitStore($baseDir . '/rate_limits.sqlite'),
            static fn () => new JsonFileRateLimitStore($baseDir . '/json'),
            static fn () => new SqliteRateLimitStore($tempDir . '/rate_limits.sqlite'),
            static fn () => new JsonFileRateLimitStore($tempDir . '/json'),
        ];

        if ($driver === 'json') {
            return [
                static fn () => new JsonFileRateLimitStore($baseDir . '/json'),
                static fn () => new JsonFileRateLimitStore($tempDir . '/json'),
            ];
        }

        if ($driver === 'sqlite' || $driver === '') {
            return $sqliteThenJson;
        }

        error_log('MPCT rate limit storage driver rejected');
        throw new RuntimeException('Unable to initialize rate limit storage.');
    }

    public static function reset(): void
    {
        self::$instance = null;
    }
}
