// var currentMonth = new Month();
// var username = "";
var events = [];
var session_token = ""

class eventL {
    eventL(eventid, eventname, date, username){
        this.event_id = eventid;
        this.event_name = eventname;
        this.date = date;
        // this.time = duration;
        this.username = username;
        // this.event_description = event_description;
        // this.duration = duration;
    }
    get getID(){
      return this.event_id;
    }
}

function getCalendar(date, month, year ){
    var events = [];
    const data = {'date' : date, 'month' : month, 'year' : year};
    console.log(data);
    fetch("getevents.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(response =>{
            var status = response.success;
            if(status){

                let event_names = response.event_names;
                let event_dates = response.event_dates;
                let user = response.username;
                let event_times = response.event_times;
                // let event_duration = data.event_duration;
                // let event_description = data.event_description;
                let event_id = response.event_id;
                console.log(event_times[0]);
                for(i = 0; i < event_names.length; i++){

                  //  events.push(new eventL(String(event_id[i]), String(event_names[i]), String(event_dates[i]), String(user)));
                  document.getElementById('result').innerHTML += `<b> ${event_id[i]} <br> ${event_names[i]} <br> ${event_dates[i]} <br> ${event_times[i]}  <br> </b>`; 

                   
                   //events.push(0);
                }

            }
        });
        
}


