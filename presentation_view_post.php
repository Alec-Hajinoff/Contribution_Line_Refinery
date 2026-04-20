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
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

if (!isset($_SESSION['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized. Please log in.']);
    exit;
}

$userId = $_SESSION['id'];

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['contributions_id']) || !is_array($input['contributions_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'No contributions selected.']);
    exit;
}

$contributionIdsJson = json_encode($input['contributions_id']);

try {
    $pdo = new PDO('mysql:host=localhost;dbname=contribution_line', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);

    $pdo->beginTransaction();

    $stmt = $pdo->prepare('
    INSERT INTO presentation_view (users_id, contributions_id, created_at) 
    VALUES (?, ?, NOW())
');

    $stmt->execute([
        $userId,
        $contributionIdsJson
    ]);

    $newId = $pdo->lastInsertId();
    $pdo->commit();

    echo json_encode([
        'status' => 'success',
        'id' => $newId,
        'message' => 'Presentation view created successfully'
    ]);
} catch (PDOException $e) {
    if (isset($pdo)) {
        $pdo->rollBack();
    }
    file_put_contents('error_log.txt', 'Presentation Post Error: ' . $e->getMessage() . PHP_EOL, FILE_APPEND);
    echo json_encode(['status' => 'error', 'message' => 'Database error occurred.']);
} finally {
    $pdo = null;
}
