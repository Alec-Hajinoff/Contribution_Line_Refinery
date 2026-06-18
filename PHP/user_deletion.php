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
    exit(0);
}

if (! isset($_SESSION['id'])) {
    header('HTTP/1.1 401 Unauthorized');
    echo json_encode(['success' => false, 'message' => 'You must be logged in to delete users.']);
    exit;
}

$current_user_id = $_SESSION['id'];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('HTTP/1.1 405 Method Not Allowed');
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if ($input === null) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input.']);
    exit;
}

if (! isset($input['user_id']) || ! is_numeric($input['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User ID is required.']);
    exit;
}

$target_user_id = (int) $input['user_id'];

if ($target_user_id === $current_user_id) {
    echo json_encode(['success' => false, 'message' => 'You cannot delete your own account.']);
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
    error_log('Database connection failed: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Server configuration error.']);
    exit;
}

try {
    $checkSql  = 'SELECT id, name FROM users WHERE id = :user_id';
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->execute([':user_id' => $target_user_id]);
    $userToDelete = $checkStmt->fetch(PDO::FETCH_ASSOC);

    if (! $userToDelete) {
        echo json_encode(['success' => false, 'message' => 'User not found.']);
        exit;
    }

    $deleteSql  = 'DELETE FROM users WHERE id = :user_id';
    $deleteStmt = $conn->prepare($deleteSql);
    $deleteStmt->execute([':user_id' => $target_user_id]);

    echo json_encode([
        'success' => true,
        'message' => 'User "' . $userToDelete['name'] . '" has been deleted successfully.',
        'user_id' => $target_user_id,
    ]);
} catch (PDOException $e) {
    error_log('User deletion error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Failed to delete user. Please try again.']);
} finally {
    $conn = null;
}
