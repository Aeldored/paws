<?php

$host = 'localhost';
$dbname = 'fureverhomes';
$username = 'root';
$password = '';

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}

$category = $_GET['category']; 

$sql = "SELECT * FROM pets WHERE category = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $category);
$stmt->execute();
$result = $stmt->get_result();

$pets = [];
while ($row = $result->fetch_assoc()) {
    $pets[] = $row;
}

echo json_encode($pets);

$stmt->close();
$conn->close();
?>
