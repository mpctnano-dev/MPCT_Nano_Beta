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
require_once __DIR__ . '/mpact_config.php';

// Shared validators / sanitizers / required-field gate live in
// includes/validation.php so all three form endpoints share one
// source of truth instead of each carrying a prefixed copy.
require_once __DIR__ . '/includes/validation.php';

// SharePoint failure alert helper — emails LAB_EMAIL + CC_LIST whenever
// the SharePoint sync below throws, so the lab knows to backfill.
require_once __DIR__ . '/includes/sharepoint_alert.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Log all errors but never display them to the browser.
// Showing PHP errors to a user is a security risk — it can expose file paths,
// database credentials, or internal logic. We want them in the server log where
// only we can see them. E_ALL makes sure nothing gets silently swallowed.
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);


// Email and SMTP configuration is in mpact_config.php.
// SharePoint credentials and shared helpers (createMailer, curlRequest) are also there.
// To change who receives emails, edit CC_LIST in mpact_config.php.


// post(), clean(), respond(), and requireFields() come from
// includes/validation.php. Only the booking-specific formatValue() map
// stays in this file — every other helper is shared.


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


// Content validators (enforceMaxLength, validateNumericRange, validateInteger,
// validateDateInRange, validateNameField, validateTextField, enforceWordLimit,
// and the containsHtmlTags / containsEmoji / looksLikeMashing primitives) all
// come from includes/validation.php. The booking.js front-end runs the same
// rules in the browser; these are the server-side defense-in-depth copy.

// STEP 1: Validate the request method
// This script should only ever be called by the booking form's fetch().
// If someone types the URL directly in a browser (GET request) or pokes
// at it with a tool, we return an error immediately.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Invalid request method.');
}

// The name and email are the absolute minimum we need to do anything useful.
// Everything else — equipment details, dates, preferences — fills in the email
// body but isn't strictly required to send a notification.
requireFields(['first_name', 'last_name', 'email']);

// Billing acknowledgement is gated on the client by a checkbox (#bkAgreeTerms).
// A hand-crafted POST can omit it entirely, so we re-check on the server.
// Standard HTML checkboxes only post a value when checked; absence == no.
if (empty($_POST['agreeTerms'])) {
    respond(false, 'You must acknowledge the billing terms before submitting.');
}

$firstName = post('first_name');
$lastName  = post('last_name');

// Validate name format + lengths on the globally required fields.
validateNameField('first_name', 'First Name');
validateNameField('last_name',  'Last Name');
enforceMaxLength('first_name',   25,  'First Name');
enforceMaxLength('last_name',    25,  'Last Name');
enforceMaxLength('email',        50,  'Email');
enforceMaxLength('organization', 100, 'Organization');
validateTextField('organization', 'Organization');


// STEP 2: Collect all POST values
// Equipment fields come from the booking form's hidden inputs, which
// booking.js populates when the user selects a piece of equipment.
//
// equipment_name_display is the human-readable label (e.g. "SUSS MJB4
// Mask Aligner") that booking.js writes from the equipment card.
// equipment_name is the raw identifier. We prefer the display version
// for email subject lines and body text — it's what the user actually saw.
$category           = post('category');
$equipment_id       = post('equipment_id');
$equipment_name     = post('equipment_name');
$equipment_category = post('equipment_category');
$equipment_status   = post('equipment_status');
$equipment_display  = post('equipment_name_display');

$email        = post('email');
validatePhoneFormat('phone', 'Phone');
$phone        = mb_substr(post('phone'), 0, 25);   // matches the 14-char client mask + slack for international
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


// STEP 3: Validate the email address
// filter_var with FILTER_VALIDATE_EMAIL does a proper RFC-compliant check.
// This catches typos like "user@" or "notanemail" before we try to send
// anything. We do it after field collection so we have $email available.
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Invalid email address.');
}


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
// Category-specific validation + field maps. The form posts either
// 'booking' (standard reservation) or 'educational' (course request).
// Anything else is tampered input and gets rejected.
$categoryMode = post('category');
if ($categoryMode === '') {
    $categoryMode = 'booking';
}
if (!in_array($categoryMode, ['booking', 'educational'], true)) {
    respond(false, 'Invalid booking category.');
}

// User type controls billing + gates access to educational equipment.
$userType = post('user_type');
$validUserTypes = ['nau_student', 'nau_faculty_staff', 'external_academic', 'industry', ''];
if (!in_array($userType, $validUserTypes, true)) {
    respond(false, 'Invalid user type.');
}

