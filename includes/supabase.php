<?php
/*
 * includes/supabase.php
 *
 * Thin client for the Supabase RPC endpoints backing the MPaCT LIMS
 * database. Only stored functions are called — never tables directly —
 * so every write goes through the validation and authorisation the
 * database itself enforces.
 *
 * Requires: mpact_config.php must be included before this file
 * (SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_INTAKE_SECRET).
 */

if (defined('MPCT_SUPABASE_LOADED')) {
    return;
}
define('MPCT_SUPABASE_LOADED', true);


/*
 * True when the config carries a usable intake secret. Lets callers skip
 * the Supabase step entirely on an environment that has not been set up
 * (local sandbox, staging) rather than emitting a failure alert.
 */
function supabaseIsConfigured(): bool
{
    foreach (['SUPABASE_URL', 'SUPABASE_PUBLISHABLE_KEY', 'SUPABASE_INTAKE_SECRET'] as $key) {
        if (!defined($key) || trim((string) constant($key)) === '') {
            return false;
        }
    }

    return SUPABASE_INTAKE_SECRET !== 'REPLACE_WITH_INTAKE_SECRET';
}


/*
 * Call a Supabase stored function and return its decoded result.
 *
 * Throws RuntimeException on transport failure or any non-2xx response,
 * with the database's own error message when it sent one. Callers run
 * inside a try/catch and turn the throw into a failure alert.
 *
 * $args is sent as the JSON body. Never log it: the intake secret is one
 * of its values.
 */
function supabaseRpc(string $function, array $args, int $timeoutSeconds = 15)
{
    if (!function_exists('curl_init')) {
        throw new RuntimeException('Supabase call failed: curl extension is not available');
    }

    $url  = rtrim(SUPABASE_URL, '/') . '/rest/v1/rpc/' . rawurlencode($function);
    $body = json_encode($args, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

    if ($body === false) {
        throw new RuntimeException('Supabase call failed: request could not be encoded');
    }

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $body,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => $timeoutSeconds,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
        CURLOPT_HTTPHEADER     => [
            'apikey: ' . SUPABASE_PUBLISHABLE_KEY,
            'Authorization: Bearer ' . SUPABASE_PUBLISHABLE_KEY,
            'Content-Type: application/json',
            'Accept: application/json',
        ],
    ]);

    $raw   = curl_exec($ch);
    $error = curl_error($ch);
    $code  = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if ($raw === false) {
        throw new RuntimeException('Supabase call failed: ' . $error);
    }

    if ($code < 200 || $code >= 300) {
        throw new RuntimeException(
            'Supabase call failed: HTTP ' . $code . ' — ' . supabaseErrorMessage((string) $raw)
        );
    }

    return json_decode((string) $raw, true);
}


/*
 * Pull the human-readable message out of a PostgREST error body, falling
 * back to a trimmed copy of the raw response when it is not the shape we
 * expect. Kept short so it stays readable in an alert email.
 */
function supabaseErrorMessage(string $raw): string
{
    $decoded = json_decode($raw, true);

    if (is_array($decoded)) {
        $parts = array_filter([
            $decoded['message'] ?? null,
            isset($decoded['code']) ? '(' . $decoded['code'] . ')' : null,
        ]);

        if ($parts) {
            return implode(' ', $parts);
        }
    }

    return mb_substr(trim($raw), 0, 300);
}
