var userCityForm = $("#user-city-form");
var userCitySelect = $("#user-city");

function userFormSubmit(event) {
  event.preventDefault();

  var userCityName = userCitySelect.val();
  if (userCityName) {
    getCityCoordinates(userCityName);
    userCitySelect.val("");
  } else {
    alert("Please enter a city");
  }
}

function getCityCoordinates(cityName) {
  var geocodeUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=6cb822b337f6a4741cec5e8cacad4726`;
  fetch(geocodeUrl)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
            var lat_coord = data[0].lat;
            var long_coord = data[0].lon;
            getCityWeather(lat_coord, long_coord);
        });
        } else {
        alert("Error: " + response.statusText);
        }
    })
    .catch(function (error) {
      alert("Unable to get city geodata currently! Please try again later");
    });
}

function getCityWeather(latitude, longitude) {
  var weatherUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=6cb822b337f6a4741cec5e8cacad4726&units=metric`;
  fetch(weatherUrl)
    .then(function (response) {
      if (response.ok) {
          response.json().then(function (data) {
            displayCurrentWeather(data);
            getDailyWeather(data);
            storeUserCity(data.city.name);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to get weather data currently! Please try again later");
    });
}

function getDailyWeather(weatherData) {
    const dailyData = {};
    weatherData.list.forEach((dataPoint) => {
        const date = dataPoint.dt_txt.split(" ")[0];
        if (!dailyData[date]) {
            dailyData[date] = {
                temperature: [],
                windSpeed: [],
                humidity: [],
                weather: [],
            };
        }
        dailyData[date].temperature.push(dataPoint.main.temp);
        dailyData[date].windSpeed.push(dataPoint.wind.speed);
        dailyData[date].humidity.push(dataPoint.main.humidity);
        dailyData[date].weather.push(dataPoint.weather[0].main);
    });

    getDailyAverages(dailyData);
}

function getDailyAverages(dailyData) {
    const dailyAverages = {};
    Object.keys(dailyData).forEach((day) => {
      dailyAverages[day] = {
        temperature: Math.round(dailyData[day].temperature.reduce((a, b) => a + b) / dailyData[day].temperature.length *100)/100,
        windSpeed: Math.round(dailyData[day].windSpeed.reduce((a, b) => a + b) / dailyData[day].windSpeed.length *100)/100,
        humidity: Math.round(dailyData[day].humidity.reduce((a, b) => a + b) / dailyData[day].humidity.length),
        weather: dailyData[day].weather.reduce((a,b) => a),
      };
    });
    displayForecast(dailyAverages)
}

var weatherIcon = {
  Thunderstorm: `&#9928;`,
  Drizzle: `&#127783;`,
  Rain: `&#127783;`,
  Snow: `&#10052`,
  Atmosphere: `&#127787;`,
  Clear: `&#9728;`,
  Clouds: `&#9729;`,
  Extreme: `&#9888;`,
  Additional: `&#127786;`,
};

function displayCurrentWeather(weatherData) {
    if ($(".mainbar").length) {
      $(".mainbar").remove();
    }
    var userSearchEl = $(".user-search");
    var currentWeatherCard = `
    <div class="mainbar col-md-9">
        <div class="card">
            <div class="current-weather card-body">
                <h2 class="card-title"></h2>
                <ul class="list-group">
                    <li class="list-group-item px-0">Temp: <span id="user-city-temp"></span></li>
                    <li class="list-group-item px-0">Wind: <span id="user-city-wind"></span></li>
                    <li class="list-group-item px-0">Humidity: <span id="user-city-humidity"></span></li>
                </ul>   
            </div>
        </div>
    </div>`;

    userSearchEl.removeClass("col-12");
    userSearchEl.addClass("col-md-3");
    userSearchEl.after(currentWeatherCard);

    var currentWeatherEl = $(".current-weather");
    var currentCityTitle = currentWeatherEl.children("h2");
    var currentTemp = currentWeatherEl.children(".list-group").children("li").children("#user-city-temp");
    var currentWind = currentWeatherEl.children(".list-group").children("li").children("#user-city-wind");
    var currentHumidity = currentWeatherEl.children(".list-group").children("li").children("#user-city-humidity");

    currentCityTitle.html(weatherData.city.name + ` (${weatherData.list[0].dt_txt.split(" ")[0]}) ` + weatherIcon[weatherData.list[0].weather[0].main]);
    currentTemp.html(weatherData.list[0].main.temp + " &deg;C");
    currentWind.text(weatherData.list[0].wind.speed + " m/s");
    currentHumidity.text(weatherData.list[0].main.humidity + "%");
}

function displayForecast(averageData) {
    var currentWeatherCard = $(".current-weather").parent(".card");
    var forecastElements = `
    <div class="card mt-3">
        <div class="card-header">
            <h3 class="card-title">5-day Forecast:</h3>
        </div>

        <div class="card-body">
            <div class="user-city-forecast row row-cols-1 row-cols-md-3 row-cols-lg-5 g-3">
            </div>
        </div>
    </div>`;
    currentWeatherCard.after(forecastElements);

    var forecastCards = $(".user-city-forecast");
    Object.keys(averageData).forEach((day, index) => {
        if (index == 0) {
            return;
        }
        var card = `
        <div class="col">
            <div class="card bg-secondary text-light">
                <div class="card-header"><h4 class="card-title">${day}</h4></div>
                <div class="card-body">
                    <p class="card-text">${weatherIcon[averageData[day].weather]}</p>
                    <p class="card-text">Temp: ${averageData[day].temperature}&#176;C</p>
                    <p class="card-text">Wind: ${averageData[day].windSpeed} m/s</p>
                    <p class="card-text">Humidity: ${averageData[day].humidity}%</p>
                </div>
            </div>
        </div>`;
        forecastCards.append(card);
    });
}

function storeUserCity(userCity) {
    var recentCities = $(".user-recent-cities");
    var storedCities = JSON.parse(localStorage.getItem("user_cities"));
    if (storedCities == null) {
        storedCities = []
    }
    
    if (storedCities.includes(userCity)) {
        let index = storedCities.indexOf(userCity);
        let repeatedCity = storedCities.splice(index, 1);
        storedCities.unshift(repeatedCity[0]);
        console.log(storedCities);
    }
    else {
        storedCities.unshift(userCity);
        if (storedCities.length > 8) {
            recentCities.children().last().remove();
            storedCities.pop();
        }
    }
    localStorage.setItem("user_cities", JSON.stringify(storedCities));
    displayStoredCity();
    
}

function displayStoredCity() {
    var recentCities = $(".user-recent-cities");
    var displayCities = JSON.parse(localStorage.getItem("user_cities"));
    if (displayCities == null) {
      displayCities = [];
    }

    recentCities.empty();
    displayCities.forEach((city) => {
      var userCityEl = `<li class="user-recent-city list-group-item">${city}</li>`;
      recentCities.append(userCityEl);
    });
}

$(document).ready(displayStoredCity);
userCityForm.submit(userFormSubmit);
var recentCities = $(".user-recent-cities");

recentCities.on("click", ".user-recent-city", function (event) {
    var selectedCity = $(event.target).text();
    getCityCoordinates(selectedCity)
});
