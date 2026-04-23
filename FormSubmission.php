<?php
/*
 * FormSubmission.php
 * ------------------
 * Backend handler for ALL contact forms on Contact_Us.html.
 *
 * Contact_Us.html has nine different form categories (equipment inquiry,
 * research partnerships, billing, training, courses, tour, vendor/sales,
 * general, and issue reporting). All of them POST to this one file.
 * The category field tells us which form was submitted and which fields
 * to expect in the request.
 *
 * Flow from form submission to email:
 *   1. Browser hits Submit → JavaScript POSTs form data here (no page reload)
 *   2. We confirm it's POST, check required fields are present
 *   3. We look up the category in $categories to know which fields to expect
 *   4. We loop through those fields, translate machine values to readable labels,
 *      and build the HTML rows for the email table
 *   5. Two emails are built and sent:
 *        - Lab inbox notification with contact info and submission details
 *        - User confirmation with a receipt of what they submitted
 *   6. JSON response goes back to the browser so the frontend can show
 *      the success/error message without a page reload
 *
 * Mail delivery:
 *   NAU's internal SMTP relay (mailgate.nau.edu, port 25) handles delivery.
 *   It doesn't require authentication — it trusts traffic from within the
 *   university network. PHPMailer is loaded from the PHPMailer/ folder
 *   directly, no Composer or autoloader required.
 *
 * Anti-spam measures baked in:
 *   - Both HTML and plain text versions are included (multipart/alternative)
 *   - From address is @nau.edu, matching the relay's trusted domain
 *   - Message-ID header uses @nau.edu to match the sender
 *   - Full DOCTYPE + html/head/body structure (email clients use this to
 *     assess legitimacy — bare HTML fragments score lower)
 *   - X-Mailer header identifies the sending system
 *   - Reply-To set to the submitter so replies reach the right person
 */


// Buffer any stray output so a PHP notice can't corrupt the JSON response.
// respond() calls ob_clean() before writing the body.
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// PHPMailer is bundled in the PHPMailer/ folder — no package manager needed.
// Exception.php must come before PHPMailer.php since PHPMailer references it.
// Using __DIR__ means these paths work correctly regardless of the web server's
// current working directory when it executes this script.
require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


// ---------------------------------------------------------------
// CONFIGURATION
// All the values that might need to change over time are constants
// up here — easy to find and update without hunting through the code.
//
// LAB_EMAIL   — where the notification lands when someone submits a form
// SENDER_EMAIL — what appears in the "From" field on outgoing emails.
//                Must be @nau.edu or the relay may reject or flag it.
// SMTP_HOST   — NAU's internal mail relay. Only reachable from within NAU.
// SMTP_PORT   — Port 25 is standard unencrypted SMTP for internal relays.
// ---------------------------------------------------------------
define('LAB_EMAIL',    'mpct.nano@nau.edu');
define('SENDER_EMAIL', 'mpct.nano@nau.edu');
define('SENDER_NAME',  'MPaCT Nano Lab');
define('SMTP_HOST',    'mailgate.nau.edu');
define('SMTP_PORT',    25);


// ---------------------------------------------------------------
// HELPER: clean()
// Trims whitespace and HTML-encodes special characters.
// This prevents XSS — if someone types <script>alert(1)</script>
// into a form field, htmlspecialchars turns it into harmless text.
// ENT_QUOTES encodes both single and double quotes, which matters
// when values end up inside HTML attribute strings.
// ---------------------------------------------------------------
function clean(string $val): string
{
    return htmlspecialchars(trim($val), ENT_QUOTES, 'UTF-8');
}


// ---------------------------------------------------------------
// HELPER: post()
// Reads a POST field and runs it through clean() in one call.
// Returns empty string (never null/undefined) if the key doesn't
// exist, so callers don't need to check isset() themselves.
//
// Note: only use post() when the value will go directly into HTML.
// If you need to process the value first (e.g. pass it through
// formatValue()), read from $_POST directly to avoid pre-escaping
// a value that will get escaped again later.
// ---------------------------------------------------------------
function post(string $key): string
{
    return isset($_POST[$key]) ? clean($_POST[$key]) : '';
}


// ---------------------------------------------------------------
// HELPER: requireFields()
// Checks a list of field names and returns an error immediately if
// any are missing or empty. The error message humanizes the field
// name — "first_name" becomes "First Name" — so the user sees
// something meaningful rather than a raw variable name.
//
// respond() calls exit(), so execution stops the moment a required
// field is missing. Nothing below this call runs.
// ---------------------------------------------------------------
function requireFields(array $keys): void
{
    foreach ($keys as $k) {
        if (empty(post($k))) {
            respond(false, 'Missing required field: ' . ucwords(str_replace('_', ' ', $k)) . '.');
        }
    }
}


