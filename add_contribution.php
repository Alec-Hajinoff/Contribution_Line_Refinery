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

$title = $_POST['title'] ?? null;
$what_happened = $_POST['what_happened'] ?? null;
$why_it_mattered = $_POST['why_it_mattered'] ?? null;
$outcome_impact = $_POST['outcome_impact'] ?? null;
$contribution_date = $_POST['contribution_date'] ?? null;
$categories = $_POST['categories'] ?? [];
$evidence_link = $_POST['evidence_link'] ?? '';
$current_role = $_POST['current_role'] ?? null;
$current_company = $_POST['current_company'] ?? null;

if (!$title || !$what_happened || !$why_it_mattered || !$outcome_impact || !$contribution_date) {
    echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
    exit;
}

$categories_json = json_encode(is_array($categories) ? $categories : []);

try {
    $pdo = new PDO('mysql:host=localhost;dbname=contribution_line', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);

    $pdo->beginTransaction();

    $stmt = $pdo->prepare('
        INSERT INTO contributions (
            users_id, 
            title, 
            what_happened, 
            why_it_mattered, 
            outcome_impact, 
            contribution_date, 
            categories,
            `current_role`,
            `current_company`
        ) VALUES (
            :users_id, 
            :title, 
            :what_happened, 
            :why_it_mattered, 
            :outcome_impact, 
            :contribution_date, 
            :categories,
            :current_role,
            :current_company
        )
    ');

    $stmt->execute([
        ':users_id' => $_SESSION['id'],
        ':title' => trim($title),
        ':what_happened' => trim($what_happened),
        ':why_it_mattered' => trim($why_it_mattered),
        ':outcome_impact' => trim($outcome_impact),
        ':contribution_date' => $contribution_date,
        ':categories' => $categories_json,
        ':current_role' => !empty($current_role) ? trim($current_role) : null,
        ':current_company' => !empty($current_company) ? trim($current_company) : null
    ]);

    $contribution_id = $pdo->lastInsertId();

    if (!empty($evidence_link)) {
        $linkStmt = $pdo->prepare('
            INSERT INTO evidence_links (contributions_id, url)
            VALUES (:contributions_id, :url)
        ');

        $linkStmt->execute([
            ':contributions_id' => $contribution_id,
            ':url' => trim($evidence_link)
        ]);
    }

    if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
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

    echo json_encode([
        'status' => 'success',
        'message' => 'Contribution and file saved successfully',
        'id' => $contribution_id
    ]);
} catch (PDOException $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log('Add Contribution Error: ' . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'Database error occurred.']);
} finally {
    $pdo = null;
}
