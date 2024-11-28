<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "fureverhomes";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed."]));
}

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['name'], $data['duration'], $data['pet_id'])) {
    $name = $data['name'];
    $duration = $data['duration'];
    $pet_id = $data['pet_id'];

    $query = "UPDATE fosters SET name = ?, duration = ? WHERE pet_id = ?";
    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param('ssi', $name, $duration, $pet_id); 
        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Foster updated']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to update foster']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to prepare statement']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid input data']);
}

$conn->close();
?>
