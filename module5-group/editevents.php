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
    $newName = $json_obj['new_name'];
    $event_time = $json_obj['new_event_time'].":00";
    // $newDescription = $json_obj['new_description'];
    // $newDuration = $json_obj['new_duration'];
    $newDate = $json_obj['new_date'];
    $username = $_SESSION['user'];

    // $newTime = $json_obj['new_time'];
    if($_SESSION['token'] != $json_obj['token']){
        die("Request forgery detected");
    }


    $stmt = $mysqli->prepare("update events set event_time = ?, event_name = ?, event_date = ? where event_id = ?");
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        echo json_encode(array(
            "success" => false
        ));
        exit;
    }    
    

    $stmt->bind_param('sssi', $event_time, $newName, $newDate, $event_id);
    $stmt->execute();
    $stmt->close();

    echo json_encode(array(
        "success" => true,
    ));
    exit;
?>