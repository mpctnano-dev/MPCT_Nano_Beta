<?php

// ---------------------------------------------------------------
// LOAD PHPMailer
// ---------------------------------------------------------------
require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// ---------------------------------------------------------------
// CONFIGURATION
// ---------------------------------------------------------------

define('LAB_EMAIL', 'mpct.nano@nau.edu');
define('SENDER_EMAIL', 'mpct.nano@nau.edu');
define('SENDER_NAME', 'MPaCT Nano Lab');
define('SMTP_HOST', 'mailgate.nau.edu');
define('SMTP_PORT', 25);

// ---------------------------------------------------------------
// VALIDATION
// ---------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Invalid request method.');
}

requireFields([
    'first_name',
    'last_name',
    'email',
    'equipment_name',
    'preferred_date',
    'preferred_time',
    'sample_description',
    'purpose'
]);

$firstName = post('first_name');
$lastName = post('last_name');
$email = post('email');
$phone = post('phone');
$organization = post('organization');

// Booking-specific fields
$equipment = post('equipment_name') ?: post('bk_equipment_name');
$date = post('preferred_date') ?: post('booking_date');
$preferredTime = post('preferred_time');
$duration = post('estimated_duration') ?: post('end_time');
$purpose = post('purpose_of_use') ?: post('purpose');

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Invalid email address.');
}

$fullName = "$firstName $lastName";
$timestamp = date("F j, Y \a\\t g:i A T");

// ---------------------------------------------------------------
// BOOKING DETAILS (keeps SAME TABLE DESIGN)
// ---------------------------------------------------------------
$fields = [
    'equipment_name'     => 'Equipment',
    'preferred_date'     => 'Date',
    'preferred_time'     => 'Preferred Time',
    'estimated_duration' => 'Duration',
    'purpose_of_use'     => 'Purpose'
];

$detailRows = '';
$plainDetails = '';

foreach ($fields as $key => $label) {
    $value = post($key) ?: '—';

    $detailRows .= "
        <tr>
            <td style='padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; width:35%; font-size:14px;'>$label</td>
            <td style='padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;'>$value</td>
        </tr>";

    $plainDetails .= "  $label: $value\n";
}

// ---------------------------------------------------------------
// SUBJECT
// ---------------------------------------------------------------
$catTitle = "Equipment Booking Request";
$labSubject = "New Booking: $equipment from $fullName";

// ---------------------------------------------------------------
// EMAIL BODY (UNCHANGED TEMPLATE)
// ---------------------------------------------------------------
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
                <!-- Main email container, 640px max like a standard email -->
                <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                    
                    <!-- Header: NAU logo + lab name on navy blue -->
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
                    <!-- Gold accent bar -->
                    <tr><td style="background:#FFC627; height:4px; font-size:0; line-height:0;">&nbsp;</td></tr>

                    <!-- Body content -->
                    <tr>
                        <td style="padding:28px 32px;">
                            <!-- What type of inquiry this is -->
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

                            <!-- Contact info section -->
                            <h2 style="margin:0 0 12px 0; font-size:15px; color:#003466; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid #FFC627; padding-bottom:8px; display:inline-block;">Contact Information</h2>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                                <tr>
                                    <td style="padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; width:35%; font-size:14px;">Name</td>
                                    <td style="padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;">' . $fullName . '</td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; font-size:14px;">Email</td>
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

                            <!-- Category-specific details -->
                            <h2 style="margin:0 0 12px 0; font-size:15px; color:#003466; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid #FFC627; padding-bottom:8px; display:inline-block;">' . $catTitle . ' Details</h2>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">' . $detailRows . '
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
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



// ---------------------------------------------------------------
// PLAIN TEXT
// ---------------------------------------------------------------
$labPlain = "NEW BOOKING REQUEST
Submitted: $timestamp
---

CONTACT INFORMATION
  Name: $fullName
  Email: $email
  Phone: " . ($phone ?: 'Not provided') . "
  Organization: " . ($organization ?: 'Not provided') . "

BOOKING DETAILS
$plainDetails
---
";

// ---------------------------------------------------------------
// USER EMAIL (UNCHANGED DESIGN)
// ---------------------------------------------------------------
$userSubject = "Booking Request Received — MPaCT Nano Lab";

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
                    
                    <!-- Header: NAU logo + lab name on navy blue -->
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

                    <!-- Body -->
                    <tr>
                        <td style="padding:28px 32px;">
                            <h2 style="margin:0 0 16px 0; font-size:22px; color:#003466;">Thank you, ' . $firstName . '!</h2>
                            
                            <p style="font-size:15px; line-height:1.7; color:#444; margin:0 0 8px 0;">
                                We have received your <strong style="color:#003466;">' . $catTitle . '</strong> inquiry and it is currently being reviewed by our team.
                            </p>
                            <p style="font-size:15px; line-height:1.7; color:#444; margin:0 0 24px 0;">
                                A lab representative will get back to you within <strong>1&ndash;2 business days</strong>.
                            </p>

                            <!-- Summary of what they submitted -->
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

                            <!-- Direct contact info in case they need help sooner -->
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

                    <!-- Footer -->
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

// ---------------------------------------------------------------
$userPlain = "Thank you, $firstName!

We received your booking request.

BOOKING DETAILS
$plainDetails
";

// ---------------------------------------------------------------
// MAILER FUNCTION
// ---------------------------------------------------------------
function createMailer(): PHPMailer
{
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = SMTP_HOST;
    $mail->Port = SMTP_PORT;
    $mail->SMTPAuth = false;
    $mail->SMTPSecure = '';
    $mail->SMTPAutoTLS = false;

    $mail->setFrom(SENDER_EMAIL, SENDER_NAME);
    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';

    $logoPath = __DIR__ . '/Images/NAU.png';
    if (file_exists($logoPath)) {
        $mail->addEmbeddedImage($logoPath, 'naulogo');
    }

    return $mail;
}

// ---------------------------------------------------------------
// SEND EMAILS
// ---------------------------------------------------------------
try {
    $labMail = createMailer();
    $labMail->addAddress(LAB_EMAIL);
    $labMail->addReplyTo($email, $fullName);
    $labMail->Subject = $labSubject;
    $labMail->Body = $labBody;
    $labMail->AltBody = $labPlain;
    $labMail->send();

    $userMail = createMailer();
    $userMail->addAddress($email, $fullName);
    $userMail->Subject = $userSubject;
    $userMail->Body = $userBody;
    $userMail->AltBody = $userPlain;
    $userMail->send();

    respond(true, 'Booking submitted successfully!');

} catch (Exception $e) {
    error_log($e->getMessage());
    respond(false, 'Email failed.');
}

// ---------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------
function post($key)
{
    return trim($_POST[$key] ?? '');
}

function requireFields($fields)
{
    foreach ($fields as $field) {
        if (empty($_POST[$field])) {
            respond(false, "Missing field: $field");
        }
    }
}

function respond($success, $message)
{
    header('Content-Type: application/json');
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}