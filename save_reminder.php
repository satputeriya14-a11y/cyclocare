<?php

session_start();

include "db.php";

if (!isset($_SESSION["user_id"])) {
    die("User not logged in.");
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $userId = $_SESSION["user_id"];

    $medication = trim($_POST["medication"]);
    $reminderDate = $_POST["reminder_date"];
    $reminderTime = $_POST["reminder_time"];

    if (
        $medication == "" ||
        $reminderDate == "" ||
        $reminderTime == ""
    ) {
        die("All reminder fields are required.");
    }

    $sql = "INSERT INTO reminders
            (user_id, medication, reminder_date, reminder_time)
            VALUES (?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        die("Database query error: " . $conn->error);
    }

    $stmt->bind_param(
        "isss",
        $userId,
        $medication,
        $reminderDate,
        $reminderTime
    );

    if ($stmt->execute()) {
        echo "Reminder saved successfully.";
    } else {
        echo "Failed to save reminder.";
    }

    $stmt->close();
    $conn->close();

} else {

    echo "Invalid request.";

}

?>