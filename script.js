// ======================================
// WEATHER PRO
// WEATHERAPI.COM VERSION
// PART 1
// ======================================


const API_KEY = "1a0421e0a5b5919b5c3123f652d859b0";

const BASE_URL ="https://www.weatherapi.com/my/";


let currentWeatherData = null;


// DOM

const cityInput =
document.getElementById("cityInput");


const searchBtn =
document.getElementById("searchBtn");


const locationBtn =
document.getElementById("locationBtn");


const themeBtn =
document.getElementById("themeBtn");


const voiceBtn =
document.getElementById("voiceBtn");


const loadingScreen =
document.getElementById("loadingScreen");




// SEARCH

searchBtn.onclick=()=>{


let city =
cityInput.value.trim();


if(city){

getWeather(city);

}


};



cityInput.addEventListener(
"keypress",
e=>{


if(e.key==="Enter"){

getWeather(
cityInput.value
);

}


});





// WEATHER API CALL


async function getWeather(city){


showLoading();



try{


let url =

`${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=5&aqi=yes&alerts=yes`;



let res =
await fetch(url);



let data =
await res.json();



if(data.error){


alert(
data.error.message
);


return;


}



currentWeatherData=data;



updateWeather(data);



updateForecast(data);



updateAQI(data);



saveHistory(city);



}


catch(error){


console.log(error);


alert(
"Weather API Error"
);


}


finally{


hideLoading();


}


}







// GPS


locationBtn.onclick=()=>{


navigator.geolocation.getCurrentPosition(

pos=>{


let lat =
pos.coords.latitude;


let lon =
pos.coords.longitude;



getWeather(
`${lat},${lon}`
);



},

()=>{


alert(
"GPS permission denied"
);


}

);


};







// DISPLAY WEATHER


function updateWeather(data){



let c =
data.current;


let l =
data.location;



document
.getElementById("cityName")
.innerHTML =

`${l.name}, ${l.country}`;



document
.getElementById("temperature")
.innerHTML =

Math.round(c.temp_c)
+"°C";



document
.getElementById("condition")
.innerHTML =

c.condition.text;



document
.getElementById("weatherIcon")
.src =

"https:"+c.condition.icon;



document
.getElementById("feels")
.innerHTML =

Math.round(c.feelslike_c)
+"°C";



document
.getElementById("humidity")
.innerHTML =

c.humidity+"%";



document
.getElementById("wind")
.innerHTML =

c.wind_kph+
" km/h";



document
.getElementById("visibility")
.innerHTML =

c.vis_km+
" km";



document
.getElementById("pressure")
.innerHTML =

c.pressure_mb+
" hPa";



document
.getElementById("clouds")
.innerHTML =

c.cloud+"%";



document
.getElementById("sunrise")
.innerHTML =

data.forecast.forecastday[0]
.astro.sunrise;



document
.getElementById("sunset")
.innerHTML =

data.forecast.forecastday[0]
.astro.sunset;



updateStatus(
"🌤 "+c.condition.text
);


}
// ======================================
// WEATHER PRO
// PART 2
// ======================================



// ======================================
// FORECAST
// ======================================


function updateForecast(data){


let box =
document.getElementById(
"forecastContainer"
);



box.innerHTML="";



data.forecast.forecastday
.forEach(day=>{


let date =
new Date(day.date)
.toLocaleDateString(
"en-US",
{
weekday:"short"
}
);



box.innerHTML += `

<div class="forecast-card glass">

<h3>
${date}
</h3>


<img src="https:${day.day.condition.icon}">


<h2>
${Math.round(day.day.avgtemp_c)}°C
</h2>


<p>
${day.day.condition.text}
</p>


</div>

`;

});


updateHourly(data);

createCharts(data);

}







// ======================================
// HOURLY FORECAST
// ======================================


function updateHourly(data){


let box =
document.getElementById(
"hourlyContainer"
);



box.innerHTML="";



let hours =
data.forecast.forecastday[0].hour;



hours.slice(0,12)
.forEach(hour=>{


let time =
new Date(hour.time)
.toLocaleTimeString(
[],
{
hour:"2-digit"
}
);



box.innerHTML += `


<div class="hour-card glass">


<h3>
${time}
</h3>


<img src="https:${hour.condition.icon}">


<h2>
${Math.round(hour.temp_c)}°C
</h2>


<p>
${hour.condition.text}
</p>


</div>


`;

});


}








// ======================================
// AIR QUALITY
// ======================================


function updateAQI(data){



if(!data.current.air_quality){

return;

}



let pm25 =
data.current.air_quality.pm2_5;



let result;



if(pm25 < 12){

result="Good";

}

else if(pm25 < 35){

result="Fair";

}

else if(pm25 < 55){

result="Moderate";

}

else{

result="Poor";

}



document
.getElementById("aqi")
.innerHTML =
result;



}









