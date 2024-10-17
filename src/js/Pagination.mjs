export function setupPagination(totalItems, itemsPerPage, currentPage, onPageChange) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationContainer = document.querySelector('.pagination');
  
    paginationContainer.innerHTML = '';
  
    if (currentPage > 1) {
      const prevPage = document.createElement('button');
      prevPage.textContent = 'Previous';
      prevPage.addEventListener('click', () => {
        onPageChange(currentPage - 1);
      });
      paginationContainer.appendChild(prevPage);
    }
  
    if (currentPage < totalPages) {
      const nextPage = document.createElement('button');
      nextPage.textContent = 'Next';
      nextPage.addEventListener('click', () => {
        onPageChange(currentPage + 1);  
      });
      paginationContainer.appendChild(nextPage);
    }
  }