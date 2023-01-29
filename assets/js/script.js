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
        return response.json();
      })
      .then(function (data) {
        console.log(data);
      });
}

userCityForm.submit(userFormSubmit);
