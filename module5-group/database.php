<?php

$mysqli = new mysqli('localhost', 'module5_user', 'module5_pass', 'Calendar');

if($mysqli->connect_errno) {
	printf("Connection Failed: %s\n", $mysqli->connect_error);
	exit;
}
?>