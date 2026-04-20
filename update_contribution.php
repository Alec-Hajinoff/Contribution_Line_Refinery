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

$contribution_id = $_POST['contribution_id'] ?? null;

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

    $checkStmt = $pdo->prepare('SELECT * FROM contributions WHERE id = :id AND users_id = :users_id');
    $checkStmt->execute([
        ':id' => $contribution_id,
        ':users_id' => $_SESSION['id']
    ]);

    $existingContribution = $checkStmt->fetch();
    if (!$existingContribution) {
        echo json_encode(['status' => 'error', 'message' => 'Contribution not found or access denied']);
        exit;
    }

    $pdo->beginTransaction();

    $updateFields = [];
    $params = [':id' => $contribution_id];

    $textFields = ['title', 'what_happened', 'why_it_mattered', 'outcome_impact',
        'contribution_date', 'current_role', 'current_company'];

    foreach ($textFields as $field) {
        if (isset($_POST[$field]) && $_POST[$field] !== '') {
            $updateFields[] = "`$field` = :$field";
            $params[":$field"] = trim($_POST[$field]);
        }
    }

    if (isset($_POST['categories'])) {
        $updateFields[] = 'categories = :categories';
        $params[':categories'] = $_POST['categories'];
    }

    if (!empty($updateFields)) {
        $updateSql = 'UPDATE contributions SET ' . implode(', ', $updateFields) . ' WHERE id = :id';
        $updateStmt = $pdo->prepare($updateSql);
        $updateStmt->execute($params);
    }

    if (isset($_POST['evidence_link'])) {
        $deleteLinksStmt = $pdo->prepare('DELETE FROM evidence_links WHERE contributions_id = :contributions_id');
        $deleteLinksStmt->execute([':contributions_id' => $contribution_id]);

        if (!empty($_POST['evidence_link'])) {
            $linkStmt = $pdo->prepare('
                INSERT INTO evidence_links (contributions_id, url)
                VALUES (:contributions_id, :url)
            ');
            $linkStmt->execute([
                ':contributions_id' => $contribution_id,
                ':url' => trim($_POST['evidence_link'])
            ]);
        }
    }

    if (isset($_POST['remove_file']) && $_POST['remove_file'] === '1') {
        $deleteFilesStmt = $pdo->prepare('DELETE FROM files WHERE contributions_id = :contributions_id');
        $deleteFilesStmt->execute([':contributions_id' => $contribution_id]);
    }

    if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
        $deleteFilesStmt = $pdo->prepare('DELETE FROM files WHERE contributions_id = :contributions_id');
        $deleteFilesStmt->execute([':contributions_id' => $contribution_id]);

        $file_tmp = $_FILES['file']['tmp_name'];
        $file_name = $_FILES['file']['name'];
        $mime_type = $_FILES['file']['type'];
        $file_data = file_get_contents($file_tmp);

        $fileStmt = $pdo->prepare('
            INSERT INTO files (contributions_id, file_data, file_name, mime_type)
            VALUES (:contributions_id, :file_data, :file_name, :mime_type)
        ');

        $fileStmt->bindParam(':contributions_id', $contribution_id, PDO::PARAM_INT);
        $fileStmt->bindParam(':file_data', $file_data, PDO::PARAM_LOB);
        $fileStmt->bindParam(':file_name', $file_name, PDO::PARAM_STR);
        $fileStmt->bindParam(':mime_type', $mime_type, PDO::PARAM_STR);
        $fileStmt->execute();
    }

    $pdo->commit();

    $fetchStmt = $pdo->prepare('SELECT * FROM contributions WHERE id = :id');
    $fetchStmt->execute([':id' => $contribution_id]);
    $updatedContribution = $fetchStmt->fetch();

    $linksStmt = $pdo->prepare('SELECT id, url FROM evidence_links WHERE contributions_id = :contributions_id');
    $linksStmt->execute([':contributions_id' => $contribution_id]);
    $evidence_links = $linksStmt->fetchAll();

    $filesStmt = $pdo->prepare('SELECT id, file_name, mime_type FROM files WHERE contributions_id = :contributions_id');
    $filesStmt->execute([':contributions_id' => $contribution_id]);
    $files = $filesStmt->fetchAll();

    $updatedContribution['categories'] = json_decode($updatedContribution['categories'], true) ?: [];
    $updatedContribution['evidence_links'] = $evidence_links;
    $updatedContribution['files'] = $files;

    echo json_encode([
        'status' => 'success',
        'message' => 'Contribution updated successfully',
        'contribution' => $updatedContribution
    ]);
} catch (PDOException $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('Update Contribution Error: ' . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Database error occurred.']);
} finally {
    $pdo = null;
}
