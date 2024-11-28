<?php
$host = 'localhost';
$dbname = 'fureverhomes';
$username = 'root';
$password = '';

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}

if (isset($_GET['pet_id'])) {
    $pet_id = $_GET['pet_id'];
    $sql = "SELECT * FROM pets WHERE id = $pet_id";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $pet = $result->fetch_assoc();
        echo json_encode(['pet' => $pet]);
    } else {
        echo json_encode(['error' => 'Pet not found']);
    }
}
?>
