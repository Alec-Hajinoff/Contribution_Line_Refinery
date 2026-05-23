<?php
require_once 'session_config.php';

require_once __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

$config = parse_ini_file(__DIR__ . '/.env', false, INI_SCANNER_RAW);
if ($config === false) {
    error_log('Failed to parse .env file');
    echo json_encode(['success' => false, 'message' => 'Server configuration error']);
    exit;
}

$mailUsername = $config['MAIL_USERNAME'];
$mailPassword = $config['MAIL_PASSWORD'];
$adminEmail = $config['ADMIN_EMAIL'];

if (empty($mailUsername) || empty($mailPassword) || empty($adminEmail)) {
    error_log('Email configuration not found in .env file');
    echo json_encode(['success' => false, 'message' => 'Server configuration error']);
    exit;
}

$allowed_origins = [
    'http://localhost:3000'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header('HTTP/1.1 403 Forbidden');
    exit;
}

header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if ($input === null) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
    exit;
}

$honeypot = $input['website'] ?? '';
if (!empty($honeypot)) {
    error_log('Honeypot triggered - possible bot detected');

    exit;
}

$name = trim($input['name'] ?? '');
$email = filter_var($input['email'] ?? '', FILTER_SANITIZE_EMAIL);
$phone = trim($input['phone'] ?? '');
$projectDescription = trim($input['projectDescription'] ?? '');

if (empty($name) || !preg_match('/^[a-zA-Z\s\-\']+$/', $name)) {
    echo json_encode(['success' => false, 'message' => 'Invalid name format']);
    exit;
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

if (empty($phone) || !preg_match('/^[\+\d\s\-\(\)]{8,20}$/', $phone)) {
    echo json_encode(['success' => false, 'message' => 'Invalid phone number format']);
    exit;
}

if (empty($projectDescription)) {
    echo json_encode(['success' => false, 'message' => 'Project description is required']);
    exit;
}

$wordCount = str_word_count($projectDescription);
if ($wordCount > 100) {
    echo json_encode(['success' => false, 'message' => 'Project description must be 100 words or less']);
    exit;
}

try {
    $mail = new PHPMailer(true);

    $mail->SMTPDebug = SMTP::DEBUG_OFF;
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = $mailUsername;
    $mail->Password = $mailPassword;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    $mail->setFrom($mailUsername, 'Hertford Standard Contact Form');
    $mail->addAddress($adminEmail, 'Admin');
    $mail->addReplyTo($email, $name);

    $mail->isHTML(false);
    $mail->Subject = 'New Project Submission - Hertford Standard';

    $mail->Body = "A new message has been received:\n\n"
        . 'Name: ' . $name . "\n"
        . 'Email: ' . $email . "\n"
        . 'Phone: ' . $phone . "\n\n"
        . "Project Description:\n"
        . $projectDescription . "\n\n"
        . "---\n"
        . 'This message was sent from the Hertford Standard contact form.';

    $mail->send();

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    error_log('Contact Form PHPMailer Error: ' . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Failed to send message. Please try again later.'
    ]);
}
