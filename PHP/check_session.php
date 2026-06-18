<?php
require_once 'session_config.php';

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
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$isAuthenticated = isset($_SESSION['id']);
$isAdmin         = $isAuthenticated && isset($_SESSION['is_admin']) ? (bool) $_SESSION['is_admin'] : false;

echo json_encode([
    'authenticated' => $isAuthenticated,
    'userId'        => $isAuthenticated ? $_SESSION['id'] : null,
    'is_admin'      => $isAdmin,
]);
