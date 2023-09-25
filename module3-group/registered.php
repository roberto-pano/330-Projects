<!DOCTYPE html>

<head><title>Main Page</title></head>
<body>
    
    <h1>  News Forum</h1>

    <form action = "" method = "POST">
        <p><input type="hidden" name="token" value="<?php echo $_SESSION['token'] ?? '' ?>"></p>
        <p>
        Title: <input type = "text" id = "title" name = "title">
        </p>
        <p>
        Content: <input type = "textarea" id = "content" name = "body">
        </p>
        <p>
        Optional link: <input type = "text" name = "insert_link">
        <p>
        <input type = "submit" name = "new_story" value = "submit new story">
</form> 

    <form action = "" method = "POST"> 
        <p><input type="hidden" name="token" value="<?php echo $_SESSION['token'] ?? '' ?>"></p>
        <p>
        Title: <input type = "text" id = "title" name = "title">
        </p>
        <p>
        Content: <input type = "textarea" id = "content" name = "body">
        </p>
        <p>
        Optional Link: <input type = "text" name = "edit_link" >
        </p>
        <input type = "submit" name = "edit_story" value = "Edit Story">
    </form>

    <form action = "" method = "POST"> 
        <p><input type="hidden" name="token" value="<?php echo $_SESSION['token'] ?? '' ?>"></p>
        <p>
        Title: <input type = "text" id = "title" name = "title">
        </p>
        <input type = "submit" name = "delete_story" value = "Delete Story">
    </form>

    <form action = "" method = "POST"> 
        <p><input type="hidden" name="token" value="<?php echo $_SESSION['token'] ?? '' ?>"></p>
        <p>
        New Comment: <input type = "text" id = "comment" name = "comment">
        </p> 
        <p>
        Enter Title of Story You Want To Comment On<input type = "text" id = "title" name = "title">
        </p>
        <input type = "submit" name = "new_comment" value = "Add comment">
    </form>
    
    <form action = "" method = "POST"> 
        <p><input type="hidden" name="token" value="<?php echo $_SESSION['token'] ?? '' ?>"></p>
        <p>
        Edit Comment Text: <input type = "text" id = "comment" name = "comment" >
        </p>
        <p>
        Enter Comment ID: <input type = "number" id = "comment" name = "comment_id" min="0" step="1">
        </p>
        <p>
        Enter Title of Story You Want To Edit Comment On<input type = "text" id = "title" name = "title">
        </p>
        <input type = "submit" name = "edit_comment "value = "Edit comment">
    </form>

    <form action = "" method = "POST">
        <p><input type="hidden" name="token" value="<?php echo $_SESSION['token'] ?? '' ?>"></p>
        <p>
        Enter Story You Want To Delete Comment On<input type = "text" id = "title" name = "title">
        </p>
        <p>
        Enter Comment ID <input type="number" name = "comment_id", id = "comment_id" min="0" step="1">
        </p>
    <input type = "submit" name = "delete_comment "value = "Delete comment">
    </form>
        
    <form action = "" method = "post">
        <p>
        <input type = "submit" name = "logout" value = "Logout">
        </p>
    </form>


    <p> Stories: </p>
</body>

<?php
    session_start();


    if(isset($_POST['logout'])){
        session_destroy();
        header("Location: login.php");
    }
    if(isset($_POST['new_story'])){

    require 'database.php';

    $username= $_SESSION['user'];
    $title = $_POST['title'];
    $content = $_POST['body'];
    $link = $_POST['insert_link'];

    $stmt = $mysqli->prepare("insert into story (username, title, body, link) values (?,?,?,?)");
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
    $stmt->bind_param("ssss", $username, $title, $content, $link);
    $stmt->execute();
    $stmt->close();
    header("Refresh: 0");
    exit;
}  else if(isset($_POST['edit_story'])){
    
    require 'database.php';

    $username= $_SESSION['user'];
    $title = $_POST['title'];
    $content = $_POST['body'];
    $link = $_POST['edit_link'];
 
    $stmt = $mysqli->prepare("update story set body = '$content', link = '$link' where title = ? ");
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
    $stmt->bind_param('s', $title);
    $stmt->execute();
    $stmt->close();
    unset($_SESSION['title']);
    header("Refresh: 0");
    exit;

} else if(isset($_POST['delete_story'])){
    
    require 'database.php';
    $username = $_SESSION['user'];
    $title = $_POST['title'];
    $delete_comment = $mysqli->prepare("delete from comment where title = ?");
    $delete_comment->bind_param('s', $title);
    $delete_comment->execute();
    $delete_comment->close();
    $stmt = $mysqli->prepare("delete from story where title = ? and username = ?");
    
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
    $stmt->bind_param("ss", $title, $username);
    $stmt->execute();
    $stmt->close();
    header("Refresh: 0");
    exit;

}else if(isset($_POST['new_comment'])){
    
    require 'database.php';
    $username = $_SESSION['user'];
    $comment = $_POST['comment'];
    $title = $_POST['title'];

    $stmt = $mysqli->prepare("insert into comment (username, comment_text, title) values (?,?,?)");
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
    $stmt->bind_param("sss", $username, $comment, $title);
    $stmt->execute();
    $stmt->close();
    header("Refresh: 0");
    exit;

} else if(isset($_POST['edit_comment'])){
    
    require 'database.php';
    $username = $_SESSION['user'];
    $comment = $_POST['comment'];
    $title = $_POST['title'];
    $id = (int)$_POST['comment_id'];
    echo "the id is $id endOfID";
     
    $stmt = $mysqli->prepare("update comment set comment_text = $comment where comment_id = ? and title = ? and username = ?");
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }

    $stmt->bind_param("iss", $id, $title, $username);
    $stmt->execute();
    $stmt->close();
   unset($_SESSION['user']);
    header("Refresh: 0");
    exit;

} else if(isset($_POST['delete_comment'])){
    
    require 'database.php';
    $username = $_SESSION['user'];
    $title = $_POST['title'];
    $c_id = (int)$_POST['comment_id'];

    $stmt = $mysqli->prepare("delete from comment where comment_id = ? and username = ? and title = ?");
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
    $stmt->bind_param("iss", $c_id, $username, $title);
    $stmt->execute();
    $stmt->close();
    header("Refresh: 0");

} else {   
    require 'database.php';
    $allstory = $mysqli->prepare("select * from story");
    if(!$allstory){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
    $allstory->execute();
    $allresult = $allstory->get_result();
        while($row = $allresult->fetch_assoc()){
         
        printf("\tAuthor and Title<li>%s %s</li>\n \tBody<li>%s</li>\n \tLink<li>%s</li>\n",
        $row["username"],
        $row["title"],
        $row["body"],
        $row["link"]
        );
        $comment = $mysqli->prepare("select comment_id, comment_text from comment where title = ? order by comment_id ASC");
        if(!$comment){
            printf("Query Prep Failed: %s\n", $mysqli->error);
            exit;
        }
        $comment->bind_param("s",$row["title"]);
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
