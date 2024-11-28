<?php

$host = 'localhost'; 
$dbname = 'fureverhomes';
$username = 'root';
$password = ''; 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['_method']) && $_POST['_method'] == 'DELETE') {
        $donorId = $_POST['id'] ?? null;

        if ($donorId) {
        
            $sql = "DELETE FROM donate WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':id', $donorId, PDO::PARAM_INT);

            if ($stmt->execute()) {
                echo json_encode(['status' => 'success', 'message' => 'Donor deleted successfully']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to delete donor']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid donor ID']);
        }
        exit; 
    }

    $viewType = $_GET['viewType'] ?? 'recent'; 
    $page = $_GET['page'] ?? 1; 
    $limit = 10; 
    $offset = ($page - 1) * $limit; 

    if ($viewType === 'top') {
        $sql = "SELECT donorName, donationAmount, location, id 
                FROM donate 
                WHERE isAnonymous = 0 
                ORDER BY donationAmount DESC 
                LIMIT :limit OFFSET :offset";
    } else {
        $sql = "SELECT donorName, donationAmount, location, id 
                FROM donate 
                WHERE isAnonymous = 0 
                ORDER BY id DESC 
                LIMIT :limit OFFSET :offset";
    }
    

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    $donors = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $countStmt = $pdo->prepare("SELECT COUNT(*) FROM donate WHERE isAnonymous = 0");
    $countStmt->execute();
    $totalDonors = $countStmt->fetchColumn();

    $response = [
        'donors' => $donors,
        'totalDonors' => $totalDonors
    ];

    echo json_encode($response);

} catch (PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
