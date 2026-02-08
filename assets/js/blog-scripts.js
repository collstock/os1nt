// blog-scripts.js
// Handles search, clear button, and post filtering for blog.html

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('post-search');
  const searchClear = document.getElementById('post-search-clear');
  const posts = Array.from(document.querySelectorAll('.post-card'));
  const countEl = document.getElementById('post-count');

  function filterPosts(){
    const query = searchInput.value.trim().toLowerCase();
    let visible = 0;
    posts.forEach(post => {
      const titleEl = post.querySelector('.card-title h2');
      const title = titleEl ? titleEl.textContent.toLowerCase() : '';
      const tagEls = post.querySelectorAll('.chip');
      const tags = Array.from(tagEls).map(el => el.textContent.toLowerCase()).join(' ');
      const fullText = post.textContent.toLowerCase();
      const match = !query || title.includes(query) || tags.includes(query) || fullText.includes(query);
      post.style.display = match ? '' : 'none';
      if(match) visible++;
    });
    if (countEl) countEl.textContent = visible;
  }

  const updateClear = () => {
    if (!searchClear || !searchInput) return;
    if (searchInput.value && searchInput.value.trim().length > 0) {
      searchClear.removeAttribute('hidden');
    } else {
      searchClear.setAttribute('hidden', '');
    }
  };

  if (searchInput) {
    searchInput.addEventListener('input', (e) => { updateClear(); filterPosts(); });
    searchInput.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') {
        searchInput.value = '';
        updateClear();
        filterPosts();
      }
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      if (!searchInput) return;
      searchInput.value = '';
      updateClear();
      searchInput.focus();
      filterPosts();
    });
  }

  updateClear();
  filterPosts();

  // Bookmark functionality
  const bookmarkButtons = document.querySelectorAll('.btn.small');
  const BOOKMARKS_KEY = 'blog_bookmarks';

  function getBookmarks() {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    if (!stored) return [];
    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveBookmarks(bookmarks) {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }

  function getPostTitle(button) {
    const titleEl = button.closest('.post-card').querySelector('.card-title h2');
    return titleEl ? titleEl.textContent : '';
  }

  function updateButtonState(button, isBookmarked) {
    if (isBookmarked) {
      button.classList.add('bookmarked');
      button.textContent = '★ Bookmarked';
    } else {
      button.classList.remove('bookmarked');
      button.textContent = 'Bookmark';
    }
  }

  function initBookmarks() {
    const bookmarks = getBookmarks();
    bookmarkButtons.forEach(button => {
      const title = getPostTitle(button);
      const isBookmarked = bookmarks.includes(title);
      updateButtonState(button, isBookmarked);

      button.addEventListener('click', () => {
        const currentBookmarks = getBookmarks();
        const isCurrentlyBookmarked = currentBookmarks.includes(title);

        if (isCurrentlyBookmarked) {
          const index = currentBookmarks.indexOf(title);
          currentBookmarks.splice(index, 1);
        } else {
          currentBookmarks.push(title);
        }

        saveBookmarks(currentBookmarks);
        updateButtonState(button, !isCurrentlyBookmarked);
      });
    });
  }

  initBookmarks();
});
