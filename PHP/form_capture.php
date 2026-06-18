<?php
require_once 'session_config.php';

require_once __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

$allowed_origins = [
    'http://localhost:3000',
    'https://hertfordstandard.com',
    'https://www.hertfordstandard.com',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? null;

if ($origin !== null && in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} elseif ($origin === null) {
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

$servername     = 'localhost';
$username       = 'hertford_standard_user';
$passwordServer = 'T6hhZ2Lz3UQbXBK';
$dbname         = 'hertford_standard';
$port           = 3306;

try {
    $conn = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $passwordServer);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
} catch (PDOException $e) {
    die('Connection failed: ' . $e->getMessage());
}

$input = json_decode(file_get_contents('php://input'), true);
if ($input === null) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
    exit;
}

$name     = $input['name'] ?? null;
$email    = filter_var($input['email'] ?? '', FILTER_SANITIZE_EMAIL);
$password = $input['password'] ?? null;

if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

if (! $name || ! $email || ! $password) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

try {
    $checkSql  = 'SELECT id FROM users WHERE email = :email LIMIT 1';
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bindParam(':email', $email);
    $checkStmt->execute();

    if ($checkStmt->rowCount() > 0) {
        echo json_encode([
            'success' => false,
            'message' => 'We couldn’t use this email. Please try a different one.',
        ]);
        exit;
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error during email verification',
    ]);
    exit;
}

try {
    $conn->beginTransaction();

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $verificationToken = bin2hex(random_bytes(32));

    $sql = 'INSERT INTO users (email, password, name, verification_token, verification_token_expires_at, is_verified)
        VALUES (:email, :password, :name, :token, DATE_ADD(NOW(), INTERVAL 24 HOUR), 0)';

    $stmt = $conn->prepare($sql);
    if ($stmt) {
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $hashedPassword);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':token', $verificationToken);
        $stmt->execute();

        $userId = $conn->lastInsertId();

        $verificationLink = 'https://hertfordstandard.com/VerifyEmail?token=' . urlencode($verificationToken);

        $mail = new PHPMailer(true);

        try {
            $mail->SMTPDebug = SMTP::DEBUG_OFF;
            $mail->isSMTP();
            $mail->Host       = 'localhost';
            $mail->SMTPAuth   = false;
            $mail->SMTPSecure = false;
            $mail->Port       = 25;

            $mail->setFrom('alec@hertfordstandard.com', 'Hertford Standard');
            $mail->addAddress($email, $name);

            $mail->isHTML(false);
            $mail->Subject = 'Verify your email address - Hertford Standard';
            $mail->Body    = "Thank you for creating an account with Hertford Standard.\n\n"
                . "Please click the link below to verify your email address:\n"
                . $verificationLink . "\n\n"
                . "Once verified, you will be able to sign in to your account.\n\n"
                . 'This link is valid for 24 hours.';

            $mail->send();

            $conn->commit();
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            $conn->rollBack();

            error_log('PHPMailer Error: ' . $e->getMessage());
            echo json_encode([
                'success' => false,
                'message' => 'Registration completed but failed to send verification email. Please contact support.',
            ]);
        }
    } else {
        throw new Exception('Database error preparing statement');
    }
} catch (Exception $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    error_log('Registration Error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Registration failed. Please try again.']);
} finally {
    $conn = null;
}
