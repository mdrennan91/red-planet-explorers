import { qs, convertToJson } from './utils.mjs';

document.addEventListener('DOMContentLoaded', () => {
  displayMarsWeather();
});

export async function displayMarsWeather() {
  const apiKey = import.meta.env.VITE_NASA_API_KEY;
  const weatherApiUrl = `https://api.nasa.gov/insight_weather/?api_key=${apiKey}&feedtype=json&ver=1.0`;

  try {
    const response = await fetch(weatherApiUrl);
    const data = await convertToJson(response);

    const sol = data.sol_keys[0];
    const temperature = data[sol].AT;
    
    const highTempCelsius = temperature.mx;
    const lowTempCelsius = temperature.mn;
    const highTempFahrenheit = Math.round((highTempCelsius * 9 / 5) + 32);
    const lowTempFahrenheit = Math.round((lowTempCelsius * 9 / 5) + 32);

    const banner = qs('#mars-weather-banner');
    if (banner) {
      banner.innerHTML = `
        <div>
          Most Recent Weather Readings from Mars InSight Lander: High: ${highTempFahrenheit}°F, Low: ${lowTempFahrenheit}°F
          <button id="close-weather-banner" class="close-button">X</button>
        </div>
      `;
      banner.style.display = 'block';

      const closeButton = qs('#close-weather-banner');
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          banner.style.display = 'none';
        });
      }
    } else {
      console.error('Mars weather banner not found in the DOM');
    }

  } catch (error) {
    console.error('Error fetching Mars weather data:', error);
  }
}