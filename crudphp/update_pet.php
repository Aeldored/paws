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
    $petCategory = $_POST['petCategory'];
    $petType = $_POST['petType'];
    $petName = $_POST['petName'];
    $petBreed = $_POST['petBreed'];
    $petAge = $_POST['petAge'];
    $petDescription = $_POST['petDescription'];

    if (isset($_FILES['petImage']) && $_FILES['petImage']['error'] === UPLOAD_ERR_OK)
    {
        $targetDir = $_SERVER['DOCUMENT_ROOT'] . "/FurHomes/assets/uploads/";
        $imageName = time() . "_" . basename($_FILES['petImage']['name']);
        $targetFile = $targetDir . $imageName;
        if (move_uploaded_file($_FILES['petImage']['tmp_name'], $targetFile))
        {
            $imageUpdate = ", image = '$imageName'";
        }
        else
        {
            die(json_encode(['status' => 'error', 'message' => 'Error uploading the image.']));
        }
    }
    else
    {
        $imageUpdate = "";
    }

    $stmt = $conn->prepare("UPDATE pets SET category = ?, type = ?, name = ?, breed = ?, age = ?, description = ? $imageUpdate WHERE id = ?");
    $stmt->bind_param("ssssssi", $petCategory, $petType, $petName, $petBreed, $petAge, $petDescription, $petId);

    if ($stmt->execute())
    {
        echo json_encode(['status' => 'success', 'message' => 'Pet updated successfully!']);
    }
    else
    {
        echo json_encode(['status' => 'error', 'message' => 'Error: ' . $stmt->error]);
    }
    $stmt->close();
}
$conn->close();
?>
