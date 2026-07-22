<?php
/*
 * FormSubmission.php
 * ------------------
 * Backend handler for ALL contact forms on Contact_Us.html.
 *
 * Contact_Us.html has nine different form categories (equipment inquiry,
 * research partnerships, billing, training, programs, tour, vendor/sales,
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
require_once __DIR__ . '/mpact_config.php';

// Shared validators / sanitizers / required-field gate live in
// includes/validation.php so all three form endpoints share one
// source of truth instead of each carrying a prefixed copy.
require_once __DIR__ . '/includes/validation.php';
require_once __DIR__ . '/includes/turnstile.php';
require_once __DIR__ . '/includes/rate_limit.php';

// SharePoint failure alert helper — emails LAB_EMAIL + DEV_SUPP_CC_LIST whenever
// the SharePoint sync below throws, so the lab knows to backfill.
require_once __DIR__ . '/includes/sharepoint_alert.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Email, SMTP, and SharePoint configuration is in mpact_config.php.
// To change who receives emails, edit the *_CC_LIST arrays in mpact_config.php.


// clean(), post(), respond(), and requireFields() come from
// includes/validation.php. Only the contact-form-specific formatValue()
// map stays here.


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


// HELPER: resolveInquiryCcList()
// Picks the CC roster for Contact_Us lab notifications. Non-Programs
// categories use CONTACT_US_CC_LIST; Programs routes by the program
// dropdown. Missing or unrecognized program values fall back to
// DEV_SUPP_CC_LIST so dev/support still gets a copy.
function resolveInquiryCcList(string $category, string $program = ''): array
{
    if ($category === 'programs') {
        switch ($program) {
            case 'Degree Programs - NAU':
                return DEGREE_PROGRAMS_CC_LIST;
            case 'PTAP - TSMC apprenticeship':
                return PTAP_CC_LIST;
            case 'Intel-SRC CHIPS Scholarship':
                return INTEL_SRC_CC_LIST;
            default:
                return DEV_SUPP_CC_LIST;
        }
    }

    return CONTACT_US_CC_LIST;
}


// Content validators (enforceMaxLength, validateNumericRange, validateInteger,
// validateDateInRange, validateNameField, validateTextField, enforceWordLimit,
// and the containsHtmlTags / containsEmoji / looksLikeMashing primitives) come
// from includes/validation.php — same code that backs the booking and service
// request endpoints. The browser already runs these in script.js; this is the
// server-side defense-in-depth copy so JS-disabled or hand-crafted POSTs hit
// the same wall.


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
    'programs' => [
        'title'  => 'Programs',
        'required' => ['program', 'inquiry'],
        'textFields' => ['semester', 'inquiry'],
        'wordLimited' => ['inquiry'],
        'fields' => ['program', 'bachelors_degree_program', 'semester', 'inquiry'],
        'labels' => [
            'program'                  => 'Program',
            'bachelors_degree_program' => "Bachelor's Degree Programs",
            'semester'               => 'Semester',
            'inquiry'                => 'Your Question',
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
    // 'issue' / "Report an Issue" category removed: no Contact_Us card
    // or link routes here, so the registry + fieldData entry were
    // unreachable from the UI. To restore, re-add a gateway card in
    // Contact_Us.html, a fieldData entry in JS/script.js, and a
    // matching block here.
];


// REQUEST VALIDATION
// Reject anything that isn't a real POST from the form. This prevents
// someone from loading this URL in a browser or sending a GET request.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Invalid request method.');
}

verifyTurnstile();

// Name, email, and category are required for every form type.
// Category tells us which form was submitted; without it we can't
// look up the right fields or build a meaningful email.
requireFields(['first_name', 'last_name', 'email', 'category']);

$firstName    = post('first_name');
$lastName     = post('last_name');
$email        = post('email');
validatePhoneFormat('phone', 'Phone');
$phone        = mb_substr(post('phone'), 0, 25);         // matches client 14-char mask + slack for international
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

// CATEGORY-SPECIFIC + CROSS-CATEGORY VALIDATION
// Runs after the category lookup so the required-field list and the
// content checks can be tailored per category. These are the same
// checks the browser already ran in script.js — repeated here so a
// hand-crafted POST can't slip past them.

// Required fields declared per category
foreach (($catMeta['required'] ?? []) as $reqField) {
    if (empty(post($reqField))) {
        $disp = $catMeta['labels'][$reqField] ?? ucwords(str_replace('_', ' ', $reqField));
        respond(false, 'Missing required field: ' . $disp . '.');
    }
}

// Global field shape + length checks
validateNameField('first_name', 'First Name');
validateNameField('last_name',  'Last Name');
enforceMaxLength('first_name',   25, 'First Name');
enforceMaxLength('last_name',    25, 'Last Name');
enforceMaxLength('email',        50, 'Email');
enforceMaxLength('organization', 100, 'Organization');
validateTextField('organization', 'Organization');

// Category-specific textarea + free-text checks
foreach (($catMeta['textFields'] ?? []) as $field) {
    $label = $catMeta['labels'][$field] ?? ucwords(str_replace('_', ' ', $field));
    validateTextField($field, $label);
    enforceMaxLength($field, 2500, $label);
}

// Word limits on long-form fields (abstracts, descriptions, inquiries)
foreach (($catMeta['wordLimited'] ?? []) as $field) {
    $label = $catMeta['labels'][$field] ?? ucwords(str_replace('_', ' ', $field));
    enforceWordLimit($field, 500, $label);
}

// Bachelor's Degree Programs is required only when Degree Programs - NAU is selected
if ($category === 'programs' && post('program') === 'Degree Programs - NAU' && empty(post('bachelors_degree_program'))) {
    respond(false, "Missing required field: Bachelor's Degree Programs.");
}

// Category-specific numeric and date validations
if ($category === 'tour') {
    validateNumericRange('group_size', 1, 500, 'Group Size');
    validateInteger('group_size', 'Group Size');
    validateDateInRange('preferred_date',   'Preferred Date');
    validateDateInRange('alternative_date', 'Alternative Date');
}

// All caught string fields in every category get a sane upper bound so no
// single value can blow up the email body.
foreach (($catMeta['fields'] ?? []) as $field) {
    $label = $catMeta['labels'][$field] ?? ucwords(str_replace('_', ' ', $field));
    enforceMaxLength($field, 2500, $label);
}

// Arizona doesn't observe Daylight Saving Time, so "MST" is always
// correct. Other US timezones flip between standard and daylight time,
// but Arizona stays on MST year-round (except Navajo Nation).
$timestamp = date("F j, Y \a\\t g:i A T");


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


// USER CONFIRMATION EMAIL
// Goes back to the submitter so they have a record of what they sent.
// We greet by first name (friendlier than "Dear [Full Name]"),
// set expectations for response time, and show a full recap of their
// submission. If they need something urgently, the lab email is at the bottom.
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


// createMailer() is defined in mpact_config.php


checkRateLimits(getClientIp(), trim($_POST['email'] ?? ''));


// SEND BOTH EMAILS
// Lab notification first. If it fails, the catch fires and we stop —
// we haven't confirmed success to the user yet, so that's fine.
// If the lab email succeeds, we send the user confirmation.
//
// The CC list routes by form category (and Programs dropdown when applicable).
// See resolveInquiryCcList() and the *_CC_LIST constants in mpact_config.php.
//
// addReplyTo() is important: it means when a staff member hits Reply
// in their inbox, the reply goes directly to the submitter — not
// back to the lab address (which would send them a loop).
try {
    $labMail = createMailer();
    $labMail->addAddress(LAB_EMAIL);
    addCcRecipients($labMail, resolveInquiryCcList($category, post('program')));
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
    // Log the real PHPMailer error to the server log where only we can see it.
    // Never echo exception details to the browser — they can expose internal paths
    // and server configuration to anyone watching the network.
    error_log("MPCT Form Error: " . $e->getMessage());
    respond(false, 'We were unable to send your inquiry at this time. Please try again or email us directly at ' . LAB_EMAIL . '.');
}

if (!defined('SANDBOX_SKIP_SHAREPOINT') || !SANDBOX_SKIP_SHAREPOINT) {
// Log the inquiry to SharePoint (non-blocking)
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
        if ($list['name'] === INQURY_LIST_NAME) {
            $listId = $list['id'];
            break;
        }
    }

    if (!$listId) {
        throw new RuntimeException('SharePoint list not found: ' . INQURY_LIST_NAME);
    }

    $itemUrl = GRAPH . '/sites/' . $siteId . '/lists/' . $listId . '/items';

    // Values from post() are HTML-escaped for safe email rendering
    // (e.g. "O'Brien" becomes "O&#039;Brien"). SharePoint stores plain
    // text and renders it itself — decode before insert so the list
    // shows the original characters, not entity codes.
    $sp_List_fields = [
        'Title'        => $catTitle,
        'FirstName'    => htmlspecialchars_decode($firstName, ENT_QUOTES),
        'LastName'     => htmlspecialchars_decode($lastName, ENT_QUOTES),
        'Email'        => htmlspecialchars_decode($email, ENT_QUOTES),
        'Phone'        => htmlspecialchars_decode($phone, ENT_QUOTES),
        'Organization' => htmlspecialchars_decode($organization, ENT_QUOTES),
    ];

    $payload = json_encode([
        'fields' => $sp_List_fields
    ]);

    $create = curlRequest('POST', $itemUrl, $token, $payload);

    if ($create['code'] < 200 || $create['code'] >= 300) {
        throw new RuntimeException('SharePoint list insert failed: ' . $create['body']);
    }

} catch (Exception $e) {
    error_log('MPCT SharePoint Inquiry Sync Error: ' . $e->getMessage());
    notifySharePointFailure('Inquiry', $e, [
        'submitter_name'  => $fullName,
        'submitter_email' => $email,
        'category'        => $catTitle ?? ($category ?? ''),
    ]);
}
}
