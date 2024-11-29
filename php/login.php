<?php
session_start();

if (isset($_GET['logout'])) {
    session_unset(); 
    session_destroy();
    header("Location: http://localhost/FurHomes/login.html");
    exit();
}

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
    $input_username = $_POST['username'];
    $input_password = $_POST['password'];

    $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = :username");
    $stmt->execute(['username' => $input_username]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($admin && password_verify($input_password, $admin['password'])) {

        $_SESSION['logged_in'] = true;
        $_SESSION['username'] = $input_username; 

        header("Location: http://localhost/FurHomes/admin.html");
        exit();
    } else {
   
        echo "<script>alert('Invalid username or password!');</script>";
    }
}
?>

<a href="login.php?logout=true" class="logout">Logout</a>