// ---------------------------------------------------------------
// HELPER: formatValue()
// HTML select elements send their option *values* to the server,
// not the text the user sees on screen. So a dropdown that shows
// "Full day (8 hours)" actually POSTs "full_day". Without this
// function, emails would contain raw machine values like "full_day",
// "nau_faculty_staff", or "staff_assisted" — confusing for staff.
//
// The static $map is initialized once per request (that's what
// "static" means inside a function). Since we call formatValue()
// in a loop, this avoids rebuilding the same array on every call.
//
// For values not in the map, we fall back to replacing underscores
// with spaces and title-casing the result. This is a reasonable
// default that handles new fields added to the form without needing
// a code change here.
//
// The time conversion handles <input type="time"> fields, which
// always submit in 24-hour HH:MM format. We convert to 12-hour
// AM/PM because that's how the lab staff expects to read it.
// ---------------------------------------------------------------
function formatValue(string $raw): string
{
    static $map = [
        // Yes/no/refresher options from training fields
        'new_user'           => 'Yes — First-time user',
        'refresher'          => 'Yes — Refresher needed',
        'no'                 => 'No',
        'yes'                => 'Yes',

        // Lab assistance level options
        'self_service'       => 'Self-service',
        'staff_assisted'     => 'Staff-assisted session',
        'full_service'       => 'Full service (sample-in / data-out)',

        // Booking duration options
        '30min'              => '30 minutes',
        '1hr'                => '1 hour',
        '2hr'                => '2 hours',
        '3hr'                => '3 hours',
        '4hr'                => '4 hours (half day)',
        'full_day'           => 'Full day (8 hours)',
        'multi_day'          => 'Multiple days — specify in notes',

        // User affiliation — affects billing tier
        'nau_student'        => 'NAU Student',
        'nau_faculty_staff'  => 'NAU Faculty / Staff',
        'external_academic'  => 'External Academic / Researcher',
        'industry'           => 'Industry / Commercial',

        // NAU college options shown in some forms
        'sanghi_engineering' => 'Steve Sanghi College of Engineering',
        'ceias'              => 'College of Engineering, Informatics & Applied Sciences',
        'cefns'              => 'College of the Environment, Forestry & Natural Sciences',
        'franke_business'    => 'W.A. Franke College of Business',
        'education'          => 'College of Education',
        'arts_letters'       => 'College of Arts & Letters',
        'social_behavioral'  => 'College of Social & Behavioral Sciences',
        'health_human'       => 'College of Health & Human Services',
        'graduate'           => 'Graduate College',

        // Delivery options for service requests
        'pickup'             => 'Lab Pickup (Free)',
        'ship'               => 'Ship to Address',

        // Catch-all options used across multiple form fields
        'other'              => 'Other',
        'unsure'             => 'Not sure — let staff recommend',
    ];

    if ($raw === '') return '';

    // HTML time inputs always submit as HH:MM in 24-hour format.
    // Convert: "08:00" → "8:00 AM", "14:30" → "2:30 PM"
    if (preg_match('/^(\d{2}):(\d{2})$/', $raw, $m)) {
        $h      = (int) $m[1];
        $min    = $m[2];
        $suffix = $h >= 12 ? 'PM' : 'AM';
        $h12    = $h > 12 ? $h - 12 : ($h === 0 ? 12 : $h);
        return "{$h12}:{$min} {$suffix}";
    }

    return $map[$raw] ?? ucwords(str_replace('_', ' ', $raw));
}


// ---------------------------------------------------------------
// HELPER: respond()
// Single exit point for the script. Every code path calls this —
// success, validation failure, or send error.
//
// Content-Type is set to application/json so the browser's fetch()
// can call response.json() without issues. exit() ensures nothing
// else gets appended to the output after our JSON.
// ---------------------------------------------------------------
function respond(bool $ok, string $msg): void
{
    if (ob_get_length()) {
        ob_clean();
    }
    header('Content-Type: application/json');
    echo json_encode(['success' => $ok, 'message' => $msg]);
    exit;
}


// ---------------------------------------------------------------
// CONTENT VALIDATORS
// Last line of defense for the contact form: everything here runs
// even if JS is disabled or someone hits this endpoint directly.
// Each helper rejects the request via respond() on first failure —
// we don't try to accumulate errors, because spammers don't need a
// polished list and real users only ever hit one at a time.
// Kept inline (no shared include) so each PHP endpoint stays a
// single-file unit that's easy to read and deploy.
// ---------------------------------------------------------------
function fs_enforceMaxLength(string $field, int $max, string $label): void
{
    $val = trim($_POST[$field] ?? '');
    if (mb_strlen($val) > $max) {
        respond(false, "$label exceeds the $max-character limit.");
    }
}

