// Require the packages we will use:
const http = require("http"),
    fs = require("fs"),
    path = require('path'),
    url = require('url');

    
const port = 3456;
// Listen for HTTP connections.  This is essentially a miniature static file server that only serves our one file, client.html, on port 3456:
const server = http.createServer(function (req, res) {
    // This callback runs when a new connection is made to our HTTP server.
    var filename = path.join(__dirname, "client", url.parse(req.url).pathname);
    fs.readFile(filename, function (err, data) {
        // This callback runs when the client.html file has been read from the filesystem.

        if (err) return res.writeHead(500);
        res.writeHead(200);
        res.end(data);
    });
});
server.listen(port);

// Import Socket.IO and pass our HTTP server object to it.
const socketio = require("socket.io")(http, {
    wsEngine: 'ws'
});


// Map used for rooms w/ passwords

var Room = function(name, creator_id, creator_name, password){
        this.room_name = name;
        this.creator_id = creator_id;
        this.password = password;
        this.mem_id = [];
        this.mem_id.push(creator_id);
        this.banned_id = [];
};
var user = function(user_id, user_display, room){
        this.u_id = user_id;
        this.display = user_display;
        this.room = room;
};
const user_list = new Set();
const server_rooms = new Set();
general_lobby = [];

// Attach our Socket.IO server to our HTTP server to listen
const io = socketio.listen(server);
// io.of("/").adapter.on("create-room", (room) => {
//     console.log(`room ${room} was created`);
// });

