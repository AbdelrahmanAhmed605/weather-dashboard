var userCityForm = $("#user-city-form");
var userCitySelect = $("#user-city");

function userFormSubmit(event) {
    event.preventDefault();

    var userCityName = userCitySelect.val();
    console.log(userCityName);
    if (userCityName) {
        getCityCoordinates(userCityName);
        userCitySelect.val("");
    }
    else {
        alert("Please enter a city")
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
                    getCityWeather(lat_coord,long_coord);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to get city geodata currently! Please try again later');
        });
}

function getCityWeather(latitude,longitude) {
    var weatherUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=6cb822b337f6a4741cec5e8cacad4726`;
    fetch(weatherUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                });
            } else {
            alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to get weather data currently! Please try again later");
        });
}

userCityForm.submit(userFormSubmit);
