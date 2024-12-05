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

    $name = $_POST['name'];
    $age = $_POST['age'];
    $gender = $_POST['gender'];
    $location = $_POST['location'];
    $username = $_SESSION['username'];

    $profilePicture = null;
    if (!empty($_FILES['profile_picture']['name'])) {
        $targetDir = "../assets/images/";
        $targetFile = $targetDir . basename($_FILES['profile_picture']['name']);
        move_uploaded_file($_FILES['profile_picture']['tmp_name'], $targetFile);
        $profilePicture = $targetFile;
    }

    $query = "UPDATE admins SET name = :name, age = :age, gender = :gender, location = :location";
    if ($profilePicture) {
        $query .= ", profile_picture = :profile_picture";
    }
    $query .= " WHERE username = :username";

    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':age', $age);
    $stmt->bindParam(':gender', $gender);
    $stmt->bindParam(':location', $location);
    $stmt->bindParam(':username', $username);
    if ($profilePicture) {
        $stmt->bindParam(':profile_picture', $profilePicture);
    }
    $stmt->execute();

    echo json_encode(['success' => true, 'name' => $name, 'age' => $age, 'gender' => $gender, 'location' => $location, 'profile_picture' => $profilePicture]);
} else {
    echo json_encode(['success' => false]);
}
?>
