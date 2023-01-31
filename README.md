# Weather Dashboard

## Description

Website containing a weather dashboard which displays weather data for multiple cities using third-party API calls to OpenWeather. The application contains a form input which accepts user inputs of city names. The city names are passed on to OpenWeathers Geocoding API to convert the city name into latitude and longitude coordinates. The coordinates are then used as query parameters to OpenWeather's 5 day weather forecast API call to get the weather forecast for the selected city. If there is an error due to incorrect data provided by the user or a problem with the API call, the application provides an alert to the user with the code for the specific error. The application also keeps track of the users most recent searches in the local storage, and allows the user to click on recent cities for quick access to their weather data. The webpage features dynamically updated HTML and CSS powered by JQuery and Bootstrap.

During the project, Abdelrahman learnt the following skills:
- Making fetch API calls to request for data
- Using online documentation of API's to understand the data that it returns
- Using bootstrap to quickly build a layout for the page

## Installation
N/A

## Usage

The link to the website can be found here: https://abdelrahmanahmed605.github.io/weather-dashboard/ . A video illustrating the use of the webpage can be found below.

To use the weather-dashboard website, you can click on the form input text field. Once the user types a city name and clicks submit, they are presented with the current weather and a 5 day weather forecast for the selected city. A "recent searches" section on the left will keep track of the user's most recent searches and display them on the side of the page. The user can click on the recent city to quickly access its current weather and 5 day weather forecast.

![Showcasing Abdelrahman's weather dashboard application in use](assets/imgs/weather-dashboard.gif)

## Credits

Abdelrahman Ahmed https://github.com/AbdelrahmanAhmed605

University of Toronto, BootCampSpot https://courses.bootcampspot.com/courses/2861/assignments/46293?module_item_id=854349

StackOverflow, https://stackoverflow.com/questions/10359907/how-to-compute-the-sum-and-average-of-elements-in-an-array

## License

Please refer to the MIT LICENSE in the repo.
