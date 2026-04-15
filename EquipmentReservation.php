<?php
/*
 * EquipmentReservation.php
 * ------------------------
 * Handles all booking requests submitted through Reserve_Equipment.html.
 *
 * Here's the flow from start to finish:
 *   1. The page POSTs form data here via fetch() — no page reload happens
 *   2. We check it's actually a POST, validate the required fields
 *   3. We loop through the submitted booking fields and turn machine values
 *      (like "full_day", "staff_assisted") into readable labels for the email
 *   4. Two emails get built and sent:
 *        - One to the lab inbox so staff know a request came in
 *        - One back to the user as a confirmation they can keep
 *   5. We return JSON so the frontend can show the right success or error message
 *
 * If you need to change where notification emails go, update the CC list near
 * the bottom of this file in the send block. Don't change LAB_EMAIL unless
 * the lab's primary address actually changes — it's used in multiple places.
 */


// ob_start() buffers all output from this point forward.
// This is a safety net: if PHP emits a warning or notice before we call respond(),
// that stray text would corrupt our JSON response and break the frontend.
// ob_clean() inside respond() wipes the buffer before we write our JSON.
ob_start();

// PHPMailer lives in the PHPMailer/ folder — no Composer, no autoloader needed.
// We load the three class files directly. Order matters: Exception must come first
// because PHPMailer.php references it, and SMTP comes last because PHPMailer uses it.
require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Log all errors but never display them to the browser.
// Showing PHP errors to a user is a security risk — it can expose file paths,
// database credentials, or internal logic. We want them in the server log where
// only we can see them. E_ALL makes sure nothing gets silently swallowed.
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);


// ---------------------------------------------------------------
// CONFIGURATION
// Update these constants if the lab email address or mail server changes.
// Using constants (rather than variables) means these can't be accidentally
// overwritten somewhere else in the script.
// ---------------------------------------------------------------

// LAB_EMAIL is where booking notifications land — the lab's working inbox.
define('LAB_EMAIL',    'mpct.nano@nau.edu');

// SENDER_EMAIL shows up in the "From" field of outgoing emails.
// Keeping it on the same domain (nau.edu) is important — NAU's mail relay
// will reject or flag messages that claim to be "from" an external domain.
define('SENDER_EMAIL', 'mpct.nano@nau.edu');
define('SENDER_NAME',  'MPaCT Nano Lab');

// mailgate.nau.edu is NAU's internal SMTP relay.
// Port 25 is standard SMTP — no TLS, no login required because it's an
// internal relay that already trusts traffic from university servers.
define('SMTP_HOST', 'mailgate.nau.edu');
define('SMTP_PORT', 25);


// ---------------------------------------------------------------
// HELPER: post()
// A small wrapper around $_POST that trims whitespace and escapes
// HTML entities in one step. It returns an empty string (never null)
// if the key doesn't exist, which keeps the rest of the code clean.
//
// IMPORTANT: Use post() only for values that will be embedded directly
// into HTML output. For values that need further processing (like select
// option values going through formatValue()), read from $_POST directly
// so you don't pre-escape something that will be escaped again later.
// ---------------------------------------------------------------
function post($key) {
    return isset($_POST[$key]) ? htmlspecialchars(trim((string) $_POST[$key]), ENT_QUOTES, 'UTF-8') : '';
}


