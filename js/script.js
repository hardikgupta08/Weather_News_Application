const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "f4a15e7faaa1041a91939ee7dc85824b"; // API key for OpenWeatherMap API

const createWeatherCard = (cityName, weatherItem, index) => {
  if (index === 0) {
    // HTML for the main weather card
    return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(
                      2
                    )}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${
                      weatherItem.weather[0].icon
                    }@4x.png" alt="weather-icon">
                    <h6>${weatherItem.weather[0].description}</h6>
                </div>`;
  } else {
    // HTML for the other five day forecast card
    return `<li class="card">
                    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <img src="https://openweathermap.org/img/wn/${
                      weatherItem.weather[0].icon
                    }@4x.png" alt="weather-icon">
                    <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(
                      2
                    )}°C</h6>
                    <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                    <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                </li>`;
  }
};

const getWeatherDetails = (cityName, latitude, longitude) => {
  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

  fetch(WEATHER_API_URL)
    .then((response) => response.json())
    .then((data) => {
      // Filter the forecasts to get only one forecast per day
      const uniqueForecastDays = [];
      const fiveDaysForecast = data.list.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
          return uniqueForecastDays.push(forecastDate);
        }
      });

      // Clearing previous weather data
      cityInput.value = "";
      currentWeatherDiv.innerHTML = "";
      weatherCardsDiv.innerHTML = "";

      // Creating weather cards and adding them to the DOM
      fiveDaysForecast.forEach((weatherItem, index) => {
        const html = createWeatherCard(cityName, weatherItem, index);
        if (index === 0) {
          currentWeatherDiv.insertAdjacentHTML("beforeend", html);
        } else {
          weatherCardsDiv.insertAdjacentHTML("beforeend", html);
        }
      });
    })
    .catch(() => {
      alert("An error occurred while fetching the weather forecast!");
    });
};

const getCityCoordinates = () => {
  const cityName = cityInput.value.trim();
  if (cityName === "") return;
  const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName.toLowerCase()}&limit=1&appid=${API_KEY}`;

  // Get entered city coordinates (latitude, longitude, and name) from the API response
  fetch(GEOCODING_API_URL)
    .then((response) => response.json())
    .then((data) => {
      if (!data.length) return alert(`No coordinates found for ${cityName}`);
      const { lat, lon, name } = data[0];
      getWeatherDetails(name, lat, lon);
    })
    .catch(() => {
      alert("An error occurred while fetching the coordinates!");
    });
};

const getUserCoordinates = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords; // Get coordinates of user location
      // Get city name from coordinates using reverse geocoding API
      const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
      fetch(API_URL)
        .then((response) => response.json())
        .then((data) => {
          const { name } = data[0];
          getWeatherDetails(name, latitude, longitude);
        })
        .catch(() => {
          alert("An error occurred while fetching the city name!");
        });
    },
    (error) => {
      // Show alert if user denied the location permission
      if (error.code === error.PERMISSION_DENIED) {
        alert(
          "Geolocation request denied. Please reset location permission to grant access again."
        );
      } else {
        alert("Geolocation request error. Please reset location permission.");
      }
    }
  );
};

locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener(
  "keyup",
  (e) => e.key === "Enter" && getCityCoordinates()
);

const app = async () => {
  var url =
    "https://api.thenewsapi.com/v1/news/top?api_token=ITBT65gJh9czS95az1yBUxI95RdmEogwmkJGAfg0&locale=us&limit=6";
  var req = new Request(url);

  try {
    const response = await fetch(req);
    const result = await response.json();
    document.querySelector(".card-title").innerText = result.data[0].title;
    document.querySelector(".card-img-top").src = result.data[0].image_url;
    document.querySelector(".btn.btn-primary").href = result.data[0].url;
    document.querySelector(".card-title.t2").innerText = result.data[1].title;
    document.querySelector(".card-img-top.img2").src = result.data[1].image_url;
    document.querySelector(".btn.btn-primary.a2").href = result.data[1].url;
    document.querySelector(".card-title.t3").innerText = result.data[2].title;
    document.querySelector(".card-img-top.img3").src = result.data[2].image_url;
    document.querySelector(".btn.btn-primary.a3").href = result.data[2].url;
    // document.querySelector('.btn.btn-primary').href=result[0].url;
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};
