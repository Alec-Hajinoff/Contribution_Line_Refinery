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
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

if (!isset($_SESSION['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized access']);
    exit;
}

$user_id = $_SESSION['id'];

try {
    $pdo = new PDO('mysql:host=localhost;dbname=contribution_line', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);

    $stmt = $pdo->prepare('
        SELECT 
            id, 
            users_id, 
            title, 
            what_happened, 
            why_it_mattered, 
            outcome_impact, 
            contribution_date, 
            categories, 
            created_at,
            `current_role`,
            `current_company`
        FROM contributions 
        WHERE users_id = ? 
        ORDER BY contribution_date DESC
    ');
    $stmt->execute([$user_id]);
    $contributions = $stmt->fetchAll();

    if (!empty($contributions)) {
        $contribution_ids = array_column($contributions, 'id');
        $in_query = implode(',', array_fill(0, count($contribution_ids), '?'));

        $file_stmt = $pdo->prepare("SELECT * FROM files WHERE contributions_id IN ($in_query)");
        $file_stmt->execute($contribution_ids);
        $all_files = $file_stmt->fetchAll();

        $grouped_files = [];
        foreach ($all_files as $file) {
            $contrib_id = $file['contributions_id'];
            if (!isset($grouped_files[$contrib_id])) {
                $grouped_files[$contrib_id] = [];
            }

            if (isset($file['file_data'])) {
                $file['file_data'] = base64_encode($file['file_data']);
            }

            $grouped_files[$contrib_id][] = $file;
        }

        $link_stmt = $pdo->prepare("SELECT * FROM evidence_links WHERE contributions_id IN ($in_query)");
        $link_stmt->execute($contribution_ids);
        $all_links = $link_stmt->fetchAll();

        $grouped_links = [];
        foreach ($all_links as $link) {
            $contrib_id = $link['contributions_id'];
            if (!isset($grouped_links[$contrib_id])) {
                $grouped_links[$contrib_id] = [];
            }
            $grouped_links[$contrib_id][] = $link;
        }

        foreach ($contributions as &$contribution) {
            $id = $contribution['id'];
            $contribution['files'] = $grouped_files[$id] ?? [];
            $contribution['evidence_links'] = $grouped_links[$id] ?? [];
        }
    }

    echo json_encode($contributions);
} catch (PDOException $e) {
    file_put_contents('error_log.txt', 'Timeline Error: ' . $e->getMessage() . PHP_EOL, FILE_APPEND);
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['status' => 'error', 'message' => 'An error occurred while fetching your timeline.']);
} finally {
    $pdo = null;
}
