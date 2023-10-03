var weatherAPIKey = "8a2c2f06a2efa59ec006a52375e7f41d";
var geoForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + weatherAPIKey;
var todayDate = dayjs().format("MM/DD/YYYY")
console.log(todayDate);

var city = "Chicago";


$("#searchBtn").on("click", function (event) {
    event.preventDefault();
    var currentCity = $("#searchID").val();
    $("#currentCity").text(currentCity );
    localStorage.setItem(currentCity, "")
    var weather = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherAPIKey}&units=imperial`;

  fetch(weather).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    displayForecast(data);
  })
    }
);


function createDayCard(dayData, date) {
  const card = document.createElement('div');
  card.classList.add('card', 'col', 'g-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const title = document.createElement('h5');
  title.classList.add('card-title');
  title.textContent = `Forecast for ${date}`;

  cardBody.appendChild(title);

  // Check if weather data is available
  if (dayData.weather && dayData.weather.length > 0) {
    const icon = document.createElement('img');
    icon.src = `http://openweathermap.org/img/w/${dayData.weather[0].icon}.png`;
    icon.alt = 'Weather icon';
    cardBody.appendChild(icon);
  } else {
    cardBody.appendChild(document.createTextNode('No weather information available'));
  }

  const temperature = document.createElement('p');
  temperature.textContent = `Temperature: ${dayData.main.temp} °F`;
  cardBody.appendChild(temperature);

  const humidity = document.createElement('p');
  humidity.textContent = `Humidity: ${dayData.main.humidity}%`;
  cardBody.appendChild(humidity);

  const windSpeed = document.createElement('p');
  windSpeed.textContent = `Wind Speed: ${dayData.wind.speed} m/s`;
  cardBody.appendChild(windSpeed);

  card.appendChild(cardBody);

  return card;
}
  
function generateForecastCards(weatherDataArray) {
  const forecastContainer = document.querySelector('.card-container');
  for (let i = 1; i <= 5; i++) {
    const dayCard = createDayCard(i, weatherDataArray[i - 1]); // Pass weather data for the corresponding day
    forecastContainer.appendChild(dayCard);
  }
}

function displayWeather(data) { // current weather
    const weatherContainer = document.getElementById('forecast');
    console.log('Weather data:', data);
    
    if (!data.weather || data.weather.length === 0) {
      weatherContainer.innerHTML = '<p>No weather data available.</p>';
      return;
    }
  
    weatherContainer.innerHTML = `
      <div class="weatherCard">
        <h2>${data.name}</h2>
        <p>Date: ${new Date().toLocaleDateString()}</p>
        <img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="Weather icon">
        <p>Temperature: ${data.main.temp} °F</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
      </div>
    `;
  }

function displayForecast(data) {
    console.log('Forecast data:', data);  // Log the data received
  
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';
  
    for (let i = 0; i < data.list.length; i += 8) {
      const dayData = data.list[i];
      const date = dayjs(dayData.dt_txt).format('MM/DD/YYYY');
      const dayCard = createDayCard(dayData, date);
      forecastContainer.appendChild(dayCard);
    }
  }
  
  // Call the function to generate forecast cards



// # 06 Server-Side APIs: Weather Dashboard Psuedo

// 1. Setup HTML structure for the page, initialize JS variables
//     - create layout sections for the search from, current weather data, forecast data, search history list
//     - Define Api_key variable for the openweather API
//     - Define base URL for the openwather API
//     - Create variables to store references to HTML elements (e.g, searchForm, cityInput, currentWeatherContainer, forecastContainer, searchHistoryContainer)

// 2. Event Listener for form submission 
//     - Add submit event listener to searchForm element
//     - prevent the default form submission
//     - Get the users input from cityInput element
//     - call a function (e.g, fetchWeatherData) with the user's input

// 3. Fetch weather data from OpenWeather API (fetchWeatherData function)
//     - construct the API URL using the users input and API Key
//     - fetch data from the API using the constructed URL
//     - parse the JSON response
//     - Handle errors (e.g, if the city is not found)

// 4. Display the current weather conditions (displayCurrentWeather function)
//     - Extract relevant data from the API response (city name, date, icon, temp, humidity, and wind speed)
//     - Create HTML elements to display this data
//     - Update the currentWeatherContainer with the HTML elements

// 5. Display 5-day forecast (displayForecast function)
//     - 5 day forecast requires lat and long, so we need to fiure out how to extract lat and long from our currentWeather response
//     - Extract the 5-day forecast data from the API response
//     - Loop through the forecast data and for each, create HTML elements to display (date, icon, temp, wind speed, humidity)
//     - Append these to forecastContainer

// 6. Update search history (updateSearchHistory function)
//     - Add the searched City to the searchHistory array
//     - Store the searchHistory array in local storage (setItem)

// 7. Display search history (displaySearchHistory function)
//     - Loop through the searchHistory array and create a clickable list of cities in the seachHistoryContainer
//     - Add event listeners to the list of items to allow users to click and view data for a previous search

// 8. Event listener for search history 
//     - Add a click event listener to the searchHistoryContainer
//     - When a city is clicked call the fetchWeatherData function with the selected city

// 9. Initial page load
//     - Load the search history from local storage and display using displaySearchHistory function