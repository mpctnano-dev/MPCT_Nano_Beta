<?php
/**
 * sandbox/bootstrap.php
 *
 * Loads sandbox placeholder config when MPCT_SANDBOX=1 (Docker local POC).
 * Otherwise loads production mpact_config.php unchanged.
 */

if (defined('MPCT_CONFIG_LOADED')) {
    return;
}

$sandboxEnabled = getenv('MPCT_SANDBOX');
if ($sandboxEnabled === '1' || $sandboxEnabled === 'true') {
    define('MPCT_SANDBOX', 1);

    $localOverride = __DIR__ . '/mpact_config.local.php';
    $sandboxConfig = __DIR__ . '/mpact_config.sandbox.php';

    if (file_exists($localOverride)) {
        require_once $localOverride;
    } elseif (file_exists($sandboxConfig)) {
        require_once $sandboxConfig;
    } else {
        http_response_code(500);
        exit('Sandbox mode enabled but sandbox config not found.');
    }

    define('MPCT_CONFIG_LOADED', true);
    return;
}

require_once __DIR__ . '/../mpact_config.php';
define('MPCT_CONFIG_LOADED', true);