function fs_validateNumericRange(string $field, float $min, float $max, string $label): void
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

function fs_validateInteger(string $field, string $label): void
{
    $val = trim($_POST[$field] ?? '');
    if ($val === '') return;
    if (!is_numeric($val) || floor((float) $val) != (float) $val) {
        respond(false, "$label must be a whole number.");
    }
}

function fs_validateDateInRange(string $field, string $label): void
{
    $val = trim($_POST[$field] ?? '');
    if ($val === '') return;
    $date = DateTime::createFromFormat('Y-m-d', $val);
    if (!$date || $date->format('Y-m-d') !== $val) {
        respond(false, "$label must be a valid date (YYYY-MM-DD).");
    }
    $today   = new DateTime('today');
    $maxDate = (new DateTime('today'))->modify('+6 months');
    if ($date < $today) respond(false, "$label cannot be in the past.");
    if ($date > $maxDate) respond(false, "$label must be within 6 months from today.");
}

function fs_containsHtmlTags(string $text): bool
{
    return (bool) preg_match(
        '/<\s*\/?(script|img|iframe|object|embed|svg|form|input|button|a\s|div|span|style|link|meta|base|body|html)\b/i',
        $text
    ) || (bool) preg_match('/(on\w+\s*=|javascript\s*:)/i', $text);
}

function fs_containsEmoji(string $text): bool
{
    return (bool) preg_match(
        '/[\x{1F300}-\x{1F9FF}\x{2600}-\x{27BF}\x{FE00}-\x{FE0F}\x{1FA00}-\x{1FAFF}]/u',
        $text
    );
}

function fs_looksLikeMashing(string $text): bool
{
    return (bool) preg_match('/(.)\1{3,}/u', $text);
}

function fs_validateNameField(string $field, string $label): void
{
    $val = trim($_POST[$field] ?? '');
    if ($val === '') return;
    if (fs_containsEmoji($val)) {
        respond(false, "$label cannot contain emoji.");
    }
    if (!preg_match('/^[\p{L}\s\'\-\.]+$/u', $val)) {
        respond(false, "$label should contain letters, spaces, hyphens, or apostrophes only.");
    }
}

function fs_validateTextField(string $field, string $label): void
{
    $val = trim($_POST[$field] ?? '');
    if ($val === '') return;
    if (fs_containsHtmlTags($val)) {
        respond(false, "$label cannot contain HTML or script-like content.");
    }
    if (fs_containsEmoji($val)) {
        respond(false, "$label cannot contain emoji.");
    }
    if (fs_looksLikeMashing($val)) {
        respond(false, "$label appears to contain invalid input. Please provide a meaningful response.");
    }
}

function fs_enforceWordLimit(string $field, int $maxWords, string $label): void
{
    $val = trim($_POST[$field] ?? '');
    if ($val === '') return;
    $count = count(preg_split('/\s+/', $val, -1, PREG_SPLIT_NO_EMPTY));
    if ($count > $maxWords) {
        respond(false, "$label must not exceed $maxWords words (currently $count words).");
    }
}


