import { convertToJson, getFavorites } from './utils.mjs';

export async function fetchPhotoDetails(photoId, rover, sol) {
  const favorites = getFavorites();
  let photo = favorites.find(fav => fav.id === photoId);

  if (!photo) {
    const apiKey = import.meta.env.VITE_NASA_API_KEY;  
    const apiUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=${apiKey}`; 
    
    try {
      const response = await fetch(apiUrl);
      const data = await convertToJson(response);
      photo = data.photos.find(p => p.id === parseInt(photoId));

      if (!photo) {
        throw new Error("Photo not found in API response.");
      }
    } catch (error) {
      console.error('Error fetching photo details:', error);
      return null;
    }
  }
  
  return photo;
}

export function updatePhotoDetails(photo) {
  document.getElementById('photo-img').src = photo.img_src;
  
  const roverName = typeof photo.rover === 'string' ? photo.rover.charAt(0).toUpperCase() + photo.rover.slice(1) : (photo.rover?.name || 'Unknown Rover');
  const cameraName = typeof photo.camera === 'string' ? photo.camera.toUpperCase() : (photo.camera?.name.toUpperCase() || 'Unknown Camera');

  document.getElementById('photo-rover').textContent = roverName;
  document.getElementById('photo-camera-name').textContent = cameraName;
  document.getElementById('photo-earth-date').textContent = photo.earth_date || 'Unknown Earth Date';
  document.getElementById('photo-sol').textContent = photo.sol || 'Unknown Sol';
}