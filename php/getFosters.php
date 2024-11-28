<?php

$host = 'localhost';
$dbname = 'fureverhomes';
$username = 'root';
$password = ''; 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['_method']) && $_POST['_method'] == 'DELETE') {
        $fosterId = $_POST['id'] ?? null;

        if ($fosterId) {
        
            $sql = "DELETE FROM fosters WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':id', $fosterId, PDO::PARAM_INT);

            if ($stmt->execute()) {
                echo json_encode(['status' => 'success', 'message' => 'Foster deleted successfully']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to delete foster']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid foster ID']);
        }
        exit; 
    }

    $viewType = $_GET['viewType'] ?? 'recent'; 
    $page = intval($_GET['page'] ?? 1);
    $limit = 10; 
    $offset = ($page - 1) * $limit;

    if ($viewType === 'longest') {

        $sql = "SELECT f.id, f.name, f.duration, f.pet_id, p.name AS pet_name
                FROM fosters f
                JOIN pets p ON f.pet_id = p.id
                WHERE f.isAnonymousFoster = 0
                ORDER BY f.duration DESC
                LIMIT :limit OFFSET :offset";
    } else {
   
        $sql = "SELECT f.id, f.name, f.duration, f.pet_id, p.name AS pet_name
                FROM fosters f
                JOIN pets p ON f.pet_id = p.id
                WHERE f.isAnonymousFoster = 0
                ORDER BY f.id DESC
                LIMIT :limit OFFSET :offset";
    }

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();

    $fosters = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $countStmt = $pdo->query("SELECT COUNT(*) FROM fosters WHERE isAnonymousFoster = 0");
    $totalFosters = $countStmt->fetchColumn();

    echo json_encode([
        'fosters' => $fosters,
        'totalFosters' => $totalFosters
    ]);

} catch (PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
