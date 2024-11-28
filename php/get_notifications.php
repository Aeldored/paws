<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "fureverhomes";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT id, message FROM notifications ORDER BY timestamp DESC";
$result = $conn->query($sql);

$notifications = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $notifications[] = ['id' => $row['id'], 'message' => $row['message']];
    }
}

$conn->close();

header('Content-Type: application/json');
echo json_encode($notifications);

?>
