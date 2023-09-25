var socketio = io.connect();
var current_room = ""
var display_name = "";
var clicked_user = "";
var clicked_room = "";

socketio.on("message_to_client",function(data) {
//Append an HR thematic break and the escaped HTML of the new message
    document.getElementById("chatlog").appendChild(document.createElement("hr"));
    var msg = data['display'] + ": " + data['message']
    document.getElementById("chatlog").appendChild(document.createTextNode(msg));
});


socketio.on("room_created", function(data){
    //console.log("here");
   document.getElementById("chatlog").appendChild(document.createElement("hr"));
    var msg = data['room'] + data['message'];
   document.getElementById("chatlog").appendChild(document.createTextNode(msg));
})

socketio.on("person_joined", function(data){
   document.getElementById("chatlog").appendChild(document.createElement("hr"));
   var msg = data['name'] + data['message'];
   document.getElementById("chatlog").appendChild(document.createTextNode(msg));
})
// socketio.on("kicked_message", function(data){
//     document.getElementById("chatlog").appendChild(document.createElement("hr"));
//     var msg = data['kicked'] + data['msg'];
//     document.getElementById("chatlog").appendChild(document.createTextNode(msg));
// })

socketio.on("someone_left", function(data){
   document.getElementById("chatlog").appendChild(document.createElement("hr"));
   var msg = data['name'] + data["message"];
   document.getElementById("chatlog").appendChild(document.createTextNode(msg));
})

function youBanned(){
   document.getElementById("ban_msg").appendChild(document.createElement("hr"));
   document.getElementById("ban_msg").appendChild(document.createTextNode("You are banned from this server"));
}

// socketio.on("user_ban", function(data){
//    document.getElementById("chatlog").appendChild(document.createElement("hr"));
//    var msg = data['ban_user'] + data['msg'];
//    document.getElementById("chatlog").appendChild(document.createTextNode(msg))
// })

socketio.on("new_owner_client", function(data){
    document.getElementById("chatlog").appendChild(document.createElement("hr"));
    var msg = data['name'] + " is the new owner of this room";
    document.getElementById("chatlog").appendChild(document.createTextNode(msg));
})
// socketio.on("change_password", function(data){
//     var roomname = data.msg;
//     document.getElementById("chatlog").appendChild(document.createTextNode(msg));
// })


