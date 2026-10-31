# SkyPulse Weather Application

A clean, responsive, and modern Weather Web Application built with vanilla HTML5, CSS3, and JavaScript.

---

## 🌟 Features
- **Global City Search:** Search weather conditions for any city worldwide.
- **Real-Time Weather Metrics:**
  - Current Temperature (°C / °F)
  - Weather Condition Description (e.g., Clear sky, Scattered clouds, Light rain)
  - "Feels Like" Temperature
  - Humidity Percentage (%)
  - Wind Speed (km/h or mph)
  - Atmospheric Pressure (hPa)
  - Daily Min / Max Temperature Range
- **Dynamic Weather Icons:** High-resolution icons fetched dynamically according to current weather conditions.
- **Dynamic Adaptive Backgrounds:** Color gradients adapt to the weather (Clear, Clouds, Rain, Snow, Thunderstorm, Mist).
- **Celsius ⇄ Fahrenheit Unit Toggle:** Seamless one-click temperature unit conversion without re-fetching.
- **Dual Mode (Demo Mode + Live API):**
  - **Demo Mode:** Works out of the box with built-in realistic mock data for popular cities even before adding an API key.
  - **Live Mode:** Powered by OpenWeatherMap API for live real-time conditions.
- **Robust Error Handling:** Visual alerts for invalid city names, empty inputs, or network issues with subtle shake animation.
- **100% Responsive Design:** Mobile, tablet, and desktop friendly with a modern Glassmorphism UI.

---

## 📁 Project Structure
```text
weather-app/
├── index.html     # Semantic HTML5 layout and card structure
├── style.css      # Modern styling, glassmorphism, animations & media queries
├── script.js      # Vanilla JavaScript logic, API integration, and DOM updates
└── README.md      # Project documentation and guide
```

---

## 🔑 How to Get a Free OpenWeatherMap API Key
1. Go to [OpenWeatherMap Sign Up](https://home.openweathermap.org/users/sign_up) and register a free account.
2. Confirm your email address.
3. Log in and navigate to the **API keys** tab on your dashboard.
4. Copy your default 32-character API key (or create a new named key).
5. Open `script.js` and paste your key on line 23:
   ```javascript
   const API_KEY = "YOUR_ACTUAL_32_CHAR_API_KEY_HERE";
   ```
6. Save the file. The app will immediately switch from Demo Mode to Live API data!
*(Note: Newly created OpenWeatherMap keys typically activate within 10 to 30 minutes).*

---

## 🚀 How to Run the Project
### Option 1: Direct Browser Launch (Simplest)
- Double-click `index.html` or right-click `index.html` and select **Open with Google Chrome** (or Edge/Firefox).

### Option 2: VS Code Live Server
1. Open the `weather-app` folder in Visual Studio Code.
2. Install the **Live Server** extension if not already installed.
3. Right-click `index.html` and choose **"Open with Live Server"**.

---

## 🧠 How the Code Works
1. **HTML (`index.html`):**
   - Provides semantic markup with a main glassmorphic card container.
   - Includes search input, submit button, quick clear button, unit switchers (`°C`/`°F`), weather overview, and a 2x2 details grid.
2. **CSS (`style.css`):**
   - Implements glassmorphism using `backdrop-filter: blur(20px)` with semi-transparent backgrounds and subtle glowing ambient orbs.
   - Uses CSS Grid for the 4-box details section and CSS Flexbox for alignment.
   - Changes gradient backgrounds dynamically when JS adds classes (`theme-clear`, `theme-clouds`, `theme-rain`, etc.) to the `<body>`.
3. **JavaScript (`script.js`):**
   - Listens for form submission, reads the city query, and dispatches an asynchronous `fetch()` request to OpenWeatherMap.
   - Processes JSON response to extract temperature, humidity, wind, and conditions.
   - Updates the DOM elements dynamically with formatting helpers.
   - Provides instant client-side temperature and speed conversion between metric (°C, km/h) and imperial (°F, mph).