// ---------------------------------------------------------------
// FORM CATEGORY REGISTRY
// The contact form is one <form> that swaps its field set based on
// the category the user picks on Contact_Us.html. This registry is
// the server-side counterpart: it tells this script, for every
// category, which POST fields to expect, which labels to put in the
// outgoing email, and which fields get the stricter content checks.
//
// Adding a new category means adding an entry here AND in
// script.js's fieldData — if either side is missing, the category
// validation below will reject the request. Keep the 'fields' keys
// in lockstep with the name="" attributes in the HTML, and keep the
// labels human-readable because they end up in the email body.
//
// Per-category keys:
//   required     — must be non-empty (in addition to the always-on
//                  first_name / last_name / email / category / organization)
//   textFields   — free-text inputs that get emoji / HTML / mashing checks
//   wordLimited  — textareas capped at 500 words
//   fields / labels — what appears in the email
$categories = [
    'equipment' => [
        'title'  => 'Equipment Inquiry',
        'required' => ['equipment_name', 'experimental_details'],
        'textFields' => ['experimental_details'],
        'wordLimited' => ['experimental_details'],
        'fields' => ['equipment_category', 'equipment_name', 'intended_usage', 'experimental_details'],
        'labels' => [
            'equipment_category'   => 'Equipment Category',
            'equipment_name'       => 'Equipment Name',
            'intended_usage'       => 'Intended Usage',
            'experimental_details' => 'Experimental Details / Measurement Goals',
        ],
    ],
    'research' => [
        'title'  => 'Research & Strategic Partnerships',
        'required' => ['project_title', 'project_abstract'],
        'textFields' => ['project_title', 'funding_agency', 'project_abstract'],
        'wordLimited' => ['project_abstract'],
        'fields' => ['project_title', 'funding_agency', 'timeline', 'project_abstract'],
        'labels' => [
            'project_title'    => 'Project Title / Topic',
            'funding_agency'   => 'Funding Agency',
            'timeline'         => 'Timeline',
            'project_abstract' => 'Project Description / Abstract',
        ],
    ],
    'billing' => [
        'title'  => 'Billing & Invoicing',
        'required' => ['reference_number', 'billing_contact', 'billing_address', 'issue_description'],
        'textFields' => ['reference_number', 'billing_contact', 'billing_address', 'issue_description'],
        'wordLimited' => ['issue_description', 'billing_address'],
        'fields' => ['reference_number', 'billing_contact', 'billing_address', 'issue_description'],
        'labels' => [
            'reference_number'  => 'Reference Number',
            'billing_contact'   => 'Billing Contact Person',
            'billing_address'   => 'Billing Address',
            'issue_description' => 'Issue Description',
        ],
    ],
    'training' => [
        'title'  => 'Safety & Training',
        'required' => ['request_type', 'training_specifics', 'notes'],
        'textFields' => ['notes'],
        'wordLimited' => ['notes'],
        'fields' => ['request_type', 'training_specifics', 'notes'],
        'labels' => [
            'request_type'      => 'Request Type',
            'training_specifics' => 'Training Specifics',
            'notes'             => 'Notes / Additional Details',
        ],
    ],
    'courses' => [
        'title'  => 'Course Support',
        'required' => ['course_number', 'inquiry'],
        'textFields' => ['course_number', 'inquiry'],
        'wordLimited' => ['inquiry'],
        'fields' => ['course_number', 'semester', 'inquiry'],
        'labels' => [
            'course_number' => 'Course Number',
            'semester'      => 'Semester',
            'inquiry'       => 'Inquiry',
        ],
    ],
    'tour' => [
        'title'  => 'Schedule a Tour',
        'required' => ['group_size', 'group_type', 'preferred_date'],
        'textFields' => ['notes'],
        'wordLimited' => ['notes'],
        'fields' => ['group_size', 'group_type', 'preferred_date', 'alternative_date', 'notes'],
        'labels' => [
            'group_size'       => 'Group Size',
            'group_type'       => 'Group Type',
            'preferred_date'   => 'Preferred Date',
            'alternative_date' => 'Alternative Date',
            'notes'            => 'Notes / Specific Interests',
        ],
    ],
    'sales' => [
        'title'  => 'Vendor / Sales',
        'required' => ['product_category', 'message'],
        'textFields' => ['product_category', 'message'],
        'wordLimited' => ['message'],
        'fields' => ['product_category', 'message'],
        'labels' => [
            'product_category' => 'Product Category',
            'message'          => 'Message',
        ],
    ],
    'other' => [
        'title'  => 'General Inquiry',
        'required' => ['message'],
        'textFields' => ['message'],
        'wordLimited' => ['message'],
        'fields' => ['message'],
        'labels' => [
            'message' => 'Message',
        ],
    ],
    'issue' => [
        'title'  => 'Report an Issue',
        'required' => ['issue_type', 'description'],
        'textFields' => ['equipment_name', 'description'],
        'wordLimited' => ['description'],
        'fields' => ['issue_type', 'equipment_name', 'description'],
        'labels' => [
            'issue_type'     => 'Issue Type',
            'equipment_name' => 'Equipment Name',
            'description'    => 'Description',
        ],
    ],
];


// ---------------------------------------------------------------
// REQUEST VALIDATION
// Reject anything that isn't a real POST from the form. This prevents
// someone from loading this URL in a browser or sending a GET request.
// ---------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Invalid request method.');
}

// Name, email, and category are required for every form type.
// Category tells us which form was submitted; without it we can't
// look up the right fields or build a meaningful email.
requireFields(['first_name', 'last_name', 'email', 'category']);

$firstName    = post('first_name');
$lastName     = post('last_name');
$email        = post('email');
$phone        = mb_substr(post('phone'), 0, 255);         // cap at 255 chars, just in case
$organization = mb_substr(post('organization'), 0, 255);
$category     = post('category');

