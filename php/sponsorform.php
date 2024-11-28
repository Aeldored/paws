<?php
$conn = new mysqli('localhost', 'root', '', 'fureverhomes');

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $sponsorName = $_POST['sponsorName'] ?? null;
    $sponsorshipAmount = $_POST['sponsorshipAmount'] ?? null;
    $sponsorLocation = $_POST['sponsorLocation'] ?? null;
    $sponsorPaymentMethod = $_POST['sponsorPaymentMethod'] ?? null;
    $sponsorReferenceCode = $_POST['sponsorReferenceCode'] ?? null;
    $isAnonymous = isset($_POST['isAnonymousSponsor']) ? 1 : 0;
    $petId = $_POST['petId'] ?? null; 

    if (!$sponsorName || !$sponsorshipAmount || !$sponsorLocation || !$sponsorPaymentMethod || !$sponsorReferenceCode || !$petId) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid input data']);
        exit();
    }

    $petQuery = $conn->prepare("SELECT name FROM pets WHERE id = ?");
    $petQuery->bind_param("i", $petId);
    $petQuery->execute();
    $petQuery->bind_result($petName);
    $petQuery->fetch();
    $petQuery->close();

    if ($petName) {
        $stmt = $conn->prepare("INSERT INTO sponsors (name, place, amount, payment_method, is_anonymous, reference_code, pet_id) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssisssi", $sponsorName, $sponsorLocation, $sponsorshipAmount, $sponsorPaymentMethod, $isAnonymous, $sponsorReferenceCode, $petId);

        if ($stmt->execute()) {
            $notificationMessage = "New sponsorship received from " . ($isAnonymous ? "Anonymous" : $sponsorName) . " for pet " . $petName . " with Amount ₱" . $sponsorshipAmount;
            $notifStmt = $conn->prepare("INSERT INTO notifications (message) VALUES (?)");
            $notifStmt->bind_param("s", $notificationMessage);
            $notifStmt->execute();

            http_response_code(200);
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to insert data']);
        }

        $stmt->close();
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Pet not found']);
    }

    exit();
}
$conn->close();
?>
