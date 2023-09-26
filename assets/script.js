require('dotenv').config();
const apiKey = process.env.API_KEY;
const units = "imperial";

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("search-form");
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        
        const cityInput = document.getElementById("city-input");
        const cityName = cityInput.value;
        cityInput.value = '';
        fetchWeatherData(cityName);
        fetchForecastData(cityName);
        addToSearchHistory(cityName);
    });
});

async function fetchForecastData(cityName) {
    
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=${units}`;
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('network response was not ok');
        }
        const data = await response.json();
        console.log('Forecast API response:', data);
             displayForecast(data)
    } catch (error) {
        console.error('Error fetching forecast data:', error);
    }
}

function displayForecast(data) {
    const forecastEntries = data.list;
    const futureWeatherElement = document.getElementById('future-weather');
    futureWeatherElement.innerHTML = '';

    forecastEntries.forEach(entry => {
        const timestamp = entry.dt * 1000;
        const date = new Date(timestamp);
        const temperature = entry.main.temp;
        const humidity = entry.main.humidity;
        const windSpeed = entry.wind.speed;
        const weatherIcon = entry.weather[0].icon;

        const forecastEntryElement = document.createElement('div');
        forecastEntryElement.classList.add('forecast-entry');
        forecastEntryElement.innerHTML = `
        <h3>${date.toDateString()}</h3>
        <p>Temperature: ${temperature} °F</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
        <img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon">
        `;
        futureWeatherElement.appendChild(forecastEntryElement);
    });
}

async function fetchWeatherData(cityName) {
    if (!cityName || cityName.trim() === '') {
        console.error('Invalid city name');
        return;
    }
    
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}`;

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
    <p>Temperature: ${temperature} °F</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${windSpeed} m/s</p>
    <img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon">
    `;
};


function displaySearchHistory() {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const searchHistoryList = document.getElementById('history-list');

    searchHistoryList.innerHTML = '';
    searchHistory.forEach(city => {
        const listItem = document.createElement('li');
        listItem.textContent = city;
        searchHistoryList.appendChild(listItem);
    });
}

function addToSearchHistory(cityName) {
    let searchHistory = JSON.parse(localStorage.getItem('seachHistory')) || [];

    if (!searchHistory.includes(cityName)) {
        searchHistory.push(cityName);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
      }
    displaySearchHistory();
}

function clearSearchHistory() {
    localStorage.removeItem('searchHistory');
    displaySearchHistory();
}

document.addEventListener('DOMContentLoaded', function () {
displaySearchHistory();

document.getElementById('clear-history-button').addEventListener('click', clearSearchHistory);
});