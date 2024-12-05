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
        die(json_encode(['success' => false, 'message' => "Connection failed: " . $e->getMessage()]));
    }

    $name = $_POST['name'];
    $age = $_POST['age'];
    $gender = $_POST['gender'];
    $location = $_POST['location'];
    $username = $_SESSION['username'];

    $profilePictureUpdate = "";
    if (isset($_FILES['profile_picture']) && $_FILES['profile_picture']['error'] === UPLOAD_ERR_OK) {

        $targetDir = $_SERVER['DOCUMENT_ROOT'] . "/FurHomes/assets/uploads/";
        $imageName = time() . "_" . basename($_FILES['profile_picture']['name']);
        $targetFile = $targetDir . $imageName;

        if (move_uploaded_file($_FILES['profile_picture']['tmp_name'], $targetFile)) {
            $profilePictureUpdate = ", profile_picture = :profile_picture";
        } else {
            die(json_encode(['success' => false, 'message' => 'Error uploading the profile picture.']));
        }
    }

    $query = "UPDATE admins SET name = :name, age = :age, gender = :gender, location = :location" . $profilePictureUpdate . " WHERE username = :username";

    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':age', $age);
    $stmt->bindParam(':gender', $gender);
    $stmt->bindParam(':location', $location);
    $stmt->bindParam(':username', $username);

    if (!empty($profilePictureUpdate)) {
        $stmt->bindParam(':profile_picture', $imageName);
    }

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'name' => $name,
            'age' => $age,
            'gender' => $gender,
            'location' => $location,
            'profile_picture' => !empty($profilePictureUpdate) ? "/FurHomes/assets/uploads/" . $imageName : null
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error updating profile.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Unauthorized.']);
}
?>