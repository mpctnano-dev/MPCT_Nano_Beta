<?php
// IntelScholarshipSubmission.php
//
// Handler for the CHIPS Scholars Program registration form on
// CHIPS_Scholars_Program.html. Sends two emails per submission: a
// lab notification (LAB_EMAIL + INTEL_SRC_CC_LIST) and an applicant
// confirmation, both using the same NAU template as the contact
// form. Validation reuses includes/validation.php so server rules
// match JS/validation.js byte-for-byte.
//
// This is a separate endpoint (not routed through FormSubmission.php)
// because the field shape — institution, major, degree, term,
// enrollment status — doesn't fit the contact router's nine-category
// registry, and forcing it in would mean touching every category's
// labels and email copy.


// Buffer stray output — a PHP notice would otherwise corrupt the
// JSON response. respond() ob_clean's before writing.
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';
require_once __DIR__ . '/mpact_config.php';
require_once __DIR__ . '/includes/validation.php';

use PHPMailer\PHPMailer\Exception;


// Reject anything that isn't a real POST.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Invalid request method.');
}


// Field name → label for the email body. Order matters — it's the
// order the rows appear in the lab + applicant emails, and we keep
// it aligned with how the form reads top-to-bottom.
$detailFields = [
    'current_institution' => 'Current Institution',
    'intended_major'      => 'Intended Major',
    'degree_interest'     => 'Degree Interest',
    'target_term'         => 'Target Semester',
    'enrollment_status'   => 'Current Status',
    'notes'               => 'Notes',
];

// Translate machine values from <select> to human labels for the
// email body. Major is free text now, so it has no map entry —
// the value falls through verbatim.
$valueMap = [
    'ms'           => 'Master of Science (MS)',
    'phd'          => 'Doctor of Philosophy (PhD)',
    'fall_2026'    => 'Fall 2026',
    'spring_2027'  => 'Spring 2027',
    'fall_2027'    => 'Fall 2027',
    'onboarding'   => 'Onboarding (incoming / applying)',
    'boarded'      => 'Boarded (currently enrolled MS)',
];


// Required fields. Phone is included because the coordinator's
// standard follow-up is a phone call, not just email.
requireFields(
    [
        'first_name',
        'last_name',
        'email',
        'phone',
        'current_institution',
        'intended_major',
        'degree_interest',
        'target_term',
        'enrollment_status',
    ],
    [
        'first_name'          => 'First Name',
        'last_name'           => 'Last Name',
        'current_institution' => 'Current Institution',
        'intended_major'      => 'Intended Major',
        'degree_interest'     => 'Degree Interest',
        'target_term'         => 'Target Semester',
        'enrollment_status'   => 'Current Status',
    ]
);

$firstName  = post('first_name');
$lastName   = post('last_name');
$fullName   = trim("$firstName $lastName");

// Email is read RAW (not via post()) before filter_var. post() runs
// htmlspecialchars first, which would turn "o'brien@x.com" into
// "o&#039;brien@x.com" and filter_var would reject it. PHPMailer
// also expects a real RFC address, so we keep the raw value through
// validation and PHPMailer, and escape only when embedding into HTML
// via $emailHtml.
$email = trim((string) ($_POST['email'] ?? ''));
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Invalid email address.');
}
$emailHtml = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');

// Length + content rules. Same shape as FormSubmission.php so all
// the forms on the site enforce identical caps and character classes.
validateNameField('first_name', 'First Name');
validateNameField('last_name',  'Last Name');
enforceMaxLength('first_name',  25,  'First Name');
enforceMaxLength('last_name',   25,  'Last Name');
enforceMaxLength('email',       50,  'Email');
validatePhoneFormat('phone', 'Phone');

validateTextField('current_institution', 'Current Institution');
enforceMaxLength('current_institution',  120, 'Current Institution');

// Major is free text — same emoji/mashing/HTML rules as any other
// text field, plus a 50-char cap that matches the client maxlength.
validateTextField('intended_major', 'Intended Major');
enforceMaxLength('intended_major', 50, 'Intended Major');

// Allow-list every dropdown. A value outside the list is either a
// typo in the front-end markup or a hand-crafted POST — reject before
// it lands in an email.
$allowed = [
    'degree_interest'   => ['ms', 'phd'],
    'target_term'       => ['fall_2026', 'spring_2027', 'fall_2027'],
    'enrollment_status' => ['onboarding', 'boarded'],
];
foreach ($allowed as $field => $options) {
    $raw = trim($_POST[$field] ?? '');
    if ($raw !== '' && !in_array($raw, $options, true)) {
        $label = $detailFields[$field] ?? ucwords(str_replace('_', ' ', $field));
        respond(false, "$label has an invalid selection.");
    }
}

