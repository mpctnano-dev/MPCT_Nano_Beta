<?php
/*
 * includes/validation.php
 *
 * Shared validation + sanitization helpers used by every form handler in
 * this project (ServiceRequestSubmission.php, EquipmentReservation.php,
 * FormSubmission.php). Each endpoint require_once's this file and calls the
 * unprefixed names directly. Form-specific concerns (formatValue's option
 * map, the SR upload pipeline, mailer/SharePoint helpers in mpact_config.php)
 * stay out of here.
 *
 * Regex parity with JS/validation.js: emoji, mashing, name, and email
 * patterns must match the client-side rules byte-for-byte. If you change
 * one, change the other.
 */

if (defined('MPCT_VALIDATION_LOADED')) {
    return;
}
define('MPCT_VALIDATION_LOADED', true);


/* Trim + HTML-encode for safe HTML embedding. */
function clean(string $value): string
{
    return htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
}

/*
 * Read a POST field through clean(). The (string) cast guards against a
 * multi-value input (name="foo[]") landing under a single-value name.
 * Use post() ONLY for values going straight to HTML — values that pass
 * through formatValue() should read $_POST directly to avoid double-encoding.
 */
function post(string $key): string
{
    return isset($_POST[$key]) ? clean((string) $_POST[$key]) : '';
}

/*
 * Single exit point. ob_clean() discards any output that may have leaked
 * into the buffer (PHP notices, stray whitespace) so JSON is the only thing
 * the browser sees. Always HTTP 200 — the front-end checks JSON `success`.
 */
function respond(bool $ok, string $msg): void
{
    if (ob_get_length()) {
        ob_clean();
    }
    header('Content-Type: application/json');
    echo json_encode(['success' => $ok, 'message' => $msg]);
    exit;
}

/*
 * Sends the JSON response to the browser and lets the script keep running.
 *
 * Use this on the SUCCESS path when there is still server-side work to do
 * (SharePoint sync, audit logging, etc.) that the user should not have to
 * wait on. After this returns:
 *   - The user's browser already has the response and the spinner stops.
 *   - PHP keeps running on the server with stdout disconnected.
 *   - Any further `echo` is silently discarded — write to error_log instead.
 *   - The user cannot interrupt the rest of the script.
 *
 * Under PHP-FPM (the standard NAU webserver setup) fastcgi_finish_request()
 * flushes the response and detaches the user immediately. Under mod_php or
 * the CLI / built-in dev server, that function does not exist and we fall
 * back to flushing buffers — script still continues, the user just may
 * have to wait until script end for the connection to fully close.
 *
 * Failure paths should keep using respond(false): if email send failed
 * there is no point continuing with SharePoint sync, and we do want the
 * script to exit cleanly so the catch handler can return the error.
 */
function respondAndContinue(bool $ok, string $msg): void
{
    if (ob_get_length()) {
        ob_clean();
    }
    header('Content-Type: application/json');
    header('Connection: close');
    echo json_encode(['success' => $ok, 'message' => $msg]);

    if (function_exists('fastcgi_finish_request')) {
        fastcgi_finish_request();
    } else {
        @ob_end_flush();
        @flush();
    }
}

/*
 * Bail out if any required POST field is empty. The optional $labels map
 * lets the caller override the auto-generated label (e.g. 'NAU ID' instead
 * of 'Nau Id').
 */
function requireFields(array $keys, array $labels = []): void
{
    foreach ($keys as $key) {
        if (empty(post($key))) {
            $display = $labels[$key] ?? ucwords(str_replace('_', ' ', $key));
            respond(false, 'Missing required field: ' . $display . '.');
        }
    }
}

/*
 * Cap a POST field's length using mb_strlen so multi-byte UTF-8 counts as
 * one. $label is optional — when omitted, we auto-generate Title Case from
 * the field name. Optional keeps older 2-arg call sites working.
 */
function enforceMaxLength(string $field, int $max, ?string $label = null): void
{
    $val = trim($_POST[$field] ?? '');
    if (mb_strlen($val) > $max) {
        $label = $label ?? ucwords(str_replace('_', ' ', $field));
        respond(false, "$label exceeds the $max-character limit.");
    }
}

/* Numeric range check. Empty values pass — requireFields() owns "must be set". */
function validateNumericRange(string $field, float $min, float $max, string $label): void
{
    $val = trim($_POST[$field] ?? '');
    if ($val === '') return;
    if (!is_numeric($val)) {
        respond(false, "$label must be a valid number.");
    }
    $num = (float) $val;
    if ($num < $min || $num > $max) {
        respond(false, "$label must be between $min and $max.");
    }
}

