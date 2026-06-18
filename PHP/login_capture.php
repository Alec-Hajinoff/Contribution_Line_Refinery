<?php
require_once 'session_config.php';

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

$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['email'], $input['password'])) {
    $email = filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL);
    if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid email format']);
        exit;
    }
    $password = $input['password'];
    try {
        $pdo = new PDO('mysql:host=localhost;port=3306;dbname=hertford_standard', 'hertford_standard_user', 'T6hhZ2Lz3UQbXBK', [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);

        $pdo->beginTransaction();

        $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            if ($user['is_verified'] == 0) {
                $pdo->rollBack();
                echo json_encode([
                    'status'  => 'unverified',
                    'message' => 'Please confirm your email address before signing in. Check your inbox and click the verification link we sent you.',
                ]);
                exit;
            }

            session_regenerate_id(true);
            $_SESSION['id']       = $user['id'];
            $_SESSION['is_admin'] = (bool) $user['is_admin'];

            $response = [
                'status'   => 'success',
                'message'  => 'Login successful',
                'is_admin' => (bool) $user['is_admin'],
            ];

            $pdo->commit();
            echo json_encode($response);
        } else {
            $pdo->rollBack();
            echo json_encode(['status' => 'error', 'message' => 'We couldn’t log you in with those details.']);
        }
    } catch (PDOException $e) {
        if (isset($pdo)) {
            $pdo->rollBack();
        }
        file_put_contents('error_log.txt', $e->getMessage() . PHP_EOL, FILE_APPEND);
        echo json_encode(['status' => 'error', 'message' => 'An error occurred. Please try again later.']);
    } finally {
        $pdo = null;
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Email and password are required']);
}
