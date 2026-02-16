?>

<?php


use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';


$mail = new PHPMailer(true);

try {

    $mail->isSMTP();


    $mail->Host       = 'mailgate.nau.edu';
    $mail->SMTPAuth   = true;
    $mail->Port       = 587;
    //Below is used for mpct.nano@gmail only
   /* $mail->Host       = 'smtp.gmail.com';       // 
    $mail->SMTPAuth   = true;
    $mail->Username   = 'mpct.nano@gmail.com';    // SMTP email
    $mail->Password   = 'jyqksvagxwnywmmc';    // SMTP gmail Password,please do not edit else should be generated
    $mail->SMTPSecure = 'tls';
    $mail->Port       = 587;*/

    $first_name   = htmlspecialchars($_POST['first_name']);
    $last_name    = htmlspecialchars($_POST['last_name']);
    $email = htmlspecialchars($_POST['email']);
    $name = $first_name . ' ' . $last_name;  
    
    // Recipient: Lab Manager
    $mail->setFrom('mpct.nano@nau.edu', 'MPaCT Lab');

    $mail->addAddress('mpct.nano@nau.edu');
	$mail->addCC('sethuprasad.gorantla@nau.edu');
    $mail->addCC('spg99@nau.edu');

    $mail->isHTML(true);
    $mail->Subject = "New Metrology Lab Inquiry Submission";

    //Collect Data
    $formattedFields = '';

    foreach ($_POST as $key => $value) {

        $cleanKey   = ucwords(str_replace('_', ' ', htmlspecialchars($key)));
        $cleanValue = nl2br(htmlspecialchars(trim($value)));

        if (!empty($cleanValue)) {

            $formattedFields .= "
                <div style='margin-bottom:18px;'>
                    <div style='font-size:13px; 
                                font-weight:600; 
                                text-transform:uppercase; 
                                letter-spacing:0.5px; 
                                color:#475569; 
                                margin-bottom:6px;'>
                        $cleanKey
                    </div>

                    <div style='font-size:15px; 
                                color:#111827; 
                                background:#f8fafc; 
                                padding:12px 14px; 
                                border-radius:6px; 
                                border-left:4px solid #0f172a;'>
                        $cleanValue
                    </div>
                </div>
            ";
        }
    }

    $formattedFields = '';

/*foreach ($_POST as $key => $value) {
    if (!empty(trim($value))) {

        $label = ucwords(str_replace('_', ' ', htmlspecialchars($key)));
        $val   = nl2br(htmlspecialchars(trim($value)));

        $formattedFields .= "
            <tr>
                <td style='padding:8px 0; font-weight:600; width:180px;'>$label:</td>
                <td style='padding:8px 0;'>$val</td>
            </tr>
        ";
    }
}*/

$timestamp = date("F j, Y");


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
    $mail->Subject = "NEW INQUIRY SUBMISSION- " . date('Ymd') . " by " . strtoupper($name);

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


// Optional: Send confirmation to the user
   /* $mail->clearAddresses();
    $mail->addAddress(spg99@nau.edu);
    $mail->Subject = "We received your inquiry";
    $mail->Body = "
        Hello $name,<br><br>
        Thank you for contacting our lab. We have received your inquiry regarding <strong>$equipment</strong> and will get back to you shortly.<br><br>
        — Lab Team
    ";
    $mail->send();*/

$mail->clearAddresses();
$mail->addAddress($_POST['email']);  // User email
$mail->Subject = "We Have Received Your Inquiry - MPaCT Lab";

$mail->Body = '
<!DOCTYPE html>
<html>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:40px 20px;">

<table width="650" cellpadding="0" cellspacing="0" 
style="background:#ffffff; border-radius:8px; padding:40px;">

<tr>
<td>

<div style="font-size:20px; font-weight:600; color:#1f3b57;">
Microelectronics, Processing and Characterization, Testing (MPaCT) Lab
</div>

<hr style="margin:25px 0; border:none; border-top:1px solid #e5e5e5;">

<div style="font-size:18px; font-weight:600; color:#1f3b57;">
Thank You for Your Submission
</div>

<p style="font-size:14px; color:#444; line-height:1.6; margin-top:20px;">
Dear ' . $name . ',
<br><br>

We appreciate your interest in the <strong>MPaCT Lab</strong>. 
Your inquiry has been successfully received and is currently under review by our team.
<br><br>

A lab representative will contact you soon regarding next steps, 
assessment details, or any additional information required.
</p>

<div style="margin-top:30px; font-size:14px; color:#333;">
If you need immediate assistance, please contact us:
<br><br>
<strong>Email:</strong> mpct.nano@nau.edu<br>
<strong>Phone:</strong> (123) 456-7890
</div>

<hr style="margin:30px 0; border:none; border-top:1px solid #e5e5e5;">

<div style="font-size:12px; color:#888; text-align:center;">
© '.date("Y").' Microelectronics, Processing and Characterization, Testing (MPaCT) Lab<br>
All rights reserved.
</div>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
';

$mail->send();
header("Location: index.html?status=success");
exit();

} catch (Exception $e) {
    header("Location: index.html?status=error");
    exit();
}

?>