/* Whole-number check. Rejects "1.5" but accepts "1" or "1.0". */
function validateInteger(string $field, string $label): void
{
    $val = trim($_POST[$field] ?? '');
    if ($val === '') return;
    if (!is_numeric($val) || floor((float) $val) != (float) $val) {
        respond(false, "$label must be a whole number.");
    }
}

/*
 * Date must parse as Y-m-d, must not be in the past, and must be within
 * 6 months. Mirrors the min/max attributes set by the client-side JS.
 */
function validateDateInRange(string $field, string $label): void
{
    $val = trim($_POST[$field] ?? '');
    if ($val === '') return;
    $date = DateTime::createFromFormat('Y-m-d', $val);
    if (!$date || $date->format('Y-m-d') !== $val) {
        respond(false, "$label must be a valid date (YYYY-MM-DD).");
    }
    $today   = new DateTime('today');
    $maxDate = (new DateTime('today'))->modify('+6 months');
    if ($date < $today)   respond(false, "$label cannot be in the past.");
    if ($date > $maxDate) respond(false, "$label must be within 6 months from today.");
}

/*
 * HTML / script-like content sniffer. First regex catches dangerous tags;
 * second catches event-handler attributes ("onclick=") and javascript: URIs
 * even when no <tag> is present.
 */
function containsHtmlTags(string $text): bool
{
    return (bool) preg_match(
        '/<\s*\/?(script|img|iframe|object|embed|svg|form|input|button|a\s|div|span|style|link|meta|base|body|html)\b/i',
        $text
    ) || (bool) preg_match('/(on\w+\s*=|javascript\s*:)/i', $text);
}

/*
 * Emoji detection. Uses \p{Extended_Pictographic} which is what the client-
 * side JS uses too — keeping the rule identical on both sides means the
 * server never rejects something the browser said was fine, and vice versa.
 */
function containsEmoji(string $text): bool
{
    return (bool) preg_match('/\p{Extended_Pictographic}/u', $text);
}

/* Keyboard-mashing heuristic: 4+ identical characters in a row. */
function looksLikeMashing(string $text): bool
{
    return (bool) preg_match('/(.)\1{3,}/u', $text);
}

/* Name field: Unicode letters, spaces, hyphens, apostrophes, dots only. */
function validateNameField(string $field, string $label): void
{
    $val = trim($_POST[$field] ?? '');
    if ($val === '') return;
    if (containsEmoji($val)) {
        respond(false, "$label cannot contain emoji.");
    }
    if (!preg_match('/^[\p{L}\s\'\-\.]+$/u', $val)) {
        respond(false, "$label should contain letters, spaces, hyphens, or apostrophes only.");
    }
}

/* General free-text rules: no HTML, no emoji, no mashing. */
function validateTextField(string $field, string $label): void
{
    $val = trim($_POST[$field] ?? '');
    if ($val === '') return;
    if (containsHtmlTags($val)) {
        respond(false, "$label cannot contain HTML or script-like content.");
    }
    if (containsEmoji($val)) {
        respond(false, "$label cannot contain emoji.");
    }
    if (looksLikeMashing($val)) {
        respond(false, "$label appears to contain invalid input. Please provide a meaningful response.");
    }
}

/*
 * Phone format check. The browser-side mask formats numbers as
 * (XXX) XXX-XXXX (max 14 chars), so anything beyond ~25 chars or
 * containing letters / script is the result of a hand-crafted POST.
 * We accept digits, spaces, parens, hyphens, dots, and a leading +
 * for international numbers. Empty values pass — the field is optional.
 */
function validatePhoneFormat(string $field, string $label): void
{
    $val = trim($_POST[$field] ?? '');
    if ($val === '') return;
    if (mb_strlen($val) > 25) {
        respond(false, "$label is too long.");
    }
    if (!preg_match('/^[\d\s().\-+]{7,25}$/', $val)) {
        respond(false, "$label format is invalid.");
    }
}

/* Word-count cap on a textarea. Matches the data-max-words HTML attribute. */
function enforceWordLimit(string $field, int $maxWords, string $label): void
{
    $val = trim($_POST[$field] ?? '');
    if ($val === '') return;
    $count = count(preg_split('/\s+/', $val, -1, PREG_SPLIT_NO_EMPTY));
    if ($count > $maxWords) {
        respond(false, "$label must not exceed $maxWords words (currently $count words).");
    }
}
