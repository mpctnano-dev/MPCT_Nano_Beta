<?php
/**
 * includes/csrf.php
 *
 * Double-submit cookie CSRF protection for public form handlers.
 * Issue tokens via csrf-token.php; call verifyCsrfToken() after the
 * honeypot check and before verifyTurnstile().
 *
 * Depends on respond() from validation.php (callers must require it first).
 */

if (defined('MPCT_CSRF_LOADED')) {
    return;
}
define('MPCT_CSRF_LOADED', true);

define('MPCT_CSRF_COOKIE', 'csrf_token');
define('MPCT_CSRF_FIELD', 'csrf_token');
define('MPCT_CSRF_BYTES', 32);

function csrfIsHttps(): bool
{
    if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
        return true;
    }

    if (isset($_SERVER['SERVER_PORT']) && (int) $_SERVER['SERVER_PORT'] === 443) {
        return true;
    }

    $forwarded = strtolower((string) ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? ''));

    return $forwarded === 'https';
}

function csrfGenerateToken(): string
{
    return bin2hex(random_bytes(MPCT_CSRF_BYTES));
}

function csrfTokenLooksValid(string $token): bool
{
    return (bool) preg_match('/^[a-f0-9]{64}$/', $token);
}

function csrfSetCookie(string $token): void
{
    setcookie(MPCT_CSRF_COOKIE, $token, [
        'expires'  => 0,
        'path'     => '/',
        'secure'   => csrfIsHttps(),
        'httponly' => true,
        'samesite' => 'Lax',
    ]);

    $_COOKIE[MPCT_CSRF_COOKIE] = $token;
}

/**
 * Return an existing valid cookie token or mint a new one, and (re)set the cookie.
 */
function csrfIssueToken(): string
{
    $existing = (string) ($_COOKIE[MPCT_CSRF_COOKIE] ?? '');
    if (csrfTokenLooksValid($existing)) {
        csrfSetCookie($existing);
        return $existing;
    }

    $token = csrfGenerateToken();
    csrfSetCookie($token);
    return $token;
}

/**
 * Reject the request unless cookie + POST field are present and match.
 */
function verifyCsrfToken(): void
{
    $cookie = (string) ($_COOKIE[MPCT_CSRF_COOKIE] ?? '');
    $posted = (string) ($_POST[MPCT_CSRF_FIELD] ?? '');

    if ($cookie === '' || $posted === '' || !csrfTokenLooksValid($cookie) || !csrfTokenLooksValid($posted)) {
        respond(false, 'Unable to process your submission. Please refresh the page and try again.');
    }

    if (!hash_equals($cookie, $posted)) {
        respond(false, 'Unable to process your submission. Please refresh the page and try again.');
    }
}
