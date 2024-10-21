export function setupPagination(totalPhotos, photosPerPage, currentPage, onPageChange) {
  const totalPages = Math.ceil(totalPhotos / photosPerPage);
  const paginationContainer = document.querySelector('.pagination');

  paginationContainer.innerHTML = '';

  if (totalPages <= 1) {
    return;
  }

  let paginationHtml = `<button class="pagination-btn prev-btn" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>`;

  for (let i = 1; i <= totalPages; i++) {
    paginationHtml += `<button class="pagination-btn page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
  }

  paginationHtml += `<button class="pagination-btn next-btn" ${currentPage === totalPages ? 'disabled' : ''}>Next</button>`;

  paginationContainer.innerHTML = paginationHtml;

  const prevButton = document.querySelector('.prev-btn');
  const nextButton = document.querySelector('.next-btn');
  const pageButtons = document.querySelectorAll('.page-btn');

  prevButton.addEventListener('click', () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  });

  nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  });

  pageButtons.forEach(btn => {
    btn.addEventListener('click', (event) => {
      const selectedPage = parseInt(event.target.getAttribute('data-page'));
      onPageChange(selectedPage);
    });
  });
}