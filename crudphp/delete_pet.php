<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
$host = 'localhost';
$dbname = 'fureverhomes';
$username = 'root';
$password = '';
$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error)
{
    die(json_encode(['status' => 'error', 'message' => 'Connection failed: ' . $conn->connect_error]));
}
if ($_SERVER['REQUEST_METHOD'] === 'POST')
{
    $petId = $_POST['petId'];
    if (!empty($petId))
    {
        $stmt = $conn->prepare("DELETE FROM pets WHERE id = ?");
        $stmt->bind_param("i", $petId);
        if ($stmt->execute())
        {
            echo json_encode(['status' => 'success', 'message' => 'Pet deleted successfully!']);
        }
        else
        {
            echo json_encode(['status' => 'error', 'message' => 'Error: ' . $stmt->error]);
        }
        $stmt->close();
    }
    else
    {
        echo json_encode(['status' => 'error', 'message' => 'Pet ID is required']);
    }
}
$conn->close();
?>
