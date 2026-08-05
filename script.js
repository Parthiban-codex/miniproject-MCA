
// ======================================
// WEATHER PRO APP - JAVASCRIPT
// PART 3A
// ======================================


// OpenWeather API Key
// Replace with your own API key

const API_KEY = "1a0421e0a5b5919b5c3123f652d859b0";


// Elements

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");

const weatherIcon = document.getElementById("weatherIcon");

const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");

const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");

const loading = document.getElementById("loading");
const errorBox = document.getElementById("errorBox");




// ======================================
// SEARCH BUTTON
// ======================================


searchBtn.addEventListener("click",()=>{


    let city = cityInput.value.trim();


    if(city !== ""){

        getWeather(city);

    }


});




// ======================================
// ENTER KEY SEARCH
// ======================================


cityInput.addEventListener("keypress",(e)=>{


    if(e.key === "Enter"){


        let city = cityInput.value.trim();


        if(city !== ""){


            getWeather(city);


        }


    }


});





// ======================================
// GET WEATHER DATA
// ======================================


async function getWeather(city){


    showLoading();



    try{


        const url =

        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;



        const response = await fetch(url);



        if(!response.ok){


            throw new Error("City not found");


        }



        const data = await response.json();



        displayWeather(data);



        saveHistory(city);



    }


    catch(error){


        showError();


    }



    hideLoading();


}






// ======================================
// DISPLAY WEATHER
// ======================================


function displayWeather(data){



    cityName.innerHTML =

    `<i class="fa-solid fa-location-dot"></i>
    ${data.name}`;



    temperature.innerHTML =

    `${Math.round(data.main.temp)}°C`;



    description.innerHTML =

    data.weather[0].description;



    feelsLike.innerHTML =

    `${data.main.feels_like}°C`;



    humidity.innerHTML =

    `${data.main.humidity}%`;



    wind.innerHTML =

    `${data.wind.speed} m/s`;



    pressure.innerHTML =

    `${data.main.pressure} hPa`;



    visibility.innerHTML =

    `${data.visibility/1000} km`;




    // Weather Icon


    weatherIcon.src =

    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;





    // Sunrise Sunset


    sunrise.innerHTML =

    convertTime(data.sys.sunrise);



    sunset.innerHTML =

    convertTime(data.sys.sunset);



}






// ======================================
// TIME CONVERSION
// ======================================


function convertTime(timestamp){


    let date = new Date(timestamp*1000);


    return date.toLocaleTimeString([],{

        hour:"2-digit",

        minute:"2-digit"

    });


}






// ======================================
// LOADING
// ======================================


function showLoading(){


    loading.style.display="flex";


}



function hideLoading(){


    loading.style.display="none";


}







// ======================================
// ERROR
// ======================================


function showError(){


    errorBox.style.display="flex";



    setTimeout(()=>{


        errorBox.style.display="none";


    },3000);



}






// ======================================
// LIVE DATE AND CLOCK
// ======================================


function updateClock(){


    let now = new Date();


    document.getElementById("currentDate").innerHTML =

    now.toDateString();



    document.getElementById("currentTime").innerHTML =

    now.toLocaleTimeString();



}



setInterval(updateClock,1000);


updateClock();


// ======================================
// PART 3B
// ======================================



// ======================================
// DOWNLOAD WEATHER REPORT
// ======================================


const downloadBtn = document.getElementById("downloadBtn");


downloadBtn.addEventListener("click",()=>{


const report = `

WEATHER REPORT
======================

City:
${cityName.innerText}


Temperature:
${temperature.innerText}


Weather:
${description.innerText}


Feels Like:
${feelsLike.innerText}


Humidity:
${humidity.innerText}


Wind:
${wind.innerText}


Pressure:
${pressure.innerText}


Visibility:
${visibility.innerText}


Sunrise:
${sunrise.innerText}


Sunset:
${sunset.innerText}


Generated by WeatherPro

`;



const blob = new Blob(
    [report],
    {
        type:"text/plain"
    }
);



const link=document.createElement("a");


link.href=URL.createObjectURL(blob);


link.download="Weather_Report.txt";


link.click();



});








// ======================================
// DARK / LIGHT MODE
// ======================================



const themeBtn=document.getElementById("themeBtn");



