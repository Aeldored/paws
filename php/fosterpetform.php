<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "fureverhomes";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed."]));
}

$pet_id = $_POST['foster_pet_id'] ?? null;
$foster_type = $_POST['fosterType'] ?? null;
$foster_name = $_POST['fosterName'] ?? null;
$foster_email = $_POST['fosterEmail'] ?? null;
$foster_phone = $_POST['fosterPhone'] ?? null;
$foster_reason = $_POST['fosterReason'] ?? null;

$missing_fields = [];
if (!$pet_id) $missing_fields[] = 'foster_pet_id';
if (!$foster_type) $missing_fields[] = 'fosterType';
if (!$foster_name) $missing_fields[] = 'fosterName';
if (!$foster_email) $missing_fields[] = 'fosterEmail';
if (!$foster_phone) $missing_fields[] = 'fosterPhone';
if (!$foster_reason) $missing_fields[] = 'fosterReason';

if (!empty($missing_fields)) {
    echo json_encode([
        "status" => "error",
        "message" => "Missing fields: " . implode(", ", $missing_fields)
    ]);
    exit;
}

$pet_sql = "SELECT name FROM pets WHERE id = $pet_id";
$pet_result = $conn->query($pet_sql);
$pet_name = $pet_result->num_rows > 0 ? $pet_result->fetch_assoc()['name'] : 'Unknown Pet';

$sql = "INSERT INTO fostering (pet_id, foster_name, foster_email, foster_phone, foster_type, foster_reason) 
        VALUES ('$pet_id', '$foster_name', '$foster_email', '$foster_phone', '$foster_type', '$foster_reason')";

if ($conn->query($sql) === TRUE) {
 
    if ($foster_type === 'walk-in') {
        $update_sql = "UPDATE pets SET status = 'Adopted' WHERE id = $pet_id";
        $notificationMessage = "The pet '$pet_name' has been fostered by $foster_name through a walk-in application.";
    } elseif ($foster_type === 'online') {
        $update_sql = "UPDATE pets SET status = 'On Process' WHERE id = $pet_id";
        $notificationMessage = "The foster application for pet '$pet_name' is currently on process by $foster_name through an online application.";
    }

    if ($conn->query($update_sql)) {
  
        $notifStmt = $conn->prepare("INSERT INTO notifications (message) VALUES (?)");
        $notifStmt->bind_param("s", $notificationMessage);
        $notifStmt->execute();

        echo json_encode(["status" => "success", "message" => "Foster application submitted successfully!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error: " . $conn->error]);
    }
}

$conn->close();
?>
