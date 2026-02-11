<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

// Collect form data safely
$name         = htmlspecialchars($_POST['name']);
$email        = htmlspecialchars($_POST['email']);
$organization = htmlspecialchars($_POST['organization']);
$equipment    = htmlspecialchars($_POST['equipment']);
$messageText  = htmlspecialchars($_POST['message']);

// Create PHPMailer instance
$mail = new PHPMailer(true);

try {
    // SMTP Configuration for outlook NAU

    $mail->isSMTP();
    $mail->Host       = 'mailgate.nau.edu';
    $mail->SMTPAuth   = false;
    $mail->Port       = 25;


    //Below is used for mpct.nano@gmail only
    /*$mail->Host       = 'smtp.gmail.com';       // 
    $mail->SMTPAuth   = true;
    $mail->Username   = 'mpct.nano@gmail.com';    // SMTP email
    $mail->Password   = 'jyqksvagxwnywmmc';    // SMTP gmail Password,please do not edit else should be generated
    $mail->SMTPSecure = 'tls';
    $mail->Port       = 587;*/

    // Recipient: Lab Manager
    $mail->setFrom('mpct.nano@nau.edu', 'MPaCT Lab');
    $mail->addAddress('mpct.nano@nau.edu');
	$mail->addAddress('spg99@nau.edu');
	$mail->addCC('sethuprasad.gorantla@nau.edu');
    $mail->addReplyTo($email, $name);

    // Email content
    $mail->isHTML(true);
    $mail->Subject = "New Lab Inquiry from $name";
    $mail->Body    = "
        <h3>New Lab Inquiry</h3>
        <p><strong>Name:</strong> $name</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Organization:</strong> $organization</p>
        <p><strong>Equipment:</strong> $equipment</p>
        <p><strong>Message:</strong><br>$messageText</p>
    ";
    $mail->send();

    // Optional: Send confirmation to the user
    $mail->clearAddresses();
    $mail->addAddress($email);
    $mail->Subject = "We received your inquiry";
    $mail->Body = "
        Hello $name,<br><br>
        Thank you for contacting our lab. We have received your inquiry regarding <strong>$equipment</strong> and will get back to you shortly.<br><br>
        — Lab Team
    ";
    $mail->send();

    echo "Inquiry sent successfully.";

} catch (Exception $e) {
    echo "Mailer Error: {$mail->ErrorInfo}";
}
?>