themeBtn.addEventListener("click",()=>{


document.body.classList.toggle("dark");



if(document.body.classList.contains("dark")){


themeBtn.innerHTML=
`
<i class="fa-solid fa-sun"></i>
`;



localStorage.setItem(
"theme",
"dark"
);



}

else{


themeBtn.innerHTML=
`
<i class="fa-solid fa-moon"></i>
`;



localStorage.setItem(
"theme",
"light"
);



}



});




// Load Theme


if(localStorage.getItem("theme")==="dark"){


document.body.classList.add("dark");


themeBtn.innerHTML=
`
<i class="fa-solid fa-sun"></i>
`;



}









// ======================================
// CELSIUS / FAHRENHEIT
// ======================================



const unitBtn =
document.getElementById("unitBtn");


let currentTemp = null;


let celsius=true;



unitBtn.addEventListener("click",()=>{


if(currentTemp===null){

return;

}



if(celsius){


temperature.innerHTML =

`${Math.round(
(currentTemp*9/5)+32
)}°F`;



celsius=false;


}

else{


temperature.innerHTML =

`${Math.round(currentTemp)}°C`;


celsius=true;


}


});







// Save temperature


const oldDisplayWeather = displayWeather;



displayWeather=function(data){


currentTemp=data.main.temp;


oldDisplayWeather(data);


};









// ======================================
// SEARCH HISTORY
// ======================================



function saveHistory(city){



let history =

JSON.parse(
localStorage.getItem("history")
)
|| [];




history = history.filter(
item=>item!==city
);



history.unshift(city);



history = history.slice(0,5);



localStorage.setItem(
"history",
JSON.stringify(history)
);



showHistory();



}





function showHistory(){



const list =
document.getElementById("historyList");



if(!list)return;



let history =

JSON.parse(
localStorage.getItem("history")
)
|| [];



list.innerHTML="";



history.forEach(city=>{


let li=document.createElement("li");


li.innerHTML=

`
<i class="fa-solid fa-clock"></i>
${city}
`;



li.onclick=()=>{


getWeather(city);


};



list.appendChild(li);



});


}



showHistory();









// ======================================
// FAVORITE CITIES
// ======================================



const favoriteBtn =
document.getElementById("favoriteBtn");




favoriteBtn.addEventListener("click",()=>{


let city =
cityName.innerText.replace(
"City Name",
""
).trim();



if(!city)return;



let favorites =

JSON.parse(
localStorage.getItem("favorites")
)
|| [];



if(!favorites.includes(city)){


favorites.push(city);



localStorage.setItem(
"favorites",
JSON.stringify(favorites)
);



showFavorites();


}



});







function showFavorites(){



const list =
document.getElementById("favoriteList");



if(!list)return;



let favorites =

JSON.parse(
localStorage.getItem("favorites")
)
|| [];



list.innerHTML="";



favorites.forEach(city=>{


let li=document.createElement("li");



li.innerHTML=

`
<i class="fa-solid fa-star"></i>
${city}
`;



li.onclick=()=>{


getWeather(city);


};



list.appendChild(li);



});


}



showFavorites();










// ======================================
// VOICE SEARCH
// ======================================



const voiceBtn =
document.getElementById("voiceBtn");



voiceBtn.addEventListener("click",()=>{



if(!("webkitSpeechRecognition" in window)){


alert(
"Voice search not supported"
);


return;


}



const recognition =
new webkitSpeechRecognition();



recognition.lang="en-US";



recognition.start();




recognition.onresult=(event)=>{


let voiceText =

event.results[0][0].transcript;



cityInput.value =
voiceText;



getWeather(voiceText);



};



});


// ======================================
// PART 3C
// ======================================



let weatherChart;



// ======================================
// EXTEND WEATHER DISPLAY
// ======================================


const oldDisplayWeather2 = displayWeather;



displayWeather = function(data){


    oldDisplayWeather2(data);


    loadForecast(
        data.coord.lat,
        data.coord.lon
    );


    loadAQI(
        data.coord.lat,
        data.coord.lon
    );


    generateAdvice(data);



};







// ======================================
// 24 HOUR + WEEK FORECAST
// ======================================