// ---------------------------------------------------------------
// HELPER: formatValue()
// This exists because HTML select elements send their option *values*
// to the server, not the human-readable labels the user sees on screen.
// So when someone picks "Full day (8 hours)" from a dropdown, PHP receives
// "full_day" — which would look terrible printed in an email.
//
// The static $map translates those machine values back into readable strings.
// "static" means the array is only built once per request, not on every
// function call — a minor efficiency win since we call this in a loop.
//
// If a value isn't in the map, we fall back to replacing underscores with
// spaces and title-casing it (e.g. "some_unknown_value" → "Some Unknown Value").
// That way new fields added to the form won't just silently show raw values.
//
// The time conversion at the bottom handles the preferred_time field, which
// comes through as 24-hour format (e.g. "14:30") from an <input type="time">.
// We convert it to 12-hour AM/PM so it reads naturally in the email.
// ---------------------------------------------------------------
function formatValue(string $raw): string
{
    static $map = [
        // Training needed (yes/no/refresher from the booking form's radio)
        'new_user'            => 'Yes — First-time user',
        'refresher'           => 'Yes — Refresher needed',
        'no'                  => 'No',
        'yes'                 => 'Yes',

        // Lab assistance level (how much staff involvement the user wants)
        'self_service'        => 'Self-service',
        'staff_assisted'      => 'Staff-assisted session',
        'full_service'        => 'Full service (sample-in / data-out)',

        // Booking duration options
        '30min'               => '30 minutes',
        '1hr'                 => '1 hour',
        '2hr'                 => '2 hours',
        '3hr'                 => '3 hours',
        '4hr'                 => '4 hours (half day)',
        'full_day'            => 'Full day (8 hours)',
        'multi_day'           => 'Multiple days — specify in notes',

        // User affiliation — determines billing category
        'nau_student'         => 'NAU Student',
        'nau_faculty_staff'   => 'NAU Faculty / Staff',
        'external_academic'   => 'External Academic / Researcher',
        'industry'            => 'Industry / Commercial',

        // NAU colleges — used when department/affiliation is collected
        'sanghi_engineering'  => 'Steve Sanghi College of Engineering',
        'ceias'               => 'College of Engineering, Informatics & Applied Sciences',
        'cefns'               => 'College of the Environment, Forestry & Natural Sciences',
        'franke_business'     => 'W.A. Franke College of Business',
        'education'           => 'College of Education',
        'arts_letters'        => 'College of Arts & Letters',
        'social_behavioral'   => 'College of Social & Behavioral Sciences',
        'health_human'        => 'College of Health & Human Services',
        'graduate'            => 'Graduate College',

        // Equipment availability statuses (these come from equipment.json)
        'AVAILABLE'           => 'Available',
        'EXPECTED'            => 'Expected',
        'UNAVAILABLE'         => 'Unavailable',

        // Academic semesters shown in scheduling dropdowns
        'fall_2025'           => 'Fall 2025',
        'spring_2026'         => 'Spring 2026',
        'summer_2026'         => 'Summer 2026',
        'fall_2026'           => 'Fall 2026',
        'spring_2027'         => 'Spring 2027',

        // Catch-all options used across multiple form fields
        'other'               => 'Other',
        'unsure'              => 'Not sure — let staff recommend',
    ];

    // Empty string in, empty string out — the calling code decides what to show
    // (usually a dash) when there's nothing to display.
    if ($raw === '') {
        return '';
    }

    // HTML time inputs always submit in HH:MM 24-hour format.
    // This converts "08:00" → "8:00 AM" and "14:30" → "2:30 PM".
    if (preg_match('/^(\d{2}):(\d{2})$/', $raw, $m)) {
        $h      = (int) $m[1];
        $min    = $m[2];
        $suffix = $h >= 12 ? 'PM' : 'AM';
        $h12    = $h > 12 ? $h - 12 : ($h === 0 ? 12 : $h);
        return "{$h12}:{$min} {$suffix}";
    }

    // Known value → readable label, unknown value → best-effort title case
    return $map[$raw] ?? ucwords(str_replace('_', ' ', $raw));
}


// ---------------------------------------------------------------
// HELPER: requireFields()
// Loops through a list of field names and bails immediately if any
// are empty. The error message converts "first_name" → "First Name"
// so the user sees something intelligible, not a raw field key.
//
// respond() calls exit, so the moment a required field is missing
// we stop processing and return an error — nothing below runs.
// ---------------------------------------------------------------
function requireFields(array $keys): void
{
    foreach ($keys as $key) {
        if (empty(post($key))) {
            respond(false, 'Missing required field: ' . ucwords(str_replace('_', ' ', $key)) . '.');
        }
    }
}


