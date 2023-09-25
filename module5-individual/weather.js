function fetchWeather(){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "https://classes.engineering.wustl.edu/cse330/content/weather_json.php", true);
    xmlHttp.addEventListener("load", refresh, false);
    xmlHttp.send(null);
}

function refresh(event) {
    var jsonData = JSON.parse(event.target.responseText);
    var current_location = document.getElementById("weatherWidget").getElementsByClassName("weather-loc")[0];
    var current_state = jsonData.location.state;
    var current_city = jsonData.location.city;

    current_location.innerHTML = "<strong>" + current_city + "</strong> " + current_state;
    
    var actual_humidity = jsonData.atmosphere.humidity;
    var humidity = document.getElementById("weatherWidget").getElementsByClassName("weather-humidity")[0];
    
    humidity.innerHTML = actual_humidity;
    
    var actual_temp = jsonData.current.temp;
    var temp = document.getElementsByClassName("weather-temp")[0];
    temp.innerHTML = actual_temp;
    document.getElementsByClassName("weather-tomorrow")[0].src = "http://us.yimg.com/i/us/nws/weather/gr/" + jsonData.dayafter.code + "ds.png";
    document.getElementsByClassName("weather-dayaftertomorrow")[0].src = "http://us.yimg.com/i/us/nws/weather/gr/" + jsonData.tomorrow.code + "ds.png";
   
}

document.addEventListener("DOMContentLoaded", fetchWeather, false);

document.getElementById("get_weather").addEventListener("click",fetchWeather,false);