// awesome-osint.js
// STRICT local-only loader (no remote fetches, no fallbacks)

(() => {
  const DATA_URL = './assets/data/awesome-osint.json';
  const container = document.getElementById('osint-cards');
  const escapeHtml = (value) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  const isSafeUrl = (value) => {
    try {
      const parsed = new URL(String(value), location.href);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  if (!container) {
    console.error('[OSINT] Container #osint-cards not found');
    return;
  }

  function showFatalError(message) {
    container.innerHTML = `
      <section class="layout">
        <div class="col-left">
          <section class="card error">
            <div class="card-body">
              <h2>OSINT Data Load Error</h2>
              <p>${message}</p>
              <p><strong>Required:</strong> awesome-osint.json must be served locally over HTTP.</p>
            </div>
          </section>
        </div>
      </section>
    `;
  }

  fetch(DATA_URL, { cache: 'no-store' })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} while loading ${DATA_URL}`);
      }
      return response.json();
    })
    .then(data => {
      if (!data || !Array.isArray(data.categories)) {
        throw new Error('Invalid JSON structure');
      }

      renderCategories(data.categories);
    })
    .catch(err => {
      console.error('[OSINT] Fatal load error:', err);
      showFatalError(
        'Local OSINT dataset could not be loaded.<br>' +
        'Do NOT open this page via <code>file://</code>.<br>' +
        'Use a local web server instead.'
      );
    });

  function renderCategories(categories) {
    container.innerHTML = '';

    categories.forEach(cat => {
      const section = document.createElement('section');
      section.className = 'layout';
      const name = escapeHtml(cat?.name || 'Category');
      const description = escapeHtml(cat?.description || '');
      const items = Array.isArray(cat?.items) ? cat.items : [];
      const listHtml = items.map((item) => {
        const itemName = escapeHtml(item?.name || item?.url || 'Untitled');
        const itemDescription = escapeHtml(item?.description || '');
        const rawUrl = item?.url || '';
        const itemUrl = isSafeUrl(rawUrl) ? escapeHtml(rawUrl) : '#';
        const itemDomain = escapeHtml(item?.domain || '');
        return `
          <li class="item">
            <a href="${itemUrl}" target="_blank" rel="noopener noreferrer">
              <img src="https://www.google.com/s2/favicons?domain=${itemDomain}&sz=64" alt="favicon" />
              <div class="txt">
                <div class="name">${itemName}</div>
                <div class="meta">${itemDescription}</div>
              </div>
            </a>
          </li>
        `;
      }).join('');

      section.innerHTML = `
        <div class="col-left">
          <section class="card">
            <details>
              <summary>
                <div class="card-title">
                  <h2>${name}</h2>
                  <span>${description}</span>
                </div>
                <div class="chev">⌄</div>
              </summary>
              <div class="card-body">
                <ul>
                  ${listHtml}
                </ul>
              </div>
            </details>
          </section>
        </div>
      `;

      container.appendChild(section);
    });
  }
})();