// Notes is optional but, if filled, plays by the same rules as every
// other free-text field on the site (no emoji/HTML/mashing) plus a
// 500-word / 2500-char cap.
validateTextField('notes', 'Notes');
enforceMaxLength('notes', 2500, 'Notes');
enforceWordLimit('notes', 500, 'Notes');


// Build the email body rows. We read raw $_POST so the value map can
// translate, then htmlspecialchars exactly once before it goes into
// the HTML — using post() here would double-encode "&" through the map.
//
// Empty fields are skipped (no em-dash placeholder) so the email is
// a clean recap of what the applicant actually filled in. Required
// fields are guaranteed populated above, so this only ever drops
// optional values like Notes.
$detailRows   = '';
$plainDetails = '';

foreach ($detailFields as $field => $label) {
    $raw = trim($_POST[$field] ?? '');
    if ($raw === '') {
        continue;
    }
    $formatted = $valueMap[$raw] ?? $raw;
    $value     = htmlspecialchars($formatted, ENT_QUOTES, 'UTF-8');

    // Notes is a textarea — keep paragraph breaks in the HTML version.
    if ($field === 'notes') {
        $value = nl2br($value);
    }

    $detailRows .= "
            <tr>
                <td style='padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; width:35%; font-size:14px; vertical-align:top;'>$label</td>
                <td style='padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px; vertical-align:top;'>$value</td>
            </tr>";
    $plainDetails .= "  $label: $formatted\n";
}

$phoneClean = post('phone');

// Arizona doesn't observe DST — "MST" is correct year-round.
$timestamp = date('F j, Y \a\\t g:i A T');

// Short label for the lab banner, long label for the applicant intro.
// Two strings so each audience sees the wording that fits — staff
// scan the inbox quickly and want the short program name; applicants
// want the full program name in their confirmation.
$programShort = 'NAU CHIPS Scholars Program';
$programLong  = 'NAU Intel-SRC CHIPS Scholars Program';


// Lab notification. Same NAU header / gold rule / table layout as
// FormSubmission.php so staff see one consistent template across forms.
$labSubject = "New Scholarship Interest: $fullName ($programShort)";
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
                <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">

                    <!-- NAU header -->
                    <tr>
                        <td style="background:#003466; padding:20px 32px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td width="180" valign="middle">
                                        <img src="cid:naulogo" alt="Northern Arizona University" width="160" style="display:block; height:auto; border:0;">
                                    </td>
                                    <td valign="middle" style="padding-left:16px; border-left:2px solid rgba(255,255,255,0.3);">
                                        <h1 style="margin:0; font-size:18px; font-weight:700; color:#ffffff; letter-spacing:0.3px;">MPaCT Nano Lab</h1>
                                        <p style="margin:3px 0 0 0; font-size:12px; color:#9bb8d7;">NAU Intel-SRC CHIPS Scholars Program</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr><td style="background:#FFC627; height:4px; font-size:0; line-height:0;">&nbsp;</td></tr>

                    <tr>
                        <td style="padding:28px 32px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                                <tr>
                                    <td style="background:#eef3f8; padding:12px 16px; border-radius:6px; border-left:4px solid #003466;">
                                        <span style="font-size:13px; color:#666; text-transform:uppercase; letter-spacing:0.5px;">New Submission</span><br>
                                        <strong style="font-size:17px; color:#003466;">' . $programShort . '</strong>
                                    </td>
                                    <td align="right" valign="top" style="background:#eef3f8; padding:12px 16px; border-radius:6px;">
                                        <span style="font-size:12px; color:#888;">' . $timestamp . '</span>
                                    </td>
                                </tr>
                            </table>

                            <h2 style="margin:0 0 12px 0; font-size:15px; color:#003466; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid #FFC627; padding-bottom:8px; display:inline-block;">Applicant Information</h2>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                                <tr>
                                    <td style="padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; width:35%; font-size:14px;">Name</td>
                                    <td style="padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;">' . htmlspecialchars($fullName, ENT_QUOTES, 'UTF-8') . '</td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; font-size:14px;">Email</td>
                                    <td style="padding:10px 16px; border-bottom:1px solid #e8e8e8; font-size:14px;"><a href="mailto:' . $emailHtml . '" style="color:#003466; text-decoration:none;">' . $emailHtml . '</a></td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; font-size:14px;">Phone</td>
                                    <td style="padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;">' . $phoneClean . '</td>
                                </tr>
                            </table>

                            <h2 style="margin:0 0 12px 0; font-size:15px; color:#003466; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid #FFC627; padding-bottom:8px; display:inline-block;">Scholarship Details</h2>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">' . $detailRows . '
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="background:#f8f9fa; padding:16px 32px; border-top:1px solid #e8e8e8;">
                            <p style="margin:0; font-size:12px; color:#999; text-align:center;">
                                This email was sent from the MPaCT Nano Lab (<a href="https://nano.nau.edu" style="color:#999; text-decoration:underline;">nano.nau.edu</a>) from Northern Arizona University<br>
                                You can reply directly to this email to reach the applicant.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>';

