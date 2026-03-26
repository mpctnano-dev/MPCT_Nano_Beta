<?php


ob_start();
require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

error_reporting(E_ALL);
ini_set('display_errors', 0); 
ini_set('log_errors', 1);

define('LAB_EMAIL', 'mpct.nano@nau.edu');
define('SENDER_EMAIL', 'mpct.nano@nau.edu');
define('SENDER_NAME', 'MPaCT Nano Lab');
define('SMTP_HOST', 'mailgate.nau.edu');
define('SMTP_PORT', 25);

function post($key) {
    return isset($_POST[$key]) ? trim($_POST[$key]) : null;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Invalid request method.');
}

//requireFields(['first_name', 'last_name', 'email', 'category']);
$firstName = $_POST['first_name'] ?? '';
$lastName  = $_POST['last_name'] ?? '';

$category            = post('category');
$equipment_id        = post('equipment_id');
$equipment_name      = post('equipment_name');
$equipment_category  = post('equipment_category');
$equipment_status    = post('equipment_status');
//$equipment_filter    = post('equipment_category_filter');
$equipment_display   = post('equipment_name_display');

$first_name   = post('first_name');
$last_name    = post('last_name');
$email        = post('email');
$phone        = post('phone');

$preferred_date     = post('preferred_date');
$preferred_time     = post('preferred_time');
$estimated_duration = post('estimated_duration');
$alternative_date   = post('alternative_date');

$sample_description = post('sample_description');
$purpose_of_use     = post('purpose_of_use');

$training_needed      = post('training_needed');
$lab_assistance       = post('lab_assistance');
$special_requirements = post('special_requirements');


$fields = [
    'equipment_name' => 'Equipment',
    'equipment_category'     => 'Category',
    'equipment_status'       => 'Status',

    'preferred_date'         => 'Preferred Date',
    'preferred_time'         => 'Preferred Time',
    'estimated_duration'     => 'Estimated Duration',
    'alternative_date'       => 'Alternative Date',

    'sample_description'     => 'Sample Description',
    'purpose_of_use'         => 'Purpose of Use',

    'training_needed'        => 'Training Needed',
    'lab_assistance'         => 'Lab Assistance',
    'special_requirements'   => 'Special Requirements'
];



$detailRows = '';
$plainDetails = '';

foreach ($fields as $field => $label) {

    $value = post($field);

    // Handle empty values
    if ($value === null || $value === '') {
        $value = '—';
    }

    // If value is array (checkboxes, multi-select)
    if (is_array($value)) {
        $value = implode(', ', $value);
    }

    // Escape for safety (VERY important for email HTML)
    $safeValue = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');

    // HTML row
    $detailRows .= "
        <tr>
            <td style='padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; width:35%; font-size:14px;'>
                $label
            </td>
            <td style='padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;'>
                $safeValue
            </td>
        </tr>";

    // Plain text version
    $plainDetails .= "$label: $value\n";
}


//$organization = post('organization');
//$category = post('category');

$organization = post('organization');

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Invalid email address.');
}
$categories = [
    'equipment' => ['title' => 'Equipment Booking']
];

// Grab the metadata for whichever form they submitted
$catMeta = $categories[$category] ?? ['title' => 'Equipment Booking'];
$catTitle = $catMeta['title'];
$fullName = "$firstName $lastName";

// Timestamp for when the form was submitted (Arizona is MST, no DST)
$timestamp = date("F j, Y \a\\t g:i A T");


$labSubject = "New Booking Request: $equipment_name from $fullName";
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
                                        <strong style="font-size:17px; color:#003466;">'.$equipment_name.' </strong>
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
                               
                            </table>

                             
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

// Plain-text version for email clients that don't render HTML
// (also helps spam score — emails with BOTH html and plain text look more legit)
$labPlain = "NEW INQUIRY: from $fullName
Submitted: $timestamp
---

CONTACT INFORMATION
  Name: $fullName
  Email: $email
  Phone: " . ($phone ?: 'Not provided') . "


---
Sent from MPaCT Nano Lab contact form (nau.edu)
";


