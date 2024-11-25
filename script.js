const API_KEY = "799bd86c5d1900f3e7db39e0738fe37c"; // Reemplaza con tu clave API

document.getElementById("search-btn").addEventListener("click", async () => {
  const city = document.getElementById("city-input").value;
  if (city) {
    console.log(`Buscando el clima de: ${city}`);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`
      );
      if (!response.ok) {
        throw new Error("Ciudad no encontrada");
      }
      const data = await response.json();
      displayWeather(data);
    } catch (error) {
      alert(error.message);
    }
  } else {
    alert("Por favor, escribe una ciudad.");
  }
});

function displayWeather(data) {
  const weatherDiv = document.getElementById("weather-result");
  const iconCode = data.weather[0].icon; // Código del icono
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // URL del icono

  weatherDiv.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <img src="${iconUrl}" alt="Icono del clima">
        <p>Temperatura: ${data.main.temp}°C</p>
        <p>Clima: ${data.weather[0].description}</p>
        <p>Humedad: ${data.main.humidity}%</p>
        <p>Viento: ${data.wind.speed} m/s</p>
    `;
}
navigator.geolocation.getCurrentPosition(async (position) => {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`
  );
  const data = await response.json();
  displayWeather(data);
});
