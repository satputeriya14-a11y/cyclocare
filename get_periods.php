<?php

session_start();

include "db.php";

if (!isset($_SESSION["user_id"])) {
    die("User not logged in.");
}

$userId = $_SESSION["user_id"];

$sql = "SELECT id, period_date
        FROM periods
        WHERE user_id = ?
        ORDER BY period_date DESC, id DESC";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("Database query error: " . $conn->error);
}

$stmt->bind_param("i", $userId);

$stmt->execute();

$result = $stmt->get_result();

$periods = [];

while ($row = $result->fetch_assoc()) {
    $periods[] = $row;
}

echo json_encode($periods);

$stmt->close();
$conn->close();

?>