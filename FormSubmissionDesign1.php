<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

$mail = new PHPMailer(true);

try {

    $mail->isSMTP();

    //Below is used for mpct.nano@gmail only
    $mail->Host       = 'smtp.gmail.com';       // 
    $mail->SMTPAuth   = true;
    $mail->Username   = 'mpct.nano@gmail.com';    // SMTP email
    $mail->Password   = 'jyqksvagxwnywmmc';    // SMTP gmail Password,please do not edit else should be generated
    $mail->SMTPSecure = 'tls';
    $mail->Port       = 587;

     $timestamp = strtoupper(date("d M Y / H:i"));
    $userName = htmlspecialchars($_POST['name'] ?? 'Client');

    // --- 1. DATA GRID GENERATOR ---
    $dataRows = '';
    foreach ($_POST as $key => $value) {
        if (!empty(trim($value)) && !in_array($key, ['submit', 'email_to'])) {
            $label = strtoupper(str_replace(['_', '-'], ' ', htmlspecialchars($key)));
            $val   = nl2br(htmlspecialchars(trim($value)));
            
            $dataRows .= "
            <tr>
                <td style='padding: 15px 0; border-bottom: 1px solid #e5e7eb; width: 140px; vertical-align: top; font-size: 10px; letter-spacing: 1px; color: #6b7280; font-weight: 700;'>$label</td>
                <td style='padding: 15px 0; border-bottom: 1px solid #e5e7eb; vertical-align: top; font-size: 14px; color: #111827; line-height: 1.5;'>$val</td>
            </tr>";
        }
    }

    // --- 2. INTERNAL LAB NOTIFICATION ---
    $mail->setFrom('mpct.nano@nau.edu', 'MPCT SYSTEM');
    $mail->addAddress('mpct.nano@nau.edu');
	$mail->addCC('sethuprasad.gorantla@nau.edu');
    $mail->addCC('spg99@nau.edu');
    $mail->isHTML(true);
    $mail->Subject = "INQUIRY_" . date('Ymd') . "_" . strtoupper($_POST['name'] ?? 'REQ');

    $mail->Body = "
    <div style='background: #ffffff; padding: 40px; font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif; color: #111827;'>
        <div style='max-width: 600px; margin: 0 auto; border: 1px solid #111827; padding: 40px;'>
            
            <div style='border-bottom: 4px solid #111827; padding-bottom: 20px; margin-bottom: 30px;'>
                <div style='font-size: 10px; letter-spacing: 3px; font-weight: 800; color: #111827;'>METROLOGY LABORATORY</div>
                <h1 style='margin: 10px 0 0 0; font-size: 28px; font-weight: 300; letter-spacing: -0.5px;'>Technical Inquiry</h1>
                <div style='margin-top: 5px; font-size: 11px; color: #6b7280;'>REF: $timestamp</div>
            </div>

            <table style='width: 100%; border-collapse: collapse;'>
                $dataRows
            </table>

            <div style='margin-top: 40px; font-size: 10px; color: #9ca3af; text-align: right; letter-spacing: 1px;'>
                MPACT LOGISTICS ENGINE / NORTHERN ARIZONA UNIVERSITY
            </div>
        </div>
    </div>";

    $mail->send();

    // --- 3. CLIENT CONFIRMATION ---
    if (!empty($_POST['email'])) {
        $mail->clearAddresses();
        $mail->addAddress($_POST['email']);
        $mail->Subject = "Submission Received - MPaCT Lab";
        
        $mail->Body = "
        <div style='background: #ffffff; padding: 60px 20px; font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;'>
            <div style='max-width: 500px; margin: 0 auto;'>
                <h2 style='font-size: 24px; font-weight: 400; color: #111827; margin-bottom: 25px;'>Hello $userName,</h2>
                <p style='font-size: 15px; color: #374151; line-height: 1.7; margin-bottom: 30px;'>
                    Your technical inquiry has been logged in our system. Our engineering team will review your parameters and provide a breakdown within 48 hours.
                </p>
                <div style='height: 1px; background: #e5e7eb; width: 100%; margin-bottom: 30px;'></div>
                <div style='font-size: 12px; color: #6b7280;'>
                    <div style='font-weight: 700; color: #111827; margin-bottom: 5px;'>MPaCT METROLOGY</div>
                    School of Informatics, Computing, and Cyber Systems<br>
                    Flagstaff, AZ
                </div>
            </div>
        </div>";
        
        $mail->send();
    }

    echo "Success";

} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
?>