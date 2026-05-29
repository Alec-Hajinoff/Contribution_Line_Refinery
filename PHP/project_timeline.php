<?php
require_once 'session_config.php';

if (!isset($_SESSION['id'])) {
    header('HTTP/1.1 401 Unauthorized');
    echo json_encode(['success' => false, 'message' => 'You must be logged in to view project messages.']);
    exit;
}

$user_id = $_SESSION['id'];

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
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    header('HTTP/1.1 405 Method Not Allowed');
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

if (!isset($_GET['project_id']) || !is_numeric($_GET['project_id'])) {
    echo json_encode(['success' => false, 'message' => 'Project ID is required.']);
    exit;
}

$project_id = (int) $_GET['project_id'];

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

    if ($is_admin) {
        $verifySql = 'SELECT id FROM projects WHERE id = :project_id';
        $verifyStmt = $conn->prepare($verifySql);
        $verifyStmt->execute([':project_id' => $project_id]);
    } else {
        $verifySql = 'SELECT id FROM projects WHERE id = :project_id AND user_id = :user_id';
        $verifyStmt = $conn->prepare($verifySql);
        $verifyStmt->execute([
            ':project_id' => $project_id,
            ':user_id' => $user_id
        ]);
    }

    if ($verifyStmt->rowCount() === 0) {
        echo json_encode(['success' => false, 'message' => 'Project not found or access denied.']);
        exit;
    }

    $sql = 'SELECT pm.id, pm.message, pm.created_at, u.name as author_name
            FROM project_messages pm
            JOIN users u ON pm.created_by = u.id
            WHERE pm.project_id = :project_id
            ORDER BY pm.created_at DESC';

    $stmt = $conn->prepare($sql);
    $stmt->execute([':project_id' => $project_id]);
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($messages as &$message) {
        $attachmentSql = 'SELECT id, attachment_name, attachment_type, uploaded_at 
                          FROM message_attachments 
                          WHERE project_message_id = :message_id 
                          ORDER BY uploaded_at ASC';

        $attachmentStmt = $conn->prepare($attachmentSql);
        $attachmentStmt->execute([':message_id' => $message['id']]);
        $attachments = $attachmentStmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($attachments as &$attachment) {
            $attachment['view_url'] = 'http://localhost:8001/Hertford_Standard/view_message_attachment.php?id=' . $attachment['id'];
            $attachment['download_url'] = 'http://localhost:8001/Hertford_Standard/download_message_attachment.php?id=' . $attachment['id'];
        }

        $message['attachments'] = $attachments;
    }

    echo json_encode([
        'success' => true,
        'messages' => $messages
    ]);
} catch (PDOException $e) {
    error_log('Get project timeline error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Failed to fetch project messages. Please try again.']);
} finally {
    $conn = null;
}
