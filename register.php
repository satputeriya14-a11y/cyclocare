<?php

include "db.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $name =
        trim($_POST["name"]);

    $email =
        trim($_POST["email"]);

    $password =
        $_POST["password"];

    $confirmPassword =
        $_POST["confirmPassword"];


    if (
        $password !==
        $confirmPassword
    ) {

        die("Passwords do not match.");

    }


    $hashedPassword =
        password_hash(
            $password,
            PASSWORD_DEFAULT
        );


    $sql =
        "INSERT INTO users
        (name, email, password)
        VALUES (?, ?, ?)";


    $stmt =
        $conn->prepare($sql);


    if (!$stmt) {

        die("Database query error.");

    }


    $stmt->bind_param(
        "sss",
        $name,
        $email,
        $hashedPassword
    );


    if ($stmt->execute()) {

        $stmt->close();

        $conn->close();


        header(
            "Location: login.html"
        );

        exit;
} else {

    echo "Registration failed: " . $stmt->error;

}

    $stmt->close();

    $conn->close();

} else {

    echo "Invalid request.";

}

?>