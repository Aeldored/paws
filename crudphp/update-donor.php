<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "fureverhomes";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error)
{
    die(json_encode(["status" => "error", "message" => "Database connection failed."]));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST')
{

    if (isset($_GET['id']))
    {
        $donorId = intval($_GET['id']); 
        $data = json_decode(file_get_contents("php://input") , true);
        $name = $data['name'];
        $amount = $data['amount'];
        $location = $data['location'];

        $query = "UPDATE donate SET donorName = ?, donationAmount = ?, location = ? WHERE id = ?";
        if ($stmt = $conn->prepare($query))
        {
            $stmt->bind_param('sdsi', $name, $amount, $location, $donorId);
            if ($stmt->execute())
            {
                echo json_encode(['status' => 'success', 'message' => 'Donor updated successfully']);
            }
            else
            {
                echo json_encode(['status' => 'error', 'message' => 'Failed to update donor']);
            }
            $stmt->close();
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
