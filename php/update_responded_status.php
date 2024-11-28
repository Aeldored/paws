<?php

$host = 'localhost';
$user = 'root';
$password = '';
$dbname = 'fureverhomes';

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['error' => 'Database connection failed']));
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id']) || !isset($data['responded'])) {
    die(json_encode(['error' => 'Invalid input']));
}

$id = intval($data['id']);
$responded = intval($data['responded']);

$sql = "UPDATE rehome SET responded = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $responded, $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => 'Failed to update responded status']);
}

$stmt->close();
$conn->close();
?>
