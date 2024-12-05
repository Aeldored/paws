<?php
session_start();

if (isset($_SESSION['username'])) {
    $host = 'localhost';
    $dbname = 'fureverhomes'; 
    $username = 'root'; 
    $password = ''; 

    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch (PDOException $e) {
        die("Connection failed: " . $e->getMessage());
    }

    $stmt = $pdo->prepare("SELECT name, age, gender, location, profile_picture FROM admins WHERE username = :username");
    $stmt->execute(['username' => $_SESSION['username']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        echo json_encode([
            'success' => true,
            'name' => $user['name'],
            'age' => $user['age'],
            'gender' => $user['gender'],
            'location' => $user['location'],
            'profile_picture' => $user['profile_picture'] ? "/FurHomes/assets/uploads/" . $user['profile_picture'] : "/FurHomes/assets/images/profile.png"
        ]);    
    } else {
        echo json_encode(['success' => false]);
    }
} else {
    echo json_encode(['success' => false]);
}
?>
