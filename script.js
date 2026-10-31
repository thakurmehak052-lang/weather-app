/**
 * ============================================================================
 * SkyPulse Weather Application - Core JavaScript
 * 
 * Features:
 * - Real-time weather search via OpenWeatherMap API
 * - Celsius (°C) and Fahrenheit (°F) temperature conversion
 * - Dynamic weather icons & theme background switcher
 * - Detailed atmospheric data (humidity, wind speed, pressure, min/max)
 * - Built-in Demo Mode (works instantly out-of-the-box before adding an API key)
 * - Comprehensive error handling and responsive states
 * ============================================================================
 */

// -----------------------------------------------------------------------------
// 1. Configuration & API Setup
// -----------------------------------------------------------------------------
// To get your free API key:
// 1. Visit: https://home.openweathermap.org/users/sign_up
// 2. Create a free account and copy your API key from the "API keys" tab.
// 3. Replace "YOUR_API_KEY_HERE" with your actual 32-character key below.
const API_KEY = "YOUR_API_KEY_HERE";
const API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// -----------------------------------------------------------------------------
// 2. DOM Element Selectors
// -----------------------------------------------------------------------------
const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const clearBtn = document.getElementById("clearBtn");
const searchBtn = document.getElementById("searchBtn");

// Units toggle buttons
const celsiusBtn = document.getElementById("celsiusBtn");
const fahrenheitBtn = document.getElementById("fahrenheitBtn");

// Display containers & banners
const weatherContent = document.getElementById("weatherContent");
const loadingIndicator = document.getElementById("loadingIndicator");
const errorMessage = document.getElementById("errorMessage");
const errorText = document.getElementById("errorText");
const demoNotice = document.getElementById("demoNotice");

// Weather data elements
const cityNameEl = document.getElementById("cityName");
const countryCodeEl = document.getElementById("countryCode");
const currentDateEl = document.getElementById("currentDate");
const weatherIconEl = document.getElementById("weatherIcon");
const weatherDescEl = document.getElementById("weatherDesc");
const temperatureValueEl = document.getElementById("temperatureValue");
const tempUnitSymbolEl = document.getElementById("tempUnitSymbol");
const feelsLikeValueEl = document.getElementById("feelsLikeValue");
const feelsLikeUnitEl = document.getElementById("feelsLikeUnit");
const humidityValueEl = document.getElementById("humidityValue");
const windValueEl = document.getElementById("windValue");
const pressureValueEl = document.getElementById("pressureValue");
const minMaxValueEl = document.getElementById("minMaxValue");

// -----------------------------------------------------------------------------
// 3. Application State
// -----------------------------------------------------------------------------
let currentUnit = "metric"; // 'metric' (°C) or 'imperial' (°F)
let currentWeatherData = null; // Stores currently loaded weather data object

// -----------------------------------------------------------------------------
// 4. Built-in Demo Mock Data
// (Ensures the app runs beautifully out-of-the-box even before adding an API key)
// -----------------------------------------------------------------------------
const mockCityDatabase = {
  london: {
    name: "London",
    country: "GB",
    tempC: 18,
    feelsLikeC: 17,
    tempMinC: 14,
    tempMaxC: 21,
    humidity: 72,
    windSpeedKmh: 14,
    pressure: 1013,
    weatherGroup: "Clouds",
    description: "scattered clouds",
    icon: "03d"
  },
  "new york": {
    name: "New York",
    country: "US",
    tempC: 22,
    feelsLikeC: 21,
    tempMinC: 18,
    tempMaxC: 25,
    humidity: 58,
    windSpeedKmh: 18,
    pressure: 1016,
    weatherGroup: "Clear",
    description: "clear sky",
    icon: "01d"
  },
  tokyo: {
    name: "Tokyo",
    country: "JP",
    tempC: 26,
    feelsLikeC: 27,
    tempMinC: 23,
    tempMaxC: 29,
    humidity: 80,
    windSpeedKmh: 12,
    pressure: 1008,
    weatherGroup: "Rain",
    description: "light rain",
    icon: "10d"
  },
  paris: {
    name: "Paris",
    country: "FR",
    tempC: 19,
    feelsLikeC: 19,
    tempMinC: 15,
    tempMaxC: 22,
    humidity: 64,
    windSpeedKmh: 10,
    pressure: 1018,
    weatherGroup: "Clouds",
    description: "broken clouds",
    icon: "04d"
  },
  mumbai: {
    name: "Mumbai",
    country: "IN",
    tempC: 31,
    feelsLikeC: 36,
    tempMinC: 28,
    tempMaxC: 33,
    humidity: 84,
    windSpeedKmh: 16,
    pressure: 1009,
    weatherGroup: "Haze",
    description: "haze",
    icon: "50d"
  },
  sydney: {
    name: "Sydney",
    country: "AU",
    tempC: 20,
    feelsLikeC: 20,
    tempMinC: 16,
    tempMaxC: 23,
    humidity: 65,
    windSpeedKmh: 22,
    pressure: 1022,
    weatherGroup: "Clear",
    description: "sunny and clear",
    icon: "01d"
  }
};