// io.of("/").adapter.on("join-room", (room, id) => {
//     console.log(`[${id}] has joined room: ${room}`)
//  })
io.sockets.on("connection", function (socket) {
    // This callback runs when a new Socket.IO connection is established.

    socket.on('message_to_server', function (data) {
        // This callback runs when the server receives a new message from the client.
        //console.log(data["display"] + ": " + data["message"]); // log it to the Node.JS output
        //console.log(data['room']);
        io.to(data['room']).emit("message_to_client", { message: data["message"], display: data["display"] }) // broadcast the message to other users
    });
    socket.on('join_general', function (data) {
        // This callback runs when the server receives a new message from the client.
        var already_exists = false;
        var avail_rooms = [];
        user_list.forEach(u =>{
            if(u.display == data['display']){
                already_exists = true;
            }
        })
        if(already_exists == false){
            user_list.add(new user(socket.id, data['display'], "general_lobby"));
            general_lobby.push(socket.id);

            if(server_rooms.size >= 1){
             server_rooms.forEach(r => {
                var room = r.room_name;
                avail_rooms.push(room);
             })
            }
            //console.log(avail_rooms); // log it to the Node.JS output
            socket.emit("current_room", {room:"general_lobby", rooms:avail_rooms, ban_status: false} );
        }
       
    });
    socket.on('join_server', function (data) {
        var b_list = [];
        var ban = false;
        server_rooms.forEach(r => {
                if(r.room_name == data['room']){
                    b_list = r.banned_id;
                    for(var i = 0; i< b_list.length; i++){
                        if(b_list[i] == socket.id){
                            ban = true
                        }
                    }
                }
        });
        if(ban != true){
            socket.join(data['room']);
            var c_id = ""
            io.to(data['room']).emit("person_joined", {name: data['name'], message: " has joined"});
            server_rooms.forEach(r => {
                if(r.room_name == data['room']){
                    c_id = r.creator_id;
                    i_list = r.mem_id;
                    r.mem_id.push(socket.id);
                }
        });
            for(var i = 0; i < general_lobby.length; i++){
                if(general_lobby[i] == socket.id){
                    general_lobby.splice(i, 1)
                }
            }
            
            var c_list = [];
            user_list.forEach(u => {
                for(var i = 0; i < i_list.length; i++){
                    if(i_list[i] == u.u_id){
                        if(i_list[i] == c_id){
                            var c_display = "Creator: " + u.display;
                            c_list.push(c_display);
                        }
                        else{
                            c_list.push(u.display);
                        }
                    }
                }
                if(u.u_id == socket.id){
                    u.room = data['room'];
                }
            })
    
            io.to(data['room']).emit("current_room", {room: data['room'], chatters:c_list});
        }
       else{
            var s_list = [];
            server_rooms.forEach(r => {
                s_list.push(r.room_name);
            });
            socket.emit("current_room", {room: "general_lobby", rooms:s_list, ban_status: ban});
            var msg = "You are banned from this server";
            socket.emit("ban_msg", {msg:msg})
       }
    });

    socket.on('new_server', function(data){
        var already_exists = false;
        var avail_rooms = [];


        if(server_rooms.size >= 1){
            server_rooms.forEach(r => {
                if(r.room_name == data['server_name']){
                    already_exists = true;
                }
                avail_rooms.push(r.room_name);
            })
        }
        if(already_exists == false){
            avail_rooms.push(data['server_name']);
            for(var i = 0; i < general_lobby.length; i++){
                if(general_lobby[i] == socket.id){
                    general_lobby.splice(i, 1)
                }
            }

            user_list.forEach(u => {
                if(u.u_id == socket.id){
                    u.room = data['server_name'];
                }
            });
            //console.log("Password Add")
            //console.log(data['password'])
            server_rooms.add(new Room(data['server_name'], socket.id, data['name'], data['password']));
            socket.join(data['server_name']);
            io.to(data['server_name']).emit("room_created", {room:data['server_name'], message:" has been created"});
            // console.log(data["display"]); // log it to the Node.JS output
            socket.emit("new_room", {room: data['server_name'], creator:data['name']});
            if(general_lobby.length >= 1){
                for(var i = 0; i < general_lobby.length; i++){
                    //console.log(general_lobby.length);
                    io.to(general_lobby[i]).emit("current_room", {room: "general_lobby", rooms:avail_rooms, ban_status: false});
                }
            }
        }
        else{
            socket.emit("current_room", {room:"general_lobby", rooms:avail_rooms, ban_status: false} );
        }
    });
        socket.on('leave_room', function (data) {
            var creator = false;
            var r_list = [];
            server_rooms.forEach(r => {
                if(r.room_name == data['server_name']){
                    if(r.creator_id == socket.id){
                        r_list = r.mem_id;
                        for(var i = 0; i < r_list.length; i++){
                            if(r_list[i] != r.creator_id){
                                general_lobby.push(r_list[i]);
                            }
                        }
                        server_rooms.delete(r);
                        creator = true;
                    }
                    else{
                       var index = r.mem_id.indexOf(socket.id);
                       r.mem_id.splice(index, 1);
                    }
                }
            });
            //console.log(server_rooms);
            user_list.forEach(u => {
                if(u.u_id == socket.id){
                    u.room = "general_lobby";
                }
            });

            if(creator == true){
                socket.leave(data['server_name']);
                general_lobby.push(socket.id);
                var s_list = [];
                server_rooms.forEach(r => { 
                    s_list.push(r.room_name);
                });   
                user_list.forEach(u => {
                    for(var i = 0; i < r_list.length; i++){
                        if(u.u_id == r_list[i]){
                            u.room = "general_lobby";
                        }
                    }
                }) 
                io.to(data['server_name']).emit("disband_room");
                for(var i = 0; i < general_lobby.length; i++){
                    io.to(general_lobby[i]).emit("current_room", {room: "general_lobby", rooms:s_list});
                }
                socket.emit("current_room", {room: "general_lobby", rooms: s_list, ban_status: false})
            }
            else{
                var s_list = [];
                var i_list = [];
                var c_list = [];
                var c_id = "";
                general_lobby.push(socket.id);
                server_rooms.forEach(r => { 
                    s_list.push(r.room_name);
                    if(r.room_name == data["server_name"]){
                        c_id = r.creator_id;
                        i_list = r.mem_id;
                    }
                });   
                user_list.forEach(u => {
                    for(var i = 0; i < i_list.length; i++){
                        if(u.u_id == i_list[i]){
                            if(i_list[i] == c_id){
                                var c_display = "Creator: " + u.display;
                                c_list.push(c_display)
                            }
                            else{
                                c_list.push(u.display);
                            }
                        }
                    }
                }) 
                socket.leave(data['server_name']);
                socket.emit("current_room", {room: "general_lobby", rooms: s_list, ban_status: false})
                // console.log(c_list)
                var message = ": has left";
                io.to(data['server_name']).emit("someone_left", {name: data['name'], message:message});
                io.to(data['server_name']).emit("current_room", {room: data["server_name"], chatters: c_list});
            }
            
        });
        socket.on('disband_room', function(data){
            socket.leave(data['server_room']);
        //     var avail_rooms = [];
        //     server_rooms.forEach(r => { 
        //        avail_rooms.push(r.room_name);
        //     }); 
        //     socket.emit("current_room", {room: "general_lobby", rooms: avail_rooms});
        });
        socket.on('user_click', function(data){
            server_rooms.forEach(r => { 
                if(r.room_name == data["room"]){
                    if(socket.id == r.creator_id){
                        socket.emit("server_click", {creator: true})
                    }
                    else{
                        socket.emit("server_click", {creator: false})
                    }
                }
            }); 
        })
        socket.on("ban_user", function(data){
            var ban_id = "";
            var s_list = [];
            var i_list = [];
            user_list.forEach(u => {
                if(u.display == data['banned']){
                    ban_id = u.u_id;
                }
            }); 
            server_rooms.forEach(r => { 
                s_list.push(r.room_name);
                if(r.room_name == data['room']){
                    var index = r.mem_id.indexOf(ban_id);
                    r.mem_id.splice(index, 1);
                    r.banned_id.push(ban_id);
                    // i_list = r.mem_id;
                }
            });
            // user_list.forEach(u => {
            //     for(var i = 0; i < i_list.length; i++){
            //         if(u.u_id == i_list[i]){
            //             c_list.push(u.display);
            //         }
            //     }
            // }) 
            general_lobby.push(ban_id);
            var message = " was banned"
            io.to(ban_id).emit("removed", {message:message});
            // console.log(c_list);
            // var msg = "has been banned"
            // io.to(data['room']).emit("user_ban", {ban_user:data['banned'], msg:msg})
        })
        socket.on("give_ownership", function(data){
            // NEED TO REFRESH PAGE TO REFLECT NEW CHAT LIST
            var c_list = [];
            var c_id = "";
            var i_list = [];
            var newOwnerID = "";
            user_list.forEach(u => {
                if(u.display == data['newowner']){
                    newOwnerID = u.u_id;
                }
            });
            server_rooms.forEach(r => {
                if(r.room_name == data['room']){
                    io.to(r.creator_id).emit("hide_change_pass");
                    r.display = data['newowner']
                    r.creator_id = newOwnerID
                    c_id = r.creator_id; 
                    i_list = r.mem_id;
                }
            })
            //console.log(i_list);
            user_list.forEach(u => {
                for(var j = 0; j<i_list.length; j++){
                    if(i_list[j] == u.u_id){
                        if(i_list[j] == c_id){
                            //console.log("Hey")
                            var c_display = "Creator: " + u.display;
                            c_list.push(c_display);
                        }
                        else{
                            //console.log("No")
                            c_list.push(u.display);
                        }
                    }
                }
            });
            //console.log(c_list);
            io.to(data['room']).emit("new_owner_client", {name: data['newowner']})
            io.to(data['room']).emit("current_room", {room: data['room'], chatters: c_list})
            io.to(c_id).emit("show_change_pass");

        })
        socket.on("change_password", function(data){
            var newPassword = data['newpass'];
            server_rooms.forEach(r => {
                if(r.room_name == data['room']){
                   r.password = newPassword
                }
            })
            //var room = data.room;
            // var user = data.user;
            // if(user == room.creator){
            //     room.password = newPassword;
            // io.to(socket.id).emit('change_password');
            // }
        })
        socket.on("kick_user", function(data){
            var s_list = [];
            var d_id = ""
            user_list.forEach(u => {
                if(u.display == data['kicked']){
                    d_id = u.u_id;
                }
            }) 
            server_rooms.forEach(r => {
                s_list.push(r.room_name);
                if(r.room_name == data['room']){
                    var index = r.mem_id.indexOf(d_id);
                    r.mem_id.splice(index, 1);
                    // i_list = r.mem_id;
                }
            })
            var message = " was kicked";
            // io.to(data['room']).emit("current_room", {room: data['room'], chatters:c_list})
            io.to(d_id).emit("removed", {message:message} );
        })
        socket.on("removal", function(data){
            var i_list = [];
            var c_list = [];
            var c_id = "";
            var s_list = [];
            socket.leave(data['room']);
            server_rooms.forEach(r => {
                s_list.push(r.room_name);
                if(r.room_name == data['room']){
                    c_id = r.creator_id;
                    i_list = r.mem_id;
                }
            })
            user_list.forEach(u => {
                for(var i = 0; i < i_list.length; i++){
                    if(u.u_id == i_list[i]){
                        if(i_list[i] == c_id){
                            var c_display = "Creator: " + u.display;
                            c_list.push(c_display)
                        }
                        else{
                            c_list.push(u.display);
                        }
                    }
                }
            }) 
            io.to(data['room']).emit("current_room", {room: data['room'], chatters:c_list})
            io.to(data['room']).emit("someone_left", {name: data['name'], message:data['msg']})
            // msg = " was removed";
            //io.to(data['room']).emit("kicked_message", {kicked:data['kicked'], msg:msg});
            socket.emit("current_room", {room: "general_lobby", rooms:s_list})
            io.to(c_id).emit("show_change_pass");
        })
        socket.on("check_pass", function(data){
            server_rooms.forEach(r => {
                if(r.room_name == data['room']){
                    if(r.password == ""){
                        socket.emit("join", {room:data['room']});
                    }
                    else{
                        socket.emit("pass_needed", {room:data["room"]});
                    }
                }
            })
        })
        socket.on("direct", function(data){
            var uid = ""
            user_list.forEach(u => {
                if(u.display == data['to']){
                    uid = u.u_id
                }
            });
            //console.log(uid)
            //console.log(data['to'])
            //console.log(data['from'])
            //console.log(data['msg'])
            private = "private " + data['from'];
            io.to(uid).emit("message_to_client", {message:data['msg'], display: private});
            io.to(socket.id).emit("message_to_client", {message:data['msg'], display: private});

        })
        socket.on("join_room_w_pass", function(data){

        // console.log("I am here dude");


        var b_list = [];
        var ban = false;
        // socket.join(data['room']);
        // io.to(data['room']).emit("person_joined", {name: data['name'], message: " has joined"});

        server_rooms.forEach(r => {
                if(r.room_name == data['room']){
                    b_list = r.banned_id;
                    for(var i = 0; i< b_list.length; i++){
                        if(b_list[i] == socket.id){
                            ban = true;
                        }
                    }
                }
        });
        if(ban != true){
            var c_id = "";
            server_rooms.forEach(r => {
                if(r.room_name == data['room']){
                    //console.log("I am here dude");
                    //console.log(r.password)
                    //console.log(data['password'])
                    if(r.password == data['password']){
                        c_id = r.creator_id;
                        //console.log("I now am here dude");
                        socket.join(data['room'])
                        io.to(data['room']).emit("person_joined", {name: data['name'], message: " has joined"});
                        i_list = r.mem_id;
                        r.mem_id.push(socket.id);
                        for(var i = 0; i < general_lobby.length; i++){
                            if(general_lobby[i] == socket.id){
                                general_lobby.splice(i, 1)
                            }
                        }
                        var c_list = [];
                        user_list.forEach(u => {
                            for(var i = 0; i < i_list.length; i++){
                                if(i_list[i] == u.u_id){
                                    if(i_list[i] == c_id){
                                        var c_display = "Creator: " + u.display;
                                        c_list.push(c_display);
                                    }
                                    else{
                                        c_list.push(u.display);
                                    }
                                }
                            }
                            if(u.u_id == socket.id){
                                u.room = data['room'];
                            }
                        });
            
                    io.to(data['room']).emit("current_room", {room: data['room'], chatters:c_list,});
                    io.to(c_id).emit("show_change_pass");
                }
            }
            else{
                var s_list = [];
                server_rooms.forEach(r => {
                    s_list.push(r.room_name);
                });
                socket.emit("current_room", {room: "general_lobby", rooms:s_list, ban_status: ban});
                //socket.emit("incorrect_pass_msg");
            }
                
        });
    }
    else{
        var s_list = [];
        server_rooms.forEach(r => {
            s_list.push(r.room_name);
        });
        socket.emit("current_room", {room: "general_lobby", rooms:s_list, ban_status: ban});
        //socket.emit("ban_msg");
    }
});
    socket.on("disconnect", function(reason){
        //console.log(reason);
        //console.log("Hello there!")
       
            var d_list = []
            var room_name = ""
            var s_list = []
            var creator = false;
            var g_lob = false
            for(var j = 0; j < general_lobby.length; i++){
                if(general_lobby[i] == socket.id){
                    g_lob = true;
                }
            }
            if(g_lob == false){
                var c_id = "";
                server_rooms.forEach(r => {
                    if(r.creator_id == socket.id){
                        var index = r.mem_id.indexOf(socket.id);
                        r.mem_id.splice(index,1);
                        d_list = r.mem_id;
                        room_name = r.room_name;
                        server_rooms.delete(r);
                        creator = true
                    }
                    else(
                        s_list.push(r.room_name)
                    )
                });

                if(creator == true){
                    io.to(room_name).emit("disband_room");


                    for(var j = 0; i < general_lobby.length; i++){
                        io.to(general_lobby[i]).emit("current_room", {room: "general_lobby", rooms:s_list, ban_status: false})
                    }

                    for(var i = 0; i < d_list.length; i++){
                        general_lobby.push(d_list[i]);
                        io.to(d_list[i]).emit("current_room", {room: "general_lobby", rooms:s_list, ban_status: false});
                    }
                    user_list.forEach(u => {
                        if(u.u_id == socket.id){
                            user_list.delete(u)
                        }
                        for(var i = 0; i< d_list.length;i++){
                            if(u.u_id == d_list[i]){
                                u.room = "general_lobby";
                            }
                        }
                    });
                }
                else{
                    check = [];
                    var i_list = []
                    server_rooms.forEach(r => {
                        check = r.mem_id;
                        for(var j = 0; j < check.length; i++){
                            if(check[j] == socket.id){
                                var index = r.mem_id.indexOf(socket.id);
                                r.mem_id.splice(index,1);
                                i_list = r.mem_id;
                                c_id = r.creator_id;
                            }
                        }
                    });

                    var display = ""
                    var c_list = [];
                    user_list.forEach(u => {
                        for(var i = 0; i<i_list.length;i++){
                            if(u.u_id==i_list[i]){
                                if(i_list[i] == c_id){
                                    var c_display = "Creator: " + u.display
                                    c_list.push(c_display)
                                }
                                else{
                                    c_list.push(u.display);
                                }
                            }
                        }
                    });
                    user_list.forEach(u => {
                        if(u.u_id == socket.id){
                            display = u.display;
                            room_name = u.room;
                            user_list.delete(u)
                        }
                    });
                    var message = " disconnnected";
                    io.to(room_name).emit("someone_left", {name: display, message:message});
                    io.to(room_name).emit("current_room", {room: room_name, chatters:c_list,})
                    io.to(c_id).emit("show_change_pass");
                }
            }
            else{
                var index = general_lobby.indexOf(socket.id);
                general_lobby.splice(index, 1)
            }
        
});

});



