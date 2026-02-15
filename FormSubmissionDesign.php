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


        //Below is used for mpct.nano@gmail only
    $mail->Host       = 'smtp.gmail.com';       // 
    $mail->SMTPAuth   = true;
    $mail->Username   = 'mpct.nano@gmail.com';    // SMTP email
    $mail->Password   = 'jyqksvagxwnywmmc';    // SMTP gmail Password,please do not edit else should be generated
    $mail->SMTPSecure = 'tls';
    $mail->Port       = 587;

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

$timestamp = date("F j, Y, g:i a");


    

    $timestamp = date("F j, Y, g:i a");

    $mail->clearAddresses();
    $mail->addAddress("lab@yourdomain.edu");  // Shared Lab Email
    $mail->Subject = "New Web Inquiry - MPaCT Lab";

    $mail->Body = '
    <!DOCTYPE html>
    <html>
    <body style="font-family:Arial, Helvetica, sans-serif; background:#f4f6f8; padding:30px;">

    <table width="700" cellpadding="0" cellspacing="0" 
    style="background:#ffffff; padding:30px; border-radius:6px;">

    <tr>
    <td>

    <h2 style="margin-top:0; color:#1f3b57;">
    New Inquiry Submission
    </h2>

    <p style="font-size:14px; color:#555;">
    A new inquiry has been submitted through the MPaCT Lab website.
    </p>

    <p style="font-size:13px; color:#888;">
    Submitted on: '.$timestamp.'
    </p>

    <hr style="margin:20px 0;">

    <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px; color:#333;">
    '.$formattedFields.'
    </table>

    </td>
    </tr>

    </table>

    </body>
    </html>
    ';



    $mail->send();
    echo "Success";


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
Dear '.htmlspecialchars($_POST["name"] ?? "Valued User").',
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
<strong>Email:</strong> mpactlab@yourdomain.edu<br>
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


} catch (Exception $e) {
    echo "Mailer Error: {$mail->ErrorInfo}";
}
?>