$labPlain = "NEW SCHOLARSHIP INTEREST: $programShort
Submitted: $timestamp
---

APPLICANT INFORMATION
  Name: $fullName
  Email: $email
  Phone: $phoneClean

SCHOLARSHIP DETAILS
$plainDetails
---
Sent from MPaCT Nano Lab Intel-SRC scholarship registration form (nau.edu)
";


// Applicant confirmation. Friendly receipt with the same submission
// recap, so the applicant has a record they can forward to a
// recommender or referrer.
$userSubject = 'We received your NAU CHIPS Scholars Program interest';
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
                                        <p style="margin:3px 0 0 0; font-size:12px; color:#9bb8d7;">NAU Intel-SRC CHIPS Scholars Program</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr><td style="background:#FFC627; height:4px; font-size:0; line-height:0;">&nbsp;</td></tr>

                    <tr>
                        <td style="padding:28px 32px;">
                            <h2 style="margin:0 0 16px 0; font-size:22px; color:#003466;">Thank you, ' . htmlspecialchars($firstName, ENT_QUOTES, 'UTF-8') . '!</h2>

                            <p style="font-size:15px; line-height:1.7; color:#444; margin:0 0 8px 0;">
                                Your interest in the <strong style="color:#003466;">' . $programLong . '</strong> has been received and is currently being reviewed by the NAU program coordinator.
                            </p>
                            <p style="font-size:15px; line-height:1.7; color:#444; margin:0 0 24px 0;">
                                A coordinator will reach out to you within <strong>1&ndash;2 business days</strong> with the next steps for the cohort window you selected.
                            </p>

                            <h3 style="margin:0 0 12px 0; font-size:15px; color:#003466; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid #FFC627; padding-bottom:8px; display:inline-block;">Your Submission</h3>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                                <tr>
                                    <td style="padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; width:35%; font-size:14px;">Name</td>
                                    <td style="padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;">' . htmlspecialchars($fullName, ENT_QUOTES, 'UTF-8') . '</td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; font-size:14px;">Email</td>
                                    <td style="padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;">' . $emailHtml . '</td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; font-size:14px;">Phone</td>
                                    <td style="padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;">' . $phoneClean . '</td>
                                </tr>' . $detailRows . '
                            </table>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="background:#eef3f8; padding:16px 20px; border-radius:6px; border-left:4px solid #003466;">
                                        <p style="margin:0; font-size:14px; color:#555; line-height:1.6;">
                                            <strong style="color:#003466;">Need to follow up sooner?</strong><br>
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
                                NAU Intel-SRC CHIPS Scholars Program<br>
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

Your interest in the $programLong has been received and is currently being reviewed by the NAU program coordinator. A coordinator will reach out to you within 1-2 business days with the next steps for the cohort window you selected.

YOUR SUBMISSION
  Name: $fullName
  Email: $email
  Phone: $phoneClean
$plainDetails
Need to follow up sooner? Email us at " . LAB_EMAIL . "

---
MPaCT Nano Lab
NAU Intel-SRC CHIPS Scholars Program
Northern Arizona University, Flagstaff, AZ
";


// Lab notification goes first. If that fails the catch fires before
// we tell the user "submitted successfully". Each createMailer() call
// returns a fresh PHPMailer so recipients and Reply-To don't leak
// between the two sends.
try {
    $labMail = createMailer();
    $labMail->addAddress(LAB_EMAIL);
    addCcRecipients($labMail, INTEL_SRC_CC_LIST);
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

    respond(true, 'Thanks! Your scholarship interest has been submitted. Watch your inbox for a confirmation email.');

} catch (Exception $e) {
    error_log('MPCT Intel Scholarship Form Error: ' . $e->getMessage());
    respond(false, 'We were unable to submit your registration at this time. Please try again or email us directly at ' . LAB_EMAIL . '.');
}
