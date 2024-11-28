<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "fureverhomes";
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error)
{
    die(json_encode(["status" => "error", "message" => "Database connection failed."]));
}
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['_method']) && $_POST['_method'] == 'DELETE')
{
    if (isset($_POST['id']))
    {
        $donorId = $_POST['id'];
        $query = "DELETE FROM donate WHERE id = ?";
        if ($stmt = $conn->prepare($query))
        {
            $stmt->bind_param('i', $donorId);
            if ($stmt->execute())
            {
                echo json_encode(['status' => 'success', 'message' => 'Donor deleted successfully']);
            }
            else
            {
                echo json_encode(['status' => 'error', 'message' => 'Failed to delete donor']);
            }
        }
        else
        {
            echo json_encode(['status' => 'error', 'message' => 'Failed to prepare statement']);
        }
    }
    else
    {
        echo json_encode(['status' => 'error', 'message' => 'Donor ID missing']);
    }
}
else
{
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
$conn->close();
?>
