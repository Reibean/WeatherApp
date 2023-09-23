document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("search-form");
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        
        const cityInput = document.getElementById("city-input");
        const cityName = cityInput.value;
        cityInput.value = '';
        fetchWeatherData(cityName);
    });
});

async function fetchWeatherData(cityName) {
    if (!cityName || cityName.trim() === '') {
        console.error('Invalid city name');
        return;
    }
    const apiKey = "";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('network response was not ok');
            }
        const data = await response.json();
        console.log('API repsonse:', data);

        if (data.main && data.main.temp !== undefined) {
            displayCurrentWeather(data);
        } else {
            throw new Error('Weather data not available');
        } 
    } catch (error) {
            console.error('Error fetching weather data:', error);
        }
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
};
