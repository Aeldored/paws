<?php
session_start();

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

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $age = $_POST['age'];
    $gender = $_POST['gender'];
    $location = $_POST['location'];
    $email = $_POST['email']; 
    $input_username = $_POST['username'];
    $input_password = $_POST['password'];

    if (strlen($input_password) < 8) {
        echo "<script>alert('Password must be at least 8 characters long.');</script>";
        exit();
    }

    $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = :username OR email = :email");
    $stmt->execute(['username' => $input_username, 'email' => $email]);
    $existingUser = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($existingUser) {
        echo "<script>alert('Username or email already exists!');</script>";
    } else {

        try {
            $hashed_password = password_hash($input_password, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("INSERT INTO admins (username, password, name, age, gender, location, email) VALUES (:username, :password, :name, :age, :gender, :location, :email)");
            $stmt->execute([
                'username' => $input_username,
                'password' => $hashed_password,
                'name' => $name,
                'age' => $age,
                'gender' => $gender,
                'location' => $location,
                'email' => $email 
            ]);

            header("Location: http://localhost/FurHomes/login.html");
            exit();
        } catch (PDOException $e) {
            echo "<script>alert('Error: Unable to register user. Please try again later.');</script>";
        }
    }
}
?>