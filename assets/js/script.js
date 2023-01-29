var userCityForm = $("#user-city-form");
var userCitySelect = $("#user-city");

function userFormSubmit(event) {
  event.preventDefault();

  var userCityName = userCitySelect.val();
  console.log(userCityName);
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
          getDailyWeather(data);
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
        humidity: [],
        windSpeed: [],
        };
    }
    dailyData[date].temperature.push(dataPoint.main.temp);
    dailyData[date].humidity.push(dataPoint.main.humidity);
    dailyData[date].windSpeed.push(dataPoint.wind.speed);
    });

    getDailyAverages(dailyData);
}

function getDailyAverages(dailyData) {
    const dailyAverages = {};
    Object.keys(dailyData).forEach((day) => {
      dailyAverages[day] = {
        temperature: Math.round(dailyData[day].temperature.reduce((a, b) => a + b) / dailyData[day].temperature.length),
        humidity: Math.round(dailyData[day].humidity.reduce((a, b) => a + b) / dailyData[day].humidity.length),
        windSpeed: Math.round(dailyData[day].windSpeed.reduce((a, b) => a + b) / dailyData[day].windSpeed.length),
      };
    });
    console.log(dailyAverages)
}

userCityForm.submit(userFormSubmit);