socketio.on("show_change_pass", function(){
    document.getElementById("new_password").style.display = "block";
    document.getElementById("new_password_enter").style.display = "block";
})
socketio.on("hide_change_pass", function(){
    document.getElementById("new_password").style.display = "none";
    document.getElementById("new_password_enter").style.display = "none";
})
socketio.on("current_room", function(data){
   current_room = data['room'];
   //console.log(current_room);
   document.getElementById("chatlog").style.display = "block";
   if(current_room == "general_lobby"){
    const chatlog = document.getElementById("chatlog");
      chatlog.innerHTML = '';
      document.getElementById("server_list").style.display = "block";
      document.getElementById("message_input").style.display = "none";
      document.getElementById("message_enter").style.display = "none";
      document.getElementById("chatter_list").style.display = "none";
      document.getElementById("password").style.display = "block";
      document.getElementById("new_server_name").style.display = "block";
      document.getElementById("create_server").style.display = "block";
      document.getElementById("leave_room").style.display = "none";
      document.getElementById("chatlog").style.display = "none";
      document.getElementById("close_priv").style.display == "none";
      document.getElementById("close_priv").style.display = "none";
      document.getElementById("send_priv").style.display = "none";
      document.getElementById("priv").style.display = "none";
      document.getElementById("ban").style.display = "none";
      document.getElementById("kick").style.display = "none";
      document.getElementById("close_removal").style.display = "none";
      document.getElementById("new_password").style.display = "none";
      document.getElementById("new_password_enter").style.display = "none";
      
      var server_li = "";
      const server_list = document.querySelector(".server_list");
      server_list.innerHTML = "";
      //console.log(data['rooms']);
      if(data['rooms'].length >= 1){
         for (var i = 0; i < data['rooms'].length; i++)
         {
            var room = data['rooms'][i];
            server_li += `<div id = '${room}' class = "server_name">${room}</div>`;
         }
         //console.log(server_li);
         server_list.innerHTML = server_li;
      }
      if(data['ban_status'] == true){
        if(document.getElementById('ban_msg').style.display == "block"){
            var ban_msg = document.getElementById('ban_msg');
            ban_msg.innerHTML = '';
        }
        document.getElementById('ban_msg').style.display = "block";
        youBanned();
      }
      else{
        document.getElementById('ban_msg').style.display = "none";
        var ban_msg = document.getElementById('ban_msg');
        ban_msg.innerHTML = '';
      }
   }
   else{
      document.getElementById('ban_msg').style.display = "none";
      var ban_msg = document.getElementById('ban_msg');
      ban_msg.innerHTML = '';
      document.getElementById("chatlog").style.display = "block";
      document.getElementById("password").style.display = "none";
      document.getElementById("new_server_name").style.display = "none";
      document.getElementById("create_server").style.display = "none";
      document.getElementById("chatter_list").style.display = "block";
      document.getElementById("server_list").style.display = "none";
      document.getElementById("message_input").style.display = "block";
      document.getElementById("message_enter").style.display = "block";
      document.getElementById("leave_room").style.display = "block";
      document.getElementById("enter_password").style.display = "none";
      document.getElementById("sign_in").style.display = "none";
      var p_list = ""
      var chatter_list = document.getElementById("chatter_list");
      chatter_list.innerHTML = ""
      //console.log(data["chatters"]);
      for (var i = 0; i < data['chatters'].length; i++)
      {
         var person = data['chatters'][i];
         p_list += `<div id = '${person}' class = "user_dis">${person}<br></div>`;
      }
      chatter_list.innerHTML = p_list;
   }
});
socketio.on("disband_room", function(){
   socketio.emit("disband_room", {server_name: current_room});
});

socketio.on("new_room", function(data){
    document.getElementById("new_password").style.display = "block";
    document.getElementById("new_password_enter").style.display = "block";
   document.getElementById("password").style.display = "none";
   document.getElementById("new_server_name").style.display = "none";
   document.getElementById("create_server").style.display = "none";
   document.getElementById("chatter_list").style.display = "block";
   document.getElementById("server_list").style.display = "none";
   document.getElementById("message_input").style.display = "block";
   document.getElementById("message_enter").style.display = "block";
   document.getElementById("leave_room").style.display = "block";
   document.getElementById("chatlog").style.display = "block";
   current_room = data['room'];
   const chatter_list = document.querySelector(".chatter_list");
   chatter_list.innerHTML = `<div id = '${data['creator']}' class = "user_dis">Creator: ${data['creator']}<br></div>`;
});



socketio.on("server_click", function(data){
    if(data['creator'] == true){
        if(document.getElementById("close_priv").style.display == "none"){
         document.getElementById("close_priv").style.display = "block";
         document.getElementById("send_priv").style.display = "block";
         document.getElementById("priv").style.display = "block";
         document.getElementById("ban").style.display = "block";
         document.getElementById("kick").style.display = "block";
         document.getElementById("close_removal").style.display = "block";
         document.getElementById("give_ownership").style.display = "block";
        //  document.getElementById("new_password").style.display = "block";
        //  document.getElementById("new_password_enter").style.display = "block";
        } 
        // else {
        // clicked_user = "";
        //  document.getElementById("close_priv").style.display = "none";
        //  document.getElementById("send_priv").style.display = "none";
        //  document.getElementById("priv").style.display = "none";
        //  document.getElementById("ban").style.display = "none";
        //  document.getElementById("kick").style.display = "none";
        //  document.getElementById("close_removal").style.display = "none";
        // }
    }
    else{
        if(document.getElementById("close_priv").style.display == "none"){
         document.getElementById("close_priv").style.display = "block";
         document.getElementById("send_priv").style.display = "block";
         document.getElementById("priv").style.display = "block";
        } 
        // else {
        // clicked_user  = "";
        //  document.getElementById("close_priv").style.display = "none";
        //  document.getElementById("send_priv").style.display = "none";
        //  document.getElementById("priv").style.display = "none";
        // }
    }
});

