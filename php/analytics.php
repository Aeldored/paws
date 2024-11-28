<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = 'localhost';
$dbname = 'fureverhomes';
$username = 'root';
$password = ''; 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo 'Connection failed: ' . $e->getMessage();
    exit;
}

$stmtAdoptedPets = $pdo->prepare("SELECT COUNT(*) AS count FROM pets WHERE category = 'Adoptable' AND status = 'Adopted'");
$stmtAdoptedPets->execute();
$adoptedPets = $stmtAdoptedPets->fetch(PDO::FETCH_ASSOC);

$stmtFosteredPets = $pdo->prepare("SELECT COUNT(*) AS count FROM pets WHERE category = 'Fosterable' AND status = 'Adopted'");
$stmtFosteredPets->execute();
$fosteredPets = $stmtFosteredPets->fetch(PDO::FETCH_ASSOC);

$stmtOnProcessPets = $pdo->prepare("SELECT COUNT(*) AS count FROM pets WHERE status = 'On Process'");
$stmtOnProcessPets->execute();
$onProcessPets = $stmtOnProcessPets->fetch(PDO::FETCH_ASSOC);

$stmtRehomeInquiries = $pdo->prepare("SELECT pettype, COUNT(*) AS count FROM rehome GROUP BY pettype");
$stmtRehomeInquiries->execute();
$rehomeInquiries = $stmtRehomeInquiries->fetchAll(PDO::FETCH_ASSOC);

$stmtTotalDonations = $pdo->prepare("SELECT SUM(donationAmount) AS totalDonations FROM donate");
$stmtTotalDonations->execute();
$totalDonations = $stmtTotalDonations->fetch(PDO::FETCH_ASSOC);

$stmtTotalSponsorAmount = $pdo->prepare("SELECT SUM(amount) AS totalAmount FROM sponsors");
$stmtTotalSponsorAmount->execute();
$totalSponsorAmount = $stmtTotalSponsorAmount->fetch(PDO::FETCH_ASSOC);

$stmtTotalDonors = $pdo->prepare("SELECT COUNT(id) AS totalDonors FROM donate");
$stmtTotalDonors->execute();
$totalDonors = $stmtTotalDonors->fetch(PDO::FETCH_ASSOC);
$totalDonorsCount = $totalDonors['totalDonors']; 

$stmtTotalSponsors = $pdo->prepare("SELECT COUNT(id) AS totalSponsors FROM sponsors");
$stmtTotalSponsors->execute();
$totalSponsors = $stmtTotalSponsors->fetch(PDO::FETCH_ASSOC);
$totalSponsorsCount = $totalSponsors['totalSponsors']; 

$stmtTotalFosters = $pdo->prepare("SELECT COUNT(id) AS totalFosters FROM fosters");
$stmtTotalFosters->execute();
$totalFosters = $stmtTotalFosters->fetch(PDO::FETCH_ASSOC);
$totalFostersCount = $totalFosters['totalFosters']; 

$stmtPetsByType = $pdo->prepare("SELECT type, 
                                      SUM(CASE WHEN category = 'adoptable' AND status = 'Available' THEN 1 ELSE 0 END) AS adoptable_available_count,
                                      SUM(CASE WHEN category = 'fosterable' AND status = 'Available' THEN 1 ELSE 0 END) AS fosterable_available_count
                                   FROM pets
                                   GROUP BY type");
$stmtPetsByType->execute();
$petsByType = $stmtPetsByType->fetchAll(PDO::FETCH_ASSOC);

$data = [
    'adoptedPets' => (int) $adoptedPets['count'],
    'fosteredPets' => (int) $fosteredPets['count'],
    'onProcessPets' => (int) $onProcessPets['count'],
    'rehomeInquiries' => $rehomeInquiries, 
    'totalDonations' => $totalDonations['totalDonations'] ?? 0, 
    'totalSponsorAmount' => $totalSponsorAmount['totalAmount'] ?? 0,  
    'totalDonors' => (int) $totalDonors['totalDonors'],
    'totalSponsors' => (int) $totalSponsors['totalSponsors'],
    'totalFosters' => (int) $totalFosters['totalFosters'],
    'petsByType' => $petsByType
];

header('Content-Type: application/json');
echo json_encode($data);
?>
