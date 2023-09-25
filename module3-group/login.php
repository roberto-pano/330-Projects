<!DOCTYPE html>
<head><title>Login Page</title></head>
<body>
    <form action="" method="post">
        <p>
            <input type="text" name ="user">
        </p>
        <p>
            <input type="text" name = "pass">
        </p>
        <p>
            <input type="submit" name = "login" value = "Login" />
            <input type="reset" />
        </p>
    </form>
    <form action="unregistered.php" method="post">
        <p>
            <input type="text" name = "new_user">
        </p>
        <p>
            <input type="text" name = "new_pass">
        </p>
        <p>
            <input type="submit" name = "register" value = "Register"/>
            <input type="reset" />
        </p>
    </form>
    <form action = "" method = "POST">
        <p><input type="hidden" name="token" value="<?php echo $_SESSION['token'] ?? '' ?>"></p>
        <p>
        Username: <input type = "text" id = "username" name = "username">
        </p>
        <p>
        New password: <input type = "text" id = "edit_pass" name = "edit_pass">
        </p>
        <input type = "submit" name = "edit_password" value = "Edit password">
</form> 
</body>
<?php
    require 'database.php';
    
    if(isset($_POST['login'])){
        $stmt = $mysqli->prepare("select username, password from users where username = ?");
        if(!$stmt){
            printf("Query Prep Failed: %s\n", $mysqli->error);
            exit;
        }
        
        $stmt->bind_param('s', $_POST['user']);
        $stmt->execute();

        $stmt->bind_result($user_input, $pass_input);
        $stmt->fetch();
        if(password_verify($_POST['pass'], $pass_input)){
            session_start();
            $_SESSION['token'] = bin2hex(random_bytes(35));
            $_SESSION['user'] = $user_input;
            $_SESSION['pass'] = $pass_input;
            header("Location: registered.php");
        } else {
            echo "invalid login";
            header("Refresh: 0");
        }
    } else if (isset($_POST['edit_password'])){
        $newpass = $_POST['edit_pass'];
        $username = $_POST['username'];

        $stmt = $mysqli->prepare("update users set password = ? where username = ?");
        if(!$stmt){
            printf("Query Prep Failed: %s\n", $mysqli->error);
            exit;
        }
        $hash_password = password_hash($newpass, PASSWORD_DEFAULT);
         $stmt->bind_param("ss", $hash_password, $username);
         $stmt->execute();
         $stmt->close();
         unset($_SESSION['user']);
         header("Refresh: 0");
         exit;

    }
    else{
        $stmt = $mysqli->prepare("select * from story");
      
        if(!$stmt){
            printf("Query Prep Failed: %s\n", $mysqli->error);
            exit;
        }
        
        $stmt->execute();
        $result = $stmt->get_result();
    
        while($row = $result->fetch_assoc()){
            printf("\tAuthor and Title<li>%s %s</li>\n \tBody<li>%s</li>\n \tLink<li>%s</li>\n",
            $row["username"],
            $row["title"],
            $row["body"],
            $row["link"]
            );
            $comment = $mysqli->prepare("select comment_id, comment_text from comment where title = ?");
            if(!$comment){
                printf("Query Prep Failed: %s\n", $mysqli->error);
                exit;
            }
            $comment->bind_param("s",$comment_row["title"]);
            $comment->execute();
            $comment_result = $comment->get_result();
            while($comment_row = $comment_result->fetch_assoc()){
            printf("\t\tComment Author and ID<li>%s %s</li>\n \t\tComment Text<li>%s</li>\n",
            $row["username"],
            $comment_row["comment_id"],
            $comment_row["comment_text"]
            );
            }
        
        }
    }
?>