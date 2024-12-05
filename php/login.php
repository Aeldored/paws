<?php
session_start();

$timeout = 1800; 
if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity']) > $timeout) {
    session_unset();
    session_destroy();
}
$_SESSION['last_activity'] = time();

session_regenerate_id(true);

if (isset($_GET['logout'])) {
    session_unset(); 
    session_destroy();
    header("Location: /FurHomes/login.html"); 
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

if (!isset($_SESSION['login_attempts'])) {
    $_SESSION['login_attempts'] = 0;
    $_SESSION['attempt_time'] = time();
}

if (time() - $_SESSION['attempt_time'] > 300) {
    $_SESSION['login_attempts'] = 0; 
}

if ($_SESSION['login_attempts'] >= 3) {
    die("Too many login attempts. Please try again later.");
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input_username = trim($_POST['username']); 
    $input_password = $_POST['password'];

    $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = :username");
    $stmt->execute(['username' => $input_username]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($admin && password_verify($input_password, $admin['password'])) {

        $_SESSION['admin_logged_in'] = true;  
        $_SESSION['username'] = $input_username;  

        $_SESSION['login_attempts'] = 0;

        header("Location: ../admin.html");
        exit();
    } else {

        $_SESSION['login_attempts']++;

        echo "<script>alert('Invalid username or password!'); window.location.href = '/FurHomes/login.html';</script>";
        exit();
    }
}
?>