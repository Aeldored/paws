<?php
session_start();

// Session Timeout (30 minutes)
$timeout = 1800; // 30 minutes
if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity']) > $timeout) {
    session_unset();
    session_destroy();
}
$_SESSION['last_activity'] = time();

// Session Regeneration after login to prevent session fixation
session_regenerate_id(true);

// Check if user is trying to log out
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

// Limit login attempts (3 attempts in 5 minutes)
if (!isset($_SESSION['login_attempts'])) {
    $_SESSION['login_attempts'] = 0;
    $_SESSION['attempt_time'] = time();
}

if (time() - $_SESSION['attempt_time'] > 300) {
    $_SESSION['login_attempts'] = 0; // Reset attempts after 5 minutes
}

if ($_SESSION['login_attempts'] >= 3) {
    die("Too many login attempts. Please try again later.");
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input_username = trim($_POST['username']); // Sanitize input
    $input_password = $_POST['password'];

    // Prepare the SQL statement
    $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = :username");
    $stmt->execute(['username' => $input_username]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);

    // If user exists and password is correct
    if ($admin && password_verify($input_password, $admin['password'])) {
        // Successful login
        $_SESSION['logged_in'] = true;
        $_SESSION['username'] = $input_username;

        // Optional: Set a session timeout (e.g., 30 minutes)
        $_SESSION['last_activity'] = time();

        // Reset login attempts on successful login
        $_SESSION['login_attempts'] = 0;

        // Redirect to admin page
        header("Location: http://localhost/FurHomes/admin.html");
        exit();
    } else {
        // Increment login attempts on failed login
        $_SESSION['login_attempts']++;

        // Display alert and redirect to login.html
        echo "<script>alert('Invalid username or password!'); window.location.href = 'http://localhost/FurHomes/login.html';</script>";
        exit();
    }
}
?>
