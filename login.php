<?php

session_start();

include "db.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $email = trim($_POST["email"]);
    $password = $_POST["password"];


    // Find user by email
    $sql = "SELECT id, name, email, password
            FROM users
            WHERE email = ?";

    $stmt = $conn->prepare($sql);


    if (!$stmt) {

        die("Database query error: " . $conn->error);

    }


    $stmt->bind_param(
        "s",
        $email
    );


    $stmt->execute();


    $result =
        $stmt->get_result();


    // Check if user exists
    if ($result->num_rows == 1) {

        $user =
            $result->fetch_assoc();


        // Verify password
        if (
            password_verify(
                $password,
                $user["password"]
            )
        ) {

            // Store user information in session
            $_SESSION["user_id"] =
                $user["id"];

            $_SESSION["user_name"] =
                $user["name"];

            $_SESSION["user_email"] =
                $user["email"];


           header(
    "Location: dashboard.php"
);

            exit;


        } else {

            echo "Incorrect email or password.";

        }


    } else {

        echo "Incorrect email or password.";

    }


    $stmt->close();

    $conn->close();


} else {

    echo "Invalid request.";

}

?>