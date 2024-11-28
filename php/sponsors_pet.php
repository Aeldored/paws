<?php

$host = 'localhost';
$dbname = 'fureverhomes';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "SELECT id, name FROM pets WHERE id NOT IN (SELECT pet_id FROM sponsors)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $pets = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['pets' => $pets]);

} catch (PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
