// state
let currCity = "Kolkata";
let units = "metric";


// Selectors
let city = document.querySelector(".weather__city");
let datetime = document.querySelector(".weather__datetime");
let weather__forecast = document.querySelector('.weather__forecast');
let weather__temperature = document.querySelector(".weather__temperature");
let weather__icon = document.querySelector(".weather__icon");
let weather__minmax = document.querySelector(".weather__minmax")
let weather__realfeel = document.querySelector('.weather__realfeel');
let weather__humidity = document.querySelector('.weather__humidity');
let weather__wind = document.querySelector('.weather__wind');
let weather__pressure = document.querySelector('.weather__pressure');
let weatherForecastEl = document.querySelector('.weather-forecast');
let currentTempEl = document.querySelector('.today');


// search
document.querySelector(".weather__search").addEventListener('submit', e => {
    let search = document.querySelector(".weather__searchform");
    // prevent default action
    e.preventDefault();
    // change current city
    currCity = search.value;
    // get weather forecast 
    getWeather();
    // clear form
    search.value = ""
})

// units
document.querySelector(".weather_unit_celsius").addEventListener('click', () => {
    if (units !== "metric") {
        // change to metric
        units = "metric"
        // get weather forecast 
        getWeather()
    }
})

document.querySelector(".weather_unit_farenheit").addEventListener('click', () => {
    if (units !== "imperial") {
        // change to imperial
        units = "imperial"
        // get weather forecast 
        getWeather()
    }
})

function convertTimeStamp(timestamp, timezone) {
    const convertTimezone = timezone / 3600; // convert seconds to hours

    const date = new Date(timestamp * 1000);

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        //timeZone: `Etc/GMT${convertTimezone >= 0 ? "-" : "+"}${Math.abs(convertTimezone)}`,
        hour12: true,
    };

    return date.toLocaleString("en-US", options);
}

// convert country code to name
function convertCountryCode(country) {
    let regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    return regionNames.of(country)
}

function kelvinToCelsius(kelvin) {
    return kelvin - 273.15;
  }

function showWeatherData(data) {
    if (data.list && data.list.length > 0) {
        let otherDayForecast = '';

        const forecasts = data.list;

        if (forecasts.length > 0) {
            const todayForecast = forecasts[0];
            const tempCelsius = kelvinToCelsius(todayForecast.main.temp);
            const feelsLikeCelsius = kelvinToCelsius(todayForecast.main.feels_like);

            currentTempEl.innerHTML = `
                <img src="http://openweathermap.org/img/wn/${todayForecast.weather[0].icon}.png" alt="weather icon" class="w-icon">
                <div class="other">
                    <div class="day">Monday</div>
                    <div class="temp">Day - ${feelsLikeCelsius.toFixed()}&#176;C</div>
                    <div class="temp">Night - ${tempCelsius.toFixed()}&#176;C</div>
                </div>`;
        }

        for (let idx = 6; idx < forecasts.length; idx += 6) {
            const forecast = forecasts[idx];
            const dayNames = ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const dayName = dayNames[Math.floor((idx - 6) / 6) % dayNames.length];
            const tempCelsius = kelvinToCelsius(forecast.main.temp);
            const feelsLikeCelsius = kelvinToCelsius(forecast.main.feels_like);

            otherDayForecast += `
                <div class="weather-forecast-item">
                    <div class="day">${dayName}</div>
                    <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="weather icon" class="w-icon">
                    <div class="temp">Day - ${feelsLikeCelsius.toFixed()}&#176;C</div>
                    <div class="temp">Night - ${tempCelsius.toFixed()}&#176;C</div>
                </div>`;
        }

        weatherForecastEl.innerHTML = otherDayForecast;
    }
}



function getWeather() {
    const API_KEY = 'e9e97c953cc187388f106aaadd8e8e45';

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${currCity}&appid=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            showWeatherData(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${currCity}&appid=${API_KEY}&units=${units}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            city.innerHTML = `${data.name}, ${convertCountryCode(data.sys.country)}`;
            datetime.innerHTML = convertTimeStamp(data.dt, data.timezone);
            weather__forecast.innerHTML = `<p>${data.weather[0].main}</p>`;
            weather__temperature.innerHTML = `${data.main.temp.toFixed()}&#176`;
            weather__icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" />`;
            weather__minmax.innerHTML = `<p>Min: ${data.main.temp_min.toFixed()}&#176;</p><p>Max: ${data.main.temp_max.toFixed()}&#176;</p>`;
            weather__realfeel.innerHTML = `${data.main.feels_like.toFixed()}&#176`;
            weather__humidity.innerHTML = `${data.main.humidity}%`;
            weather__wind.innerHTML = `${data.wind.speed} ${units === "imperial" ? "mph" : "m/s"}`;
            weather__pressure.innerHTML = `${data.main.pressure} hPa`;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

document.addEventListener('DOMContentLoaded', getWeather);
