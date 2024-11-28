<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "fureverhomes";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed."]));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['_method']) && $_POST['_method'] === 'DELETE') {
    if (isset($_POST['id'])) {
        $sponsorId = intval($_POST['id']);

        $query = "DELETE FROM sponsors WHERE id = ?";
        if ($stmt = $conn->prepare($query)) {
            $stmt->bind_param('i', $sponsorId);
            if ($stmt->execute()) {
                echo json_encode(['status' => 'success']);
            } else {
                echo json_encode(['status' => 'error', 'message' => $stmt->error]);
            }
            $stmt->close();
        } else {
            echo json_encode(['status' => 'error', 'message' => $conn->error]); 
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Sponsor ID missing.']);
    }
}

$conn->close();
?>