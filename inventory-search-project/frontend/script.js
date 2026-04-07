document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  const categorySelect = document.getElementById('categorySelect');
  const minPriceInput = document.getElementById('minPriceInput');
  const maxPriceInput = document.getElementById('maxPriceInput');
  
  const resultsTable = document.getElementById('resultsTable');
  const resultsBody = document.getElementById('resultsBody');
  const emptyState = document.getElementById('emptyState');
  const loadingState = document.getElementById('loadingState');
  const errorState = document.getElementById('errorState');
  const resultsCount = document.getElementById('resultsCount');

  // Initial fetch on page load
  fetchInventory();

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    fetchInventory();
  });

  async function fetchInventory() {
    showLoading();

    const q = searchInput.value.trim();
    const category = categorySelect.value;
    const minPrice = minPriceInput.value;
    const maxPrice = maxPriceInput.value;

    // Client-side validation for price
    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
      showError('Minimum price cannot be greater than maximum price.');
      return;
    }

    // Build query params
    const params = new URLSearchParams();
    if (q) params.append('q', q);
    if (category) params.append('category', category);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);

    try {
      // If served by the same server, use relative path, otherwise use full localhost path
      // Since it's requested to test via browser, we'll try API on same host but fallback to node typical port if needed
      const endpoint = `/api/search?${params.toString()}`;
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        let errMsg = 'Failed to fetch results from server.';
        try {
          const errData = await response.json();
          if (errData.message) errMsg = errData.message;
        } catch(e) {}
        throw new Error(errMsg);
      }

      const data = await response.json();
      renderResults(data);
    } catch (err) {
      // In case we are running via standalone index.html, we might get fetch error
      // due to different origin. For this assignment, assuming it's served via backend.
      console.error(err);
      showError(err.message || 'Could not connect to the API. Make sure the backend server is running.');
    }
  }

  function renderResults(data) {
    hideLoading();
    hideError();

    resultsCount.textContent = `${data.length} item${data.length !== 1 ? 's' : ''} found`;

    if (data.length === 0) {
      resultsTable.classList.add('hidden');
      emptyState.classList.remove('hidden');
      return;
    }

    emptyState.classList.add('hidden');
    resultsTable.classList.remove('hidden');

    resultsBody.innerHTML = '';
    
    data.forEach((item, index) => {
      const tr = document.createElement('tr');
      // Adding stagger effect on rows
      tr.style.animationDelay = `${index * 0.05}s`;
      
      tr.innerHTML = `
        <td>
          <div style="font-weight: 500">${item.productName}</div>
        </td>
        <td>
          <span class="category-pill">${item.category}</span>
        </td>
        <td class="price-cell">$${item.price.toFixed(2)}</td>
        <td>${item.supplier}</td>
      `;
      resultsBody.appendChild(tr);
    });
  }

  function showLoading() {
    resultsTable.classList.add('hidden');
    emptyState.classList.add('hidden');
    errorState.classList.add('hidden');
    loadingState.classList.remove('hidden');
  }

  function hideLoading() {
    loadingState.classList.add('hidden');
  }

  function showError(msg) {
    hideLoading();
    resultsTable.classList.add('hidden');
    emptyState.classList.add('hidden');
    
    errorState.textContent = msg;
    errorState.classList.remove('hidden');
    resultsCount.textContent = '0 items found';
  }

  function hideError() {
    errorState.classList.add('hidden');
  }
});
