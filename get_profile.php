<?php

session_start();

include "db.php";

header("Content-Type: application/json");


if (!isset($_SESSION["user_id"])) {

    echo json_encode([
        "success" => false,
        "message" => "User not logged in."
    ]);

    exit;
}


$userId = $_SESSION["user_id"];


$sql = "SELECT name, email
        FROM users
        WHERE id = ?";


$stmt = $conn->prepare($sql);

if (!$stmt) {

    echo json_encode([
        "success" => false,
        "message" => "Database query error."
    ]);

    exit;
}


$stmt->bind_param(
    "i",
    $userId
);

$stmt->execute();


$result =
    $stmt->get_result();


if ($result->num_rows == 1) {

    $user =
        $result->fetch_assoc();

    echo json_encode([

        "success" => true,

        "name" =>
            $user["name"],

        "email" =>
            $user["email"]

    ]);

} else {

    echo json_encode([

        "success" => false,

        "message" =>
            "User not found."

    ]);

}


$stmt->close();

$conn->close();

?>