if ($categoryMode === 'educational') {
    // Educational equipment is for NAU students/faculty/staff only.
    // booking.js hides the educational path for external/industry users,
    // so if those user types show up here the request was hand-crafted.
    if ($userType === 'external_academic' || $userType === 'industry') {
        respond(false, 'Educational equipment requests are limited to NAU students, faculty, and staff.');
    }

    // Course-request required fields
    requireFields([
        'equipment_name',
        'course_number',
        'instructor_name',
        'class_use',
        'group_size',
        'semester',
        'preferred_date',
    ]);

    validateNameField('instructor_name', 'Instructor Name');
    enforceMaxLength('course_number',   20,   'Course Number');
    enforceMaxLength('course_name',     150,  'Course Name');
    enforceMaxLength('instructor_name', 100,  'Instructor Name');
    enforceMaxLength('instructor_email', 50,  'Instructor Email');
    enforceMaxLength('sessions_needed', 100,  'Sessions Needed');

    validateTextField('class_use',     'Intended Use');
    enforceWordLimit('class_use', 500, 'Intended Use');
    enforceMaxLength('class_use',  2500, 'Intended Use');

    if (!empty(trim($_POST['edu_notes'] ?? ''))) {
        validateTextField('edu_notes', 'Additional Notes');
        enforceWordLimit('edu_notes', 500, 'Additional Notes');
        enforceMaxLength('edu_notes', 2500, 'Additional Notes');
    }

    validateNumericRange('group_size', 1, 200, 'Group / Class Size');
    validateInteger('group_size', 'Group / Class Size');
    validateDateInRange('preferred_date',   'Preferred Date');
    validateDateInRange('alternative_date', 'Alternative Date');

    $instructorEmail = trim($_POST['instructor_email'] ?? '');
    if ($instructorEmail !== '' && !filter_var($instructorEmail, FILTER_VALIDATE_EMAIL)) {
        respond(false, 'Instructor email is not a valid address.');
    }
} else {
    // Standard booking required fields
    requireFields([
        'equipment_name',
        'preferred_date',
        'sample_description',
        'purpose_of_use',
    ]);

    enforceMaxLength('sample_description', 500,  'Sample Description');
    validateTextField('sample_description', 'Sample Description');

    validateTextField('purpose_of_use', 'Purpose of Use');
    enforceWordLimit('purpose_of_use', 500, 'Purpose of Use');
    enforceMaxLength('purpose_of_use', 2500, 'Purpose of Use');

    if (!empty(trim($_POST['special_requirements'] ?? ''))) {
        validateTextField('special_requirements', 'Special Requirements');
        enforceWordLimit('special_requirements', 500, 'Special Requirements');
        enforceMaxLength('special_requirements', 2500, 'Special Requirements');
    }

    validateDateInRange('preferred_date',   'Preferred Date');
    validateDateInRange('alternative_date', 'Alternative Date');

    // NAU-specific fields become required when internal user types are chosen
    if ($userType === 'nau_student' || $userType === 'nau_faculty_staff') {
        requireFields(['nau_id', 'nau_email', 'department', 'school']);
        enforceMaxLength('nau_id',     20,  'NAU ID');
        enforceMaxLength('nau_email',  50,  'NAU Email');
        enforceMaxLength('department', 100, 'Department');
        enforceMaxLength('speed_chart', 50, 'Speed Chart');
        validateTextField('department',  'Department');
        validateTextField('speed_chart', 'Speed Chart');
        // The HTML uses pattern="[0-9]*" — mirror that on the server so a
        // crafted POST can't slip in letters or punctuation.
        validateInteger('nau_id', 'NAU ID');

        $nauEmail = trim($_POST['nau_email'] ?? '');
        if ($nauEmail !== '' && !filter_var($nauEmail, FILTER_VALIDATE_EMAIL)) {
            respond(false, 'NAU email is not a valid address.');
        }

        if ($userType === 'nau_student') {
            requireFields(['supervisor']);
            validateNameField('supervisor', 'Supervisor');
            enforceMaxLength('supervisor', 100, 'Supervisor');
        }
        if ($userType === 'nau_faculty_staff') {
            enforceMaxLength('job_title', 100, 'Job Title');
        }
    }
}

