<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "fureverhomes";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed."]));
}

if (isset($_GET['type'])) {
    $type = $_GET['type'];
    $applications = [];

    // Get applications from both tables based on adoption_type or foster_type
    if ($type === 'online') {
        // Query for online applications from the 'adoptions' table with pet name
        $adoption_query = "
            SELECT a.id, a.adopter_name, a.adopter_email, a.adopter_phone, p.name AS pet_name 
            FROM adoptions a 
            JOIN pets p ON a.pet_id = p.id
            WHERE a.adoption_type = 'online' AND p.status = 'On Process'
        ";
        $fostering_query = "
            SELECT f.id, f.foster_name, f.foster_email, f.foster_phone, p.name AS pet_name 
            FROM fostering f 
            JOIN pets p ON f.pet_id = p.id
            WHERE f.foster_type = 'online' AND p.status = 'On Process'
        ";

         // Query for online applications from the 'fosters' table with pet name and status 'On Process'
         $foster_query = "
         SELECT f.id, f.name AS foster_name, f.email AS foster_email, f.contact_number AS foster_phone, p.name AS pet_name 
         FROM fosters f 
         JOIN pets p ON f.pet_id = p.id
         WHERE p.status = 'On Process'
     ";
     
    } else {
        // Query for walk-in applications from the 'adoptions' table with pet name
        $adoption_query = "
            SELECT a.id, a.adopter_name, a.adopter_email, a.adopter_phone, p.id AS pet_id, p.name AS pet_name 
            FROM adoptions a 
            JOIN pets p ON a.pet_id = p.id
            WHERE a.adoption_type = 'walk-in' AND p.status = 'Adopted'
        ";
        
        // Query for walk-in applications from the 'fostering' table
        $fostering_query = "
            SELECT f.id, f.foster_name, f.foster_email, f.foster_phone, p.id AS pet_id, p.name AS pet_name 
            FROM fostering f 
            JOIN pets p ON f.pet_id = p.id
            WHERE f.foster_type = 'walk-in' AND p.status = 'Adopted'
        ";
    }

    // Fetch data from adoptions table
    $result = $conn->query($adoption_query);
    while ($row = $result->fetch_assoc()) {
        $applications[] = $row;
    }

    // Fetch data from fostering table
    $result2 = $conn->query($fostering_query);
    while ($row = $result2->fetch_assoc()) {
        $applications[] = $row;
    }

    // Fetch data from fosters table (only for online type)
    if ($type === 'online') {
        $result3 = $conn->query($foster_query);
        while ($row = $result3->fetch_assoc()) {
            $applications[] = $row;
        }
    }

    echo json_encode($applications);
}

$conn->close();
?>