async function loadForecast(lat,lon){


try{


const url =

`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;



const response =
await fetch(url);



const data =
await response.json();




displayHourly(data.list);



displayWeekly(data.list);



createChart(data.list);



}

catch(error){


console.log(error);


}



}








// ======================================
// HOURLY FORECAST
// ======================================



function displayHourly(list){


const box =
document.getElementById(
"hourlyForecast"
);



if(!box)return;



box.innerHTML="";



list.slice(0,8).forEach(item=>{



let time =
new Date(
item.dt*1000
)
.toLocaleTimeString([],{
hour:"2-digit"
});



let card=document.createElement("div");



card.className=
"hour-card glass";



card.innerHTML=

`

<h3>${time}</h3>

<img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png">

<h2>${Math.round(item.main.temp)}°C</h2>

<p>${item.weather[0].description}</p>

`;



box.appendChild(card);



});


}









// ======================================
// WEEKLY FORECAST
// ======================================



function displayWeekly(list){


const box =
document.getElementById(
"weeklyForecast"
);



if(!box)return;



box.innerHTML="";



let days={};



list.forEach(item=>{


let date =
new Date(item.dt*1000)
.toDateString();



if(!days[date]){


days[date]=item;



}


});



Object.values(days)
.slice(0,6)
.forEach(item=>{


let day =
new Date(item.dt*1000)
.toLocaleDateString(
"en-US",
{
weekday:"long"
}
);



let card=document.createElement("div");



card.className=
"day-card glass";



card.innerHTML=

`

<h3>${day}</h3>

<img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png">

<h2>
${Math.round(item.main.temp)}°C
</h2>

<p>
${item.weather[0].description}
</p>

`;



box.appendChild(card);



});



}









// ======================================
// AQI
// ======================================



async function loadAQI(lat,lon){



try{


const url=

`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;



const response =
await fetch(url);



const data =
await response.json();



let value =
data.list[0].main.aqi;



document.getElementById(
"aqi"
).innerHTML=value;




// simple UV placeholder

document.getElementById(
"uv"
).innerHTML=
Math.floor(Math.random()*10);



document.getElementById(
"comfort"
).innerHTML=
Math.floor(Math.random()*30)+70;



}

catch(error){

console.log(error);

}


}








// ======================================
// WEATHER CHART
// ======================================



function createChart(list){



const ctx =
document.getElementById(
"weatherChart"
);



if(!ctx)return;



let labels=[];

let temps=[];



list.slice(0,8)
.forEach(item=>{


labels.push(

new Date(item.dt*1000)
.getHours()+"h"

);



temps.push(
item.main.temp
);



});



if(weatherChart){

weatherChart.destroy();

}



weatherChart =
new Chart(ctx,{


type:"line",


data:{


labels:labels,


datasets:[{

label:"Temperature °C",

data:temps,


borderColor:"#ffd43b",

backgroundColor:
"rgba(255,212,59,.3)",


fill:true,


tension:.4



}]


},



options:{


responsive:true


}



});



}








// ======================================
// SMART WEATHER ADVICE
// ======================================



function generateAdvice(data){



let temp =
data.main.temp;



let rain =
data.weather[0].main;



let clothing="";

let travel="";

let health="";

let exercise="";

let driving="";

let farming="";

let laundry="";






if(temp>35){


clothing=
"Wear light cotton clothes and stay hydrated.";


health=
"Drink more water and avoid strong sunlight.";


exercise=
"Exercise during morning or evening.";


}
else if(temp<15){


clothing=
"Wear warm clothes and jackets.";


health=
"Protect yourself from cold weather.";


exercise=
"Warm up before exercise.";


}

else{


clothing=
"Comfortable normal clothing is suitable.";


health=
"Weather conditions are comfortable.";


exercise=
"Good time for outdoor activities.";


}





if(rain==="Rain"){


travel=
"Carry an umbrella. Travel carefully.";


driving=
"Drive slowly due to wet roads.";


laundry=
"Indoor drying is recommended.";



}
else{


travel=
"Good conditions for travelling.";


driving=
"Normal driving conditions.";


laundry=
"Good day for outdoor drying.";


}




farming=
"Monitor soil moisture and weather changes.";






document.getElementById(
"clothingAdvice"
).innerHTML=clothing;



document.getElementById(
"travelAdvice"
).innerHTML=travel;



document.getElementById(
"healthAdvice"
).innerHTML=health;



document.getElementById(
"exerciseAdvice"
).innerHTML=exercise;



document.getElementById(
"drivingAdvice"
).innerHTML=driving;



document.getElementById(
"farmingAdvice"
).innerHTML=farming;



document.getElementById(
"laundryAdvice"
).innerHTML=laundry;



document.getElementById(
"weatherFact"
).innerHTML=
"Weather changes because of temperature, pressure and moisture movement.";





}