// Mode-aware display field list for the email table
if ($categoryMode === 'educational') {
    $fields = [
        'equipment_name'     => 'Equipment',
        'equipment_category' => 'Category',
        'equipment_status'   => 'Status',
        'course_number'      => 'Course Number',
        'course_name'        => 'Course Name',
        'instructor_name'    => 'Instructor Name',
        'instructor_email'   => 'Instructor Email',
        'group_size'         => 'Group / Class Size',
        'semester'           => 'Semester',
        'preferred_date'     => 'Preferred Date',
        'alternative_date'   => 'Alternative Date',
        'session_duration'   => 'Session Duration',
        'sessions_needed'    => 'Sessions Needed',
        'class_use'          => 'Intended Use / Learning Objectives',
        'edu_notes'          => 'Additional Notes',
    ];
} else {
    $fields = [
        'equipment_name'       => 'Equipment',
        'equipment_category'   => 'Category',
        'equipment_status'     => 'Status',
        'user_type'            => 'User Type',

        'nau_id'               => 'NAU ID',
        'nau_email'            => 'NAU Email',
        'department'           => 'Department',
        'school'               => 'School / College',
        'speed_chart'          => 'Speed Chart',
        'supervisor'           => 'Supervisor',
        'job_title'            => 'Job Title',

        'preferred_date'       => 'Preferred Date',
        'preferred_time'       => 'Preferred Time',
        'estimated_duration'   => 'Estimated Duration',
        'alternative_date'     => 'Alternative Date',

        'sample_description'   => 'Sample Description',
        'purpose_of_use'       => 'Purpose of Use',
        'operating_modes'      => 'Preferred Operating Mode(s)',

        'training_needed'      => 'Training Needed',
        'lab_assistance'       => 'Lab Assistance',
        'special_requirements' => 'Special Requirements',
    ];
}

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
$catTitle       = ($categoryMode === 'educational') ? 'Course Equipment Request' : 'Equipment Booking';
$catMeta        = ['title' => $catTitle];
$fullName       = "$firstName $lastName";
// equipment_name (hidden input) is set by booking.js to the human-readable
// equipment name. equipment_name_display is the <select> value which, because
// options use value=item.id, actually contains the ID string. Prefer the
// hidden-field name so subject lines read "SUSS MJB4 Mask Aligner" not "EQ-031".
$equipmentLabel = ($equipment_name !== '') ? $equipment_name : $equipment_display;
$timestamp      = date("F j, Y \a\\t g:i A T");


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
$labSubject = (($categoryMode === 'educational') ? 'New Course Request: ' : 'New Booking Request: ')
             . $equipmentLabel . ' from ' . $fullName;
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


// STEP 7: Build the user confirmation email
//
// This goes back to the person who submitted the request. They get
// a full recap of everything they submitted — useful if they want to
// reference what they asked for, or forward it to a colleague.
//
// We tell them 1-2 business days for a response. If that expectation
// ever changes, update it here in both the HTML body and the $userPlain.
$userSubject = ($categoryMode === 'educational')
    ? 'We received your Course Request — MPaCT Nano Lab'
    : 'We received your Booking request — MPaCT Nano Lab';
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
                                <tr>
                                    <td style="padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; font-size:14px;">Organization</td>
                                    <td style="padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;">' . ($organization ?: '—') . '</td>
                                </tr>' . $detailRows . '
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

// Plain-text fallback for the user confirmation — now includes the same
// submission details the lab sees, so the user has a full record.
$userPlain = "Thank you, $firstName!

We have received your $catTitle inquiry and it is currently being reviewed by our team. A lab representative will get back to you within 1-2 business days.

YOUR SUBMISSION
  Name: $fullName
  Email: $email
  Organization: " . ($organization ?: 'Not provided') . "

$catTitle DETAILS
$plainDetails
Need immediate help? Email us at " . LAB_EMAIL . "

---
MPaCT Nano Lab
Microelectronics Processing, Characterization & Testing
Northern Arizona University, Flagstaff, AZ
";


// createMailer() is defined in mpact_config.php


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
try {
    $labMail = createMailer();
    $labMail->addAddress(LAB_EMAIL);
    foreach (CC_LIST as $cc) {
        $labMail->addCC($cc);
    }
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

    // Send the success response immediately so the user is not left
    // waiting for the SharePoint sync below. The script keeps running
    // and falls through into the SharePoint block; if SP fails, the lab
    // gets a SharePoint failure alert email — the user is unaffected.
    respondAndContinue(true, 'Your inquiry has been submitted successfully! You will receive a confirmation email shortly.');

} catch (Exception $e) {
    // Log the real PHPMailer error message to the server log so we can debug it,
    // but return a friendly generic message to the user. Never expose stack traces
    // or internal error details to the browser — they can reveal server configuration.
    error_log("MPCT Booking Error: " . $e->getMessage());
    respond(false, 'We were unable to send your inquiry at this time. Please try again or email us directly at ' . LAB_EMAIL . '.');
}

