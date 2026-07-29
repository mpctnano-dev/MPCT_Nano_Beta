<?php
/**
 * csrf-token.php
 *
 * Issues / refreshes the double-submit CSRF cookie and exposes the same
 * value to the browser as window.MPCT_CSRF_TOKEN (cookie is HttpOnly).
 */

require_once __DIR__ . '/includes/csrf.php';

header('Content-Type: application/javascript; charset=UTF-8');
header('Cache-Control: no-store');

$token = csrfIssueToken();

echo 'window.MPCT_CSRF_TOKEN=' . json_encode($token, JSON_UNESCAPED_SLASHES) . ';';
