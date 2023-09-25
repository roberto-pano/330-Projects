<!DOCTYPE html>
<head><title>View File Backend</title></head>

<?php
    session_start();

    // Get filename from text input form
    $filename = $_POST['view_file'];
    
    // We need to make sure that the filename is in a valid format; if it's not, display an error and leave the script.
    // To perform the check, we will use a regular expression.

    if( !preg_match('/^[\w_\.\-]+$/', $filename) ){
        header("Location: filedirectory.php");
        exit;
    }
    // This boolean will be set false always if the file name inputted by the user does not match any filenames that
    // were uploaded
    $present = false;
    foreach($_SESSION['files'] as $file){
        if ($file == $filename) {
            $present = true;
        }
    }
    if($present == false){
        header("Location: filedirectory.php");
        exit;
    }
    // Get the username from the login session
    $user = $_SESSION['user'];
    
    // Getting part of the hidden_files path to get to user folder with user files
    $hidden_path = dirname(__DIR__,2);

    // Full path of file in respective user's folder
    $full_path = $hidden_path.'/hidden_files/users/'.$user.'/'.$filename;
    
    // Now we need to get the MIME type (e.g., image/jpeg).  PHP provides a neat little interface to do this called finfo.
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($full_path);
    
    // Finally, set the Content-Type header to the MIME type of the file, and display the file.
    header("Content-Type: ".$mime);
    header('content-disposition: inline; filename="'.$filename.'";');

    // This is run to clean the page before opening the file in the browser
    ob_clean();
    flush();
    readfile($full_path);
?>