// ======================================
// PART 3D
// FINAL JAVASCRIPT
// ======================================





// ======================================
// WEATHER EMOJI SYSTEM
// ======================================


function updateWeatherEmoji(condition){


const emoji =
document.getElementById(
"weatherEmoji"
);


const bigEmoji =
document.getElementById(
"bigEmoji"
);


let icon="☀️";


switch(condition){


case "Clear":

icon="☀️";

break;



case "Clouds":

icon="☁️";

break;



case "Rain":

icon="🌧️";

break;



case "Drizzle":

icon="🌦️";

break;



case "Thunderstorm":

icon="⛈️";

break;



case "Snow":

icon="❄️";

break;



default:

icon="🌤️";


}



if(emoji)

emoji.innerHTML=icon;



if(bigEmoji)

bigEmoji.innerHTML=icon;


}







// ======================================
// EXTEND WEATHER DISPLAY FOR EMOJI
// ======================================



const oldDisplayWeather3 =
displayWeather;



displayWeather=function(data){


oldDisplayWeather3(data);



updateWeatherEmoji(
data.weather[0].main
);



changeWeatherBackground(
data.weather[0].main
);



};









// ======================================
// DYNAMIC WEATHER BACKGROUND
// ======================================



function changeWeatherBackground(condition){



document.body.classList.remove(

"rain-weather",
"snow-weather",
"cloud-weather",
"thunder-weather"

);



switch(condition){


case "Rain":


document.body.classList.add(
"rain-weather"
);


createRain();


break;



case "Snow":


document.body.classList.add(
"snow-weather"
);


createSnow();


break;



case "Clouds":


document.body.classList.add(
"cloud-weather"
);


break;



case "Thunderstorm":


document.body.classList.add(
"thunder-weather"
);


createRain();


break;


default:


break;



}



}









// ======================================
// RAIN PARTICLES
// ======================================



function createRain(){



removeParticles();



let rain =
document.createElement(
"div"
);



rain.className="rain";



for(let i=0;i<80;i++){


let drop =
document.createElement(
"span"
);



drop.className="drop";



drop.style.left =
Math.random()*100+"%";



drop.style.animationDuration =
(0.5+
Math.random()*1)
+"s";



rain.appendChild(drop);



}



document.body.appendChild(rain);



}








// ======================================
// SNOW PARTICLES
// ======================================



function createSnow(){



removeParticles();



let snow =
document.createElement(
"div"
);



snow.className="snow";



for(let i=0;i<50;i++){



let flake =
document.createElement(
"span"
);



flake.className="flake";



flake.innerHTML="❄";



flake.style.left =
Math.random()*100+"%";



flake.style.animationDuration =
(3+
Math.random()*5)
+"s";



snow.appendChild(flake);



}



document.body.appendChild(snow);



}







function removeParticles(){


document.querySelectorAll(
".rain,.snow"
)
.forEach(e=>e.remove());


}









// ======================================
// SAVE LAST CITY
// ======================================



const oldGetWeather =
getWeather;



getWeather=function(city){



localStorage.setItem(
"lastCity",
city
);



oldGetWeather(city);



};








// ======================================
// LOAD LAST CITY
// ======================================



window.addEventListener(
"load",
()=>{


let lastCity =
localStorage.getItem(
"lastCity"
);



if(lastCity){


cityInput.value=
lastCity;



getWeather(lastCity);



}



});









// ======================================
// CONTACT FORM
// ======================================



const contactForm =
document.getElementById(
"contactForm"
);



if(contactForm){



contactForm.addEventListener(
"submit",
(e)=>{


e.preventDefault();



alert(
"Thank you! Your message has been received."
);



contactForm.reset();



});


}








// ======================================
// WEATHER FACTS
// ======================================



const facts=[


"Lightning can heat air around it five times hotter than the Sun's surface.",


"Clouds can hold millions of kilograms of water.",


"Rainbows appear when sunlight passes through water droplets.",


"Wind is caused by differences in air pressure.",


"Snowflakes have unique crystal patterns."

];


function randomFact(){


let fact =
facts[
Math.floor(
Math.random()*facts.length
)
];


let box =
document.getElementById(
"weatherFact"
);



if(box)

box.innerHTML=fact;


}



randomFact();









// ======================================
// START DEFAULT CITY
// ======================================



if(!localStorage.getItem("lastCity")){


getWeather("Chennai");


}
