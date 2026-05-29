<?php
require_once 'session_config.php';

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
    exit(0);
}

if (!isset($_SESSION['id'])) {
    header('HTTP/1.1 401 Unauthorized');
    echo json_encode(['success' => false, 'message' => 'You must be logged in to update user names.']);
    exit;
}

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

if (!isset($input['user_id']) || !is_numeric($input['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User ID is required.']);
    exit;
}

if (!isset($input['name']) || empty(trim($input['name']))) {
    echo json_encode(['success' => false, 'message' => 'Name cannot be empty.']);
    exit;
}

$target_user_id = (int) $input['user_id'];
$new_name = trim($input['name']);

if (strlen($new_name) > 255) {
    echo json_encode(['success' => false, 'message' => 'Name cannot exceed 255 characters.']);
    exit;
}

$servername = '127.0.0.1';
$username = 'root';
$passwordServer = '';
$dbname = 'hertford_standard';

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $passwordServer);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
} catch (PDOException $e) {
    error_log('Database connection failed: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Server configuration error.']);
    exit;
}

try {
    $checkSql = 'SELECT id FROM users WHERE id = :target_user_id';
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->execute([':target_user_id' => $target_user_id]);

    if ($checkStmt->rowCount() === 0) {
        echo json_encode(['success' => false, 'message' => 'User not found.']);
        exit;
    }

    $updateSql = 'UPDATE users SET name = :name WHERE id = :target_user_id';
    $updateStmt = $conn->prepare($updateSql);
    $updateStmt->execute([
        ':name' => $new_name,
        ':target_user_id' => $target_user_id
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'User name updated successfully.',
        'user_id' => $target_user_id,
        'new_name' => $new_name
    ]);
} catch (PDOException $e) {
    error_log('Update user name error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Failed to update user name. Please try again.']);
} finally {
    $conn = null;
}