// ---------------------------------------------------------------
// HELPER: respond()
// The single exit point for this script. Every code path eventually
// calls this — whether it's a validation error, a send failure, or success.
//
// ob_clean() discards any buffered output before we write JSON. Without
// this, a PHP notice or a stray space at the top of the file would get
// prepended to the response, making JSON.parse() fail on the frontend.
//
// We always return HTTP 200 regardless of success/failure because the
// frontend checks result.success in the JSON body, not the HTTP status.
// ---------------------------------------------------------------
function respond($success, $message) {
    if (ob_get_length()) {
        ob_clean();
    }
    header('Content-Type: application/json');
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}


// ---------------------------------------------------------------
// STEP 1: Validate the request method
// This script should only ever be called by the booking form's fetch().
// If someone types the URL directly in a browser (GET request) or pokes
// at it with a tool, we return an error immediately.
// ---------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Invalid request method.');
}

// The name and email are the absolute minimum we need to do anything useful.
// Everything else — equipment details, dates, preferences — fills in the email
// body but isn't strictly required to send a notification.
requireFields(['first_name', 'last_name', 'email']);

$firstName = post('first_name');
$lastName  = post('last_name');


// ---------------------------------------------------------------
// STEP 2: Collect all POST values
// Equipment fields come from the booking form's hidden inputs, which
// booking.js populates when the user selects a piece of equipment.
//
// equipment_name_display is the human-readable label (e.g. "SUSS MJB4
// Mask Aligner") that booking.js writes from the equipment card.
// equipment_name is the raw identifier. We prefer the display version
// for email subject lines and body text — it's what the user actually saw.
// ---------------------------------------------------------------
$category           = post('category');
$equipment_id       = post('equipment_id');
$equipment_name     = post('equipment_name');
$equipment_category = post('equipment_category');
$equipment_status   = post('equipment_status');
$equipment_display  = post('equipment_name_display');

$email        = post('email');
$phone        = mb_substr(post('phone'), 0, 255);   // cap phone at 255 chars — just in case
$organization = mb_substr(post('organization'), 0, 255);

// Scheduling fields — come from date/time pickers and duration selects
$preferred_date     = post('preferred_date');
$preferred_time     = post('preferred_time');
$estimated_duration = post('estimated_duration');
$alternative_date   = post('alternative_date');

// Sample and usage details — free-text fields the user fills in
$sample_description   = post('sample_description');
$purpose_of_use       = post('purpose_of_use');

// Session preference fields — select inputs whose values go through formatValue()
$training_needed      = post('training_needed');
$lab_assistance       = post('lab_assistance');
$special_requirements = post('special_requirements');


// ---------------------------------------------------------------
// STEP 3: Validate the email address
// filter_var with FILTER_VALIDATE_EMAIL does a proper RFC-compliant check.
// This catches typos like "user@" or "notanemail" before we try to send
// anything. We do it after field collection so we have $email available.
// ---------------------------------------------------------------
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Invalid email address.');
}


// ---------------------------------------------------------------
// STEP 4: Build the detail rows for the email tables
//
// $fields maps POST field names to the human-readable labels that appear
// in the email. The order here is the order they appear in the email —
// we put equipment info first, then scheduling, then sample details,
// then session preferences. That matches the logical flow of the form.
//
// We read raw from $_POST (not through post()) because formatValue()
// needs the original option value like "full_day", not the already-escaped
// version "full_day" (they happen to be the same here, but for values
// containing "&" or quotes they would differ and cause double-encoding).
// We escape exactly once, right before we drop the value into HTML.
// ---------------------------------------------------------------
$fields = [
    'equipment_name'       => 'Equipment',
    'equipment_category'   => 'Category',
    'equipment_status'     => 'Status',

    'preferred_date'       => 'Preferred Date',
    'preferred_time'       => 'Preferred Time',
    'estimated_duration'   => 'Estimated Duration',
    'alternative_date'     => 'Alternative Date',

    'sample_description'   => 'Sample Description',
    'purpose_of_use'       => 'Purpose of Use',

    'training_needed'      => 'Training Needed',
    'lab_assistance'       => 'Lab Assistance',
    'special_requirements' => 'Special Requirements',
];

