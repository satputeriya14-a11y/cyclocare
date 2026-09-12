<?php

session_start();

include "db.php";

if (!isset($_SESSION["user_id"])) {
    die("User not logged in.");
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $userId = $_SESSION["user_id"];
    $symptom = trim($_POST["symptom"]);

    if ($symptom == "") {
        die("Symptom is required.");
    }

    $symptomDate = date("Y-m-d");

    $sql = "INSERT INTO symptoms (user_id, symptom, symptom_date)
            VALUES (?, ?, ?)";

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        die("Database query error: " . $conn->error);
    }

    $stmt->bind_param(
        "iss",
        $userId,
        $symptom,
        $symptomDate
    );

    if ($stmt->execute()) {
        echo "Symptom saved successfully.";
    } else {
        echo "Failed to save symptom.";
    }

    $stmt->close();
    $conn->close();

} else {

    echo "Invalid request.";

}

?>