// filter_var with FILTER_VALIDATE_EMAIL does a proper RFC-compliant check.
// This catches typos like "user@" or "not an email" before we try to send.
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Invalid email address.');
}

// If category doesn't match anything in our registry, reject it.
// This prevents someone from POSTing with an arbitrary category value
// and potentially confusing the email output or triggering PHP notices.
if (!isset($categories[$category])) {
    respond(false, 'Invalid form category.');
}

// Pull out the metadata for this category — title, field list, labels
$catMeta  = $categories[$category];
$catTitle = $catMeta['title'];
$fullName = "$firstName $lastName";

// ---------------------------------------------------------------
// CATEGORY-SPECIFIC + CROSS-CATEGORY VALIDATION
// Runs after the category lookup so the required-field list and the
// content checks can be tailored per category. These are the same
// checks the browser already ran in script.js — repeated here so a
// hand-crafted POST can't slip past them.
// ---------------------------------------------------------------

// Required fields declared per category
foreach (($catMeta['required'] ?? []) as $reqField) {
    if (empty(post($reqField))) {
        $disp = $catMeta['labels'][$reqField] ?? ucwords(str_replace('_', ' ', $reqField));
        respond(false, 'Missing required field: ' . $disp . '.');
    }
}

// Global field shape + length checks
fs_validateNameField('first_name', 'First Name');
fs_validateNameField('last_name',  'Last Name');
fs_enforceMaxLength('first_name',   25, 'First Name');
fs_enforceMaxLength('last_name',    25, 'Last Name');
fs_enforceMaxLength('email',        50, 'Email');
fs_enforceMaxLength('organization', 100, 'Organization');
fs_validateTextField('organization', 'Organization');

// Category-specific textarea + free-text checks
foreach (($catMeta['textFields'] ?? []) as $field) {
    $label = $catMeta['labels'][$field] ?? ucwords(str_replace('_', ' ', $field));
    fs_validateTextField($field, $label);
    fs_enforceMaxLength($field, 2500, $label);
}

// Word limits on long-form fields (abstracts, descriptions, inquiries)
foreach (($catMeta['wordLimited'] ?? []) as $field) {
    $label = $catMeta['labels'][$field] ?? ucwords(str_replace('_', ' ', $field));
    fs_enforceWordLimit($field, 500, $label);
}

// Category-specific numeric and date validations
if ($category === 'tour') {
    fs_validateNumericRange('group_size', 1, 500, 'Group Size');
    fs_validateInteger('group_size', 'Group Size');
    fs_validateDateInRange('preferred_date',   'Preferred Date');
    fs_validateDateInRange('alternative_date', 'Alternative Date');
}

// All caught string fields in every category get a sane upper bound so no
// single value can blow up the email body.
foreach (($catMeta['fields'] ?? []) as $field) {
    $label = $catMeta['labels'][$field] ?? ucwords(str_replace('_', ' ', $field));
    fs_enforceMaxLength($field, 2500, $label);
}

// Arizona doesn't observe Daylight Saving Time, so "MST" is always
// correct. Other US timezones flip between standard and daylight time,
// but Arizona stays on MST year-round (except Navajo Nation).
$timestamp = date("F j, Y \a\\t g:i A T");


// ---------------------------------------------------------------
// BUILD EMAIL TABLE ROWS
// Loop through the fields registered for this category and build
// one table row per field for the email body.
//
// We read from $_POST directly (not through post()) here because
// post() calls htmlspecialchars() and we need the raw value so
// formatValue() can do its translation first. If we used post(),
// values like "nau_faculty_staff" would work fine, but values
// containing "&" would get double-encoded: "&" → "&amp;" → "&amp;amp;".
// The rule is: read raw, process, then escape once right before HTML output.
// ---------------------------------------------------------------
$detailRows   = '';   // HTML <tr> blocks for the email tables
$plainDetails = '';   // Plain-text equivalent for the AltBody

foreach ($catMeta['fields'] as $field) {
    $label      = $catMeta['labels'][$field] ?? $field;
    $raw        = trim($_POST[$field] ?? '');
    $formatted  = formatValue($raw);

    // Escape exactly once for HTML — the plain text version doesn't need escaping
    $value      = $formatted !== '' ? htmlspecialchars($formatted, ENT_QUOTES, 'UTF-8') : '—';
    $plainValue = $formatted !== '' ? $formatted : '—';

    $detailRows .= "
            <tr>
                <td style='padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; width:35%; font-size:14px;'>$label</td>
                <td style='padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;'>$value</td>
            </tr>";

    // Two-space indent in plain text makes the details easier to scan in a terminal
    $plainDetails .= "  $label: $plainValue\n";
}


