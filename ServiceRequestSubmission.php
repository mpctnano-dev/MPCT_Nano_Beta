<?php
/*
 * ServiceRequestSubmission.php
 * ---------------------------
 * Handles ServiceRequest.html submissions for:
 *   - 3D Printing
 *   - Laser Structuring
 *   - 3D Scanning
 *
 * Behavior:
 *   1. Validate POST data and service type
 *   2. Build service-specific detail rows
 *   3. Send internal notification email
 *   4. Send user confirmation email
 *   5. Attach uploaded files to BOTH emails directly from PHP temp files
 *      
 */

require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

define('LAB_EMAIL', 'mpct.nano@nau.edu');
define('SENDER_EMAIL', 'mpct.nano@nau.edu');
define('SENDER_NAME', 'MPaCT Nano Lab');
define('SMTP_HOST', 'mailgate.nau.edu');
define('SMTP_PORT', 25);
define('MAX_FILE_SIZE_BYTES', 10 * 1024 * 1024); // 10 MB per file
define('MAX_FILES_PER_UPLOAD', 10);
define('DEFAULT_UPLOAD_HINT', 'No files uploaded');

// MIME types whose magic bytes indicate executable or script content.
// Files whose detected MIME matches any of these are rejected regardless of extension.
define('BLOCKED_MIME_TYPES', serialize([
    'application/x-php',
    'application/x-httpd-php',
    'application/x-sh',
    'application/x-shellscript',
    'application/x-executable',
    'application/x-elf',
    'application/x-msdos-program',
    'application/x-msdownload',
    'text/x-php',
    'text/x-script.phyton',
    'text/x-perl',
    'text/x-ruby',
]));

