<?php

$servername = "localhost";
$username = "root"; 
$password = "";
$dbname = "fureverhomes";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $petName = $_POST['petName'];
    $petAge = $_POST['petAge'];
    $petType = $_POST['petType'];
    $reasonForRehoming = $_POST['reasonForRehoming'];
    $petBehavior = $_POST['petBehavior'];
    $petHealth = $_POST['petHealth'];
    $location = $_POST['location'];
    $contactEmail = $_POST['contactEmail'];
    $isUrgent = isset($_POST['isUrgent']) ? 1 : 0; 
    $petPhoto = null;

    if (isset($_FILES['petPhoto']) && $_FILES['petPhoto']['error'] == 0) {
        $target_dir = $_SERVER['DOCUMENT_ROOT'] . "/FurHomes/assets/rehome/";
        $target_file = $target_dir . basename($_FILES["petPhoto"]["name"]);

        $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
        $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
        
        if (in_array($imageFileType, $allowedTypes)) {
            if (move_uploaded_file($_FILES["petPhoto"]["tmp_name"], $target_file)) {
                $petPhoto = "assets/rehome/" . basename($_FILES["petPhoto"]["name"]); 
            } else {
                echo json_encode(["error" => "Error uploading file."]);
                exit;
            }
        } else {
            echo json_encode(["error" => "Only JPG, JPEG, PNG, and GIF files are allowed."]);
            exit;
        }
    }

    $stmt = $conn->prepare("INSERT INTO rehome (petName, petAge, petType, reasonForRehoming, petBehavior, petHealth, location, contactEmail, isUrgent, petPhoto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sissssssib", $petName, $petAge, $petType, $reasonForRehoming, $petBehavior, $petHealth, $location, $contactEmail, $isUrgent, $petPhoto);

    if ($stmt->execute()) {
        $notificationMessage = $isUrgent ? 
            "Urgent rehoming request for pet '$petName' due to: $reasonForRehoming." : 
            "Rehoming request for pet '$petName' due to $reasonForRehoming.";
        
        $notifStmt = $conn->prepare("INSERT INTO notifications (message) VALUES (?)");
        $notifStmt->bind_param("s", $notificationMessage);
        $notifStmt->execute();

        echo json_encode(["success" => "Your pet has been successfully submitted for rehoming."]);
    } else {
        echo json_encode(["error" => "Error: " . $stmt->error]);
    }
    $stmt->close();
    $conn->close();
}
?>
