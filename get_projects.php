<?php
require_once 'session_config.php';

// Check if user is authenticated
if (!isset($_SESSION['id'])) {
    header('HTTP/1.1 401 Unauthorized');
    echo json_encode(['success' => false, 'message' => 'You must be logged in to view projects.']);
    exit;
}

$user_id = $_SESSION['id'];

// CORS configuration
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

// Only accept GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    header('HTTP/1.1 405 Method Not Allowed');
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// Database connection
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
    // Fetch projects for the authenticated user, ordered by newest first
    $sql = 'SELECT id, title, description, status, created_at, updated_at 
            FROM projects 
            WHERE user_id = :user_id 
            ORDER BY created_at DESC';
    
    $stmt = $conn->prepare($sql);
    $stmt->execute([':user_id' => $user_id]);
    
    $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
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
