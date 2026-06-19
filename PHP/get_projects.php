<?php
require_once 'session_config.php';

if (! isset($_SESSION['id'])) {
    header('HTTP/1.1 401 Unauthorized');
    echo json_encode(['success' => false, 'message' => 'You must be logged in to view projects.']);
    exit;
}

$user_id = $_SESSION['id'];

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
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    header('HTTP/1.1 405 Method Not Allowed');
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
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
    $adminSql  = 'SELECT is_admin FROM users WHERE id = :user_id';
    $adminStmt = $conn->prepare($adminSql);
    $adminStmt->execute([':user_id' => $user_id]);
    $user     = $adminStmt->fetch(PDO::FETCH_ASSOC);
    $is_admin = ($user && $user['is_admin'] == 1);

    if ($is_admin) {
        $sql = 'SELECT p.id, p.title, p.description, p.status, p.created_at, p.updated_at, u.name as client_name
                FROM projects p
                JOIN users u ON p.user_id = u.id
                ORDER BY p.created_at DESC';
        $stmt = $conn->prepare($sql);
        $stmt->execute();
    } else {
        $sql = 'SELECT p.id, p.title, p.description, p.status, p.created_at, p.updated_at, u.name as client_name
                FROM projects p
                JOIN users u ON p.user_id = u.id
                WHERE p.user_id = :user_id
                ORDER BY p.created_at DESC';
        $stmt = $conn->prepare($sql);
        $stmt->execute([':user_id' => $user_id]);
    }

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
            $attachment['view_url']     = 'https://hertfordstandard.com/Hertford_Standard/PHP/view_attachment.php?id=' . $attachment['id'];
            $attachment['download_url'] = 'https://hertfordstandard.com/Hertford_Standard/PHP/download_attachment.php?id=' . $attachment['id'];
        }

        $project['attachments'] = $attachments;
    }

    echo json_encode([
        'success'  => true,
        'projects' => $projects,
        'is_admin' => $is_admin,
    ]);
} catch (PDOException $e) {
    error_log('Get projects error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Failed to fetch projects. Please try again.']);
} finally {
    $conn = null;
}
