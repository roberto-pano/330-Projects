<!DOCTYPE html>
<head><title>Main File Directory</title></head>
<body>
<form action="upload.php" method="POST" enctype="multipart/form-data">
        <p>
            <input type="hidden" name="MAX_FILE_SIZE" value="20000000" />
            <label for="uploadfile_input">Choose a file to upload:<br><br></label> <input name="uploadedfile" type="file" id="uploadfile_input" />
        </p>
        <p>
            <input type="submit" value="Upload File" />
        </p>
</form>
<form action="view.php" method="post">
    <p>
    <label>Choose a File to View: <br> </label>
    <input type="text" name = "view_file" />
    </p>
    <p>
        <input type="submit" value = "View File" />
    </p>
</form>
<form action="" method = "post">
    <p>
        <label>Choose File to Delete <br> </label>
        <input type="text" name = 'delete_file' /> 
    </p>
    <p>
        <input type="submit" name = 'delete' value = "Delete File" />
    </p>
</form>
<form action="" method = "post">
    <p>
        <label>Logout: <br> </label>
        <input type="submit" name = 'logout' value = "Logout" />
    </p>
</form>
<form action="" method = "post">
    <p>
        <label>Choose File To Share: <br> </label>
        <input type="text" name = 'share_file' /> 
    </p>
    <p>
        <label>Choose User to Share File With: <br> </label>
        <input type="text" name = 'user_share' value = "" />
    </p>
    <p>
        <label>Share: <br> </label>
        <input type="submit" name = 'share' value = "Share" />
    </p>
</form>
<?php
session_start();
    // Get username from session
    $user = $_SESSION['user'];
    // Get part of hidden_file path
    $hidden_file = dirname(__DIR__,2);
    // Clean array after using scandir to get array of filenames
    $user_files = array_diff(scandir($hidden_file.'/hidden_files/users/'.$user), array(".", ".."));
    // Storing array of files into the session
    $_SESSION['files'] = $user_files;
    // If user clicks delete button this code will activate
    if(isset($_POST['delete'])){
        $file_delete = $_POST['delete_file'];
        if( preg_match('/^[\w_\.\-]+$/', $file_delete) ){
            $present = false;
            foreach($_SESSION['files'] as $file){
                 if ($file == $file_delete) {
                     unlink($hidden_file.'/hidden_files/users/'.$user.'/'.$file_delete);
                     // Refreshing the page
                     header("Refresh:0");
                }
            }
        }
    }
    // This code activates when logout is pressed
    if(isset($_POST['logout'])){
        session_destroy();
        header("Location: login.html");
        exit;
    }

    // If share button is clicked this code will execute
    if(isset($_POST['share'])){
        // gets name of filename in free text
        $file_share = $_POST['share_file'];
        //gets user name from free text
        $user_share = $_POST['user_share'];
        // checks to see if user is valid user to share with
        if(preg_match('/^[\w_\-]+$/', $user_share) ){
            $hidden_file_path = dirname(__DIR__, 2);
            echo $hidden_file_path;
            $valid_users = fopen($hidden_file_path.'/hidden_files/users.txt', 'r');
            while(!feof($valid_users)){
                $valid_user = fgets($valid_users);
                // I had to user PHP_EOL here because there is a newline character after each user when I wrote the file
                // PHP_EOL = newline
                if($valid_user==$user_share.PHP_EOL){
                    fclose($valid_users);
                    // If user is a valid user it will check to see if file name is a valid in file directory
                    if(preg_match('/^[\w_\.\-]+$/', $file_share) ){
                        $present = false;
                        foreach($_SESSION['files'] as $file){
                             if ($file == $file_share) {
                                //Copies file from current user into the selected user's directory
                                 copy($hidden_file.'/hidden_files/users/'.$user.'/'.$file_share, $hidden_file.'/hidden_files/users/'.$user_share.'/'.$file_share);
                                 // Refreshing the page
                                 header("Refresh:0");
                            }
                        }
                    }
                }
          
            }
            
        }
        fclose($valid_users);
    }

    // This code is activated immediately when page is loaded to display files that is in the user directory
    echo "List of files: <br/>";
    foreach($user_files as $file){
        echo $file."<br/>";
    }
?>
</body>