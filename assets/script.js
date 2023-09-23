document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("search-form");
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        
        const cityInput = document.getElementById("city-input");
        const cityName = cityInput.ariaValueMax;
        cityInput.value = '';
        fetchWeatherData(cityName);
    });
});
function fetchWeatherData(cityName) {
    const apiKey = "";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
        })
        .catch(error => {
            console.error('Error fetching weather data', error);
        });
}

function displayCurrentWeather(data) {
    const city = data.name;
    const date = new Date(data.dt * 1000);
    const temperature = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const weatherIcon = data.weather[0].icon;
    
    const currentWeatherElement = document.getElementById("current-weather");
    currentWeatherElement.innerHTML = `
    <h2>${city}</h2>
    <p>Date: ${date.toDateString()}</p>
    <p>Temperature: ${temperature} °C</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${windSpeed} m/s</p>
    <img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon">
    `;
}
