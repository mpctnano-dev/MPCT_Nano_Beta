<?php
/**
 * Production rate limit thresholds (non-secret).
 *
 * Form handlers load mpact_config.php first; these defaults apply when
 * constants are not defined there.
 *
 * Storage is 'json' — plain files guarded by flock. The SQLite driver is
 * kept as a fallback, but nano.nau.edu ships SQLite 3.7.17, which is older
 * than the UPSERT syntax the driver needs, so JSON is the supported mode
 * in production.
 *
 * PHP creates data/rate-limits itself, but only if the account running
 * PHP-FPM can write to data/. On nano.nau.edu that account is sce.nau.edu
 * while data/ is owned by spg99:nau mode 0770, so an administrator has to
 * create the directory for it. Until that happens the factory falls back to
 * the system temp directory: counting still works, but the counters reset
 * whenever PHP restarts.
 *
 * The empty folder is kept in git via .gitkeep; runtime counter files stay
 * gitignored.
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
    define('RATE_LIMIT_STORAGE', 'json');
}
if (!defined('RATE_LIMIT_DATA_DIR')) {
    define('RATE_LIMIT_DATA_DIR', dirname(__DIR__) . '/data/rate-limits');
}
