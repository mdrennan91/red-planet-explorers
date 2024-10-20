import { convertToJson } from './utils.mjs';

export const roverImages = {
  curiosity: '/images/curiosity.png',
  opportunity: '/images/opportunity.png',
  spirit: '/images/spirit.png',
  perseverance: '/images/perseverance.png',
};

export async function updateRoverDetails(rover) {
  const apiKey = import.meta.env.VITE_NASA_API_KEY;
  const roverApiUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}?api_key=${apiKey}`;  

  try {
    const response = await fetch(roverApiUrl);
    const data = await convertToJson(response);

    const roverData = data.rover;

    const totalPhotos = roverData.total_photos;
    const maxSol = roverData.max_sol;
    const landingDate = roverData.landing_date;
    const launchDate = roverData.launch_date;
    const status = roverData.status;

    const photoInfoElement = document.getElementById('photo-collection-info');
    photoInfoElement.innerHTML = `There are <span class="highlight">${totalPhotos}</span> photos in this collection from <span class="highlight">${maxSol}</span> sols <br> of ${rover.charAt(0).toUpperCase() + rover.slice(1)} exploring the Red Planet.`;

    const roverInfoElement = document.getElementById('rover-info');
    if (roverInfoElement) {
      roverInfoElement.innerHTML = `
        <p><strong>Launch Date:</strong> ${launchDate}</p>
        <p><strong>Landing Date:</strong> ${landingDate}</p>
        <p><strong>Status:</strong> ${status.charAt(0).toUpperCase() + status.slice(1)}</p>
        
      `;
    } else {
      console.error('Rover info element not found.');
    }

    const cameras = roverData.cameras;
    const cameraListElement = document.getElementById('camera-list');
    const cameraDropdownElement = document.getElementById('camera');

    cameraListElement.innerHTML = '';
    cameraDropdownElement.innerHTML = '<option value="">Select Camera</option>';

    cameras.forEach(camera => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${camera.name}</strong>: ${camera.full_name}`;
      cameraListElement.appendChild(li);

      const option = document.createElement('option');
      option.value = camera.name.toLowerCase();
      option.textContent = camera.name;
      cameraDropdownElement.appendChild(option);
    });

  } catch (error) {
    console.error('Error fetching rover manifest:', error);
    const photoInfoElement = document.getElementById('photo-collection-info');
    photoInfoElement.textContent = 'Error fetching rover details.';
  }
}

export async function getRoverDetails(rover) {
  const apiKey = import.meta.env.VITE_NASA_API_KEY;
  const roverApiUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}?api_key=${apiKey}`;

  try {
    const response = await fetch(roverApiUrl);
    const data = await convertToJson(response);
    return data.rover;
  } catch (error) {
    console.error(`Error fetching details for rover ${rover}:`, error);
    return null;
  }
}


export function setupCameraDropdown(rover) {
  updateRoverDetails(rover); 
}