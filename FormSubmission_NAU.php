?>

<?php

echo "Processing form submission...";

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


      // Recipient: Lab Manager
    $mail->setFrom('mpct.nano@nau.edu', 'MPaCT Lab');

    $mail->addAddress('mpct.nano@nau.edu');
	$mail->addCC('sethuprasad.gorantla@nau.edu');
    $mail->addCC('spg99@nau.edu');

    $mail->isHTML(true);
    $mail->Subject = "New Metrology Lab Inquiry Submission";

  
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

 

    $mail->Body = "
    <div style='background:#f1f5f9; padding:40px 20px; font-family:Segoe UI, Arial, sans-serif;'>

        <div style='max-width:720px; 
                    margin:auto; 
                    background:#ffffff; 
                    border-radius:10px; 
                    box-shadow:0 10px 30px rgba(0,0,0,0.08); 
                    overflow:hidden;'>

            <!-- Header -->
            <div style='background:#0f172a; padding:28px 30px; color:#ffffff;'>
                <div style='font-size:20px; font-weight:600;'>
                    Metrology Laboratory
                </div>
                <div style='font-size:14px; opacity:0.8; margin-top:4px;'>
                    New Inquiry Notification
                </div>
            </div>

            <!-- Body -->
            <div style='padding:30px;'>

                <div style='font-size:16px; 
                            font-weight:600; 
                            margin-bottom:25px; 
                            color:#0f172a;'>
                    Submitted Information
                </div>

                $formattedFields

                <!-- Footer -->
                <div style='margin-top:40px; 
                            font-size:12px; 
                            color:#64748b; 
                            border-top:1px solid #e2e8f0; 
                            padding-top:18px;'>
                    This email was automatically generated from the Metrology Laboratory web inquiry form.
                    <br>
                    Please respond directly to the sender using the contact information provided above.
                </div>

            </div>
        </div>

    </div>
    ";

    $mail->send();
    echo "Success";

} catch (Exception $e) {
    echo "Mailer Error: {$mail->ErrorInfo}";
}
?>
