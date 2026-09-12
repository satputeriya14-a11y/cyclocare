<?php

session_start();

include "db.php";

if (!isset($_SESSION["user_id"])) {
    die("User not logged in.");
}

$userId = $_SESSION["user_id"];

$sql = "SELECT id, symptom, symptom_date
        FROM symptoms
        WHERE user_id = ?
        ORDER BY symptom_date DESC, id DESC";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("Database query error: " . $conn->error);
}

$stmt->bind_param("i", $userId);

$stmt->execute();

$result = $stmt->get_result();

$symptoms = [];

while ($row = $result->fetch_assoc()) {
    $symptoms[] = $row;
}

echo json_encode($symptoms);

$stmt->close();
$conn->close();

?>