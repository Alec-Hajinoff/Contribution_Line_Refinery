<?php
require_once 'session_config.php';

// Authentication check first
if (!isset($_SESSION['id'])) {
    header('HTTP/1.1 401 Unauthorized');
    echo 'You must be logged in to download attachments.';
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    header('HTTP/1.1 400 Bad Request');
    echo 'Invalid attachment ID.';
    exit;
}

$attachment_id = $_GET['id'];
$user_id = $_SESSION['id'];

$servername = '127.0.0.1';
$username = 'root';
$passwordServer = '';
$dbname = 'hertford_standard';

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $passwordServer);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = 'SELECT pa.attachment, pa.attachment_name, pa.attachment_type 
            FROM project_attachments pa
            JOIN projects p ON pa.project_id = p.id
            WHERE pa.id = :attachment_id AND p.user_id = :user_id';

    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':attachment_id' => $attachment_id,
        ':user_id' => $user_id
    ]);

    $attachment = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$attachment) {
        header('HTTP/1.1 404 Not Found');
        echo 'Attachment not found.';
        exit;
    }

    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="' . $attachment['attachment_name'] . '"');
    header('Content-Length: ' . strlen($attachment['attachment']));
    header('Cache-Control: no-cache, must-revalidate');

    echo $attachment['attachment'];
} catch (PDOException $e) {
    error_log('Download attachment error: ' . $e->getMessage());
    header('HTTP/1.1 500 Internal Server Error');
    echo 'Unable to download attachment.';
} finally {
    $conn = null;
}
