<?php
    ini_set("session.cookie_httponly", 1);
    session_start();
    header("Content-Type: application/json");
    if(!isset($_SESSION['user'])){
        session_destroy();
        echo json_encode(array(
            "success" => false,
            "message" => "Not logged in"
        ));
    }
    else{
        echo json_encode(array(
            "success" => true,
            "token" => $_SESSION['token']

        ));
    }
?>