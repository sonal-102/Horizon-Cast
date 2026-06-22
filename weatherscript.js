const links = document.querySelectorAll('.weekday-link');
const sections = document.querySelectorAll('[data-section]');

links.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    const day = link.getAttribute('data-day');

    // update active link styles
    links.forEach(l => {
      l.classList.remove('text-amber-400', 'underline','bg-slate-800/10','backdrop-blur-md','rounded-xl','border','border-slate-600');
      l.classList.add('hover:text-amber-400');
    });
    link.classList.add('text-amber-400', 'underline','bg-[#EEEAE3]-800/10','backdrop-blur-md');

    // show matching section, hide others
    sections.forEach(s => {
      if (s.getAttribute('data-section') === day) {
        s.classList.remove('hidden');
      } else {
        s.classList.add('hidden');
      }
    });


    
  });
});



//var store
// let currentWeatherDiv = document.getElementById('currentWeather');
// let hourlyWeatherDiv = document.getElementById('hourlyWeather');
// let dailyWeatherDiv = document.getElementById('dailyWeather');
//
// let date=document.getElementById('date');
// let temp=document.getElementById('temperature');
// let condition=document.getElementById('condition');
// let windSpeed=document.getElementById('windSpeed');
//fetch weather
let weathercodemap={
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy", 
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
  }

  let picturecodemap = {
  0: "clear-sky.png",
  1: "clear-sky.png",
  2: "partly-cloudy.png",
  3: "clouds.png",

  45: "fog.png",
  48: "fog.png",

  51: "drizzle.png",
  53: "drizzle.png",
  55: "drizzle.png",

  56: "freezing-rain.png",
  57: "freezing-rain.png",

  61: "rain.png",
  63: "rain.png",
  65: "heavy-rain.png",

  66: "freezing-rain.png",
  67: "freezing-rain.png",

  71: "snow.png",
  73: "snow.png",
  75: "heavy-snow.png",
  77: "snow.png",

  80: "rain-shower.png",
  81: "rain-shower.png",
  82: "heavy-rain.png",

  85: "snow-shower.png",
  86: "snow-shower.png",

  95: "thunderstorm.png",
  96: "thunderstorm.png",
  99: "thunderstorm.png"
};
async function fetchWeather(city,lat=null,lon=null) {
  try {
    if(!lat || !lon) {
      // City name se lat/lon nikalo
      const GeoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
      );
      const GeoData = await GeoRes.json();

      if(!GeoData.results || !GeoData.results.length) {
        return alert("City not found!");
      }

      lat = GeoData.results[0].latitude;
      lon = GeoData.results[0].longitude;

      const { latitude, longitude, name, country } = GeoData.results[0];
    console.log(`City: ${name}, ${country}`);
    }

    

    // fetching  weather
    const WeatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,windspeed_10m,uv_index,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Asia/Kolkata`
    );
    const WeatherData = await WeatherRes.json();
    console.log(WeatherData);

    // updateUI
    document.getElementById('currentWeatherSkeleton').classList.add('hidden');
    document.getElementById('currentWeather').classList.remove('hidden');
    document.getElementById('hourlySkeleton').classList.add('hidden');
    document.getElementById('hourlycast').classList.remove('hidden');
    document.getElementById('weeklySkeleton').classList.add('hidden');
    document.getElementById('weeklycast').classList.remove('hidden');
    updateCurrentWeather(WeatherData.current_weather,city);
    updateHourlyWeather(WeatherData.hourly);
    updateWeeklyWeather(WeatherData.daily);

    document.getElementById('weatherIcon').src = picturecodemap[WeatherData.current_weather.weathercode] || "default.png";

  } catch(error) {
    console.log("Error:", error);
  }
}


//live location track

function successfn(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
  fetchWeather(null, latitude, longitude);
}

function errorfn(error) {
  switch(error.code) {
    case 1:
      console.log("Permission denied activating delhi as default location!");
      fetchWeather("Delhi"); 
      break;
    case 2:
      console.log("Location unavailable!"); 
      fetchWeather("Delhi"); 
      break;
    case 3:
      console.log("Timeout!");
      fetchWeather("Delhi"); 
      break;
  }
}
//live location track permission
navigator.geolocation.getCurrentPosition(successfn, errorfn);


//city when input and press enter
let cityInput = document.getElementById('cityInput');
cityInput.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); 
    let city=cityInput.value.trim();
    console.log('City entered:', city);
  if(!city) {
    alert('Please enter a city name.');
    return;
  }
    fetchWeather(city);}});
  
  function updateCurrentWeather(currentWeather,city){ 
   let location=document.getElementById('location');
   location.textContent=city;
   let date=document.getElementById('date');
   let currentDate = new Date();
   let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
   date.textContent = currentDate.toLocaleDateString(undefined, options);
   let temp=document.getElementById('temperature');
   temp.textContent=`${currentWeather.temperature}°C`;
   let condition=document.getElementById('condition');
   condition.textContent=weathercodemap[currentWeather.weathercode] || "Unknown";
   let windSpeed=document.getElementById('WindSpeed');
   windSpeed.textContent=`Wind Speed: ${currentWeather.windspeed} km/h`;
   
  }

function updateHourlyWeather(hourlyData) {
  let hourlyWeatherDiv = document.getElementById('hourlyWeather');
  let hour1=document.getElementById('currentHour');
  let hour2=document.getElementById('nexthour1');
  let hour3=document.getElementById('nexthour2');
  let hour4=document.getElementById('nexthour3');
  let hour5=document.getElementById('nexthour4');
  let hour6=document.getElementById('nexthour5');
  const hours=[hour1,hour2,hour3,hour4,hour5,hour6];
   let currentHour = new Date().getHours();
  hour1.textContent=`${currentHour}:00`;
  for(let j = 0; j < 6; j++) {
   hours[j].textContent =
      `${(currentHour + j) % 24}:00`;
    
}
  
  let hourTemps = document.querySelectorAll('.hourtemp');
  let hourlyIcons= document.querySelectorAll('.hourlyIcon');
  for(let i = 0; i < 6; i++){

    hourTemps[i].textContent =
    `${hourlyData.temperature_2m[currentHour+i]}°C`;


    hourlyIcons[i].src =
    picturecodemap[
    hourlyData.weathercode[currentHour+i]
    ] || "default.png";

  }

}

function updateWeeklyWeather(dailyData) {
  const currentDate = new Date();

  for(let k = 0; k < 7; k++) {
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + k);
    const dayName = nextDate.toLocaleDateString('en-US', {
      weekday: 'long'
    });

    const elements =
      document.querySelectorAll(`.weeklyday${k + 1}`);

    elements.forEach(el => {
      el.textContent = dayName;
    });
  }
  let temperature1=document.getElementById('temperature1');
  let temperature2=document.getElementById('temperature2');
  let temperature3=document.getElementById('temperature3');
  let temperature4=document.getElementById('temperature4');
  let temperature5=document.getElementById('temperature5');
  let temperature6=document.getElementById('temperature6');
  let temperature7=document.getElementById('temperature7');
  const tempElements=[temperature1,temperature2,temperature3,temperature4,temperature5,temperature6,temperature7];
  for(let m=0; m < 7; m++) {
    tempElements[m].textContent = `${dailyData.temperature_2m_max[m]}°C`;
  }

let condition1=document.getElementById('condition1');
let condition2=document.getElementById('condition2');
let condition3=document.getElementById('condition3');
let condition4=document.getElementById('condition4');
let condition5=document.getElementById('condition5');
let condition6=document.getElementById('condition6');
let condition7=document.getElementById('condition7');
const conditionElements=[condition1,condition2,condition3,condition4,condition5,condition6,condition7];
for(let l=0;l<7;l++){
  conditionElements[l].textContent=weathercodemap[dailyData.weathercode[l]] || "Unknown";

}

let highlow1=document.getElementById('highlow-1');
let highlow2=document.getElementById('highlow-2');
let highlow3=document.getElementById('highlow-3');
let highlow4=document.getElementById('highlow-4');
let highlow5=document.getElementById('highlow-5');
let highlow6=document.getElementById('highlow-6');
let highlow7=document.getElementById('highlow-7');
const HighlowElements=[highlow1,highlow2,highlow3,highlow4,highlow5,highlow6,highlow7];
for(let n=0;n<7;n++){
  HighlowElements[n].innerHTML = `High: ${dailyData.temperature_2m_max[n]}°C <br>Low: ${dailyData.temperature_2m_min[n]}°C`;
}

const weeklyIcons = document.querySelectorAll('.weeklyIcon');
for(let i = 0; i < 7; i++){

  weeklyIcons[i].src =
  picturecodemap[
    dailyData.weathercode[i]
  ] || "default.png";
}
}