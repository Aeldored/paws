<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

$conn = new mysqli("localhost", "root", "", "fureverhomes");

if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit; 
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $name = $_POST['fosterName'] ?? null;
    $pet_id = $_POST['petId'] ?? null;
    $duration = $_POST['duration'] ?? null;
    $location = $_POST['fosterLocation'] ?? null;
    $contact_number = $_POST['fosterContact'] ?? null;
    $email = $_POST['fosterEmail'] ?? null;
    $isAnonymousFoster = isset($_POST['isAnonymousFoster']) ? 1 : 0;
    $experience = $_POST['experience'] ?? null;
    $home_type = $_POST['homeType'] ?? null;
    $existing_pets = $_POST['existingPets'] ?? null;

    if (empty($name) || empty($pet_id) || empty($duration) || empty($location) || empty($contact_number) || empty($email)) {
        echo json_encode(["error" => "Please fill in all required fields."]);
        exit;
    }

    $petQuery = $conn->prepare("SELECT name FROM pets WHERE id = ?");
    $petQuery->bind_param("i", $pet_id);
    $petQuery->execute();
    $petQuery->bind_result($petName);
    $petQuery->fetch();
    $petQuery->close();

    if ($petName) {
    
        $conn->begin_transaction();

        try {
      
            $stmt = $conn->prepare("INSERT INTO fosters (name, pet_id, duration, location, contact_number, email, isAnonymousFoster, experience, home_type, existing_pets) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            if ($stmt === false) {
                throw new Exception("Failed to prepare statement for fosters.");
            }

            $stmt->bind_param("siissssssi", $name, $pet_id, $duration, $location, $contact_number, $email, $isAnonymousFoster, $experience, $home_type, $existing_pets);
            if (!$stmt->execute()) {
                throw new Exception("Error inserting foster application: " . $stmt->error);
            }
            $stmt->close();

            $update_stmt = $conn->prepare("UPDATE pets SET status = 'On Process' WHERE id = ?");
            if ($update_stmt === false) {
                throw new Exception("Failed to prepare statement for updating pets.");
            }

            $update_stmt->bind_param("i", $pet_id);
            if (!$update_stmt->execute()) {
                throw new Exception("Error updating pet status: " . $update_stmt->error);
            }
            $update_stmt->close();

            $notificationMessage = "New foster application received from " . ($isAnonymousFoster ? "Anonymous" : $name) . " for pet " . $petName . " is currently on Process";
            $notifStmt = $conn->prepare("INSERT INTO notifications (message) VALUES (?)");
            $notifStmt->bind_param("s", $notificationMessage);
            $notifStmt->execute();

            $conn->commit();

            echo json_encode(["message" => "Foster application submitted successfully."]);
        } catch (Exception $e) {

            $conn->rollback();
            error_log("Transaction failed: " . $e->getMessage());
            echo json_encode(["error" => "An error occurred while processing your request."]);
        }

        $conn->close();
    } else {
        echo json_encode(["error" => "Pet not found"]);
    }
} else {
    echo json_encode(["error" => "Invalid request method."]);
}
?>
