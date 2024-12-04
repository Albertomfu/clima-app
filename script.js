import CONFIG from "./config.js";

const API_KEY = CONFIG.OPENWEATHER_API_KEY; // Para entorno local

// Para entorno Netlify (asegúrate de que la variable esté configurada correctamente en Netlify)
const API_KEY_APPTIME_NETLIFY = window.NETLIFY_API_KEY || "development-api-key";

// Elementos del DOM
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const suggestionsDiv = document.createElement("div"); // Contenedor para las sugerencias
suggestionsDiv.id = "suggestions";
document.body.appendChild(suggestionsDiv);

// Función para obtener sugerencias de ciudades
cityInput.addEventListener("input", async () => {
  const query = cityInput.value.trim();

  if (query.length > 1) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
      );
      const data = await response.json();

      // Mostrar sugerencias
      displaySuggestions(data);
    } catch (error) {
      console.error("Error obteniendo sugerencias:", error);
    }
  } else {
    clearSuggestions(); // Limpiar las sugerencias si no hay texto
  }
});

// Mostrar sugerencias en la lista desplegable
function displaySuggestions(suggestions) {
  clearSuggestions();

  suggestions.forEach((city) => {
    const suggestion = document.createElement("div");
    suggestion.classList.add("suggestion");
    suggestion.textContent = `${city.name}, ${city.country}`;
    suggestion.addEventListener("click", () => {
      cityInput.value = city.name; // Rellenar el input con la ciudad seleccionada
      clearSuggestions();
    });
    suggestionsDiv.appendChild(suggestion);
  });

  // Posicionar las sugerencias debajo del input
  const inputRect = cityInput.getBoundingClientRect();
  suggestionsDiv.style.left = `${inputRect.left}px`;
  suggestionsDiv.style.top = `${inputRect.bottom + window.scrollX}px`;
  suggestionsDiv.style.width = `${inputRect.width}px`;
}

// Limpiar las sugerencias
function clearSuggestions() {
  suggestionsDiv.innerHTML = "";
}

// Manejo de la búsqueda
searchBtn.addEventListener("click", async () => {
  const city = cityInput.value;
  if (city) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`
      );
      if (!response.ok) {
        throw new Error("Ciudad no encontrada");
      }
      const data = await response.json();
      displayWeather(data);

      // Obtener pronóstico
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=es`
      );
      const forecastData = await forecastResponse.json();
      displayForecast(forecastData.list);
    } catch (error) {
      alert(error.message);
    }
  } else {
    alert("Por favor, escribe una ciudad.");
  }
});

// Función para mostrar el clima (sin cambios)
function displayWeather(data) {
  const weatherDiv = document.getElementById("weather-result");
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  weatherDiv.innerHTML = `<div class="caracola">
    <h2>${data.name}, ${data.sys.country}</h2>
    <img src="${iconUrl}" alt="Icono del clima">
    <p>Temperatura: ${data.main.temp}°C</p>
    <p>Clima: ${data.weather[0].description}</p>
    <p>Humedad: ${data.main.humidity}%</p>
    <p>Viento: ${data.wind.speed} m/s</p></div>
  `;
}

function displayForecast(forecastList) {
  const forecastDiv = document.getElementById("forecast");
  forecastDiv.innerHTML = ""; // Limpiar el contenido anterior

  // Agrupar el pronóstico por día
  const dailyForecast = {};
  forecastList.forEach((forecast) => {
    const date = new Date(forecast.dt * 1000);
    const day = date.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "short",
    });

    // Si el día no está en el objeto, inicializarlo
    if (!dailyForecast[day]) {
      dailyForecast[day] = [];
    }

    // Agregar el pronóstico a ese día
    dailyForecast[day].push(forecast);
  });

  // Mostrar los datos de cada día
  for (const [day, forecasts] of Object.entries(dailyForecast)) {
    const dayElement = document.createElement("div");
    dayElement.classList.add("forecast-day");
    dayElement.innerHTML = `<h4>${day}</h4>`;

    forecasts.forEach((hour) => {
      const time = new Date(hour.dt * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const iconUrl = `https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`;
      const temp = hour.main.temp;
      const description = hour.weather[0].description;

      dayElement.innerHTML += `
        <div class="hourly-forecast">
          <p>${time}</p>
          <img src="${iconUrl}" alt="Icono del clima">
          <p>${temp}°C</p>
          <p>${description}</p>
        </div>
      `;
    });

    forecastDiv.appendChild(dayElement);
  }
}
const cookieBanner = document.getElementById("cookie-banner");
const acceptButton = document.getElementById("accept-cookies");
const cancelButton = document.getElementById("cancel-cookies");

// Verificar si el usuario ya aceptó las cookies
if (!localStorage.getItem("cookiesAccepted")) {
  cookieBanner.style.display = "block";
}

// Si el usuario acepta, ocultamos el banner y guardamos la aceptación en el almacenamiento local
acceptButton.addEventListener("click", () => {
  localStorage.setItem("cookiesAccepted", "true");
  cookieBanner.style.display = "none";
});

// Si el usuario cancela, ocultamos el banner sin guardar nada en el almacenamiento local
cancelButton.addEventListener("click", () => {
  cookieBanner.style.display = "none";
});
