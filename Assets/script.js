var weatherAPIKey = "8a2c2f06a2efa59ec006a52375e7f41d";
var todayDate = dayjs().format("MM/DD/YYYY")
var city = "Chicago";
var searchLog = JSON.parse(localStorage.getItem("searchedCity")) || [];
$("#searchBtn").on("click", function (event) {
  event.preventDefault();
  city = $("#searchID").val();
  searchLog.push(city);
  localStorage.setItem("searchedCity", (JSON.stringify(searchLog)));
  $("#currentCity").text(city );
  localStorage.setItem(city, "")
  var weather = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherAPIKey}&units=imperial`;

  fetch(weather).then(response => {
    return response.json();
  })
  .then(data => {
    fetchCurrentWeather(city);// current forecast
    displayForecast(data); // future forecast
    updateSearchHistoryButtons();// update search history buttons
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
  const weatherContainer = document.getElementById('weatherContainer');
  weatherContainer.innerHTML = '';  // Clear previous content

  if (!data.weather || data.weather.length === 0) {
    weatherContainer.innerHTML = '<p>No weather data available.</p>';
    return;
  }

  weatherContainer.innerHTML = `
    <h2>${data.name}</h2>
    <p>Date: ${new Date().toLocaleDateString()}</p>
    <img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="Weather icon">
    <p>Temperature: ${data.main.temp} °F</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind Speed: ${data.wind.speed} m/s</p>
  `;
}

function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';
    for (let i = 0; i < data.list.length; i += 8) {
      const dayData = data.list[i];
      const date = dayjs(dayData.dt_txt).format('MM/DD/YYYY');
      const dayCard = createDayCard(dayData, date);
      forecastContainer.appendChild(dayCard);
    }
  }

  function init() {
  // Fetch and display the current weather for a default city on page load
  fetchCurrentWeather(city);
  updateSearchHistoryButtons();
}

function fetchCurrentWeather(city) {
  const weatherAPIKey = "8a2c2f06a2efa59ec006a52375e7f41d";
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherAPIKey}&units=imperial`;
  fetch(weatherURL)
  .then(response => {
    return response.json();  // Parse response as JSON
  })
  .then(data => {
      displayWeather(data);
  })
}

function updateSearchHistoryButtons() {
  const searchHistoryDiv = document.getElementById('searchHistory');
  searchHistoryDiv.innerHTML = '';  // Clear previous content

  const searchLog = JSON.parse(localStorage.getItem('searchedCity')) || [];
  const uniqueCities = [...new Set(searchLog)];  // Get unique cities

  uniqueCities.forEach(city => {
      const button = document.createElement('button');
      button.classList.add('btn', 'btn-secondary', 'w-100', 'my-2');
      button.textContent = city;
      weather = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherAPIKey}&units=imperial`;

      button.addEventListener('click', function(event){
        event.preventDefault();
        fetchWeather(city);
      });
      searchHistoryDiv.appendChild(button);
  });
}

function fetchWeather(city) {
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherAPIKey}&units=imperial`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherAPIKey}&units=imperial`;

  // Fetch current weather
  fetch(weatherURL)
    .then(response => response.json())
    .then(data => {
      displayWeather(data); // Display current weather
      // Fetch and display the 5-day forecast
      fetch(forecastURL)
        .then(response => response.json())
        .then(data => {
          displayForecast(data); // Display 5-day forecast
        });
    });
}

// Call this function to initially populate the search history
init();