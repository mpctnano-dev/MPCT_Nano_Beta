<?php
/**
 * Production rate limit thresholds (non-secret).
 *
 * Form handlers load mpact_config.php first; these defaults apply when
 * constants are not defined there.
 */
if (!defined('RATE_LIMIT_IP_MAX')) {
    define('RATE_LIMIT_IP_MAX', 5);
}
if (!defined('RATE_LIMIT_EMAIL_MAX')) {
    define('RATE_LIMIT_EMAIL_MAX', 2);
}
if (!defined('RATE_LIMIT_WINDOW_SEC')) {
    define('RATE_LIMIT_WINDOW_SEC', 300);
}
if (!defined('RATE_LIMIT_RETENTION_DAYS')) {
    define('RATE_LIMIT_RETENTION_DAYS', 7);
}
if (!defined('RATE_LIMIT_STORAGE')) {
    define('RATE_LIMIT_STORAGE', 'sqlite');
}
if (!defined('RATE_LIMIT_DATA_DIR')) {
    define('RATE_LIMIT_DATA_DIR', dirname(__DIR__) . '/data/rate-limits');
}