$detailRows   = '';   // HTML table rows for the email body
$plainDetails = '';   // Plain-text equivalent for the AltBody

foreach ($fields as $field => $label) {
    // Read the raw POST value so formatValue() sees the original machine value
    $rawValue  = isset($_POST[$field]) ? trim((string) $_POST[$field]) : '';
    $displayed = formatValue($rawValue);

    // Show a dash rather than a blank cell when the field wasn't filled in
    if ($displayed === '') {
        $displayed = '—';
    }

    // Single htmlspecialchars call here — this is the only place we escape.
    // The plain-text version does not need escaping since it's not rendered as HTML.
    $htmlValue = htmlspecialchars($displayed, ENT_QUOTES, 'UTF-8');

    $detailRows .= "
        <tr>
            <td style='padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; width:35%; font-size:14px;'>
                $label
            </td>
            <td style='padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;'>
                $htmlValue
            </td>
        </tr>";

    $plainDetails .= "$label: $displayed\n";
}


// ---------------------------------------------------------------
// STEP 5: Build names, labels, and the timestamp
//
// $equipmentLabel prefers the display name that booking.js wrote into
// the hidden input. If it's not there for some reason, we fall back to
// the raw equipment_name. This ensures subject lines say something like
// "SUSS MJB4 Mask Aligner" instead of "suss_mjb4".
//
// The timestamp uses Arizona's timezone. Arizona doesn't observe DST,
// so "MST" is always correct year-round — we don't need to worry about
// switching between MST and MDT the way other states do.
// ---------------------------------------------------------------
$catMeta      = ['title' => 'Equipment Booking'];
$catTitle     = $catMeta['title'];
$fullName     = "$firstName $lastName";
$equipmentLabel = ($equipment_display !== '') ? $equipment_display : $equipment_name;
$timestamp    = date("F j, Y \a\\t g:i A T");


// ---------------------------------------------------------------
// STEP 6: Build the lab notification email
//
// This is the email that lands in the lab's inbox when someone submits
// a booking. Staff need to see: who requested it, what equipment,
// when they want it, and what they're doing with it. That's the order
// the email is laid out in — contact info first, then booking details.
//
// The Reply-To is set to the user's email so that hitting Reply in any
// email client goes directly to the requester, not back to the lab address.
//
// Why table-based HTML? Email clients (especially Outlook) have notoriously
// bad CSS support. Flexbox and Grid simply don't work. Tables are the only
// reliable way to get consistent column layouts across Gmail, Outlook, Apple Mail,
// and webmail clients. It's ugly to write but it's the industry standard.
//
// The NAU logo is embedded as a CID (Content-ID) attachment rather than
// a remote URL. Gmail and Outlook block remote images from unknown senders
// by default, so a URL to our server would just show a broken image icon.
// CID embedding puts the image data directly in the email, so it always shows.
// ---------------------------------------------------------------
$labSubject = "New Booking Request: $equipmentLabel from $fullName";
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
                <!-- 640px is the standard width for email containers — wide enough
                     to be readable, narrow enough to work on most mobile clients -->
                <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">

                    <!-- NAU brand header: navy background, gold accent bar below -->
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
                    <!-- NAU gold accent line — purely decorative but important for brand -->
                    <tr><td style="background:#FFC627; height:4px; font-size:0; line-height:0;">&nbsp;</td></tr>

                    <tr>
                        <td style="padding:28px 32px;">
                            <!-- Banner showing which equipment was requested and when -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                                <tr>
                                    <td style="background:#eef3f8; padding:12px 16px; border-radius:6px; border-left:4px solid #003466;">
                                        <span style="font-size:13px; color:#666; text-transform:uppercase; letter-spacing:0.5px;">New Submission</span><br>
                                        <strong style="font-size:17px; color:#003466;">' . htmlspecialchars($equipmentLabel, ENT_QUOTES, 'UTF-8') . '</strong>
                                    </td>
                                    <td align="right" valign="top" style="background:#eef3f8; padding:12px 16px; border-radius:6px;">
                                        <span style="font-size:12px; color:#888;">' . $timestamp . '</span>
                                    </td>
                                </tr>
                            </table>

                            <!-- Requester contact details so staff can follow up quickly -->
                            <h2 style="margin:0 0 12px 0; font-size:15px; color:#003466; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid #FFC627; padding-bottom:8px; display:inline-block;">Contact Information</h2>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                                <tr>
                                    <td style="padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; width:35%; font-size:14px;">Name</td>
                                    <td style="padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;">' . $fullName . '</td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; font-size:14px;">Email</td>
                                    <!-- Making the email a mailto link means staff can reply directly from the email client -->
                                    <td style="padding:10px 16px; border-bottom:1px solid #e8e8e8; font-size:14px;"><a href="mailto:' . $email . '" style="color:#003466; text-decoration:none;">' . $email . '</a></td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; font-size:14px;">Phone</td>
                                    <td style="padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;">' . ($phone ?: '—') . '</td>
                                </tr>
                            </table>

                            <!-- All the booking-specific details, generated dynamically from $detailRows above -->
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