// ======================================
// WIND DATA
// ======================================


function updateWind(data){



let wind =
data.current;



document
.getElementById("windSpeed")
.innerHTML =

wind.wind_kph+
" km/h";



document
.getElementById("windDirection")
.innerHTML =

wind.wind_dir;



document
.getElementById("compass")
.innerHTML =

wind.wind_degree+
"°";



}









// ======================================
// WEATHER ADVICE
// ======================================


function smartAdvice(data){


let tips=[];


let temp =
data.current.temp_c;


let humidity =
data.current.humidity;



let condition =
data.current.condition.text
.toLowerCase();





if(temp>35)

tips.push(
"🔥 Hot weather. Drink more water."
);



if(temp<15)

tips.push(
"🧥 Cold weather. Wear warm clothes."
);



if(humidity>80)

tips.push(
"💧 High humidity."
);



if(condition.includes("rain"))

tips.push(
"☔ Carry umbrella."
);



if(condition.includes("sun"))

tips.push(
"🌞 Use sunscreen."
);



if(tips.length===0)

tips.push(
"✅ Weather is comfortable."
);





document
.getElementById("adviceList")
.innerHTML =


tips.map(
x=>`<li>${x}</li>`
)
.join("");



}









// ======================================
// CHARTS
// ======================================


let tempChart;

let humidityChart;

let windChart;



function createCharts(data){


let labels=[];

let temp=[];

let humidity=[];

let wind=[];



let hours =
data.forecast.forecastday[0].hour;




hours.slice(0,12)
.forEach(item=>{


labels.push(

new Date(item.time)
.toLocaleTimeString(
[],
{
hour:"2-digit"
}

)

);



temp.push(
Math.round(item.temp_c)
);



humidity.push(
item.humidity
);



wind.push(
item.wind_kph
);



});





if(tempChart)
tempChart.destroy();


if(humidityChart)
humidityChart.destroy();


if(windChart)
windChart.destroy();






tempChart =
new Chart(

document.getElementById(
"temperatureChart"
),

{


type:"line",

data:{


labels:labels,


datasets:[{

label:"Temperature °C",

data:temp,

borderWidth:3

}]


}


}

);








humidityChart =
new Chart(

document.getElementById(
"humidityChart"
),

{


type:"bar",

data:{


labels:labels,


datasets:[{

label:"Humidity %",

data:humidity,

borderWidth:2

}]


}


}

);








windChart =
new Chart(

document.getElementById(
"windChart"
),

{


type:"line",

data:{


labels:labels,


datasets:[{

label:"Wind km/h",

data:wind,

borderWidth:3

}]


}


}

);



}







// ======================================
// LOADING
// ======================================


function showLoading(){


if(loadingScreen)

loadingScreen.style.display =
"flex";


}



function hideLoading(){


if(loadingScreen)

loadingScreen.style.display =
"none";


}






// ======================================
// STATUS
// ======================================


function updateStatus(text){


let badge =
document.getElementById(
"statusBadge"
);



if(badge)

badge.innerHTML=text;


}
// ======================================
// WEATHER PRO
// PART 3
// ======================================


// ======================================
// DARK MODE
// ======================================


themeBtn.onclick=()=>{


document.body.classList.toggle(
"dark"
);



let dark =
document.body.classList.contains(
"dark"
);



localStorage.setItem(
"darkMode",
dark
);



themeBtn.innerHTML =
dark ? "☀️" : "🌙";


};





// AUTO LOAD

window.onload=()=>{


let dark =
localStorage.getItem(
"darkMode"
);



if(dark==="true"){


document.body.classList.add(
"dark"
);


themeBtn.innerHTML="☀️";


}



loadFavorites();

showHistory();


};









// ======================================
// FAVORITE SYSTEM
// ======================================



function saveFavorite(city){


let fav =

JSON.parse(
localStorage.getItem(
"favorites"
)

)||[];




if(!fav.includes(city)){


fav.push(city);


localStorage.setItem(

"favorites",

JSON.stringify(fav)

);


}



loadFavorites();


}








function loadFavorites(){



let fav =

JSON.parse(
localStorage.getItem(
"favorites"
)

)||[];




let box =
document.querySelector(
".favorite-buttons"
);



if(!box)
return;



box.innerHTML="";



fav.forEach(city=>{


box.innerHTML += `


<button onclick="getWeather('${city}')">

${city}

</button>


`;


});


}









// ADD FAVORITE BUTTON


let favButton =
document.createElement(
"button"
);



favButton.innerHTML =
"❤️ Add Favorite";



favButton.onclick=()=>{


if(currentWeatherData){


saveFavorite(

currentWeatherData.location.name

);


alert(
"Added ❤️"
);


}


};