// ---------------------------------------------------------------
// LAB NOTIFICATION EMAIL
// This is what staff see when someone submits a contact form.
// Layout: NAU header → inquiry type banner → contact info table → details table.
//
// Why table-based layout? Email clients, especially Outlook, have
// extremely poor CSS support. Flexbox and Grid don't work in emails.
// Tables are the only reliable cross-client layout method. Yes, it's
// 2003-era HTML — that's just how email rendering works.
//
// Reply-To is set to the submitter's email so staff can hit Reply
// and reach the right person directly from their inbox.
// ---------------------------------------------------------------
$labSubject = "New Inquiry: $catTitle from $fullName";
$labBody = '<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>' . $labSubject . '</title>
</head>
<body style="margin:0; padding:0; background-color:#f0f2f5; font-family:Arial, Helvetica, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f2f5;">
        <tr>
            <td align="center" style="padding:30px 20px;">
                <!-- 640px is the standard max-width for email containers -->
                <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">

                    <!-- NAU brand header — navy blue with embedded logo -->
                    <tr>
                        <td style="background:#003466; padding:20px 32px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td width="180" valign="middle">
                                        <!-- cid:naulogo references the embedded image added in createMailer().
                                             We embed it rather than linking to a URL because Gmail and Outlook
                                             block remote images from new senders by default. -->
                                        <img src="cid:naulogo" alt="Northern Arizona University" width="160" style="display:block; height:auto; border:0;">
                                    </td>
                                    <td valign="middle" style="padding-left:16px; border-left:2px solid rgba(255,255,255,0.3);">
                                        <h1 style="margin:0; font-size:18px; font-weight:700; color:#ffffff; letter-spacing:0.3px;">MPaCT Nano Lab</h1>
                                        <p style="margin:3px 0 0 0; font-size:12px; color:#9bb8d7;">Microelectronics Processing, Characterization &amp; Testing</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- NAU gold accent stripe -->
                    <tr><td style="background:#FFC627; height:4px; font-size:0; line-height:0;">&nbsp;</td></tr>

                    <tr>
                        <td style="padding:28px 32px;">
                            <!-- Banner showing category and submission time -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                                <tr>
                                    <td style="background:#eef3f8; padding:12px 16px; border-radius:6px; border-left:4px solid #003466;">
                                        <span style="font-size:13px; color:#666; text-transform:uppercase; letter-spacing:0.5px;">New Submission</span><br>
                                        <strong style="font-size:17px; color:#003466;">' . $catTitle . '</strong>
                                    </td>
                                    <td align="right" valign="top" style="background:#eef3f8; padding:12px 16px; border-radius:6px;">
                                        <span style="font-size:12px; color:#888;">' . $timestamp . '</span>
                                    </td>
                                </tr>
                            </table>

                            <!-- Contact details — who submitted and how to reach them -->
                            <h2 style="margin:0 0 12px 0; font-size:15px; color:#003466; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid #FFC627; padding-bottom:8px; display:inline-block;">Contact Information</h2>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                                <tr>
                                    <td style="padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; width:35%; font-size:14px;">Name</td>
                                    <td style="padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;">' . $fullName . '</td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; font-size:14px;">Email</td>
                                    <!-- mailto link so staff can reply directly from the email -->
                                    <td style="padding:10px 16px; border-bottom:1px solid #e8e8e8; font-size:14px;"><a href="mailto:' . $email . '" style="color:#003466; text-decoration:none;">' . $email . '</a></td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; font-size:14px;">Phone</td>
                                    <td style="padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;">' . ($phone ?: '—') . '</td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; font-size:14px;">Organization</td>
                                    <td style="padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;">' . ($organization ?: '—') . '</td>
                                </tr>
                            </table>

                            <!-- Category-specific rows built dynamically above -->
                            <h2 style="margin:0 0 12px 0; font-size:15px; color:#003466; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid #FFC627; padding-bottom:8px; display:inline-block;">' . $catTitle . ' Details</h2>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">' . $detailRows . '
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="background:#f8f9fa; padding:16px 32px; border-top:1px solid #e8e8e8;">
                            <p style="margin:0; font-size:12px; color:#999; text-align:center;">
                                This email was sent from the MPaCT Nano Lab (<a href="https://nano.nau.edu" style="color:#999; text-decoration:underline;">nano.nau.edu</a>) from Northern Arizona University<br>
                                You can reply directly to this email to reach the sender.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>';

