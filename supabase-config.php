<?php
/**
 * supabase-config.php
 *
 * Exposes the Supabase project URL and publishable key to the browser so the
 * booking page can read the equipment catalog and slot availability directly.
 *
 * The publishable key is designed to be public: every reservation table denies
 * it, and the only calls it can make are the two read functions. The intake
 * secret that authorises writes stays server-side in mpact_config.php.
 */

require_once __DIR__ . '/mpact_config.php';

header('Content-Type: application/javascript; charset=UTF-8');
header('Cache-Control: no-store');

$config = [
    'url' => defined('SUPABASE_URL') ? (string) SUPABASE_URL : '',
    'key' => defined('SUPABASE_PUBLISHABLE_KEY') ? (string) SUPABASE_PUBLISHABLE_KEY : '',
];

echo 'window.MPCT_SUPABASE=' . json_encode($config, JSON_UNESCAPED_SLASHES) . ';';
