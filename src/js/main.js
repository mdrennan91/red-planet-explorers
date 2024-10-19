import { loadHeaderFooter } from "./utils.mjs";
import { getRoverDetails } from "./Search.mjs";

loadHeaderFooter();

async function updateRoverPhotoCounts() {
  const rovers = ['curiosity', 'perseverance'];

  for (const rover of rovers) {
    const roverData = await getRoverDetails(rover);

    const roverElement = document.querySelector(`a[href*="${rover}"]`);

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