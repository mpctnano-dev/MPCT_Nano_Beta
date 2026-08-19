<?php
/**
 * includes/rate_limit.php
 *
 * Shared IP + email rate limiting for form handlers.
 */

if (defined('MPCT_RATE_LIMIT_LOADED')) {
    return;
}
define('MPCT_RATE_LIMIT_LOADED', true);

require_once __DIR__ . '/rate_limit/RateLimitStoreFactory.php';
require_once __DIR__ . '/rate_limit_config.php';

function getClientIp(): string
{
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

function normalizeEmail(string $email): ?string
{
    $email = strtolower(trim($email));
    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return null;
    }

    return $email;
}

function checkRateLimits(string $ip, string $emailRaw): void
{
    $windowSec = (int) RATE_LIMIT_WINDOW_SEC;
    $retentionDays = (int) RATE_LIMIT_RETENTION_DAYS;

    // Fail open. A storage fault must never cost us a genuine enquiry from a
    // prospective student or research partner — losing those is worse than
    // letting spam through until someone reads the log. A real reject is not
    // affected: processRateLimitKey() calls respond(), which exits before
    // this catch can see it.
    try {
        $store = RateLimitStoreFactory::create();

        processRateLimitKey(
            $store,
            'ip:' . $ip,
            (int) RATE_LIMIT_IP_MAX,
            $windowSec,
            $retentionDays,
            'Too many submissions from your network. Please try again later.'
        );

        $email = normalizeEmail($emailRaw);
        if ($email !== null) {
            processRateLimitKey(
                $store,
                'email:' . $email,
                (int) RATE_LIMIT_EMAIL_MAX,
                $windowSec,
                $retentionDays,
                'Too many submissions for this email address. Please try again later.'
            );
        }

        if (mt_rand(1, 100) === 1) {
            $store->cleanupExpired($retentionDays);
        }
    } catch (Throwable $e) {
        if (function_exists('mpactLogInternalError')) {
            mpactLogInternalError('MPCT rate limit skipped', $e);
        } else {
            error_log('MPCT rate limit skipped');
        }
    }
}

function processRateLimitKey(
    RateLimitStoreInterface $store,
    string $key,
    int $max,
    int $windowSec,
    int $retentionDays,
    string $rejectMessage
): void {
    if (!$store->consume($key, $max, $windowSec, $retentionDays)) {
        respond(false, $rejectMessage);
    }
}
