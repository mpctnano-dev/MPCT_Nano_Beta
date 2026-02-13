<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

// Collect form data 
$first_name   = htmlspecialchars($_POST['first_name']);
$last_name    = htmlspecialchars($_POST['last_name']);
$email        = htmlspecialchars($_POST['email']);
$phone        = htmlspecialchars($_POST['phone']);
$organization = htmlspecialchars($_POST['organization']);
$message      = htmlspecialchars($_POST['message']);

// Create PHPMailer instance
$mail = new PHPMailer(true);

try {
    // SMTP Configuration for outlook NAU

    $mail->isSMTP();
    $mail->Host       = 'mailgate.nau.edu';
    $mail->SMTPAuth   = false;
    $mail->Port       = 25;

    // Recipient: Lab Manager
    $mail->setFrom('mpct.nano@nau.edu', 'MPaCT Lab');

    $mail->addAddress('mpct.nano@nau.edu');
	$mail->addCC('sethuprasad.gorantla@nau.edu');

    $mail->addReplyTo($email, $name);

    // Email content
    $mail->isHTML(true);
    $mail->Subject = "New Lab Inquiry from $name";
    $mail->Body    = "
        <h3>New Lab Inquiry</h3>
        <p><strong>Name:</strong> $first_name + $last_name  </p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Phone:</strong> $phone</p>
        <p><strong>Organization:</strong> $organization</p>
        <p><strong>Message:</strong><br>$messageText</p>
    ";
    $mail->send();

    // Optional: Send confirmation to the user
    $mail->clearAddresses();
    $mail->addAddress($email);
    $mail->addCC('mpct.nano@nau.edu');
    $mail->Subject = "We received your inquiry";
    $mail->Body = "
        Hello <strong>$name</strong>,<br><br>
        Thank you for contacting our lab. We have received your inquiry, will get back to you shortly.<br><br>
        — Lab Team
    ";
    $mail->send();

    echo "Inquiry sent successfully.";

} catch (Exception $e) {
    echo "Mailer Error: {$mail->ErrorInfo}";
}


?>
