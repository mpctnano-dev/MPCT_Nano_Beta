<?php
/**
 * includes/honeypot.php
 *
 * Hidden-field honeypot check for form handlers.
 * Call rejectIfHoneypotFilled() immediately after confirming the request is POST,
 * before verifyTurnstile().
 *
 * Depends on respond() from validation.php (callers must require validation.php first).
 */

if (defined('MPCT_HONEYPOT_LOADED')) {
    return;
}
define('MPCT_HONEYPOT_LOADED', true);

function rejectIfHoneypotFilled(): void
{
    if (trim($_POST['website'] ?? '') !== '') {
        respond(false, 'Unable to process your submission. Please try again.');
    }
}