$services = [
    'printing' => [
        'title' => '3D Printing Service Request',
        'required' => [
            'first_name', 'last_name', 'email', 'affiliation', 'department',
            'project_title', 'application_category', 'project_abstract',
            'print_size', 'quantity', 'material', 'color', 'delivery'
        ],
        'fields' => [
            'affiliation', 'department', 'project_title', 'application_category', 'project_abstract',
            'print_size', 'quantity', 'material', 'color', 'deadline', 'delivery',
            'shipping_contact_name', 'shipping_speed', 'shipping_address_line1', 'shipping_address_line2',
            'shipping_city', 'shipping_state', 'shipping_zip', 'shipping_country', 'carrier_preference',
            'notes'
        ],
        'labels' => [
            'affiliation' => 'Client Affiliation',
            'department' => 'Organization / Department',
            'project_title' => 'Project Title',
            'application_category' => 'Application Category',
            'project_abstract' => 'Project Abstract / End Goal',
            'print_size' => 'Approximate Size (mm)',
            'quantity' => 'Quantity',
            'material' => 'Material',
            'color' => 'Preferred Color',
            'deadline' => 'Requested Completion Date',
            'delivery' => 'Delivery Method',
            'shipping_contact_name' => 'Shipping Contact Name',
            'shipping_speed' => 'Shipping Speed',
            'shipping_address_line1' => 'Shipping Address Line 1',
            'shipping_address_line2' => 'Shipping Address Line 2',
            'shipping_city' => 'Shipping City',
            'shipping_state' => 'Shipping State / Province',
            'shipping_zip' => 'Shipping ZIP / Postal Code',
            'shipping_country' => 'Shipping Country',
            'carrier_preference' => 'Carrier Preference',
            'notes' => 'Additional Notes'
        ],
        'uploadField' => 'files',
        // Only 3D model and reference image formats; no office docs.
        'allowedExtensions' => ['stl', '3mf', 'obj', 'ply', 'step', 'stp', 'iges', 'igs', 'pdf', 'jpg', 'jpeg', 'png', 'zip']
    ],
    'laser' => [
        'title' => 'Laser Structuring Service Request',
        'required' => [
            'first_name', 'last_name', 'email', 'affiliation', 'organization',
            'project_title', 'application_category', 'project_abstract',
            'substrate_type', 'target_material', 'substrate_dimensions', 'quantity', 'delivery'
        ],
        'fields' => [
            'affiliation', 'organization', 'project_title', 'application_category', 'project_abstract',
            'substrate_type', 'target_material', 'substrate_dimensions', 'min_feature',
            'quantity', 'deadline', 'delivery',
            'shipping_contact_name', 'shipping_speed', 'shipping_address_line1', 'shipping_address_line2',
            'shipping_city', 'shipping_state', 'shipping_zip', 'shipping_country', 'carrier_preference',
            'notes'
        ],
        'labels' => [
            'affiliation' => 'Client Affiliation',
            'organization' => 'Organization / Department',
            'project_title' => 'Project Title',
            'application_category' => 'Application Category',
            'project_abstract' => 'Project Abstract / End Goal',
            'substrate_type' => 'Substrate Type',
            'target_material' => 'Target Material / Layer',
            'substrate_dimensions' => 'Substrate Dimensions (mm)',
            'min_feature' => 'Minimum Feature Size (um)',
            'quantity' => 'Number of Units',
            'deadline' => 'Requested Completion Date',
            'delivery' => 'Delivery Method',
            'shipping_contact_name' => 'Shipping Contact Name',
            'shipping_speed' => 'Shipping Speed',
            'shipping_address_line1' => 'Shipping Address Line 1',
            'shipping_address_line2' => 'Shipping Address Line 2',
            'shipping_city' => 'Shipping City',
            'shipping_state' => 'Shipping State / Province',
            'shipping_zip' => 'Shipping ZIP / Postal Code',
            'shipping_country' => 'Shipping Country',
            'carrier_preference' => 'Carrier Preference',
            'notes' => 'Additional Notes'
        ],
        'uploadField' => 'design_files',
        // Gerber/CAD formats for PCB/laser work; no office docs.
        'allowedExtensions' => ['gbr', 'gerber', 'dxf', 'dwg', 'svg', 'pdf', 'jpg', 'jpeg', 'png', 'zip', 'step', 'stp']
    ],
    'scanning' => [
        'title' => '3D Scanning Service Request',
        'required' => [
            'first_name', 'last_name', 'email', 'affiliation', 'organization',
            'project_title', 'application_category', 'project_abstract',
            'scan_mode', 'object_size', 'surface_type', 'output_format', 'color_capture', 'quantity',
            'dropoff_confirm', 'usb_confirm'
        ],
        'fields' => [
            'affiliation', 'organization', 'project_title', 'application_category', 'project_abstract',
            'scan_mode', 'object_size', 'surface_type', 'object_dimensions', 'output_format',
            'color_capture', 'quantity', 'dropoff_date', 'dropoff_confirm', 'usb_confirm', 'notes'
        ],
        'labels' => [
            'affiliation' => 'Client Affiliation',
            'organization' => 'Organization / Department',
            'project_title' => 'Project Title',
            'application_category' => 'Application Category',
            'project_abstract' => 'Project Abstract / End Goal',
            'scan_mode' => 'Scan Mode',
            'object_size' => 'Object Size Category',
            'surface_type' => 'Object Surface Type',
            'object_dimensions' => 'Approximate Dimensions (mm)',
            'output_format' => 'Output Format',
            'color_capture' => 'Color Capture',
            'quantity' => 'Number of Objects to Scan',
            'dropoff_date' => 'Preferred Drop-off Date',
            'dropoff_confirm' => 'Drop-off Confirmation',
            'usb_confirm' => 'USB Confirmation',
            'notes' => 'Additional Notes'
        ],
        'uploadField' => 'reference_files',
        // Reference photos and drawings only; no CAD or office docs.
        'allowedExtensions' => ['jpg', 'jpeg', 'png', 'tif', 'tiff', 'pdf', 'zip']
    ]
];

function clean(string $value): string
{
    return htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
}

function post(string $key): string
{
    return isset($_POST[$key]) ? clean((string) $_POST[$key]) : '';
}

