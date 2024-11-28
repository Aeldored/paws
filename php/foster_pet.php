<?php

$host = 'localhost'; 
$user = 'root';
$password = '';    
$dbname = 'fureverhomes';

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$sql = "SELECT id, name FROM pets 
        WHERE category = 'fosterable' 
        AND status = 'Available'
        AND id NOT IN (SELECT pet_id FROM fosters WHERE status != 'adopted') 
        AND id NOT IN (SELECT pet_id FROM fostering)";

$result = $conn->query($sql);

$pets = [];
if ($result->num_rows > 0) {
    
    while ($row = $result->fetch_assoc()) {
        $pets[] = [
            'id' => $row['id'],
            'name' => $row['name']
        ];
    }
}

echo json_encode(['pets' => $pets]);

$conn->close();
?>