// The plain-text AltBody serves two purposes:
//   1. Email clients that can't render HTML (rare, but they exist) show this instead
//   2. Spam filters like SpamAssassin give higher trust scores to emails that include
//      both HTML and plain text — it's a signal that a human system sent it
$labPlain = "NEW BOOKING REQUEST: $equipmentLabel from $fullName
Submitted: $timestamp
---

CONTACT INFORMATION
  Name: $fullName
  Email: $email
  Phone: " . ($phone ?: 'Not provided') . "

BOOKING DETAILS
$plainDetails
---
Sent from MPaCT Nano Lab booking form (nau.edu)
";


// ---------------------------------------------------------------
// STEP 7: Build the user confirmation email
//
// This goes back to the person who submitted the request. They get
// a full recap of everything they submitted — useful if they want to
// reference what they asked for, or forward it to a colleague.
//
// We tell them 1-2 business days for a response. If that expectation
// ever changes, update it here in both the HTML body and the $userPlain.
// ---------------------------------------------------------------
$userSubject = "We received your Booking request — MPaCT Nano Lab";
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
                            <!-- Greet by first name — slightly warmer than "Dear [full name]" -->
                            <h2 style="margin:0 0 16px 0; font-size:22px; color:#003466;">Thank you, ' . $firstName . '!</h2>

                            <p style="font-size:15px; line-height:1.7; color:#444; margin:0 0 8px 0;">
                                We have received your <strong style="color:#003466;">' . $equipmentLabel . '</strong> inquiry and it is currently being reviewed by our team.
                            </p>
                            <p style="font-size:15px; line-height:1.7; color:#444; margin:0 0 24px 0;">
                                A lab representative will get back to you within <strong>1&ndash;2 business days</strong>.
                            </p>

                            <!-- Full submission recap — uses the same $detailRows built above.
                                 This gives the user a record of exactly what they submitted. -->
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
                                ' . $detailRows . '
                            </table>

                            <!-- Fallback contact if they need something urgently before staff replies -->
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
                            <!-- Tell the user not to reply to this address —
                                 the confirmation comes from a no-reply-style sender -->
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

// Plain-text fallback for the user confirmation
$userPlain = "Thank you, $firstName!

We have received your $catTitle inquiry and it is currently being reviewed by our team. A lab representative will get back to you within 1-2 business days.

YOUR SUBMISSION
  Name: $fullName
  Email: $email
  Organization: " . ($organization ?: 'Not provided') . "

Need immediate help? Email us at " . LAB_EMAIL . "

---
MPaCT Nano Lab
Microelectronics Processing, Characterization & Testing
Northern Arizona University, Flagstaff, AZ
";


