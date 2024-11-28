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
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['_method']) && $_POST['_method'] === 'DELETE')
{
    if (isset($_POST['id']))
    {
        $fosterId = intval($_POST['id']);
        $query = "SELECT pet_id FROM fosters WHERE id = ?";
        if ($stmt = $conn->prepare($query))
        {
            $stmt->bind_param('i', $fosterId);
            $stmt->execute();
            $stmt->bind_result($petId);
            $stmt->fetch();
            $stmt->close();
            $deleteQuery = "DELETE FROM fosters WHERE id = ?";
            if ($stmt = $conn->prepare($deleteQuery))
            {
                $stmt->bind_param('i', $fosterId);
                if ($stmt->execute())
                {
                    $updateQuery = "UPDATE pets SET status = 'available' WHERE id = ?";
                    if ($stmt = $conn->prepare($updateQuery))
                    {
                        $stmt->bind_param('i', $petId);
                        $stmt->execute();
                    }
                    echo json_encode(['status' => 'success']);
                }
                else
                {
                    echo json_encode(['status' => 'error', 'message' => $stmt->error]);
                }
                $stmt->close();
            }
            else
            {
                echo json_encode(['status' => 'error', 'message' => $conn->error]);
            }
        }
        else
        {
            echo json_encode(['status' => 'error', 'message' => 'Failed to get pet ID']);
        }
    }
    else
    {
        echo json_encode(['status' => 'error', 'message' => 'Foster ID missing.']);
    }
}
$conn->close();
?>