// STEP 9: Log the booking to SharePoint (non-blocking)
// Emails are already sent — a SharePoint failure does NOT affect
// the user's experience. Errors are logged server-side only.
try {
    $tokenRes = curlRequest('POST', TOKEN_URL, null,
        http_build_query([
            'grant_type' => 'client_credentials',
            'client_id' => CLIENT_ID,
            'client_secret' => CLIENT_SECRET,
            'scope' => 'https://graph.microsoft.com/.default'
        ]),
        'application/x-www-form-urlencoded'
    );

    $data = json_decode($tokenRes['body'], true);

    if ($tokenRes['code'] !== 200 || empty($data['access_token'])) {
        throw new RuntimeException('SharePoint auth failed');
    }

    $token = $data['access_token'];

    $siteUrl = GRAPH . '/sites/' . rawurlencode(SP_HOST) . ':' . SP_SITE_PATH;
    $site = curlRequest('GET', $siteUrl, $token);

    $siteData = json_decode($site['body'], true);
    $siteId = $siteData['id'];

    if ($site['code'] !== 200) {
        throw new RuntimeException('SharePoint site resolution failed: ' . $site['body']);
    }

    $listUrl = GRAPH . '/sites/' . $siteId . '/lists';
    $listRes = curlRequest('GET', $listUrl, $token);

    $listData = json_decode($listRes['body'], true);

    if ($listRes['code'] !== 200) {
        throw new RuntimeException('SharePoint list fetch failed: ' . $listRes['body']);
    }

    $listId = null;

    foreach ($listData['value'] as $list) {
        if ($list['name'] === LIST_NAME) {
            $listId = $list['id'];
            break;
        }
    }

    if (!$listId) {
        throw new RuntimeException('SharePoint list not found: ' . LIST_NAME);
    }

    $itemUrl = GRAPH . '/sites/' . $siteId . '/lists/' . $listId . '/items';

    // Values from post() are HTML-escaped for safe email rendering
    // (e.g. "O'Brien" becomes "O&#039;Brien"). SharePoint stores plain
    // text and renders it itself — decode before insert so the list
    // shows the original characters, not entity codes.
    $spDecode = static fn(string $v): string => htmlspecialchars_decode($v, ENT_QUOTES);

    $sp_List_fields = [
        'Title'               => $catTitle . ': ' . $spDecode($equipmentLabel),
        'FirstName'           => $spDecode($firstName),
        'LastName'            => $spDecode($lastName),
        'Email'               => $spDecode($email),
        'Phone'               => $spDecode($phone),
        'Equipment'           => $spDecode($equipmentLabel),
        'Category'            => $spDecode($equipment_category),
        'Status'              => formatValue($spDecode($equipment_status)),
        'PreferredDate'       => $spDecode($preferred_date),
        'EstimatedDuration'   => formatValue($spDecode($estimated_duration)),
        'AlternativeDate'     => $spDecode($alternative_date),
        'SampleDescription'   => $spDecode($sample_description),
        'PurposeofUse'        => $spDecode($purpose_of_use),
        'TrainingNeeded'      => formatValue($spDecode($training_needed)),
        'LabAssistance'       => formatValue($spDecode($lab_assistance)),
        'SpecialRequirements' => $spDecode($special_requirements),
    ];

    $payload = json_encode([
        'fields' => $sp_List_fields
    ]);

    $create = curlRequest('POST', $itemUrl, $token, $payload);

    if ($create['code'] < 200 || $create['code'] >= 300) {
        throw new RuntimeException('SharePoint list insert failed: ' . $create['body']);
    }

} catch (Exception $e) {
    error_log('MPCT SharePoint Booking Sync Error: ' . $e->getMessage());
    notifySharePointFailure('Equipment Reservation', $e, [
        'submitter_name'  => $fullName,
        'submitter_email' => $email,
        'equipment'       => $equipmentLabel ?? '',
        'category'        => $category ?? '',
    ]);
}