// ---------------------------------------------------------------
// HELPER: createMailer()
// Returns a pre-configured PHPMailer instance ready to use.
// We call this twice — once for the lab email, once for the user
// confirmation — rather than reusing a single instance and clearing
// its address list. Reusing causes subtle issues where Reply-To or
// CC headers from the first send bleed into the second.
//
// Key settings explained:
//   isSMTP()       — use SMTP rather than PHP's built-in mail() function.
//                    mail() doesn't work reliably in most hosting setups
//                    and gives us no control over headers or delivery.
//   SMTPAuth=false — NAU's mailgate relay doesn't require a login. It
//                    trusts traffic from within the university network.
//   SMTPSecure=''  — no TLS/SSL on port 25 for this relay. Don't change
//                    this to 'tls' or PHPMailer will try to upgrade the
//                    connection and fail.
//   SMTPAutoTLS=false — extra safety: PHPMailer would otherwise try to
//                    auto-negotiate TLS even when SMTPSecure is empty.
//   Encoding=base64 — avoids issues with long lines that some mail servers
//                    reject; base64 is safe for any character content.
//   MessageID       — having an @nau.edu Message-ID that matches the sender
//                    domain is a deliverability signal.
//   Priority=3      — "normal". Priority 1 (urgent) trips spam filters.
// ---------------------------------------------------------------
function createMailer(): PHPMailer
{
    $mail = new PHPMailer(true);  // true = throw exceptions rather than returning false on failure
    $mail->isSMTP();
    $mail->Host       = SMTP_HOST;
    $mail->Port       = SMTP_PORT;
    $mail->SMTPAuth   = false;
    $mail->SMTPSecure = '';
    $mail->SMTPAutoTLS = false;
    $mail->setFrom(SENDER_EMAIL, SENDER_NAME);
    $mail->isHTML(true);
    $mail->CharSet  = 'UTF-8';
    $mail->Encoding = 'base64';

    $mail->XMailer   = 'MPaCT Nano Lab Mailer';
    $mail->MessageID = '<' . uniqid('mpct-', true) . '@nau.edu>';
    $mail->Priority  = 3;

    // Embed the NAU logo by Content-ID rather than a remote URL.
    // If the file doesn't exist on the server (e.g. during local development),
    // we skip it gracefully — the email still sends, just without the logo.
    $logoPath = __DIR__ . '/Images/NAU.png';
    if (file_exists($logoPath)) {
        $mail->addEmbeddedImage($logoPath, 'naulogo', 'NAU.png', 'base64', 'image/png');
    }

    return $mail;
}


// ---------------------------------------------------------------
// STEP 8: Send both emails
//
// Lab email first, user confirmation second. If the lab email fails,
// the catch block fires and we never reach the user confirmation —
// which is fine, because we haven't told the user "success" yet.
//
// The CC list keeps the dev team in the loop during the launch period.
// Once the lab is running smoothly those CC lines can be removed.
//
// addReplyTo($email, $fullName) means that when a staff member hits
// Reply in their inbox, the reply goes to the person who booked —
// not back to the lab address (which would create a loop).
// ---------------------------------------------------------------
try {
    $labMail = createMailer();
    $labMail->addAddress(LAB_EMAIL);
    $labMail->addCC('Akhil.Kinnera@nau.edu');
    $labMail->addCC('Sethuprasad.Gorantla@nau.edu');
    $labMail->addCC('Krishna-Dev.Palem@nau.edu');
    $labMail->addReplyTo($email, $fullName);
    $labMail->Subject = $labSubject;
    $labMail->Body    = $labBody;
    $labMail->AltBody = $labPlain;
    $labMail->send();

    $userMail = createMailer();
    $userMail->addAddress($email, $fullName);
    $userMail->Subject = $userSubject;
    $userMail->Body    = $userBody;
    $userMail->AltBody = $userPlain;
    $userMail->send();

    respond(true, 'Your inquiry has been submitted successfully! You will receive a confirmation email shortly.');

} catch (Exception $e) {
    // Log the real PHPMailer error message to the server log so we can debug it,
    // but return a friendly generic message to the user. Never expose stack traces
    // or internal error details to the browser — they can reveal server configuration.
    error_log("MPCT Booking Error: " . $e->getMessage());
    respond(false, 'We were unable to send your inquiry at this time. Please try again or email us directly at ' . LAB_EMAIL . '.');
}