function respond(bool $ok, string $msg): void
{
    header('Content-Type: application/json');
    echo json_encode(['success' => $ok, 'message' => $msg]);
    exit;
}

function requireFields(array $keys): void
{
    foreach ($keys as $key) {
        if (empty(post($key))) {
            respond(false, "Missing required field: $key");
        }
    }
}

/**
 * Strip everything unsafe from a user-supplied filename.
 *
 * basename() removes path components (including ../ traversal).
 * The preg_replace removes null bytes, CRLF sequences (MIME header injection),
 * and any character outside printable ASCII so the name is safe to embed
 * in email headers and HTML without further escaping surprises.
 * The result is truncated to 200 characters to stay within MIME header limits.
 */
function sanitizeFilename(string $raw): string
{
    $name = basename($raw);                          // drop any path component
    $name = preg_replace('/[\x00-\x1F\x7F\r\n]/', '', $name); // strip control chars + CRLF
    $name = preg_replace('/[^\x20-\x7E]/', '', $name);         // printable ASCII only
    $name = trim($name, ". \t");                     // no leading/trailing dots or spaces
    $name = substr($name, 0, 200);
    return $name === '' ? 'upload' : $name;
}

function normalizeUploadFiles(string $fieldName): array
{
    if (!isset($_FILES[$fieldName])) {
        return [];
    }

    $f = $_FILES[$fieldName];
    $files = [];

    if (is_array($f['name'])) {
        $count = min(count($f['name']), MAX_FILES_PER_UPLOAD);
        for ($i = 0; $i < $count; $i++) {
            if (empty($f['name'][$i])) {
                continue;
            }
            $files[] = [
                'name'     => sanitizeFilename((string) $f['name'][$i]),
                'tmp_name' => (string) $f['tmp_name'][$i],
                'error'    => (int)    $f['error'][$i],
                'size'     => (int)    $f['size'][$i],
            ];
        }
    } else {
        if (!empty($f['name'])) {
            $files[] = [
                'name'     => sanitizeFilename((string) $f['name']),
                'tmp_name' => (string) $f['tmp_name'],
                'error'    => (int)    $f['error'],
                'size'     => (int)    $f['size'],
            ];
        }
    }

    return $files;
}

function validateUploads(array $files, array $allowedExtensions): array
{
    if (count($files) > MAX_FILES_PER_UPLOAD) {
        respond(false, 'Too many files uploaded. Maximum is ' . MAX_FILES_PER_UPLOAD . ' files per submission.');
    }

    $blockedMimes = unserialize(BLOCKED_MIME_TYPES);
    $finfo = function_exists('finfo_open') ? finfo_open(FILEINFO_MIME_TYPE) : null;

    $validated = [];

    foreach ($files as $file) {
        if ($file['error'] !== UPLOAD_ERR_OK) {
            respond(false, 'One or more uploaded files failed during upload. Please retry.');
        }
        if ($file['size'] <= 0) {
            continue;
        }
        if ($file['size'] > MAX_FILE_SIZE_BYTES) {
            respond(false, 'Each uploaded file must be 10 MB or smaller.');
        }
        if (!is_uploaded_file($file['tmp_name'])) {
            respond(false, 'Invalid file upload detected.');
        }

        // Extension check against per-service allowlist.
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if ($extension === '' || !in_array($extension, $allowedExtensions, true)) {
            respond(false, 'File type not accepted for this service: ' . clean($file['name'])
                . '. Allowed: ' . implode(', ', $allowedExtensions) . '.');
        }

        // Magic-byte MIME check: reject known dangerous signatures even if the
        // extension passed. finfo reads the actual file bytes, not the name.
        if ($finfo !== null) {
            $detectedMime = finfo_file($finfo, $file['tmp_name']);
            if ($detectedMime !== false && in_array($detectedMime, $blockedMimes, true)) {
                respond(false, 'File rejected due to unsafe content type: ' . clean($file['name']) . '.');
            }
        }

        $validated[] = $file;
    }

    if ($finfo !== null) {
        finfo_close($finfo);
    }

    return $validated;
}

