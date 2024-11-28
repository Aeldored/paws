<?php

$host = 'localhost';
$dbname = 'fureverhomes'; 
$username = 'root'; 
$password = ''; 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['_method']) && $_POST['_method'] == 'DELETE') {
        $sponsorId = $_POST['id'] ?? null;

        if ($sponsorId) {
            $sql = "DELETE FROM sponsors WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':id', $sponsorId, PDO::PARAM_INT);

            if ($stmt->execute()) {
                echo json_encode(['status' => 'success', 'message' => 'Sponsor deleted successfully']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to delete sponsor']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid sponsor ID']);
        }
        exit; 
    }

    $viewType = $_GET['viewType'] ?? 'recent'; 
    $page = $_GET['page'] ?? 1; 
    $limit = 10; 
    $offset = ($page - 1) * $limit; 

    if ($viewType === 'top') {
        $sql = "SELECT s.id, s.name, s.amount, s.pet_id, p.name AS pet_name
                FROM sponsors s
                JOIN pets p ON s.pet_id = p.id
                WHERE s.is_anonymous = 0
                ORDER BY s.amount DESC
                LIMIT :limit OFFSET :offset";
    } else {
        $sql = "SELECT s.id, s.name, s.amount, s.pet_id, p.name AS pet_name
                FROM sponsors s
                JOIN pets p ON s.pet_id = p.id
                WHERE s.is_anonymous = 0
                ORDER BY s.id DESC
                LIMIT :limit OFFSET :offset";
    }

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    $sponsors = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $countStmt = $pdo->prepare("SELECT COUNT(*) FROM sponsors WHERE is_anonymous = 0");
    $countStmt->execute();
    $totalSponsors = $countStmt->fetchColumn();

    $response = [
        'sponsors' => $sponsors,
        'totalSponsors' => $totalSponsors
    ];

    echo json_encode($response);

} catch (PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>