socketio.on("join", function(data){
    const chatlog = document.getElementById("chatlog");
    chatlog.innerHTML = '';
    clicked_room = ""
    socketio.emit("join_server", {room: data['room'], name: display_name});
})

socketio.on("pass_needed", function(data){
    //console.log("Right direction");
    clicked_room = data['room'];
    document.getElementById("enter_password").style.display = "block";
    document.getElementById("sign_in").style.display = "block";
})

function sendMessage(){
    if(current_room != "general_lobby"){
        var msg = document.getElementById("message_input").value;
        socketio.emit("message_to_server", {message:msg, display:display_name, room:current_room});
    }

};
function declareName(){
display_name = document.getElementById("display_name").value;
socketio.emit("join_general", {display:display_name});
document.getElementById("display_name").style.display = "none";
document.getElementById("display_enter").style.display = "none";
document.getElementById("create_server").style.display = "block";
document.getElementById("new_server_name").style.display = "block";
document.getElementById("password").style.display = "block";
document.getElementById("server_list").style.display = "block";
};
function createServer(){
const chatlog = document.getElementById("chatlog");
chatlog.innerHTML = '';
var server_name = document.getElementById("new_server_name").value;
var password = document.getElementById("password").value;
// console.log("Password Init")
// console.log(password)

socketio.emit("new_server", {server_name: server_name, name: display_name, password:password});
};

function leaveServer(){
socketio.emit("leave_room", {server_name: current_room, name: display_name});
};
socketio.on("removed", function(data){
    socketio.emit("removal", {room: current_room, name: display_name, msg: data['message']})
})



function ban(){
    socketio.emit("ban_user", {banned: clicked_user, room: current_room})
}

function closeRemoval(){
    document.getElementById("close_priv").style.display = "none";
    document.getElementById("send_priv").style.display = "none";
    document.getElementById("priv").style.display = "none";
    document.getElementById("ban").style.display = "none";
    document.getElementById("kick").style.display = "none";
    document.getElementById("close_removal").style.display = "none";
    document.getElementById("give_ownership").style.display = "none";
    // document.getElementById("new_password").style.display = "none";
    // document.getElementById("new_password_enter").style.display = "none";
}

function kick(){
    socketio.emit("kick_user", {kicked: clicked_user, room: current_room})
}

function closePriv(){
   document.getElementById("close_priv").style.display = "none";
   document.getElementById("send_priv").style.display = "none";
   document.getElementById("priv").style.display = "none";
   document.getElementById("ban").style.display = "none";
   document.getElementById("kick").style.display = "none";
   document.getElementById("close_removal").style.display = "none";
   document.getElementById("give_ownership").style.display = "none";
//    document.getElementById("new_password").style.display = "none";
//    document.getElementById("new_password_enter").style.display = "none";

}

function roomSignIn(){
    const chatlog = document.getElementById("chatlog");
    chatlog.innerHTML = '';
    //console.log("Really right direction")
    var pass = document.getElementById("enter_password").value;
    socketio.emit("join_room_w_pass", {password: pass, room: clicked_room, name: display_name})
}

function pM(){
    var msg = document.getElementById("priv").value;
    socketio.emit("direct", {to:clicked_user, from:display_name, room:current_room, msg: msg})
}
function giveOwner(){
    document.getElementById("ban").style.display = "none";
    document.getElementById("kick").style.display = "none";
    document.getElementById("close_removal").style.display = "none";
    document.getElementById("give_ownership").style.display = "none";
    socketio.emit("give_ownership", {newowner: clicked_user, room: current_room})
}
function newPassword(){
    var newpass = document.getElementById("new_password").value;
    socketio.emit("change_password", {newpass: newpass, room : current_room, name:display_name})
}


document.getElementById("message_enter").addEventListener("click", sendMessage, false);
document.getElementById("display_enter").addEventListener("click", declareName, false);
document.getElementById("create_server").addEventListener("click", createServer, false);
document.getElementById("leave_room").addEventListener("click", leaveServer, false);



