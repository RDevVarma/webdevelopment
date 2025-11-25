const API_KEY = 'API Key'; // <-- insert your API key here
const form = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const result = document.getElementById('result');
const errorBox = document.getElementById('error');

const cityNameEl = document.getElementById('cityName');
const tempEl = document.getElementById('temp');
const feelsLikeEl = document.getElementById('feelsLike');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');
const descriptionEl = document.getElementById('description');
const weatherIconEl = document.getElementById('weatherIcon');
const extraEl = document.getElementById('extra');


form.addEventListener('submit', async (e) => {
e.preventDefault();
const city = cityInput.value.trim();
if (!city) return;
fetchWeather(city);
});

async function fetchWeather(city){
// clear previous
errorBox.textContent = '';
result.classList.add('hidden');
extraEl.textContent = 'Loading...';


try{
const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
const resp = await fetch(endpoint);


if (!resp.ok){
if (resp.status === 404) throw new Error('City not found. Check spelling.');
throw new Error(`API error: ${resp.status} ${resp.statusText}`);
}


const data = await resp.json();
renderWeather(data);
}catch(err){
console.error(err);
errorBox.textContent = err.message;
extraEl.textContent = '';
}
}

function renderWeather(data){
// data structure: https://openweathermap.org/current#current_JSON
const name = `${data.name}${data.sys && data.sys.country ? ', ' + data.sys.country : ''}`;
const temp = data.main && typeof data.main.temp === 'number' ? `${Math.round(data.main.temp)}°C` : 'N/A';
const feelsLike = data.main && typeof data.main.feels_like === 'number' ? `${Math.round(data.main.feels_like)}°C` : 'N/A';
const humidity = data.main && typeof data.main.humidity === 'number' ? `${data.main.humidity}%` : 'N/A';
const wind = data.wind && typeof data.wind.speed === 'number' ? `${data.wind.speed} m/s` : 'N/A';
const description = data.weather && data.weather[0] && data.weather[0].description ? capitalize(data.weather[0].description) : 'N/A';


cityNameEl.textContent = name;
tempEl.textContent = temp;
feelsLikeEl.textContent = feelsLike;
humidityEl.textContent = humidity;
windEl.textContent = wind;
descriptionEl.textContent = description;


// icon
if (data.weather && data.weather[0] && data.weather[0].icon){
const iconCode = data.weather[0].icon; // e.g. 01d
const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
weatherIconEl.src = iconUrl;
weatherIconEl.alt = description + ' icon';
weatherIconEl.style.display = '';
} else {
weatherIconEl.style.display = 'none';
}


// extra info
const sunrise = data.sys && data.sys.sunrise ? unixToTime(data.sys.sunrise + (data.timezone || 0)) : null;
const sunset = data.sys && data.sys.sunset ? unixToTime(data.sys.sunset + (data.timezone || 0)) : null;
extraEl.textContent = sunrise && sunset ? `Sunrise: ${sunrise} — Sunset: ${sunset}` : '';


result.classList.remove('hidden');
extraEl.classList.remove('hidden');
}

function capitalize(s){
return s.replace(/(^|\s)\S/g, t => t.toUpperCase());
}


function unixToTime(unixSeconds){
// unixSeconds here is UTC + timezone offset in seconds (we pass timezone earlier)
const date = new Date(unixSeconds * 1000);
// Format as HH:MM (local time of the user's browser)
const hrs = date.getUTCHours().toString().padStart(2,'0');
const mins = date.getUTCMinutes().toString().padStart(2,'0');
return `${hrs}:${mins}`;
}


// Optional: quick example fetch on load for a default city
// fetchWeather('New York');