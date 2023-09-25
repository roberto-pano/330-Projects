<!DOCTYPE html>
<head><title>Unregistered User Page</title></head>
<?php
    require 'database.php';

    if( !preg_match('/^[\w_\-]+$/', $_POST['new_user']) ){
        header("Location: login.php");
        exit;
        
    }
    if( !preg_match('/^[\w_\-]+$/', $_POST['new_pass']) or strlen($_POST['new_pass']) > 16 ){
        header("Location: login.php");
        exit;
        
    }
    $stmt = $mysqli->prepare("select username from users where username = ?");
    if(!$stmt){
        printf("User already exist, please choose a new username\n", $mysqli->error);
        exit;
    }

    $stmt->execute();


    $stmt->bind_result($user);

    while($stmt->fetch()){
        if($user == $_POST['new_user']){
            header("Location: login.php");
            exit;
        }
    }
    $stmt = $mysqli->prepare("insert into users (username, password) values (?, ?)");
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
    $hash_password = password_hash($_POST['new_pass'], PASSWORD_DEFAULT);
    $stmt->bind_param('ss', $_POST['new_user'], $hash_password);

    $stmt->execute();
    
    
    $stmt->close();
    header("Location: login.php");
    exit;

?>