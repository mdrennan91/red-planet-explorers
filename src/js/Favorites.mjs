import { getFavorites, removeFavorite } from './utils.mjs';
import { setupPagination } from './Pagination.mjs';

const galleryGrid = document.querySelector('.gallery-grid');
let currentPage = 1;
const photosPerPage = 10;
let filteredFavorites = getFavorites();

export function displayFavorites(photos) {
    galleryGrid.innerHTML = photos.map(photo => `
      <div class="gallery-item">
        <a href="../single-photo/index.html?id=${photo.id}">
          <img src="${photo.img_src}" alt="Mars photo" />
        </a>
        <button class="heart-icon favorited" data-photo-id="${photo.id}">&#x2764;</button>
      </div>
    `).join('');

    setupFavoritesPageIcons();
}

function setupFavoritesPageIcons() {
    const heartIcons = document.querySelectorAll('.heart-icon');
    heartIcons.forEach(icon => {
      icon.addEventListener('click', () => {
        const photoId = icon.dataset.photoId;
        removeFavorite(photoId);

        filteredFavorites = getFavorites();
        displayFavorites(filteredFavorites.slice((currentPage - 1) * photosPerPage, currentPage * photosPerPage));
      });
    });
}

export function initFavoritesGallery() {
  const favorites = getFavorites();
  if (favorites.length > 0) {
    setupFilterOptions(favorites);
    displayFavorites(favorites.slice(0, photosPerPage));
    setupPagination(favorites.length, photosPerPage, currentPage, handlePageChange);
  } else {
    galleryGrid.innerHTML = '<p>No favorite photos found.</p>';
  }
}

function handlePageChange(newPage) {
  currentPage = newPage;
  const paginatedFavorites = filteredFavorites.slice((currentPage - 1) * photosPerPage, currentPage * photosPerPage);
  displayFavorites(paginatedFavorites);
  setupPagination(filteredFavorites.length, photosPerPage, currentPage, handlePageChange);
}

function setupFilterOptions(favorites) {
  const roverDropdown = document.getElementById('filter-rover');
  const solDropdown = document.getElementById('filter-sol');
  const cameraDropdown = document.getElementById('filter-camera');

  const rovers = [...new Set(favorites.map(photo => photo.rover))];
  rovers.forEach(rover => {
    const option = document.createElement('option');
    option.value = rover;
    option.textContent = rover.charAt(0).toUpperCase() + rover.slice(1);
    roverDropdown.appendChild(option);
  });

  roverDropdown.addEventListener('change', (event) => {
    const selectedRover = event.target.value;
    
    const roverPhotos = favorites.filter(photo => photo.rover === selectedRover);
    
    const sols = [...new Set(roverPhotos.map(photo => photo.sol.toString()))];
    
    solDropdown.innerHTML = '<option value="">Select Sol</option>';
    sols.forEach(sol => {
      const option = document.createElement('option');
      option.value = sol;
      option.textContent = sol;
      solDropdown.appendChild(option);
    });
    
    updateCameraDropdown(roverPhotos);
  
    solDropdown.addEventListener('change', (event) => {
      const selectedSol = event.target.value;
      if (selectedSol) {
        const solPhotos = roverPhotos.filter(photo => photo.sol === selectedSol);
        updateCameraDropdown(solPhotos);
      } else {
        updateCameraDropdown(roverPhotos);
      }
    });
  });

  document.getElementById('apply-filter-btn').addEventListener('click', () => {
    applyFilter(favorites);
  });

  document.getElementById('clear-filter-btn').addEventListener('click', () => {
    clearFilter(favorites);
  });
}

function updateCameraDropdown(photos) {
  const cameraDropdown = document.getElementById('filter-camera');
  const cameras = [...new Set(photos.map(photo => photo.camera))];

  cameraDropdown.innerHTML = '<option value="">Select Camera</option>';
  cameras.forEach(camera => {
    const option = document.createElement('option');
    option.value = camera;
    option.textContent = camera.toUpperCase();
    cameraDropdown.appendChild(option);
  });
}

function applyFilter(favorites) {
  const rover = document.getElementById('filter-rover').value;
  const sol = document.getElementById('filter-sol').value;
  const camera = document.getElementById('filter-camera').value;

  filteredFavorites = favorites.filter(photo => {
    let matches = true;
    if (rover && photo.rover !== rover) matches = false;
    if (sol && photo.sol !== sol) matches = false;
    if (camera && photo.camera !== camera) matches = false;
    return matches;
  });

  currentPage = 1;
  displayFavorites(filteredFavorites.slice(0, photosPerPage));
  setupPagination(filteredFavorites.length, photosPerPage, currentPage, handlePageChange);
}

function clearFilter(favorites) {
  document.getElementById('filter-rover').value = '';
  document.getElementById('filter-sol').innerHTML = '<option value="">Select Sol</option>'; // Reset sol dropdown
  document.getElementById('filter-camera').innerHTML = '<option value="">Select Camera</option>'; // Reset camera dropdown

  filteredFavorites = favorites;
  displayFavorites(favorites.slice(0, photosPerPage));
  setupPagination(favorites.length, photosPerPage, currentPage, handlePageChange);
}