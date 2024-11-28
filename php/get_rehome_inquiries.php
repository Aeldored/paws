<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "fureverhomes";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT id, petName, petType, contactEmail, isUrgent, responded FROM rehome WHERE responded != 1";
$result = $conn->query($sql);

$inquiries = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $inquiries[] = $row;
    }
}

echo json_encode($inquiries);

$conn->close();
?>