document
.querySelector(
".current-weather"
)
.appendChild(
favButton
);









// ======================================
// HISTORY
// ======================================


function saveHistory(city){



let history =

JSON.parse(
localStorage.getItem(
"history"
)

)||[];




history.unshift(city);



history =
[
...new Set(history)
]
.slice(0,5);




localStorage.setItem(

"history",

JSON.stringify(history)

);



showHistory();


}








function showHistory(){



let history =

JSON.parse(
localStorage.getItem(
"history"
)

)||[];




let list =
document.getElementById(
"historyList"
);



if(!list)
return;



list.innerHTML="";



history.forEach(city=>{


list.innerHTML += `


<li onclick="getWeather('${city}')">

${city}

</li>


`;


});


}









// ======================================
// VOICE SEARCH
// ======================================


voiceBtn.onclick=()=>{


let SpeechRecognition =

window.SpeechRecognition ||

window.webkitSpeechRecognition;



if(!SpeechRecognition){


alert(
"Voice not supported"
);


return;


}




let voice =
new SpeechRecognition();



voice.start();





voice.onresult=(e)=>{


let text =

e.results[0][0]
.transcript;



cityInput.value=text;



getWeather(text);



};



};









// ======================================
// WEATHER EFFECTS
// ======================================


function weatherEffect(condition){


let bg =
document.querySelector(
".weather-bg"
);



if(!bg)
return;



bg.innerHTML="";



condition =
condition.toLowerCase();




if(condition.includes("rain")){


rainEffect();


}

else if(condition.includes("cloud")){


cloudEffect();


}

else{


sunEffect();


}


}








function rainEffect(){


let bg =
document.querySelector(
".weather-bg"
);



for(let i=0;i<100;i++){


let drop =
document.createElement(
"span"
);



drop.innerHTML="💧";


drop.style.position="absolute";


drop.style.left =
Math.random()*100+"%";


drop.style.top =
"-20px";


drop.style.animation =
"rainFall 2s linear infinite";


bg.appendChild(drop);


}


}








function cloudEffect(){


let bg =
document.querySelector(
".weather-bg"
);



let cloud =
document.createElement(
"div"
);



cloud.innerHTML =
"☁️☁️☁️";



cloud.style.fontSize =
"120px";



cloud.style.position =
"absolute";



cloud.style.top =
"20%";



cloud.style.left =
"20%";



bg.appendChild(cloud);


}








function sunEffect(){


let bg =
document.querySelector(
".weather-bg"
);



let sun =
document.createElement(
"div"
);



sun.innerHTML =
"☀️";



sun.style.fontSize =
"150px";



sun.style.position =
"absolute";



sun.style.right =
"10%";



sun.style.top =
"10%";



bg.appendChild(sun);


}









// ======================================
// COPY REPORT
// ======================================


document
.getElementById(
"copyBtn"
)
.onclick=()=>{


if(!currentWeatherData)
return;



let d =
currentWeatherData;



let text =


`
Weather Report

Location:
${d.location.name}

Temperature:
${d.current.temp_c}°C

Condition:
${d.current.condition.text}

Humidity:
${d.current.humidity}%

Wind:
${d.current.wind_kph} km/h

`;




navigator.clipboard.writeText(
text
);



alert(
"Copied!"
);


};









// ======================================
// SHARE
// ======================================


document
.getElementById(
"shareBtn"
)
.onclick=()=>{


if(navigator.share){


navigator.share({

title:
"Weather Report",

text:
createReport()

});


}


};









function createReport(){


if(!currentWeatherData)

return "";



let d =
currentWeatherData;



return `

${d.location.name}

${d.current.temp_c}°C

${d.current.condition.text}

Humidity:
${d.current.humidity}%

`;



}









// ======================================
// DOWNLOAD
// ======================================


document
.getElementById(
"downloadBtn"
)
.onclick=()=>{


let file =
new Blob(

[
createReport()

],

{
type:"text/plain"
}

);



let a =
document.createElement(
"a"
);



a.href =
URL.createObjectURL(
file
);



a.download =
"weather-report.txt";



a.click();


};









// ======================================
// PRINT
// ======================================


document
.getElementById(
"printBtn"
)
.onclick=()=>{


window.print();


};








// ======================================
// ONLINE STATUS
// ======================================


window.addEventListener(
"offline",
()=>{


alert(
"⚠ Internet disconnected"
);


});



window.addEventListener(
"online",
()=>{


console.log(
"Internet restored"
);


});








// ======================================
// CONNECT ALL FUNCTIONS
// ======================================


let oldUpdateWeather =
updateWeather;



updateWeather=function(data){


oldUpdateWeather(data);



updateWind(data);


smartAdvice(data);


weatherEffect(
data.current.condition.text
);


};





console.log(
"🌦 Weather Pro Ready"
);
