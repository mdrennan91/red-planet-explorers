import { addFavorite, removeFavorite, isFavorited } from './utils.mjs';

const galleryGrid = document.querySelector('.gallery-grid');

export async function initFeaturedGallery() {
  try {
    const response = await fetch('/json/featured.json');
    const data = await response.json();

    if (data.length > 0) {
      displayFeaturedGallery(data);
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
        <p><span class="highlight">Sol:</span> ${photo.sol} | <span class="highlight">Earth Date:</span> ${photo.earth_date} </p>
        <button class="heart-icon ${isFavorited(photo.id) ? 'favorited' : ''}" data-photo-id="${photo.id}">❤</button>
      </div>
    `;
  }).join('');

  setupGalleryIcons(photos);
}

function setupGalleryIcons(photos) {
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
        rover: photo.rover,
        camera: photo.camera,
        earth_date: galleryItem.getAttribute('data-earth-date'),
        sol: photo.sol
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