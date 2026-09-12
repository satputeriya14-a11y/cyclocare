<?php

session_start();

include "db.php";

if (!isset($_SESSION["user_id"])) {
    die("User not logged in.");
}

$userId = $_SESSION["user_id"];

$sql = "SELECT id, medication, reminder_date, reminder_time
        FROM reminders
        WHERE user_id = ?
        ORDER BY reminder_date ASC, reminder_time ASC";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    die("Database query error: " . $conn->error);
}

$stmt->bind_param("i", $userId);

$stmt->execute();

$result = $stmt->get_result();

$reminders = [];

while ($row = $result->fetch_assoc()) {
    $reminders[] = $row;
}

echo json_encode($reminders);

$stmt->close();
$conn->close();

?>