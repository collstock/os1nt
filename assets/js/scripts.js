function updateItemCount() {
  const layoutSection = document.querySelector('.layout');
  const items = layoutSection ? layoutSection.querySelectorAll('li.item') : [];
  const count = items.length;
  const countElement = document.getElementById('item-count');
  if (countElement) {
    countElement.textContent = count;
  }
}

updateItemCount();

const observer = new MutationObserver(updateItemCount);
const layoutSection = document.querySelector('.layout');
if (layoutSection) {
  observer.observe(layoutSection, { childList: true, subtree: true });
}

const toggleAllBtn = document.getElementById('toggle-all');
if (toggleAllBtn) {
  toggleAllBtn.addEventListener('click', () => {
    // Select all details elements in the layout section (including those in three columns)
    const allDetails = document.querySelectorAll('.layout details, .col-left details, .col-middle details, .col-right details');
    const anyOpen = Array.from(allDetails).some(d => d.open);

    // Toggle all details elements
    allDetails.forEach(details => {
      details.open = !anyOpen;
    });

    // Update button text
    toggleAllBtn.textContent = anyOpen ? 'Expand All' : 'Collapse All';
  });
}

// Search clear button behavior
(function() {
  const searchInput = document.getElementById('search-input');
  const searchClear = document.getElementById('search-clear');
  if (!searchInput || !searchClear) return;

  const updateClear = () => {
    if (searchInput.value.trim().length > 0) {
      searchClear.removeAttribute('hidden');
    } else {
      searchClear.setAttribute('hidden', '');
    }
  };

  searchInput.addEventListener('input', updateClear);

  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    updateClear();
    searchInput.focus();
    // Trigger input event for search filtering
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    // Also directly call the filter if it's available
    if (window.applyOsintFilter) {
      window.applyOsintFilter('');
    }
  });

  updateClear();
})();