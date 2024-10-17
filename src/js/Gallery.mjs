import { getParam, convertToJson, addFavorite, removeFavorite, isFavorited } from './utils.mjs';
import { setupPagination } from './Pagination.mjs';

const galleryGrid = document.querySelector('.gallery-grid');
let currentPage = parseInt(getParam('page')) || 1;
const photosPerPage = 10;

const apiBaseUrl = process.env.NODE_ENV === 'production'
  ? 'https://red-planet-explorers.onrender.com'
  : 'http://localhost:5000';

export async function initImageGallery() {
  const rover = getParam('rover');
  const sol = getParam('sol');
  const camera = getParam('camera');

  const cameraQuery = camera ? `&camera=${camera}` : '';
  const endpoint = `${apiBaseUrl}/api/rovers/${rover}/photos?sol=${sol}${cameraQuery}`;
  console.log('Fetching photos from:', endpoint);

  try {
    const response = await fetch(endpoint);
    const data = await convertToJson(response);

    if (data.photos.length > 0) {
      document.getElementById('gallery-title').textContent = `${rover.charAt(0).toUpperCase() + rover.slice(1)} Rover Photos - Sol ${sol}`;
      document.getElementById('gallery-subtitle').textContent = `There were ${data.photos.length} photos taken by the ${camera ? camera.toUpperCase() : 'all cameras'} camera on Sol ${sol}.`;

      const startIndex = (currentPage - 1) * photosPerPage;
      const endIndex = Math.min(startIndex + photosPerPage, data.photos.length);
      const paginatedPhotos = data.photos.slice(startIndex, endIndex);

      displayGallery(paginatedPhotos, rover, sol, camera);
      setupPagination(data.photos.length, photosPerPage, currentPage, handlePageChange);
    } else {
      galleryGrid.innerHTML = '<p>No photos found for the specified sol and camera.</p>';
    }
  } catch (error) {
    console.error('Error fetching photos:', error);
    galleryGrid.innerHTML = '<p>Error fetching photos. Please try again later.</p>';
  }
}

export function displayGallery(photos, rover, sol, camera) {
  galleryGrid.innerHTML = photos.map(photo => {
    console.log('Image Source:', photo.img_src);

    return `
      <div class="gallery-item" data-earth-date="${photo.earth_date}">
        <a href="../single-photo/index.html?id=${photo.id}">
          <img src="${photo.img_src}" alt="Mars photo" />
        </a>
        <button class="heart-icon ${isFavorited(photo.id) ? 'favorited' : ''}" data-photo-id="${photo.id}">❤</button>
      </div>
    `;
  }).join('');

  setupGalleryIcons(photos, rover, sol, camera);
}

export function setupGalleryIcons(photos, rover, sol, camera) {
  const heartIcons = document.querySelectorAll('.heart-icon');
  heartIcons.forEach(icon => {
    const photoId = icon.dataset.photoId;

    if (isFavorited(photoId)) {
      icon.classList.add('favorited');
    }

    icon.addEventListener('click', () => {
      const galleryItem = icon.closest('.gallery-item');
      const photoSrc = galleryItem.querySelector('img').src;

      const photoDetails = {
        id: photoId,         
        img_src: photoSrc,   
        rover: rover,        
        camera: camera || 'all',  
        earth_date: galleryItem.getAttribute('data-earth-date'),  
        sol: sol             
      };

      if (isFavorited(photoId)) {
        removeFavorite(photoId);
        icon.classList.remove('favorited');
      } else {
        addFavorite(photoDetails);
        icon.classList.add('favorited');
      }
    });
  });
}

function handlePageChange(newPage) {
  const rover = getParam('rover');
  const sol = getParam('sol');
  const camera = getParam('camera');
  
  const url = `index.html?rover=${rover}&sol=${sol}&camera=${camera || ''}&page=${newPage}`;
  window.location.href = url;
}