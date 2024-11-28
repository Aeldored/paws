<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "fureverhomes";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents('php://input'), true);
$notifId = $data['id'];

$sql = "DELETE FROM notifications WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $notifId);

$response = ['success' => false];

if ($stmt->execute()) {
    $response['success'] = true;
}

$stmt->close();
$conn->close();

header('Content-Type: application/json');
echo json_encode($response);

?>
