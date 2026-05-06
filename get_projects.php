<?php
require_once 'session_config.php';

if (!isset($_SESSION['id'])) {
    header('HTTP/1.1 401 Unauthorized');
    echo json_encode(['success' => false, 'message' => 'You must be logged in to view projects.']);
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
    $sql = 'SELECT id, title, description, status, created_at, updated_at 
            FROM projects 
            WHERE user_id = :user_id 
            ORDER BY created_at DESC';

    $stmt = $conn->prepare($sql);
    $stmt->execute([':user_id' => $user_id]);
    $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($projects as &$project) {
        $attachmentSql = 'SELECT id, attachment_name, attachment_type, uploaded_at 
                          FROM project_attachments 
                          WHERE project_id = :project_id 
                          ORDER BY uploaded_at ASC';

        $attachmentStmt = $conn->prepare($attachmentSql);
        $attachmentStmt->execute([':project_id' => $project['id']]);
        $attachments = $attachmentStmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($attachments as &$attachment) {
            $attachment['view_url'] = 'http://localhost:8001/Hertford_Standard/view_attachment.php?id=' . $attachment['id'];
            $attachment['download_url'] = 'http://localhost:8001/Hertford_Standard/download_attachment.php?id=' . $attachment['id'];
        }

        $project['attachments'] = $attachments;
    }

    echo json_encode([
        'success' => true,
        'projects' => $projects
    ]);
} catch (PDOException $e) {
    error_log('Get projects error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Failed to fetch projects. Please try again.']);
} finally {
    $conn = null;
}