function editCalendar(event){

    const event_id = document.getElementById("edit_event_id").value;
    const new_event_time = document.getElementById("new_event_time").value;
    const new_name = document.getElementById("new_name").value;
    const new_date = document.getElementById("new_date").value;

    const data = {'event_id' : event_id, 'new_name' : new_name,  'new_date' : new_date, 'new_event_time' : new_event_time, 'token' : session_token};

    fetch("editevents.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json());
        // .then(data => console.log(data.success ? "Event edited" : 'Edit failed${data.message}'));
        //console.log("events array is " + events.length);
}

function deleteCalendar(event){
    const event_id = document.getElementById("delete_event_id").value; // Get the username from the form
    

    const data = {'event_id' : event_id , 'token' : session_token};

    console.log(data);
    fetch("deleteevent.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        //.then(data => console.log(data.success ? "Event deleted" : 'Delete failed${data.message}'));
        //console.log("events array is " + events.length);
}

window.onload = function(event){
    fetch("refresh.php", {
        method: 'POST',
        headers: { 'content-type': 'application/json' }
    })
    .then(response => response.json())
    .then(response =>{ 
        
        var status = response.success;
        console.log(status);
        console.log(status ? "You are still logged in!" : `You were not logged in ${response.message}`);
        if (status == true){
            document.getElementById("login_form").style.display = "none";
            document.getElementById("register_form").style.display = "none";
            document.getElementById("logout_form").style.display = "block";
            document.getElementById("event_form").style.display = "block";
            document.getElementById("delete_form").style.display = "block";
            document.getElementById("edit_form").style.display = "block";
            document.getElementById("share_form").style.display = "block";
        }
    });
}

function loginCalendar(event) {
    const username = document.getElementById("username").value; // Get the username from the form

    const password = document.getElementById("password").value; // Get the password from the form

    // Make a URL-encoded string for passing POST data:
    const data = { 'username': username, 'password': password };

    fetch("login.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        //.then(data => console.log(data))
        //.then(data => console.log(data.success ? "You've been logged in!" : `You were not logged in ${data.message}`))
        .then(data =>{
            var succ = data.success;
            console.log(succ ? "You've been logged in!" : `You were not logged in ${data.message}`);
            if (succ == true){
                session_token = data.token;
                document.getElementById("login_form").style.display = "none";
                document.getElementById("register_form").style.display = "none";
                document.getElementById("logout_form").style.display = "block";
                document.getElementById("event_form").style.display = "block";
                document.getElementById("delete_form").style.display = "block";
                document.getElementById("edit_form").style.display = "block";
                document.getElementById("share_form").style.display = "block";
            }
        });
        //.then(data => data.success ? document.getElementById("register_form").style.display = "none" : document.getElementById("register_form").style.display = "block");
        //.catch(err => console.error(err));
}

// function RcallBack(event) {
//     var jsonData = JSON.parse(event.target.responseText);
//     if(jsonData.success === true){
//             alert(jsonData.message);
//             document.getElementById("register_btn").style.display="none";
            
//     }
//     else{
//             alert(jsonData.message);
//     }
    
// }

function register(event) {
    const new_user= document.getElementById("new_user").value; // Get the username from the form
    const new_pass = document.getElementById("new_pass").value; // Get the password from the form

    // console.log("got user input");
    // var dataString = "username=" + encodeURIComponent(new_user) + "&password=" + encodeURIComponent(new_pass);
    // var xmlHttp = new XMLHttpRequest();
    // xmlHttp.open("POST", "register.php", true);
    // xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // xmlHttp.addEventListener("load", RcallBack,false);
    // xmlHttp.send(dataString);

    // console.log("created xml instance");
    // // Make a URL-encoded string for passing POST data:
    const data = { 'new_user': new_user, 'new_pass': new_pass };

    fetch("register.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => console.log(data.success ? "You are registered" : `Register failed${data.message}`))
        //.catch(err => console.error(err));

}
function create_event(event){
    const event_name = document.getElementById("event_name").value; // Get the username from the form
    const date = document.getElementById("date").value;
    const time = document.getElementById("event_time").value;
    const token = document.getElementById("token").value;
    
    const data = { 'event_name': event_name, 'date': date , 'time' : time, 'token' : token};
    fetch("createevent.php", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json'}
    })
    // .then(response => response.json())
    // .then(response =>{console.log(response)});
}

function logout(event) {
  session_token = "";
  document.getElementById('result').replaceChildren();
    fetch("logout.php", {
        })
        //.then(data => console.log(data))
        //.then(data => console.log(data.success ? "You've been logged in!" : `You were not logged in ${data.message}`))
        .then(document.getElementById("login_form").style.display = "block")
        .then(document.getElementById("register_form").style.display = "block")      
        .then( document.getElementById("logout_form").style.display = "none")
        .then( document.getElementById("delete_form").style.display = "none")
        .then( document.getElementById("edit_form").style.display = "none")
        .then(document.getElementById("event_form").style.display = "none")
        .then(document.getElementById("share_form").style.display = "none");
        //.then(data => data.success ? document.getElementById("register_form").style.display = "none" : document.getElementById("register_form").style.display = "block");
        //.catch(err => console.error(err));
}

function share(event){
  const share_user = document.getElementById("share_user").value;
  const data = { 'share_user' : share_user};
  fetch("share.php", {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'content-type': 'application/json'}
  })
}


document.getElementById("login_btn").addEventListener("click", loginCalendar, false);
document.getElementById("register_btn").addEventListener("click",  register, false);
document.getElementById("event_btn").addEventListener("click", create_event, false);
document.getElementById("delete_btn").addEventListener("click", deleteCalendar, false);
document.getElementById("edit_btn").addEventListener("click", editCalendar, false);
document.getElementById("logout_btn").addEventListener("click", logout, false);
document.getElementById("share_btn").addEventListener("click", share, false);
document.getElementById("logout_form").style.display = "none";
document.getElementById("event_form").style.display = "none";
document.getElementById("delete_form").style.display = "none";
document.getElementById("edit_form").style.display = "none";
document.getElementById("share_form").style.display = "none";

// var el = document.getElementById("register_btn");
// console.log("start");
// if(el){

//     el.addEventListener("click", register, false);
//     console.log("if statement");
// }

// Starting off with a date
const date = new Date();

// Method to load up calendar on boot
const load_calendar = () => {
  date.setDate(1);



  

// Gets the end of the month
  const end_month_date = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  // Getting the DOM of html associated with div num_days
  const num_days = document.querySelector(".num_days");
  const start_month_day = date.getDay();

//Gets the end of the month of the previous month when you change months
  const prev_end_month = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
  const year = date.getFullYear();
  

  const end_month_day = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();

  const next_month_days = 7 - end_month_day - 1;

  const calendar_months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  document.querySelector(".date h1").innerHTML = calendar_months[date.getMonth()] + " " + year;

  //document.querySelector(".date p").innerHTML = new Date().toDateString();

  let calendar_days = "";

  for (let x = start_month_day; x > 0; x--) {
    calendar_days += `<div class="prev-date">${prev_end_month - x + 1}</div>`;
  }

  for (let i = 1; i <= end_month_date; i++) {
    if (i === new Date().getDate() && date.getMonth() === new Date().getMonth()) {
       calendar_days += `<div id = '${i}' class="day">${i}</div>`;
    } else {
      calendar_days += `<div id = '${i}' class = "day">${i}</div>`;
    }
  }

  for (let j = 1; j <= next_month_days; j++) {
    calendar_days += `<div class="next-date">${j}</div>`;
  }
  num_days.innerHTML = calendar_days;

};

// function reloadCalendar() {

// }

document.querySelector(".prev_month").addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  load_calendar();
});

document.querySelector(".next_month").addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  load_calendar();
});

load_calendar();

// const current_days = document.getElementsByClassName("day");

// const day_clicked = d =>{
//   getCalendar((d.target.id, String(parseInt(new Date().getMonth()) + 1), new Date().getFullYear()));

//   for(let i = 0; i < events.length; i++){
//     result.innerHTML() += `<b> ${events[i].id} <br> ${events[i].event_name} <br> ${events[i].date} </b>`;

//   }
//   console.log('show evernts 2');
// }

// for (let day of current_days){
//   document.addEventListener("click", day_clicked);
// }



document.querySelector(".num_days").addEventListener("click", (d)=> {
  document.getElementById('result').replaceChildren();

  let day = d.target.id;
  // console.log(events);
  if (day !== '') {
      getCalendar(day,date.getMonth()+1, date.getFullYear());
      // console.log("after get calendar");
      // console.log(events);
      // console.log(String(events[0].event_id));
      // console.log(events[0].event_name);
      // console.log(String(events[0].date));
      // console.log(events[0].username);
      // for(let i = 0; i < events.length; i++){
      //   result.innerHTML() += `<b> ${events[i].id} <br> ${events[i].event_name} <br> ${events[i].date} </b>`;

      // }
  }
});