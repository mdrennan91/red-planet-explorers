import { setupPagination } from './Pagination.mjs';

const galleryGrid = document.querySelector('.gallery-grid');
let currentPage = parseInt(new URLSearchParams(window.location.search).get('page')) || 1;
const photosPerPage = 10;

export async function initFeaturedGallery() {
  try {
    const response = await fetch('/json/featured.json');
    const data = await response.json();

    if (data.length > 0) {
      const startIndex = (currentPage - 1) * photosPerPage;
      const endIndex = Math.min(startIndex + photosPerPage, data.length);
      const paginatedPhotos = data.slice(startIndex, endIndex);

      displayFeaturedGallery(paginatedPhotos);
      setupPagination(data.length, photosPerPage, currentPage, handlePageChange);
    } else {
      galleryGrid.innerHTML = '<p>No featured images available at the moment.</p>';
    }
  } catch (error) {
    console.error('Error fetching featured photos:', error);
    galleryGrid.innerHTML = '<p>Error fetching featured photos. Please try again later.</p>';
  }
}

function displayFeaturedGallery(photos) {
  galleryGrid.innerHTML = photos.map(photo => {
    return `
      <div class="gallery-item" data-earth-date="${photo.earth_date}">
        <a href="../single-photo/index.html?id=${photo.id}&rover=${photo.rover}&sol=${photo.sol}">
          <img src="${photo.img_src}" alt="Mars photo from ${photo.rover}" />
        </a>
        <p><span class="highlight">Rover:</span> ${photo.rover} | <span class="highlight">Camera:</span> ${photo.camera}</p>
        <p><span class="highlight">Sol:</span> ${photo.sol} | <span class="highlight">Earth Date:</span> ${photo.earth_date}</p>
      </div>
    `;
  }).join('');
}

function handlePageChange(newPage) {
  const url = `index.html?page=${newPage}`;
  window.location.href = url;
}