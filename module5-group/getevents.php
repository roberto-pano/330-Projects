<?php
    
    ini_set("session.cookie_httponly", 1);
    session_start();
    require 'database.php';
    header("Content-Type: application/json");
    $json_str = file_get_contents('php://input');
    //This will store the data into an associative array
    $json_obj = json_decode($json_str, true);

    $month = (string)$json_obj['month'];
    $year = (string)$json_obj['year'];
    $d = (string)$json_obj['date'];
    $date = $year."-".$month."-".$d;
    if(!isset($_SESSION['user'])){
        session_destroy();
        echo json_encode(array(
            "success" => false
        ));
        exit;
    }
    $username = $_SESSION['user'];
    // event_time, event_description, event_duration,
    $stmt = $mysqli->prepare("select event_name, event_date, event_id, event_time from events where event_date = ? and username = ?");
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
    // $eventDuration = array();
    // $eventDescription = array();
     $eventIDs = array();

    $stmt->bind_param('ss', $date, $username);
    $stmt->execute();
    //  $eventTime, $eventDescription, $eventDuration,
    $stmt->bind_result($eventName, $eventDate, $eventID, $eventTime);

    while($stmt->fetch()){
        $eventNames[] = htmlentities($eventName);
        $eventDates[] = htmlentities($eventDate);
        // $eventDescription[] = htmlentities($eventDescription);
        // $eventDuration[] = htmlentities($eventDuration);
        $eventTimes[] = htmlentities($eventTime);
        $eventIDs[] = htmlentities($eventID);

    }

    $stmt->close();

    // if(strsub($eventDate, 0, 4) === $year){
    //     echo json_encode(array(
    //         "success" => false
    //     ));
    //     exit;
    // } else {
    echo json_encode(array(
        "success" => true,
        "event_names" => $eventNames,
        "event_dates" => $eventDates,
        "event_times" => $eventTimes,
        // "event_duration" => $eventDuration,
        // "event_descriptions" => $eventDescription,
        "username" => $username,
        "event_id" => $eventIDs
    ));
    exit;
   // }

?>