function attachUploads(PHPMailer $mail, array $files): void
{
    foreach ($files as $file) {
        // $file['name'] is already sanitized by normalizeUploadFiles.
        $mail->addAttachment($file['tmp_name'], $file['name']);
    }
}

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
    $mail->Encoding = 'base64';

    $mail->XMailer = 'MPaCT Nano Service Request Mailer';
    $mail->MessageID = '<' . uniqid('mpct-service-', true) . '@nau.edu>';
    $mail->Priority = 3;

    $logoPath = __DIR__ . '/Images/NAU.png';
    if (file_exists($logoPath)) {
        $mail->addEmbeddedImage($logoPath, 'naulogo', 'NAU.png', 'base64', 'image/png');
    }

    return $mail;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Invalid request method.');
}

$serviceType = post('service_type');
if (!isset($services[$serviceType])) {
    respond(false, 'Invalid service type.');
}

$meta = $services[$serviceType];
requireFields($meta['required']);

if (post('delivery') === 'ship') {
    requireFields([
        'shipping_contact_name',
        'shipping_speed',
        'shipping_address_line1',
        'shipping_city',
        'shipping_state',
        'shipping_zip'
    ]);
}

$firstName = post('first_name');
$lastName = post('last_name');
$email = post('email');
$phone = post('phone');
$fullName = trim($firstName . ' ' . $lastName);

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Invalid email address.');
}

$uploadedFiles = normalizeUploadFiles($meta['uploadField']);
$validatedFiles = validateUploads($uploadedFiles, $meta['allowedExtensions']);

$uploadedFilesDisplay = DEFAULT_UPLOAD_HINT;
if (!empty($validatedFiles)) {
    $nameList = [];
    foreach ($validatedFiles as $file) {
        $sizeKb = round($file['size'] / 1024, 1);
        $nameList[] = clean($file['name']) . ' (' . $sizeKb . ' KB)';
    }
    $uploadedFilesDisplay = implode(', ', $nameList);
}

$timestamp = date('F j, Y \a\\t g:i A T');
$detailRows = '';
$plainDetails = '';

$isPickup = (post('delivery') === 'pickup');
$shippingOnlyFields = [
    'shipping_contact_name', 'shipping_speed',
    'shipping_address_line1', 'shipping_address_line2',
    'shipping_city', 'shipping_state', 'shipping_zip',
    'shipping_country', 'carrier_preference'
];

foreach ($meta['fields'] as $field) {
    // Skip shipping address rows entirely when delivery is lab pickup
    if ($isPickup && in_array($field, $shippingOnlyFields, true)) {
        continue;
    }

    $label = $meta['labels'][$field] ?? $field;
    $value = post($field);

    if ($field === 'dropoff_confirm' || $field === 'usb_confirm') {
        $value = !empty($value) ? 'Confirmed' : 'Not confirmed';
    }

    if ($field === 'delivery' && $value === 'pickup') {
        $value = 'Lab Pickup (Free)';
    } elseif ($field === 'delivery' && $value === 'ship') {
        $value = 'Ship to Address';
    }

    if ($value === '') {
        $value = '-';
    }

    $detailRows .= "
            <tr>
                <td style='padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; width:35%; font-size:14px;'>$label</td>
                <td style='padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;'>$value</td>
            </tr>";
    $plainDetails .= "  $label: $value\n";
}

$detailRows .= "
            <tr>
                <td style='padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; width:35%; font-size:14px;'>Uploaded Files</td>
                <td style='padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;'>$uploadedFilesDisplay</td>
            </tr>";
$plainDetails .= '  Uploaded Files: ' . $uploadedFilesDisplay . "\n";

