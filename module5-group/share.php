<?php
    ini_set("session.cookie_httponly", 1);
    session_start();
    require 'database.php';
    header("Content-Type: application/json");
    $json_str = file_get_contents('php://input');
    //This will store the data into an associative array
    $json_obj = json_decode($json_str, true);
    $share_user = $json_obj['share_user'];
    $my_username = $_SESSION['user'];


    $stmt = $mysqli->prepare("select event_name, event_date, event_id, event_time from events where username = ?");
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        echo json_encode(array(
            "success" => false
        ));
        exit;
    }    
    
    $eventNames = array();
    $eventTimes = array();
    $eventDates = array();
    $eventIDs = array();
    $stmt->bind_param('s', $my_username);
    $stmt->execute();
    $stmt->bind_result($eventName, $eventDate, $eventID, $eventTime);

    while($stmt->fetch()){
        $eventNames[] = htmlentities($eventName);
        $eventDates[] = htmlentities($eventDate);
        $eventTimes[] = htmlentities($eventTime);
        $eventIDs[] = htmlentities($eventID);

    }


    $stmt = $mysqli->prepare("insert into events (event_time, event_name, event_date, username) values (?,?,?,?)");
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        echo json_encode(array(
            "success" => false
        ));
        exit;
    }    

    while($stmt->fetch()){
        $stmt->bind_param('ssss', htmlentities($eventTime), htmlentities($eventName), htmlentities($eventDate), $share_user);
        $stmt->execute();
    }


    $stmt->close();
    echo json_encode(array(
        "success" => true,
    ));
    exit;

?>