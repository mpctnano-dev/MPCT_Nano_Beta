<?php
/*
 * FormSubmission.php
 * ------------------
 * This is the backend handler for ALL contact forms on Contact_Us.html.
 * 
 * Here's what happens when someone hits "Submit Request":
 *   1. The browser sends form data here via POST (AJAX, no page reload)
 *   2. We validate the input — make sure name, email, category are present
 *   3. We figure out which form they filled out (equipment, training, tour, etc.)
 *   4. We build two nicely formatted HTML emails:
 *        - One goes to the lab inbox so staff can see the inquiry
 *        - One goes back to the user as a confirmation / receipt
 *   5. Both emails are sent through NAU's internal mail relay (mailgate.nau.edu)
 *   6. We return a JSON response so the frontend can show success or error
 * 
 * PHPMailer handles the actual SMTP connection. We're using the version
 * from the PHPMailer/ folder (no Composer needed). NAU's mailgate runs
 * on port 25 with no authentication — it's an internal relay, so we
 * don't need usernames/passwords or TLS.
 * 
 * Anti-spam notes:
 *   - We use proper MIME structure (multipart/alternative with both HTML + plaintext)
 *   - The "From" domain matches nau.edu so SPF/DKIM checks pass on the relay
 *   - Every email has a proper DOCTYPE, <html>, <head>, <body> structure
 *   - No invisible text, no excessive links, no ALL-CAPS subjects
 *   - We set Message-ID and X-Mailer headers so it doesn't look auto-generated
 *   - Reply-To is set to the actual user so replies work naturally
 */

// ---------------------------------------------------------------
// STEP 1: Load PHPMailer
// We need three class files from PHPMailer. Using __DIR__ so the
// paths always resolve correctly regardless of how PHP is invoked.
// ---------------------------------------------------------------
require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// ---------------------------------------------------------------
// STEP 2: Configuration
// Change these if the lab email or sender address ever changes.
// SENDER_EMAIL is what shows up in the "From" field.
// LAB_EMAIL is where the notification goes (your inbox).
// ---------------------------------------------------------------
define('LAB_EMAIL', 'mpct.nano@nau.edu');
define('SENDER_EMAIL', 'mpct.nano@nau.edu');
define('SENDER_NAME', 'MPaCT Nano Lab');
define('SMTP_HOST', 'mailgate.nau.edu');
define('SMTP_PORT', 25);

// ---------------------------------------------------------------
// STEP 3: Helper Functions
// Small utilities we reuse throughout the script.
// ---------------------------------------------------------------

// Strips whitespace and escapes HTML to prevent XSS attacks
function clean(string $val): string
{
    return htmlspecialchars(trim($val), ENT_QUOTES, 'UTF-8');
}

// Grabs a POST field by name, returns empty string if it doesn't exist
function post(string $key): string
{
    return isset($_POST[$key]) ? clean($_POST[$key]) : '';
}

// Checks that a list of fields are all present. If any are missing,
// we immediately return an error to the browser and stop.
function requireFields(array $keys): void
{
    foreach ($keys as $k) {
        if (empty(post($k))) {
            respond(false, "Missing required field: $k");
        }
    }
}

// Sends a JSON response back to the browser and kills the script.
// The frontend JavaScript parses this to show success/error messages.
function respond(bool $ok, string $msg): void
{
    header('Content-Type: application/json');
    echo json_encode(['success' => $ok, 'message' => $msg]);
    exit;
}

// ---------------------------------------------------------------
// STEP 4: Define what fields each form category has
// 
// This mirrors the fieldData object in script.js. Each category
// has a display title, a list of field names (matching the "name"
// attributes in the HTML), and human-readable labels for emails.
// 
// When we get a POST with category = "equipment", we know to look
// for equipment_category, equipment_name, etc. in the POST data.
// ---------------------------------------------------------------
$categories = [
    'equipment' => [
        'title' => 'Equipment Inquiry',
        'fields' => ['equipment_category', 'equipment_name', 'intended_usage', 'experimental_details'],
        'labels' => [
            'equipment_category' => 'Equipment Category',
            'equipment_name' => 'Equipment Name',
            'intended_usage' => 'Intended Usage',
            'experimental_details' => 'Experimental Details / Measurement Goals',
        ],
    ],
    'research' => [
        'title' => 'Research & Strategic Partnerships',
        'fields' => ['project_title', 'funding_agency', 'timeline', 'project_abstract'],
        'labels' => [
            'project_title' => 'Project Title / Topic',
            'funding_agency' => 'Funding Agency',
            'timeline' => 'Timeline',
            'project_abstract' => 'Project Description / Abstract',
        ],
    ],
    'billing' => [
        'title' => 'Billing & Invoicing',
        'fields' => ['reference_number', 'billing_contact', 'billing_address', 'issue_description'],
        'labels' => [
            'reference_number' => 'Reference Number',
            'billing_contact' => 'Billing Contact Person',
            'billing_address' => 'Billing Address',
            'issue_description' => 'Issue Description',
        ],
    ],
    'training' => [
        'title' => 'Safety & Training',
        'fields' => ['request_type', 'training_specifics', 'notes'],
        'labels' => [
            'request_type' => 'Request Type',
            'training_specifics' => 'Training Specifics',
            'notes' => 'Notes / Additional Details',
        ],
    ],
    'courses' => [
        'title' => 'Course Support',
        'fields' => ['course_number', 'semester', 'inquiry'],
        'labels' => [
            'course_number' => 'Course Number',
            'semester' => 'Semester',
            'inquiry' => 'Inquiry',
        ],
    ],
    'tour' => [
        'title' => 'Schedule a Tour',
        'fields' => ['group_size', 'group_type', 'preferred_date', 'alternative_date', 'notes'],
        'labels' => [
            'group_size' => 'Group Size',
            'group_type' => 'Group Type',
            'preferred_date' => 'Preferred Date',
            'alternative_date' => 'Alternative Date',
            'notes' => 'Notes / Specific Interests',
        ],
    ],
    'sales' => [
        'title' => 'Vendor / Sales',
        'fields' => ['product_category', 'message'],
        'labels' => [
            'product_category' => 'Product Category',
            'message' => 'Message',
        ],
    ],
    'other' => [
        'title' => 'General Inquiry',
        'fields' => ['message'],
        'labels' => [
            'message' => 'Message',
        ],
    ],
    'issue' => [
        'title' => 'Report an Issue',
        'fields' => ['issue_type', 'equipment_name', 'description'],
        'labels' => [
            'issue_type' => 'Issue Type',
            'equipment_name' => 'Equipment Name',
            'description' => 'Description',
        ],
    ],
];

