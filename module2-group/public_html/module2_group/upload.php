<!DOCTYPE html>
<head><title>Upload Backend</title></head>
<body>

<?php
session_start();
$filename = basename($_FILES['uploadedfile']['name']);
if( !preg_match('/^[\w_\.\-]+$/', $filename) ){
	echo "Invalid filename";
	exit;
}
$hidden_path = dirname(__DIR__,2);
$full_path = $hidden_path.'/hidden_files/users/'.$_SESSION['user'].'/'.$filename;

if( move_uploaded_file($_FILES['uploadedfile']['tmp_name'], $full_path) ){
	header("Location: filedirectory.php?");
	exit;
}else{
	header("Location: upload_failure.html");
	exit;
}
?>
</body>