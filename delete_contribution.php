<?php
require_once 'session_config.php';

$allowed_origins = ['http://localhost:3000'];
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

if (!isset($_SESSION['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'User not authenticated']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$contribution_id = $input['contribution_id'] ?? null;

if (!$contribution_id) {
    echo json_encode(['status' => 'error', 'message' => 'Contribution ID is required']);
    exit;
}

try {
    $pdo = new PDO('mysql:host=localhost;dbname=contribution_line', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);

    $checkStmt = $pdo->prepare('SELECT id FROM contributions WHERE id = :id AND users_id = :users_id');
    $checkStmt->execute([
        ':id' => $contribution_id,
        ':users_id' => $_SESSION['id']
    ]);

    if (!$checkStmt->fetch()) {
        echo json_encode(['status' => 'error', 'message' => 'Contribution not found or access denied']);
        exit;
    }

    $deleteStmt = $pdo->prepare('DELETE FROM contributions WHERE id = :id AND users_id = :users_id');
    $deleteStmt->execute([
        ':id' => $contribution_id,
        ':users_id' => $_SESSION['id']
    ]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Contribution deleted successfully'
    ]);
} catch (PDOException $e) {
    error_log('Delete Contribution Error: ' . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Database error occurred.']);
} finally {
    $pdo = null;
}
