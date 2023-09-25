<!DOCTYPE html>
<head><title>Login Redirect</title></head>
<body>
<?php
// Start of initial declaration of session
session_start();
// Getting the initial user from login.html page and setting it to session variable
$_SESSION['user'] = $_GET['username'];
$user = $_SESSION['user'];
// Getting part of hidden_file path to access user folder
$hidden_file_path = dirname(__DIR__, 2);
// Making sure username is valid (has proper characters)
if( !preg_match('/^[\w_\-]+$/', $user) ){
    header("Location: login.html");
	exit;
}
// Making files readable and writable using a+
$valid_users = fopen($hidden_file_path.'/hidden_files/users.txt', 'a+');
while(!feof($valid_users)){
    $valid_user = fgets($valid_users);
    // I had to user PHP_EOL here because there is a newline character after each user when I wrote the file
    // PHP_EOL = newline
    if($valid_user==$user.PHP_EOL){
        fclose($valid_users);
        // If user is a valid user and in a list of known users it will redirect to file directory
        header("Location: filedirectory.php");
        exit;
    }
}
// In order to make sure a new user is added each line I found PHP_EOL as an option to create a newline
// in the users.txt file
fwrite($valid_users, $user.PHP_EOL);

fclose($valid_users);

// Creates user folder for new user if they are an unknown user
mkdir($hidden_file_path.'/hidden_files/users'.'/'.$user, 0777, true);
// Redirects to login page if user is an unknown user back to login, however new user directory is created with 
// unknown username, you will now be able to login as that previously used username
header("Location: login.html");
exit;
?>
</body>