// ---------------------------------------------------------------
// Build the CONFIRMATION email that goes to the USER

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
                                We have received your <strong style="color:#003466;">'.$equipment_name.'</strong> inquiry and it is currently being reviewed by our team.
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
                                    <td style="padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; font-size:14px;">Preferred Date</td>
                                    <td style="padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;">' . $preferred_date . '</td>
                                </tr>

                                 <tr>
                                    <td style="padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; font-size:14px;">Preferred Time</td>
                                    <td style="padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;">' . $preferred_time . '</td>
                                </tr>

                                 <tr>
                                    <td style="padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; font-size:14px;">Estimated Duration</td>
                                    <td style="padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;">' . $estimated_duration . '</td>
                                </tr>

                             
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

function createMailer(): PHPMailer
{
    $mail = new PHPMailer(true);    // true = throw exceptions on errors
    $mail->isSMTP();                // use SMTP instead of PHP's mail()
    $mail->Host = SMTP_HOST;
    $mail->Port = SMTP_PORT;
    $mail->SMTPAuth = false;      // no login needed for NAU relay
    $mail->SMTPSecure = '';         // no encryption
    $mail->SMTPAutoTLS = false;     // don't try to upgrade to TLS
    $mail->setFrom(SENDER_EMAIL, SENDER_NAME);
    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'base64';    // cleaner encoding, avoids line-length issues

    // These headers help email clients trust the message:
    // - X-Mailer identifies the sending system (looks professional)
    // - Message-ID with nau.edu domain matches the sender 
    // - Priority 3 = normal (1 = urgent can trigger spam filters)
    $mail->XMailer = 'MPaCT Nano Lab Mailer';
    $mail->MessageID = '<' . uniqid('mpct-', true) . '@nau.edu>';
    $mail->Priority = 3;

    // Embed the NAU logo as a CID (Content-ID) attachment.
    // This means the logo shows up inline in the email body without loading
    // from an external URL. It works even when the recipient's email client
    // blocks remote images (which Gmail and Outlook do by default for new
    // senders). The "cid:naulogo" in the HTML <img> src references this.
    $logoPath = __DIR__ . '/Images/NAU.png';
    if (file_exists($logoPath)) {
        $mail->addEmbeddedImage($logoPath, 'naulogo', 'NAU.png', 'base64', 'image/png');
    }

    return $mail;
}

function respond($success, $message) {
    // Clear ANY previous output (warnings, spaces, etc.)
    if (ob_get_length()) {
        ob_clean();
    }

    header('Content-Type: application/json');

    echo json_encode([
        'success' => $success,
        'message' => $message
    ]);

    exit;
}
// ---------------------------------------------------------------
// STEP 10: Send both emails
// 
// We send the lab notification first, then the user confirmation.
// Each one gets its own PHPMailer instance (cleaner than reusing
// and clearing addresses, which can cause weird header leaks).
// 
// AltBody is the plain-text fallback. Having BOTH html and plain text
// is one of the biggest things that keeps emails out of spam — it
// tells Gmail/Outlook "this was sent by a real system, not a bot."
// 
// If anything goes wrong, the catch block logs the actual error
// to the server log (for debugging) but shows the user a friendly
// message without exposing any internal details.
// ---------------------------------------------------------------
try {
    // First: send the notification to the lab inbox
    $labMail = createMailer();
    $labMail->addAddress(LAB_EMAIL);
    //$labMail->addCC('Akhil.Kinnera@nau.edu');
    $labMail->addCC('Sethuprasad.Gorantla@nau.edu');
    //$labMail->addCC('Krishna-Dev.Palem@nau.edu');
    $labMail->addReplyTo($email, $fullName);  // so Reply goes to the user
    $labMail->Subject = $labSubject;
    $labMail->Body = $labBody;
    $labMail->AltBody = $labPlain;
    $labMail->send();

    // Second: send the confirmation to the user
    $userMail = createMailer();
    $userMail->addAddress($email, $fullName);
    $userMail->Subject = $userSubject;
    $userMail->Body = $userBody;
    $userMail->AltBody = $userPlain;
    $userMail->send();

    // Both sent — tell the frontend everything worked
    respond(true, 'Your inquiry has been submitted successfully! You will receive a confirmation email shortly.');

} catch (Exception $e) {
    // Log the real error for us to debug, but don't show it to the user
    error_log("MPCT Form Error: " . $e->getMessage());
    respond(false, 'We were unable to send your inquiry at this time. Please try again or email us directly at ' . LAB_EMAIL . '.');
}