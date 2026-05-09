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
    echo json_encode(['success' => false, 'message' => 'You must be logged in to update project status.']);
    exit;
}

$user_id = $_SESSION['id'];

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

if (!isset($input['project_id']) || !is_numeric($input['project_id'])) {
    echo json_encode(['success' => false, 'message' => 'Project ID is required.']);
    exit;
}

if (!isset($input['status']) || !in_array($input['status'], ['in_progress', 'completed'])) {
    echo json_encode(['success' => false, 'message' => 'Valid status (in_progress or completed) is required.']);
    exit;
}

$project_id = (int) $input['project_id'];
$new_status = $input['status'];

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
    $adminSql = 'SELECT is_admin FROM users WHERE id = :user_id';
    $adminStmt = $conn->prepare($adminSql);
    $adminStmt->execute([':user_id' => $user_id]);
    $user = $adminStmt->fetch(PDO::FETCH_ASSOC);
    $is_admin = ($user && $user['is_admin'] == 1);

    if (!$is_admin) {
        echo json_encode(['success' => false, 'message' => 'Access denied. Only administrators can update project status.']);
        exit;
    }

    $verifySql = 'SELECT id FROM projects WHERE id = :project_id';
    $verifyStmt = $conn->prepare($verifySql);
    $verifyStmt->execute([':project_id' => $project_id]);

    if ($verifyStmt->rowCount() === 0) {
        echo json_encode(['success' => false, 'message' => 'Project not found.']);
        exit;
    }

    $updateSql = 'UPDATE projects 
                  SET status = :status, updated_at = NOW() 
                  WHERE id = :project_id';

    $updateStmt = $conn->prepare($updateSql);
    $updateStmt->execute([
        ':status' => $new_status,
        ':project_id' => $project_id
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Project status updated successfully.',
        'project_id' => $project_id,
        'new_status' => $new_status
    ]);
} catch (PDOException $e) {
    error_log('Status update error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Failed to update project status. Please try again.']);
} finally {
    $conn = null;
}
