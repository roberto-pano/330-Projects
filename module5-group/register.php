<?php
    require 'database.php';
    header("Content-Type: application/json");
    $json_str = file_get_contents('php://input');

    $json_obj = json_decode($json_str, true);

    //Variables can be accessed as such:
    $username = $json_obj['new_user'];
    $password = $json_obj['new_pass'];

    if( !preg_match('/^[\w_\-]+$/', $username) ){
        //header("Location: login.php");
        echo json_encode(array(
            "success" => false,
            "message" => "Username did not meet requirement"
        ));
        exit;
        
    }
    if( !preg_match('/^[\w_\-]+$/', $password) or strlen($password) > 16 ){
        //header("Location: login.php");
        echo json_encode(array(
            "success" => false,
            "message" => "Password did not meet requirement"
        ));
        exit;
        
    }
    $stmt = $mysqli->prepare("select username from users where username = ?");
    if(!$stmt){
        printf("User already exist, please choose a new username\n", $mysqli->error);
        echo json_encode(array(
            "success" => false,
            "message" => "Username already exists"
        ));
        exit;
    }

    $stmt->execute();


    $stmt->bind_result($user);

    while($stmt->fetch()){
        if(htmlentities($user) == $username){
            //header("Location: login.php");
            echo json_encode(array(
                "success" => false,
                "message" => "User already exists"
            ));
            exit;
        }
    }
    $stmt = $mysqli->prepare("insert into users (username, password) values (?, ?)");
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        echo json_encode(array(
            "success" => false,
            "message" => "Preparation Error"
        ));
        exit;
    }
    $hash_password = password_hash($password, PASSWORD_DEFAULT);
    $stmt->bind_param('ss', $username, $hash_password);

    $stmt->execute();
    
    $stmt->close();
    echo json_encode(array(
        "success" => true
    ));
    //header("Location: login.php");
    exit;

?>