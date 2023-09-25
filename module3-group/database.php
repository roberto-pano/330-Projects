<!DOCTYPE html>
<head><title>Database Check</title></head>
<?php

$mysqli = new mysqli('localhost', 'module3_user', 'module3_pass', 'module3');

if($mysqli->connect_errno) {
	printf("Connection Failed: %s\n", $mysqli->connect_error);
	exit;
}
?>