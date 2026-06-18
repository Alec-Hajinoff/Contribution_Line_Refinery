<?php
require_once 'session_config.php';

if (! isset($_SESSION['id'])) {
    header('HTTP/1.1 401 Unauthorized');
    echo 'You must be logged in to view attachments.';
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

if (! isset($_GET['id']) || ! is_numeric($_GET['id'])) {
    header('HTTP/1.1 400 Bad Request');
    echo 'Invalid attachment ID.';
    exit;
}

$attachment_id = $_GET['id'];
$user_id       = $_SESSION['id'];

$servername     = 'localhost';
$username       = 'hertford_standard_user';
$passwordServer = 'T6hhZ2Lz3UQbXBK';
$dbname         = 'hertford_standard';
$port           = 3306;

try {
    $conn = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $passwordServer);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $adminSql  = 'SELECT is_admin FROM users WHERE id = :user_id';
    $adminStmt = $conn->prepare($adminSql);
    $adminStmt->execute([':user_id' => $user_id]);
    $user     = $adminStmt->fetch(PDO::FETCH_ASSOC);
    $is_admin = ($user && $user['is_admin'] == 1);

    if ($is_admin) {
        $sql = 'SELECT pa.attachment, pa.attachment_name, pa.attachment_type
                FROM project_attachments pa
                JOIN projects p ON pa.project_id = p.id
                WHERE pa.id = :attachment_id';
        $stmt = $conn->prepare($sql);
        $stmt->execute([':attachment_id' => $attachment_id]);
    } else {
        $sql = 'SELECT pa.attachment, pa.attachment_name, pa.attachment_type
                FROM project_attachments pa
                JOIN projects p ON pa.project_id = p.id
                WHERE pa.id = :attachment_id AND p.user_id = :user_id';
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ':attachment_id' => $attachment_id,
            ':user_id'       => $user_id,
        ]);
    }

    $attachment = $stmt->fetch(PDO::FETCH_ASSOC);

    if (! $attachment) {
        header('HTTP/1.1 404 Not Found');
        echo 'Attachment not found.';
        exit;
    }

    header('Content-Type: ' . $attachment['attachment_type']);
    header('Content-Disposition: inline; filename="' . $attachment['attachment_name'] . '"');
    header('Content-Length: ' . strlen($attachment['attachment']));

    echo $attachment['attachment'];
} catch (PDOException $e) {
    error_log('View attachment error: ' . $e->getMessage());
    header('HTTP/1.1 500 Internal Server Error');
    echo 'Unable to load attachment.';
} finally {
    $conn = null;
}
