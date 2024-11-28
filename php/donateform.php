<?php
$conn = new mysqli('localhost', 'root', '', 'fureverhomes');

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $donorName = $_POST['donorName'] ?? null;
    $donationAmount = $_POST['donationAmount'] ?? null;
    $location = $_POST['location'] ?? null;
    $paymentMethod = $_POST['paymentMethod'] ?? null;
    $referenceCode = $_POST['referenceCode'] ?? null;
    $isAnonymous = isset($_POST['isAnonymous']) ? 1 : 0;

    if (!$donorName || !$donationAmount || !$location || !$paymentMethod || !$referenceCode) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid input data']);
        exit();
    }

    $stmt = $conn->prepare("INSERT INTO donate (donorName, donationAmount, location, paymentMethod, referenceCode, isAnonymous) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sisssi", $donorName, $donationAmount, $location, $paymentMethod, $referenceCode, $isAnonymous);

    if ($stmt->execute()) {
        $notificationMessage = "New donation received from " . ($isAnonymous ? "Anonymous" : $donorName) . " of amount ₱" . $donationAmount;
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
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $conn->query("SELECT donorName, donationAmount, location FROM donate WHERE isAnonymous = 0");

    if ($result) {
        $donors = [];
        while ($row = $result->fetch_assoc()) {
            $donors[] = $row;
        }
        echo json_encode($donors);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch donors']);
    }
    exit();
}

$conn->close();
?>
