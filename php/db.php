<?php
$host = 'localhost';
$db = 'studyquest';
$user = 'root';
$pass = ''; // or your actual password

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Database connection failed', 'details' => $conn->connect_error]);
    exit;
}
?>