$serviceTitle = $meta['title'];
$labSubject = 'New Service Request: ' . $serviceTitle . ' from ' . $fullName;
$userSubject = 'We received your service request - MPaCT Nano Lab';

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
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                                <tr>
                                    <td style="background:#eef3f8; padding:12px 16px; border-radius:6px; border-left:4px solid #003466;">
                                        <span style="font-size:13px; color:#666; text-transform:uppercase; letter-spacing:0.5px;">New Submission</span><br>
                                        <strong style="font-size:17px; color:#003466;">' . $serviceTitle . '</strong>
                                    </td>
                                    <td align="right" valign="top" style="background:#eef3f8; padding:12px 16px; border-radius:6px;">
                                        <span style="font-size:12px; color:#888;">' . $timestamp . '</span>
                                    </td>
                                </tr>
                            </table>

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
                                    <td style="padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;">' . (post('phone') ?: '-') . '</td>
                                </tr>
                            </table>

                            <h2 style="margin:0 0 12px 0; font-size:15px; color:#003466; text-transform:uppercase; letter-spacing:0.5px; border-bottom:2px solid #FFC627; padding-bottom:8px; display:inline-block;">' . $serviceTitle . ' Details</h2>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">' . $detailRows . '
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="background:#f8f9fa; padding:16px 32px; border-top:1px solid #e8e8e8;">
                            <p style="margin:0; font-size:12px; color:#999; text-align:center;">
                                This email was sent from the MPaCT Nano Lab Service Request portal.<br>
                                You can reply directly to this email to reach the requester.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>';

$labPlain = "NEW SERVICE REQUEST: $serviceTitle
Submitted: $timestamp
---

CONTACT INFORMATION
  Name: $fullName
  Email: $email
  Phone: " . (post('phone') ?: 'Not provided') . "

$serviceTitle DETAILS
$plainDetails
---
Sent from MPaCT Nano Lab service request form (nau.edu)
";

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
                                We have received your <strong style="color:#003466;">' . $serviceTitle . '</strong> request and it is now in our review queue.
                            </p>
                            <p style="font-size:15px; line-height:1.7; color:#444; margin:0 0 24px 0;">
                                A lab representative will follow up with next steps and timeline details.
                            </p>

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
                                    <td style="padding:10px 16px; font-weight:600; color:#003466; background:#f8f9fa; border-bottom:1px solid #e8e8e8; font-size:14px;">Service</td>
                                    <td style="padding:10px 16px; color:#333333; border-bottom:1px solid #e8e8e8; font-size:14px;">' . $serviceTitle . '</td>
                                </tr>' . $detailRows . '
                            </table>

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
                                Northern Arizona University
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

We have received your $serviceTitle request and it is currently being reviewed by our team.

YOUR SUBMISSION
  Name: $fullName
  Email: $email
  Service: $serviceTitle
$plainDetails
Need immediate help? Email us at " . LAB_EMAIL . "

---
MPaCT Nano Lab
Microelectronics Processing, Characterization & Testing
Northern Arizona University
";

try {
    $labMail = createMailer();
    $labMail->addAddress(LAB_EMAIL);
    $labMail->addCC('Akhil.Kinnera@nau.edu');
    $labMail->addCC('Sethuprasad.Gorantla@nau.edu');
    $labMail->addCC('Krishna-Dev.Palem@nau.edu');
    $labMail->addReplyTo($email, $fullName);
    $labMail->Subject = $labSubject;
    $labMail->Body = $labBody;
    $labMail->AltBody = $labPlain;
    attachUploads($labMail, $validatedFiles);
    $labMail->send();

    $userMail = createMailer();
    $userMail->addAddress($email, $fullName);
    $userMail->Subject = $userSubject;
    $userMail->Body = $userBody;
    $userMail->AltBody = $userPlain;
    attachUploads($userMail, $validatedFiles);
    $userMail->send();

    respond(true, 'Your service request has been submitted successfully. A confirmation email has been sent.');
} catch (Exception $e) {
    error_log('MPCT Service Request Error: ' . $e->getMessage());
    respond(false, 'We were unable to send your request at this time. Please try again or email us directly at ' . LAB_EMAIL . '.');
}
