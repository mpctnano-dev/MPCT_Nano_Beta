<?php
/**
 * includes/turnstile.php
 *
 * Server-side Cloudflare Turnstile verification for all form handlers.
 * Call verifyTurnstile() immediately after confirming the request is POST.
 *
 * Requires TURNSTILE_SECRET_KEY in mpact_config.php.
 */

if (defined('MPCT_TURNSTILE_LOADED')) {
    return;
}
define('MPCT_TURNSTILE_LOADED', true);

function turnstileIsConfigured(): bool
{
    if (!defined('TURNSTILE_SECRET_KEY')) {
        return false;
    }

    $secret = trim((string) TURNSTILE_SECRET_KEY);

    return $secret !== ''
        && $secret !== 'REPLACE_WITH_YOUR_SECRET_KEY';
}

function verifyTurnstile(): void
{
    if (!turnstileIsConfigured()) {
        respond(false, 'Security verification is not configured on the server. Please contact the site administrator.');
    }

    $token = trim($_POST['cf-turnstile-response'] ?? '');
    if ($token === '') {
        respond(false, 'Please complete the security check.');
    }

    $payload = http_build_query([
        'secret'   => TURNSTILE_SECRET_KEY,
        'response' => $token,
        'remoteip' => $_SERVER['REMOTE_ADDR'] ?? '',
    ]);

    $ch = curl_init('https://challenges.cloudflare.com/turnstile/v0/siteverify');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);

    $raw = curl_exec($ch);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($raw === false) {
        error_log('MPCT Turnstile siteverify curl error: ' . $curlError);
        respond(false, 'Security verification is temporarily unavailable. Please try again in a moment.');
    }

    $result = json_decode($raw, true);
    if (!is_array($result) || empty($result['success'])) {
        $codes = isset($result['error-codes']) ? implode(', ', (array) $result['error-codes']) : 'unknown';
        error_log('MPCT Turnstile siteverify failed: ' . $codes);
        respond(false, 'Security verification failed. Please try again.');
    }
}
