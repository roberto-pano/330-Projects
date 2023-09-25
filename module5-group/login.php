<?php
    //session.start();
    require 'database.php';
    header("Content-Type: application/json");
    $json_str = file_get_contents('php://input');
    //This will store the data into an associative array
    $json_obj = json_decode($json_str, true);

    //Variables can be accessed as such:
    $username = $json_obj['username'];
    $password = $json_obj['password'];
    $stmt = $mysqli->prepare("select username, password from users where username = ?");
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        echo json_encode(array(
            "success" => false,
            "message" => "Preparation Error"
        ));
        exit;
    }

    $stmt->bind_param('s', $username);
    $stmt->execute();

    $stmt->bind_result($user_input, $pass_input);
    $stmt->fetch();
    if(password_verify($password, htmlentities($pass_input))){
        session_start();
        $_SESSION['token'] = bin2hex(random_bytes(35));
        $_SESSION['user'] = htmlentities($user_input);
        $_SESSION['pass'] = htmlentities($pass_input);
        //header("Location: registered.php");
        echo json_encode(array(
            "success" => true,
            "token" => $_SESSION['token']
        ));
    } else {
        echo json_encode(array(
            "success" => false,
            "message" => "Incorrect Username or Password"
        ));
        exit;
        // header("Refresh: 0");
    }
?>