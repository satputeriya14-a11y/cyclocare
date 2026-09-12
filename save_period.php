<?php

session_start();

include "db.php";

if (!isset($_SESSION["user_id"])) {
    echo "User not logged in.";
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo "Invalid request.";
    exit;
}

$userId = (int)$_SESSION["user_id"];
$periodDate = isset($_POST["period_date"]) ? trim($_POST["period_date"]) : "";

if ($periodDate === "") {
    echo "Period date is required.";
    exit;
}

/* Validate date format */
$date = DateTime::createFromFormat("Y-m-d", $periodDate);

if (!$date || $date->format("Y-m-d") !== $periodDate) {
    echo "Invalid period date.";
    exit;
}

/* Check database connection */
if ($conn->connect_error) {
    echo "Database connection failed: " . $conn->connect_error;
    exit;
}

/* Save period */
$sql = "INSERT INTO periods (user_id, period_date) VALUES (?, ?)";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo "Database query error: " . $conn->error;
    exit;
}

$stmt->bind_param("is", $userId, $periodDate);

if ($stmt->execute()) {
    echo "Period saved successfully.";
} else {
    echo "Failed to save period: " . $stmt->error;
}

$stmt->close();
$conn->close();

?>