const API_KEY = "f4dbec5a0cd44fe7b8c104832251311";

const weatherForm = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");
const locationBtn = document.getElementById("locationBtn");


weatherForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) {
    weatherResult.innerHTML = "<p>❌ Please enter a location.</p>";
    return;
  }
  getWeather(city);
  cityInput.value = "";
});


locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    weatherResult.innerHTML = "<p>📍 Detecting your location...</p>";
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        getWeather(`${lat},${lon}`);
      },
      (err) => {
        weatherResult.innerHTML = "<p>❌ Unable to get your location. Allow location access and try again.</p>";
      }
    );
  } else {
    weatherResult.innerHTML = "<p>❌ Geolocation not supported by your browser.</p>";
  }
});


function getWeather(location) {
  weatherResult.innerHTML = "<p>⏳ Loading weather data...</p>";

  const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(location)}&aqi=no`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => showWeather(data))
    .catch(() => {
      weatherResult.innerHTML = "<p>❌ Unable to fetch weather data. Check your API key or internet connection.</p>";
    });
}


function showWeather(data) {
  if (data.error) {
    weatherResult.innerHTML = `<p>❌ ${data.error.message}</p>`;
    return;
  }

  const condition = data.current.condition.text;
  const icon = `https:${data.current.condition.icon}`;

  weatherResult.innerHTML = `
    <h2>${data.location.name}, ${data.location.country}</h2>
    <img src="${icon}" alt="${condition}">
    <p><strong>${data.current.temp_c.toFixed(1)}°C</strong></p>
    <p>${condition}</p>
    <p>Feels like: ${data.current.feelslike_c.toFixed(1)}°C</p>
    <p>Humidity: ${data.current.humidity}%</p>
    <p>Wind: ${data.current.wind_kph} kph</p>
  `;
}
