var userCityForm = $("#user-city-form");
var userCitySelect = $("#user-city");

/* Checks to see if the user has inputted text into the form, and runs the 
getCityCoordinates function when an entry in the form is submitted */
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

/* Uses OpenWeather's GeoCode API call to turn the users inputted city name into
latitude and longitude coordinates which are needed for the 5 day weather forecast API */
function getCityCoordinates(cityName) {
    var geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=6cb822b337f6a4741cec5e8cacad4726`;
    fetch(geocodeUrl)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                var lat_coord = data[0].lat;
                var long_coord = data[0].lon;
                getCurrentWeather(lat_coord, long_coord);
                getForecastWeather(lat_coord, long_coord);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function (error) {
        alert("Unable to get city geodata currently! Please try again later");
    });
}

/* Uses OpenWeather's current weather forecast API to obtain the weather data for the requested
latitude and longitude coordinates. The data is displayed by calling the displayCurrentWeather function
The storeUserCity function saves the users input into the local storage*/
function getCurrentWeather(latitude, longitude) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=6cb822b337f6a4741cec5e8cacad4726&units=metric`;
    fetch(weatherUrl)
    .then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                const currentTimestamp = data.dt * 1000;
                const currentDate = new Date(currentTimestamp);
                var formattedDate = currentDate.toISOString().substring(0, 10);
                displayCurrentWeather(data, formattedDate);
                storeUserCity(data.name);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function (error) {
        alert("Unable to get weather data currently! Please try again later");
    });
}

/* Uses OpenWeather's 5 day weather forecast API to obtain the weather data for the requested
latitude and longitude coordinates. The data points are placed into the getDailyWeather function 
to get the overall average weather info for each day. */
function getForecastWeather(latitude, longitude) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=6cb822b337f6a4741cec5e8cacad4726&units=metric`;
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

/* The 5 day weather forecast API returns data for every 3 hours of the 5 days (40 data points)
A dictionary object is made where the keys are the dates for the data and the values are 
arrays containing weather data for the respective dates */
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

/* Creates a dictionary object where the keys are the dates for the data and the value is an
average of all the data points for that respective day */
function getDailyAverages(dailyData) {
    const dailyAverages = {};

    //computes average of elements in array (StackOverflow): https://stackoverflow.com/questions/10359907/how-to-compute-the-sum-and-average-of-elements-in-an-array
    Object.keys(dailyData).forEach((day) => {
        dailyAverages[day] = {
            temperature:Math.round((dailyData[day].temperature.reduce((a, b) => a + b) /dailyData[day].temperature.length) *100) / 100,
            windSpeed:Math.round((dailyData[day].windSpeed.reduce((a, b) => a + b) /dailyData[day].windSpeed.length) *100) / 100,
            humidity: Math.round(dailyData[day].humidity.reduce((a, b) => a + b) /dailyData[day].humidity.length),
            weather: dailyData[day].weather.reduce((a, b) => a),
        };
    });
    displayForecast(dailyAverages);
}

/* Stores references to emojis which describe the city's weather. This variable is to be used
in the displayCurrentWeather and displayForecast functions */
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

/* Displays a card showing the current weather data on the screen. The card takes up
9 columns from the screen and changes the intial search form from 12 columns to 3, so it can be placed
as a sidebar. The function also replaces the entire card section when a new user input is submitted*/
function displayCurrentWeather(weatherData, date) {
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

    currentCityTitle.html(weatherData.name + ` (${date}) ` + weatherIcon[weatherData.weather[0].main]);
    currentTemp.html(weatherData.main.temp + " &deg;C");
    currentWind.text(weatherData.wind.speed + " m/s");
    currentHumidity.text(weatherData.main.humidity + "%");
}

/* Creates a bootstrap card grid with 5 cards for each day forecasted. */
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
        if (index == 0)
        {
            return; //Skips the first set of data which represents data for the current day
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

/* Stores the users input into the local Storage and checks to see if the inputted city already exists
in the recent searches section. Also orders the list to have the most recent search at the top of the list*/
function storeUserCity(userCity) {
    var recentCities = $(".user-recent-cities");
    var storedCities = JSON.parse(localStorage.getItem("user_cities"));
    if (storedCities == null) {
        storedCities = [];
    }

    if (storedCities.includes(userCity)) {
        let index = storedCities.indexOf(userCity);
        let repeatedCity = storedCities.splice(index, 1);
        storedCities.unshift(repeatedCity[0]);
    } else {
        storedCities.unshift(userCity);
        if (storedCities.length > 8) {
            recentCities.children().last().remove();
            storedCities.pop();
        }
    }
    localStorage.setItem("user_cities", JSON.stringify(storedCities));
    displayStoredCity();
}

/* Displays the user stored cities in the recent searches section on the sidebar */
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

/* Shows the stored user inputted cities in the recent searches section when the document is loaded and the DOM is rendered */
$(document).ready(displayStoredCity);
userCityForm.submit(userFormSubmit);

/* Checks to see if the user clicks on the cities in the recent searches tab at any point in the running of the application.
If the user selects on of the cities then it runs the getCityCoordinates function */
var recentCities = $(".user-recent-cities");
recentCities.on("click", ".user-recent-city", function (event) {
    var selectedCity = $(event.target).text();
    getCityCoordinates(selectedCity);
});
