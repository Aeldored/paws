<?php

$host = 'localhost';
$dbname = 'fureverhomes';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents('php://input'), true);
    $sponsorId = $_GET['id'] ?? null;

    if (!$sponsorId) {
        echo json_encode(['status' => 'error', 'message' => 'Sponsor ID is missing']);
        exit;
    }

    $petId = $data['pet_id'];
    $stmt = $pdo->prepare("SELECT id FROM pets WHERE id = :pet_id");
    $stmt->bindParam(':pet_id', $petId, PDO::PARAM_INT);
    $stmt->execute();
    
    if ($stmt->rowCount() === 0) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid pet ID']);
        exit;
    }

    $sql = "UPDATE sponsors 
            SET name = :name, amount = :amount, pet_id = :pet_id 
            WHERE id = :id";
    
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':name', $data['name']);
    $stmt->bindParam(':amount', $data['amount']);
    $stmt->bindParam(':pet_id', $petId);
    $stmt->bindParam(':id', $sponsorId, PDO::PARAM_INT);
    
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Sponsor updated successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update sponsor']);
    }

} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>