// -----------------------------------------------------------------------------
// 5. Weather Fetching Logic
// -----------------------------------------------------------------------------
/**
 * Fetches weather data for a given city name.
 * Uses live OpenWeatherMap API if a valid key is set;
 * falls back to rich mock data if using default placeholder key.
 */
async function fetchWeather(city) {
  if (!city || city.trim() === "") {
    showError("Please enter a valid city name.");
    return;
  }

  showLoading(true);
  hideError();

  const isDemoKey = (!API_KEY || API_KEY === "YOUR_API_KEY_HERE" || API_KEY.trim() === "");

  if (isDemoKey) {
    // Simulate slight network latency for realistic feel
    setTimeout(() => {
      handleMockWeather(city.trim());
      showLoading(false);
    }, 400);
    return;
  }

  // Live API Request
  try {
    const url = `${API_BASE_URL}?q=${encodeURIComponent(city.trim())}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`City "${city}" not found. Please check spelling.`);
      } else if (response.status === 401) {
        throw new Error("Invalid API key. Please check your OpenWeatherMap key in script.js.");
      } else {
        throw new Error(`Weather service error (${response.status}). Please try again.`);
      }
    }

    const data = await response.json();
    demoNotice.style.display = "none";
    
    // Normalise live OpenWeather response
    currentWeatherData = {
      name: data.name,
      country: data.sys ? data.sys.country : "",
      tempC: Math.round(data.main.temp),
      feelsLikeC: Math.round(data.main.feels_like),
      tempMinC: Math.round(data.main.temp_min),
      tempMaxC: Math.round(data.main.temp_max),
      humidity: data.main.humidity,
      windSpeedKmh: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      pressure: data.main.pressure,
      weatherGroup: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon
    };

    renderWeather();
  } catch (error) {
    console.error("Fetch weather failed:", error);
    showError(error.message || "Failed to retrieve weather data.");
  } finally {
    showLoading(false);
  }
}

/**
 * Handles fallback mock weather when user hasn't inserted their API key yet.
 */
function handleMockWeather(city) {
  demoNotice.style.display = "flex";
  const normalized = city.toLowerCase();

  if (mockCityDatabase[normalized]) {
    currentWeatherData = { ...mockCityDatabase[normalized] };
    renderWeather();
  } else {
    // Generate realistic procedural weather for any arbitrary queried city
    const generatedTemp = Math.floor(Math.random() * 18) + 12; // 12°C - 30°C
    currentWeatherData = {
      name: city.charAt(0).toUpperCase() + city.slice(1),
      country: "LIVE",
      tempC: generatedTemp,
      feelsLikeC: generatedTemp - 1,
      tempMinC: generatedTemp - 4,
      tempMaxC: generatedTemp + 3,
      humidity: Math.floor(Math.random() * 40) + 45,
      windSpeedKmh: Math.floor(Math.random() * 20) + 8,
      pressure: 1012,
      weatherGroup: "Clouds",
      description: "partly cloudy",
      icon: "02d"
    };
    renderWeather();
  }
}

// -----------------------------------------------------------------------------
// 6. UI Rendering & Conversion Helpers
// -----------------------------------------------------------------------------
/**
 * Renders the weather data on the page according to selected unit (°C or °F).
 */
function renderWeather() {
  if (!currentWeatherData) return;

  const isMetric = currentUnit === "metric";

  // Temperature calculations
  const displayTemp = isMetric 
    ? currentWeatherData.tempC 
    : celsiusToFahrenheit(currentWeatherData.tempC);

  const displayFeelsLike = isMetric 
    ? currentWeatherData.feelsLikeC 
    : celsiusToFahrenheit(currentWeatherData.feelsLikeC);

  const displayMin = isMetric 
    ? currentWeatherData.tempMinC 
    : celsiusToFahrenheit(currentWeatherData.tempMinC);

  const displayMax = isMetric 
    ? currentWeatherData.tempMaxC 
    : celsiusToFahrenheit(currentWeatherData.tempMaxC);

  // Wind speed display
  const displayWind = isMetric
    ? `${currentWeatherData.windSpeedKmh} km/h`
    : `${Math.round(currentWeatherData.windSpeedKmh * 0.621371)} mph`;

  const unitSymbol = isMetric ? "°C" : "°F";

  // Populate DOM elements
  cityNameEl.textContent = currentWeatherData.name;
  countryCodeEl.textContent = currentWeatherData.country || "";
  currentDateEl.textContent = getFormattedDate();
  weatherDescEl.textContent = currentWeatherData.description;

  temperatureValueEl.textContent = displayTemp;
  tempUnitSymbolEl.textContent = unitSymbol;
  feelsLikeValueEl.textContent = displayFeelsLike;
  feelsLikeUnitEl.textContent = unitSymbol;

  humidityValueEl.textContent = `${currentWeatherData.humidity}%`;
  windValueEl.textContent = displayWind;
  pressureValueEl.textContent = `${currentWeatherData.pressure} hPa`;
  minMaxValueEl.textContent = `${displayMin}° / ${displayMax}°`;

  // Set weather icon
  weatherIconEl.src = `https://openweathermap.org/img/wn/${currentWeatherData.icon}@4x.png`;
  weatherIconEl.alt = currentWeatherData.description;

  // Update dynamic background theme
  updateTheme(currentWeatherData.weatherGroup);

  // Reveal weather content
  weatherContent.style.display = "block";
}

/**
 * Converts Celsius to Fahrenheit.
 */
function celsiusToFahrenheit(celsius) {
  return Math.round((celsius * 9) / 5 + 32);
}

/**
 * Formats current date (e.g., "Wednesday, 21 Oct")
 */
function getFormattedDate() {
  const now = new Date();
  const options = { weekday: "long", day: "numeric", month: "short" };
  return now.toLocaleDateString("en-US", options);
}

/**
 * Dynamically changes the body's background theme class based on weather group.
 */
function updateTheme(weatherGroup) {
  // Remove existing themes
  document.body.className = "";

  if (!weatherGroup) return;

  const group = weatherGroup.toLowerCase();

  if (group.includes("clear")) {
    document.body.classList.add("theme-clear");
  } else if (group.includes("cloud")) {
    document.body.classList.add("theme-clouds");
  } else if (group.includes("rain") || group.includes("drizzle")) {
    document.body.classList.add("theme-rain");
  } else if (group.includes("snow")) {
    document.body.classList.add("theme-snow");
  } else if (group.includes("thunderstorm")) {
    document.body.classList.add("theme-thunderstorm");
  } else if (group.includes("mist") || group.includes("fog") || group.includes("haze")) {
    document.body.classList.add("theme-mist");
  }
}

// -----------------------------------------------------------------------------
// 7. Error & Loading State Management
// -----------------------------------------------------------------------------
function showLoading(isLoading) {
  if (isLoading) {
    loadingIndicator.style.display = "block";
    weatherContent.style.opacity = "0.4";
    weatherContent.style.pointerEvents = "none";
  } else {
    loadingIndicator.style.display = "none";
    weatherContent.style.opacity = "1";
    weatherContent.style.pointerEvents = "auto";
  }
}

function showError(message) {
  errorText.textContent = message;
  errorMessage.style.display = "flex";
}

function hideError() {
  errorMessage.style.display = "none";
}

// -----------------------------------------------------------------------------
// 8. Event Listeners & Interaction
// -----------------------------------------------------------------------------
// Form submission (Search city)
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = cityInput.value.trim();
  if (query) {
    fetchWeather(query);
  } else {
    showError("Please enter a city name to search.");
  }
});

// Clear input button handler
cityInput.addEventListener("input", () => {
  if (cityInput.value.trim().length > 0) {
    clearBtn.style.display = "flex";
  } else {
    clearBtn.style.display = "none";
  }
});

clearBtn.addEventListener("click", () => {
  cityInput.value = "";
  clearBtn.style.display = "none";
  cityInput.focus();
});

// Unit Switchers (°C and °F)
celsiusBtn.addEventListener("click", () => {
  if (currentUnit !== "metric") {
    currentUnit = "metric";
    celsiusBtn.classList.add("active");
    fahrenheitBtn.classList.remove("active");
    renderWeather();
  }
});

fahrenheitBtn.addEventListener("click", () => {
  if (currentUnit !== "imperial") {
    currentUnit = "imperial";
    fahrenheitBtn.classList.add("active");
    celsiusBtn.classList.remove("active");
    renderWeather();
  }
});

// -----------------------------------------------------------------------------
// 9. Initial Load
// -----------------------------------------------------------------------------
// Automatically load default city on page launch
document.addEventListener("DOMContentLoaded", () => {
  fetchWeather("London");
});
