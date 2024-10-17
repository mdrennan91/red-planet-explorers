import { getFavorites, removeFavorite } from './utils.mjs';
import { setupPagination } from './Pagination.mjs';

const galleryGrid = document.querySelector('.gallery-grid');
let currentPage = 1;
const photosPerPage = 10;

export function displayFavorites(photos) {
    galleryGrid.innerHTML = photos.map(photo => `
      <div class="gallery-item">
        <a href="../single-photo/index.html?id=${photo.id}">
          <img src="${photo.img_src}" alt="Mars photo" />
        </a>
        <button class="heart-icon favorited" data-photo-id="${photo.id}">&#x2764;</button>  <!-- Use HTML code for the heart icon -->
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

        const updatedFavorites = getFavorites();
        displayFavorites(updatedFavorites);
      });
    });
}

export function initFavoritesGallery() {
  const favorites = getFavorites();
  if (favorites.length > 0) {
    displayFavorites(favorites.slice(0, photosPerPage));
    setupPagination(favorites.length, photosPerPage, currentPage, handlePageChange);
  } else {
    galleryGrid.innerHTML = '<p>No favorite photos found.</p>';
  }
}

function handlePageChange(newPage) {
  currentPage = newPage;
  const favorites = getFavorites();
  const paginatedFavorites = favorites.slice((currentPage - 1) * photosPerPage, currentPage * photosPerPage);
  displayFavorites(paginatedFavorites);
  setupPagination(favorites.length, photosPerPage, currentPage, handlePageChange);
}