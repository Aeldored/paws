<?php 
    $donorName = $_POST['donorName'];
    $donationAmount = $_POST['donationAmount'];
    $contactEmail = $_POST['contactEmail'];

    $conn = new mysqli('localhost', 'root', '', 'fureverhomes');
    if($conn->connect_error){
        die('Connection Failed : '.$conn->connect_error);
    }else{
        $stmt = $conn->prepare("insert into donate(donorName, donationAmount, contactEmail) values (?, ?, ?)");
        $stmt->bind_param("sis", $donorName, $donationAmount, $contactEmail);
        $stmt->execute();
        echo "registration Succesfully...";
        $stmt->close();
        $conn->close();
    }