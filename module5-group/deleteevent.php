<?php
// {'month' : month, 'year' : year, 'new_name' : new_name, 'new_description' : new_description, 'new_duration' : new_duration, 'new_date' : new_date, 'new_time' : new_time};
    
    ini_set("session.cookie_httponly", 1);
    session_start();
    require 'database.php';
    header("Content-Type: application/json");
    $json_str = file_get_contents('php://input');
    //This will store the data into an associative array
    $json_obj = json_decode($json_str, true);

    $event_id = (int)$json_obj['event_id'];
    $username = $_SESSION['user'];

    if($_SESSION['token'] != $json_obj['token']) {
        die("Request forgery detected");
    }

    $stmt = $mysqli->prepare("delete from events where event_id = ? and username = ?");
    
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        echo json_encode(array(
            "success" => false,
            "message" => "Preparation Error"
        ));
        exit;
    } 

    $stmt->bind_param('is', $event_id, $username);
    $stmt->execute();
    $stmt->close();

    echo json_encode(array(
        "success" => true,
    ));
    exit;

?>