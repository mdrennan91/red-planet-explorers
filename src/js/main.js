import { loadHeaderFooter } from "./utils.mjs";
import { getRoverDetails } from "./Search.mjs";
import { displayMarsWeather } from './Weather.mjs';

loadHeaderFooter();

async function updateRoverPhotoCounts() {
  const rovers = ['curiosity', 'opportunity', 'spirit', 'perseverance'];

  const roverGrid = document.getElementById('rovers-grid');
  if (!roverGrid) return; 

  for (const rover of rovers) {
    const roverData = await getRoverDetails(rover);
    const roverElement = roverGrid.querySelector(`a[href*="${rover}"]`);

    if (roverData && roverElement) {
      const totalPhotos = roverData.total_photos;
      const photoCountElement = document.createElement('p');
      photoCountElement.textContent = `Total Photos: ${totalPhotos}`;
      photoCountElement.classList.add('photo-count');
      roverElement.appendChild(photoCountElement);
    }
  }
}

updateRoverPhotoCounts();
displayMarsWeather();