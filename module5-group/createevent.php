<?php
    ini_set("session.cookie_httponly", 1);
    session_start();
    require 'database.php';
    header("Content-Type: application/json");
    $json_str = file_get_contents('php://input');
    $json_obj = json_decode($json_str, true);

    $event_name = $json_obj['event_name'];
    $date = $json_obj['date'];
    $username = $_SESSION['user'];
    $time = $json_obj['time'];


    
    if(!hash_equals($_SESSION['token'], $json_obj['token'])){
        die("Request forgery detected");
    }

    if( !preg_match('/^[\w_\-]+$/', $event_name) ){
        echo json_encode(array(
            "success" => false,
            "message" => "Event name did not meet requirement"
        ));
        exit; 
    }
    $stmt = $mysqli->prepare("insert into events (event_name, username, event_date, event_time) values (?, ?, ?, ?)");
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        echo json_encode(array(
            "success" => false,
            "message" => "Preparation Error"
        ));
        exit;
    }
    $stmt->bind_param('ssss',$event_name,$username, $date, $time);
    $stmt->execute();

    $stmt->close();
    echo json_encode(array(
        "success" => true
    ));
    exit;
?>