document.getElementById("close_removal").addEventListener("click", closeRemoval, false);
document.getElementById("send_priv").addEventListener("click", pM, false);
document.getElementById("kick").addEventListener("click", kick, false);
document.getElementById("ban").addEventListener("click", ban, false);
document.getElementById("close_priv").addEventListener("click", closePriv, false);
document.getElementById("sign_in").addEventListener("click", roomSignIn, false);
document.getElementById("give_ownership").addEventListener("click", giveOwner, false);
document.getElementById("new_password_enter").addEventListener("click", newPassword, false);




document.getElementById("display_name").style.display = "block";
document.getElementById("display_enter").style.display = "block";
document.getElementById("message_input").style.display = "none";
document.getElementById("message_enter").style.display = "none";
document.getElementById("create_server").style.display = "none";
document.getElementById("new_server_name").style.display = "none";
document.getElementById("chatter_list").style.display = "none";
document.getElementById("server_list").style.display = "none";
document.getElementById("password").style.display = "none";
document.getElementById("new_password").style.display = "none";
document.getElementById("new_password_enter").style.display = "none";
document.getElementById("leave_room").style.display = "none";
document.getElementById("chatlog").style.display = "none";
document.getElementById("kick").style.display = "none";
document.getElementById("ban").style.display = "none";
document.getElementById("close_removal").style.display = "none";
document.getElementById("close_priv").style.display = "none";
document.getElementById("send_priv").style.display = "none";
document.getElementById("priv").style.display = "none";
document.getElementById("enter_password").style.display = "none";
document.getElementById("sign_in").style.display = "none";
document.getElementById("give_ownership").style.display = "none";
document.getElementById("new_password").style.display = "none";
document.getElementById("new_password_enter").style.display = "none";




// var c_list = document.getElementsByClassName("c_name");
// for (var i = 0; i < c_list.length; i++){
//    c_list[i].addEventListener('click', function(){
   
//    })
// }



// var s_list = document.getElementsByClassName("server_list");
// for (var i = 0; i < s_list.length; i++){
//    s_list[i].addEventListener('click', function(){
//       socketio.emit("join_server", {room: s_list[i].innerHTML, name: display_name});
//    })
// }
document.querySelector('.server_list').addEventListener('click', function(ev) {
var ban_msg = document.getElementById('ban_msg');
ban_msg.innerHTML = '';
let tgt = ev.target;
if (tgt.matches('div')) {
   //console.log(tgt.id);
   if(clicked_room != tgt.id){
    socketio.emit("check_pass", {room:tgt.id})
   }
   else{
    clicked_room = ""
    document.getElementById("enter_password").style.display = "none";
    document.getElementById("sign_in").style.display = "none";
   }
//    socketio.emit("join_server", {room: tgt.id, name: display_name});
}
});
document.querySelector('.chatter_list').addEventListener('click', function(ev) {
    let tgt = ev.target;
    if (tgt.matches('div')) {
       //console.log(tgt.id);
       if(clicked_user != tgt.id){
            clicked_user = tgt.id
            if(clicked_user != display_name){
            socketio.emit("user_click", {room: current_room});
            }
            else{
                clicked_user = "";
                document.getElementById("close_priv").style.display = "none";
                document.getElementById("send_priv").style.display = "none";
                document.getElementById("priv").style.display = "none";
                document.getElementById("ban").style.display = "none";
                document.getElementById("kick").style.display = "none";
                document.getElementById("close_removal").style.display = "none";
                document.getElementById("give_ownership").style.display = "none";
                // document.getElementById("new_password").style.display = "none";
                // document.getElementById("new_password_enter").style.display = "none";

            }
        }
        else{
                clicked_user = "";
                document.getElementById("close_priv").style.display = "none";
                document.getElementById("send_priv").style.display = "none";
                document.getElementById("priv").style.display = "none";
                document.getElementById("ban").style.display = "none";
                document.getElementById("kick").style.display = "none";
                document.getElementById("close_removal").style.display = "none";
                document.getElementById("give_ownership").style.display = "none";
                // document.getElementById("new_password").style.display = "none";
                // document.getElementById("new_password_enter").style.display = "none";

        }
    }
});