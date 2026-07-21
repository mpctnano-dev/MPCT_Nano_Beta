<?php
/**
 * sandbox/mpact_config.sandbox.php
 *
 * Placeholder configuration for the rate-limit sandbox POC.
 * Safe to commit — no production secrets, NAU SMTP, or live SharePoint.
 */

use \PHPMailer\PHPMailer\PHPMailer;

if (basename($_SERVER['PHP_SELF'] ?? '') === basename(__FILE__)) {
    http_response_code(403);
    exit('Direct access denied.');
}

define('LAB_EMAIL', 'lab-inbox@example.test');

define('CONTACT_US_CC_LIST', ['cc-one@example.test', 'cc-two@example.test']);
define('DEGREE_PROGRAMS_CC_LIST', ['cc-one@example.test', 'cc-two@example.test']);
define('PTAP_CC_LIST', ['cc-one@example.test', 'cc-two@example.test']);
define('INTEL_SRC_CC_LIST', ['cc-one@example.test', 'cc-two@example.test']);
define('RESERVE_EQ_CC_LIST', ['cc-one@example.test', 'cc-two@example.test']);
define('SERVICES_CC_LIST', ['cc-one@example.test', 'cc-two@example.test']);
define('DEV_SUPP_CC_LIST', ['cc-one@example.test', 'cc-two@example.test']);

define('SENDER_EMAIL', 'noreply@example.test');
define('SENDER_NAME', 'MPaCT Sandbox');

define('SMTP_HOST', 'mailpit');
define('SMTP_PORT', 1025);

define('TENANT_ID', '00000000-0000-0000-0000-000000000000');
define('CLIENT_ID', '00000000-0000-0000-0000-000000000000');
define('CLIENT_SECRET', 'sandbox-placeholder-secret-not-real');

define('SP_HOST', 'example.sharepoint.com');
define('SP_SITE_PATH', '/sites/Sandbox');
define('SP_LIBRARY', 'Documents');
define('SP_3DPRINT_REQ_FOLDER', 'MPaCT_Services/3D_Printing_Requests');
define('SP_LASER_REQ_FOLDER', 'MPaCT_Services/Laser_Structuring_Requests');
define('SP_3DSCANNING_REQ_FOLDER', 'MPaCT_Services/3D_Scanning_Requests');
define('SP_FOLDER', 'MPaCT_Services/3D_Printing_Requests');

define('LIST_NAME', 'Booking_Ledger1');
define('SERVICES_LIST_NAME', 'Service_Requests');
define('INQURY_LIST_NAME', 'Inquiry_Tracker');

define('GRAPH', 'https://graph.microsoft.com/v1.0');
define('TOKEN_URL', 'https://login.microsoftonline.com/' . TENANT_ID . '/oauth2/v2.0/token');

define('SANDBOX_SKIP_SHAREPOINT', true);
define('SHAREPOINT_ALERT_ENABLED', false);

define('RATE_LIMIT_IP_MAX', 3);
define('RATE_LIMIT_EMAIL_MAX', 2);
define('RATE_LIMIT_WINDOW_SEC', 300);
define('RATE_LIMIT_RETENTION_DAYS', 7);
define('RATE_LIMIT_STORAGE', getenv('RATE_LIMIT_STORAGE') ?: 'json');
define('RATE_LIMIT_DATA_DIR', __DIR__ . '/data/rate-limits');

function addCcRecipients(PHPMailer $mail, array $ccList): void
{
    foreach ($ccList as $cc) {
        $mail->addCC($cc);
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

    $mail->XMailer = 'MPaCT Sandbox Mailer';
    $mail->MessageID = '<' . uniqid('mpct-sandbox-', true) . '@example.test>';
    $mail->Priority = 3;

    $logoPath = dirname(__DIR__) . '/Images/NAU.png';
    if (file_exists($logoPath)) {
        $mail->addEmbeddedImage($logoPath, 'naulogo', 'NAU.png', 'base64', 'image/png');
    }

    return $mail;
}

function curlRequest(string $method, string $url, ?string $token = null, ?string $body = null, string $contentType = 'application/json'): array
{
    $headers = [];
    if ($token) {
        $headers[] = "Authorization: Bearer $token";
    }
    if ($body) {
        $headers[] = "Content-Type: $contentType";
    }

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_POSTFIELDS => $body,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);

    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (curl_error($ch)) {
        throw new RuntimeException(curl_error($ch));
    }

    curl_close($ch);
    return ['code' => $code, 'body' => $resp];
}