// ---------------------------------------------------------------
// STEP 5: Validate the incoming request
// 
// First, make sure it's actually a POST request (not someone
// typing the URL in their browser). Then check that the required
// fields are filled in. Finally, verify the email looks real and
// that the category matches one of our known forms.
// ---------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Invalid request method.');
}

requireFields(['first_name', 'last_name', 'email', 'category']);

$firstName = post('first_name');
$lastName = post('last_name');
$email = post('email');
$phone = post('phone');
$organization = post('organization');
$category = post('category');

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Invalid email address.');
}
if (!isset($categories[$category])) {
    respond(false, 'Invalid form category.');
}

// Grab the metadata for whichever form they submitted
$catMeta = $categories[$category];
$catTitle = $catMeta['title'];
$fullName = "$firstName $lastName";

// Timestamp for when the form was submitted (Arizona is MST, no DST)
$timestamp = date("F j, Y \a\\t g:i A T");

// ---------------------------------------------------------------
// STEP 6: Build the category-specific table rows
// 
// We loop through the fields for this category and pull each value
// from POST data. Each field becomes a row in the email table.
// If a field was left empty, we show a dash instead of blank space.
// ---------------------------------------------------------------
$detailRows = '';
$plainDetails = '';
foreach ($catMeta['fields'] as $field) {
    $label = $catMeta['labels'][$field] ?? $field;
    $value = post($field) ?: '—';
    // HTML row for the email
    $detailRows .= "
            <tr>
                <td style='padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; width:35%; font-size:14px;'>$label</td>
                <td style='padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;'>$value</td>
            </tr>";
    // Plain-text version (for the AltBody so spam filters see real content)
    $plainDetails .= "  $label: $value\n";
}

// ---------------------------------------------------------------
// STEP 7: Build the email that goes to the LAB INBOX
// 
// This is what you and the team see when someone submits a form.
// It has a navy header with the NAU gold accent, a table of contact
// info, and then the category-specific details below it.
// The Reply-To is set to the user's email so you can just hit Reply.
//
// The HTML is wrapped in a proper DOCTYPE with <html>, <head>, <body>
// tags — this is important because Gmail and Outlook use the structure
// to decide if an email is legitimate or auto-generated spam.
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

// Plain-text version for email clients that don't render HTML
// (also helps spam score — emails with BOTH html and plain text look more legit)
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
// STEP 8: Build the CONFIRMATION email that goes to the USER
// 
// This is so the person knows we got their inquiry. It greets them
// by first name, tells them we'll respond in 1-2 business days,
// and shows a summary of everything they submitted (so they have
// a record). Also includes our direct email in case they need
// to follow up on something urgent.
// 
// Same proper HTML structure as the lab email — DOCTYPE, head, body.
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

// Plain-text fallback for the user confirmation
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
// STEP 9: Set up the SMTP connection
// 
// This function creates a fresh PHPMailer instance configured for
// NAU's internal mail relay. Key things:
//   - mailgate.nau.edu on port 25 (standard SMTP, no encryption)
//   - No authentication needed — it's an internal NAU server
//   - SMTPSecure and SMTPAutoTLS are explicitly off so PHPMailer
//     doesn't try to upgrade the connection to TLS (which would fail)
//   - HTML email with UTF-8 for special characters
//   - Custom X-Mailer header so it looks like a real system, not spam
//   - Message-ID with nau.edu domain to match sender (helps deliverability)
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
    $labMail->addCC('Akhil.Kinnera@nau.edu');
    $labMail->addCC('Sethuprasad.Gorantla@nau.edu');
    $labMail->addCC('Krishna-Dev.Palem@nau.edu');
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
