<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$host = 'localhost';
$dbname = 'fureverhomes';
$username = 'root';
$password = '';

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Connection failed: ' . $conn->connect_error]));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $petCategory = $_POST['petCategory']; 
    $petType = $_POST['petType'];
    $petName = $_POST['petName'];
    $petBreed = $_POST['petBreed'];
    $petAge = $_POST['petAge'];
    $petDescription = $_POST['petDescription'];
    $petImage = $_FILES['petImage'];

    $targetDir = $_SERVER['DOCUMENT_ROOT'] . "/fureverhomes/assets/uploads/"; 
    $imageName = time() . "_" . basename($petImage["name"]);
    $targetFile = $targetDir . $imageName;

    if (move_uploaded_file($petImage["tmp_name"], $targetFile)) {

        $stmt = $conn->prepare("INSERT INTO pets (type, name, breed, age, description, image, category) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssss", $petType, $petName, $petBreed, $petAge, $petDescription, $imageName, $petCategory);
        
        if ($stmt->execute()) {
        
            echo json_encode(['status' => 'success', 'message' => 'Pet added successfully!']);
        } else {
   
            echo json_encode(['status' => 'error', 'message' => 'Error: ' . $stmt->error]);
        }
        $stmt->close();
    } else {
     
        echo json_encode(['status' => 'error', 'message' => 'Error uploading the image.']);
    }
}

$conn->close();
?>
