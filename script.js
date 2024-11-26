const API_KEY = "e30a987bf8691a449fc7e9f7d8e9e789"; // Reemplaza con tu clave API

document.getElementById("search-btn").addEventListener("click", async () => {
  const city = document.getElementById("city-input").value;
  if (city) {
    console.log(`Buscando el clima de: ${city}`);
    try {
      // Obtener el clima actual
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`
      );
      if (!response.ok) {
        throw new Error("Ciudad no encontrada");
      }
      const data = await response.json();
      displayWeather(data);

      // Obtener el pronóstico de los próximos 5 días (cada 3 horas)
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=es`
      );
      const forecastData = await forecastResponse.json();

      // Mostrar el pronóstico de 5 días (cada 3 horas)
      displayForecast(forecastData.list); // Pronóstico cada 3 horas
    } catch (error) {
      alert(error.message);
    }
  } else {
    alert("Por favor, escribe una ciudad.");
  }
});

function displayWeather(data) {
  const weatherDiv = document.getElementById("weather-result");
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  // Mostrar los datos del clima actual
  weatherDiv.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <img src="${iconUrl}" alt="Icono del clima">
    <p>Temperatura: ${data.main.temp}°C</p>
    <p>Clima: ${data.weather[0].description}</p>
    <p>Humedad: ${data.main.humidity}%</p>
    <p>Viento: ${data.wind.speed} m/s</p>
  `;
}

function displayForecast(forecastList) {
  const forecastDiv = document.getElementById("forecast");
  forecastDiv.innerHTML = ""; // Limpiar el contenido anterior

  // Agrupar el pronóstico por día
  const dailyForecast = [];
  forecastList.forEach((forecast) => {
    const date = new Date(forecast.dt * 1000);
    const day = date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    // Comprobar si ya tenemos un día en el arreglo
    let dayForecast = dailyForecast.find((item) => item.day === day);
    if (!dayForecast) {
      dayForecast = { day: day, hours: [] };
      dailyForecast.push(dayForecast);
    }

    // Agregar los datos de cada hora
    dayForecast.hours.push(forecast);
  });

  // Mostrar el pronóstico de cada día con las horas
  dailyForecast.forEach((day) => {
    const dayElement = document.createElement("div");
    dayElement.classList.add("forecast-day");
    dayElement.innerHTML = `<h4>${day.day}</h4>`;

    // Mostrar las primeras 3 horas del día
    day.hours.slice(0, 3).forEach((hour) => {
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
  <hr> <!-- Línea de separación -->
`;
    });

    forecastDiv.appendChild(dayElement);
  });
}
