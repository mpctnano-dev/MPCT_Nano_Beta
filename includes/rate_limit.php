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
    if (!defined('RATE_LIMIT_IP_MAX') || !defined('RATE_LIMIT_EMAIL_MAX')) {
        return;
    }

    $windowSec = defined('RATE_LIMIT_WINDOW_SEC') ? (int) RATE_LIMIT_WINDOW_SEC : 300;
    $retentionDays = defined('RATE_LIMIT_RETENTION_DAYS') ? (int) RATE_LIMIT_RETENTION_DAYS : 7;

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
}

function processRateLimitKey(
    RateLimitStoreInterface $store,
    string $key,
    int $max,
    int $windowSec,
    int $retentionDays,
    string $rejectMessage
): void {
    $now = time();
    $record = $store->load($key);

    if ($record !== null) {
        $retentionCutoff = $now - ($retentionDays * 86400);
        if ($record['last_seen'] < $retentionCutoff) {
            $store->delete($key);
            $record = null;
        }
    }

    if ($record === null) {
        $store->save($key, [
            'count' => 1,
            'window_start' => $now,
            'last_seen' => $now,
        ]);
        return;
    }

    $elapsed = $now - $record['window_start'];
    if ($elapsed >= $windowSec) {
        $store->save($key, [
            'count' => 1,
            'window_start' => $now,
            'last_seen' => $now,
        ]);
        return;
    }

    if ($record['count'] >= $max) {
        respond(false, $rejectMessage);
    }

    $record['count']++;
    $record['last_seen'] = $now;
    $store->save($key, $record);
}
