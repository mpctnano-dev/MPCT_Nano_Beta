<?php
/**
 * turnstile-config.php
 *
 * Exposes the public Turnstile site key to the browser as a JS global.
 * The secret key never leaves the server — it lives in mpact_config.php only.
 */

require_once __DIR__ . '/mpact_config.php';

header('Content-Type: application/javascript; charset=UTF-8');
header('Cache-Control: no-store');

$siteKey = defined('TURNSTILE_SITE_KEY') ? (string) TURNSTILE_SITE_KEY : '';

echo 'window.MPCT_TURNSTILE_SITE_KEY=' . json_encode($siteKey, JSON_UNESCAPED_SLASHES) . ';';