// AltBody: plain-text fallback for non-HTML email clients and spam filter scoring.
// Spam filters trust emails more when both HTML and plain text versions are present —
// it signals that a real system sent this, not a bulk mailer with no text fallback.
$labPlain = "NEW INQUIRY: $catTitle
Submitted: $timestamp
---

CONTACT INFORMATION
  Name: $fullName
  Email: $email
  Phone: " . ($phone ?: 'Not provided') . "
  Organization: " . ($organization ?: 'Not provided') . "

$catTitle DETAILS
$plainDetails
---
Sent from MPaCT Nano Lab contact form (nau.edu)
";


// ---------------------------------------------------------------
// USER CONFIRMATION EMAIL
// Goes back to the submitter so they have a record of what they sent.
// We greet by first name (friendlier than "Dear [Full Name]"),
// set expectations for response time, and show a full recap of their
// submission. If they need something urgently, the lab email is at the bottom.
// ---------------------------------------------------------------
$userSubject = "We received your inquiry — MPaCT Nano Lab";
$userBody = '<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>' . $userSubject . '</title>
</head>
<body style="margin:0; padding:0; background-color:#f0f2f5; font-family:Arial, Helvetica, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f2f5;">
        <tr>
            <td align="center" style="padding:30px 20px;">
                <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">

                    <tr>
                        <td style="background:#003466; padding:20px 32px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td width="180" valign="middle">
                                        <img src="cid:naulogo" alt="Northern Arizona University" width="160" style="display:block; height:auto; border:0;">
                                    </td>
                                    <td valign="middle" style="padding-left:16px; border-left:2px solid rgba(255,255,255,0.3);">
                                        <h1 style="margin:0; font-size:18px; font-weight:700; color:#ffffff; letter-spacing:0.3px;">MPaCT Nano Lab</h1>
                                        <p style="margin:3px 0 0 0; font-size:12px; color:#9bb8d7;">Microelectronics Processing, Characterization &amp; Testing</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr><td style="background:#FFC627; height:4px; font-size:0; line-height:0;">&nbsp;</td></tr>

                    <tr>
                        <td style="padding:28px 32px;">
                            <h2 style="margin:0 0 16px 0; font-size:22px; color:#003466;">Thank you, ' . $firstName . '!</h2>

                            <p style="font-size:15px; line-height:1.7; color:#444; margin:0 0 8px 0;">
                                We have received your <strong style="color:#003466;">' . $catTitle . '</strong> inquiry and it is currently being reviewed by our team.
                            </p>
                            <p style="font-size:15px; line-height:1.7; color:#444; margin:0 0 24px 0;">
                                A lab representative will get back to you within <strong>1&ndash;2 business days</strong>.
                            </p>

                            <!-- Full submission recap — same $detailRows used for the lab email.
                                 Gives the user a record of exactly what they submitted. -->
                            <h3 style="margin:0 0 12px 0; font-size:15px; color:#003466; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid #FFC627; padding-bottom:8px; display:inline-block;">Your Submission</h3>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                                <tr>
                                    <td style="padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; width:35%; font-size:14px;">Name</td>
                                    <td style="padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;">' . $fullName . '</td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; font-size:14px;">Email</td>
                                    <td style="padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;">' . $email . '</td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; font-size:14px;">Organization</td>
                                    <td style="padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;">' . ($organization ?: '—') . '</td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; font-size:14px;">Category</td>
                                    <td style="padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;">' . $catTitle . '</td>
                                </tr>' . $detailRows . '
                            </table>

                            <!-- Emergency contact in case they need something before staff replies -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="background:#eef3f8; padding:16px 20px; border-radius:6px; border-left:4px solid #003466;">
                                        <p style="margin:0; font-size:14px; color:#555; line-height:1.6;">
                                            <strong style="color:#003466;">Need immediate help?</strong><br>
                                            Email us at <a href="mailto:' . LAB_EMAIL . '" style="color:#003466; text-decoration:underline;">' . LAB_EMAIL . '</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="background:#f8f9fa; padding:20px 32px; border-top:1px solid #e8e8e8; text-align:center;">
                            <p style="margin:0 0 4px 0; font-size:13px; color:#666; font-weight:600;">MPaCT Nano Lab</p>
                            <p style="margin:0; font-size:12px; color:#999; line-height:1.5;">
                                Microelectronics Processing, Characterization &amp; Testing<br>
                                Northern Arizona University &bull; Flagstaff, AZ
                            </p>
                            <p style="margin:8px 0 0 0; font-size:11px; color:#bbb;">
                                This is an automated confirmation. Please do not reply to this email.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>';

$userPlain = "Thank you, $firstName!

