<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "fureverhomes";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed."]));
}

$pet_id = $_POST['adoption_pet_id'] ?? null; 
$adoption_type = $_POST['adoptType'] ?? null;
$adopter_name = $_POST['adopterName'] ?? null;
$adopter_email = $_POST['adopterEmail'] ?? null;
$adopter_phone = $_POST['adopterPhone'] ?? null;
$adopt_reason = $_POST['adoptReason'] ?? null;

$missing_fields = [];
if (!$pet_id) $missing_fields[] = 'adoption_pet_id';
if (!$adoption_type) $missing_fields[] = 'adoptType';
if (!$adopter_name) $missing_fields[] = 'adopterName';
if (!$adopter_email) $missing_fields[] = 'adopterEmail';
if (!$adopter_phone) $missing_fields[] = 'adopterPhone';
if (!$adopt_reason) $missing_fields[] = 'adoptReason';

if (!empty($missing_fields)) {
    echo json_encode([
        "status" => "error",
        "message" => "The following fields are missing: " . implode(', ', $missing_fields)
    ]);
    exit;
}

$pet_sql = "SELECT name FROM pets WHERE id = $pet_id";
$pet_result = $conn->query($pet_sql);
$pet_name = $pet_result->num_rows > 0 ? $pet_result->fetch_assoc()['name'] : 'Unknown Pet';

$sql = "INSERT INTO adoptions (pet_id, adopter_name, adopter_email, adopter_phone, adoption_type, adopt_reason) 
        VALUES ('$pet_id', '$adopter_name', '$adopter_email', '$adopter_phone', '$adoption_type', '$adopt_reason')";

if ($conn->query($sql) === TRUE) {
    if ($adoption_type === 'walk-in') {
        $update_sql = "UPDATE pets SET status = 'Adopted' WHERE id = $pet_id";
        $notificationMessage = "The pet '$pet_name' has been adopted by $adopter_name through a walk-in adoption.";
    } elseif ($adoption_type === 'online') {
        $update_sql = "UPDATE pets SET status = 'On Process' WHERE id = $pet_id";
        $notificationMessage = "The adoption for the pet '$pet_name' is currently on process by $adopter_name through an online application.";
    }

    if ($conn->query($update_sql)) {
        $notifStmt = $conn->prepare("INSERT INTO notifications (message) VALUES (?)");
        $notifStmt->bind_param("s", $notificationMessage);
        $notifStmt->execute();

        echo json_encode(["status" => "success", "message" => "Adoption submitted successfully!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error: " . $conn->error]);
    }
}

$conn->close();
?>
