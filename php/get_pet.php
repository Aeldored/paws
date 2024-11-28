<?php

$host = 'localhost';
$dbname = 'fureverhomes';
$username = 'root';
$password = '';

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Connection failed: ' . $conn->connect_error]));
}

$petId = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($petId > 0) {
    $stmt = $conn->prepare("SELECT * FROM pets WHERE id = ?");
    $stmt->bind_param("i", $petId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $pet = $result->fetch_assoc();
        header('Content-Type: application/json');
        echo json_encode($pet);
    } else {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Pet not found']);
    }
    $stmt->close();
} else {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'error', 'message' => 'Invalid pet ID']);
}

$conn->close();
?>