We have received your $catTitle inquiry and it is currently being reviewed by our team. A lab representative will get back to you within 1-2 business days.

YOUR SUBMISSION
  Name: $fullName
  Email: $email
  Organization: " . ($organization ?: 'Not provided') . "
  Category: $catTitle
$plainDetails
Need immediate help? Email us at " . LAB_EMAIL . "

---
MPaCT Nano Lab
Microelectronics Processing, Characterization & Testing
Northern Arizona University, Flagstaff, AZ
";


// ---------------------------------------------------------------
// MAILER FACTORY: createMailer()
// Returns a ready-to-use PHPMailer instance configured for NAU's relay.
// We call this twice (once per email) rather than reusing one instance
// because resetting PHPMailer between sends is error-prone — address
// lists and headers from the first send can bleed into the second.
//
// SMTPAuth=false and SMTPSecure='' together mean "plain SMTP, no login,
// no encryption". That's correct for NAU's internal mailgate. If you ever
// switch to an external SMTP provider (like Gmail or SendGrid), you'd
// need to set SMTPAuth=true, add a username/password, and set
// SMTPSecure='tls' or 'ssl' — but don't do that for this internal relay.
//
// addEmbeddedImage() attaches the NAU logo as a Content-ID image.
// The "cid:naulogo" value in the HTML <img src="..."> references this
// attachment by its content ID. If the logo file is missing (e.g. during
// local development), we skip it rather than crashing — the email still sends.
// ---------------------------------------------------------------
function createMailer(): PHPMailer
{
    $mail = new PHPMailer(true);   // true = throw exceptions instead of returning false
    $mail->isSMTP();
    $mail->Host        = SMTP_HOST;
    $mail->Port        = SMTP_PORT;
    $mail->SMTPAuth    = false;
    $mail->SMTPSecure  = '';
    $mail->SMTPAutoTLS = false;    // prevent PHPMailer from auto-upgrading to TLS
    $mail->setFrom(SENDER_EMAIL, SENDER_NAME);
    $mail->isHTML(true);
    $mail->CharSet  = 'UTF-8';
    $mail->Encoding = 'base64';   // base64 handles any character content safely

    // Deliverability headers — these make the email look like it came from a
    // real mail system rather than a script, which helps with spam scoring
    $mail->XMailer   = 'MPaCT Nano Lab Mailer';
    $mail->MessageID = '<' . uniqid('mpct-', true) . '@nau.edu>';
    $mail->Priority  = 3;   // 1=high triggers spam filters; 3=normal is safe

    $logoPath = __DIR__ . '/Images/NAU.png';
    if (file_exists($logoPath)) {
        $mail->addEmbeddedImage($logoPath, 'naulogo', 'NAU.png', 'base64', 'image/png');
    }

    return $mail;
}


// ---------------------------------------------------------------
// SEND BOTH EMAILS
// Lab notification first. If it fails, the catch fires and we stop —
// we haven't confirmed success to the user yet, so that's fine.
// If the lab email succeeds, we send the user confirmation.
//
// The CC list keeps the dev team in the loop during the launch period.
// Those lines can be removed once the lab is operating normally.
//
// addReplyTo() is important: it means when a staff member hits Reply
// in their inbox, the reply goes directly to the submitter — not
// back to the lab address (which would send them a loop).
// ---------------------------------------------------------------
try {
    $labMail = createMailer();
    $labMail->addAddress(LAB_EMAIL);
    // CC lines commented out for local testing — emails go to Mailpit only
    // $labMail->addCC('Akhil.Kinnera@nau.edu');
    // $labMail->addCC('Sethuprasad.Gorantla@nau.edu');
    // $labMail->addCC('Krishna-Dev.Palem@nau.edu');
    $labMail->addReplyTo($email, $fullName);
    $labMail->Subject = $labSubject;
    $labMail->Body    = $labBody;
    $labMail->AltBody = $labPlain;
    $labMail->send();

    $userMail = createMailer();
    $userMail->addAddress($email);
    $userMail->Subject = $userSubject;
    $userMail->Body    = $userBody;
    $userMail->AltBody = $userPlain;
    $userMail->send();

    respond(true, 'Your inquiry has been submitted successfully! You will receive a confirmation email shortly.');

} catch (Exception $e) {
    // Log the real PHPMailer error to the server log where only we can see it.
    // Never echo exception details to the browser — they can expose internal paths
    // and server configuration to anyone watching the network.
    error_log("MPCT Form Error: " . $e->getMessage());
    respond(false, 'We were unable to send your inquiry at this time. Please try again or email us directly at ' . LAB_EMAIL . '.');
}
