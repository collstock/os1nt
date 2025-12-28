/* osint-cards.js
   Renders category cards from a locally stored awesome-osint.json file.
   No remote network calls are made (except favicon retrieval from Google S2).
*/
(() => {
  "use strict";

  const JSON_PATH = "awesome-osint.json";
  const containers = [
    document.getElementById("osint-cards"),
    document.getElementById("osint-cards-middle"),
    document.getElementById("osint-cards-right")
  ];
  const searchInput = document.getElementById("search-input");
  const itemCountEl = document.getElementById("item-count");

  const escapeHtml = (s) =>
    String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const cleanTitle = (title) => {
    const t = String(title ?? "").trim();
    // Strip common README anchor prefix like: [↑](#-table-of-contents) Foo
    return t.replace(/^\[\s*↑\s*\]\([^)]+\)\s*/i, "").trim() || "Category";
  };

  const hostnameFromUrl = (url) => {
    try {
      return new URL(url).hostname;
    } catch {
      return "";
    }
  };

  const faviconUrl = (url) => {
    const host = hostnameFromUrl(url);
    return host
      ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=32`
      : "";
  };
  const isSafeUrl = (u) => {
    try {
      const parsed = new URL(String(u), location.href);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const renderItem = (it) => {
    const name = escapeHtml(it.name || it.url || "Untitled");
    const rawUrl = it.url || "";
    const safeHref = isSafeUrl(rawUrl) ? escapeHtml(rawUrl) : '#';
    const desc = escapeHtml(it.description || "");
    const fav = faviconUrl(rawUrl);

    return `
      <li class="item" data-search="${escapeHtml((it.name||"") + " " + (it.description||"") + " " + (it.url||""))}">
        <a href="${safeHref}" target="_blank" rel="noopener noreferrer">
          ${ fav ? `<img src="${fav}" alt="" loading="lazy" decoding="async" />` : `<div class="item-icon" aria-hidden="true">↗</div>` }
          <div class="txt">
            <div class="name">${name}</div>
            <div class="meta">${desc}</div>
          </div>
        </a>
      </li>
    `;
  };

  // Recursive function to render nested categories
  const renderNestedCategory = (cat) => {
    const title = cleanTitle(cat.title);
    const subtitle = (cat.subtitle || "").trim();
    const items = Array.isArray(cat.items) ? cat.items : [];
    const subCategories = Array.isArray(cat.categories) ? cat.categories : [];
    
    // Separate actual items from sub-categories
    const actualItems = items.filter(item => !item.categories);
    const itemsHtml = actualItems.map(renderItem).join("");
    
    // Sort sub-categories alphabetically before rendering
    const sortedSubCats = subCategories.sort((a, b) => {
      const titleA = cleanTitle(a.title).toLowerCase();
      const titleB = cleanTitle(b.title).toLowerCase();
      return titleA.localeCompare(titleB);
    });
    
    // Render sub-categories recursively (nested cats FIRST, then items)
    const subCatsHtml = sortedSubCats
      .map(subCat => `<section class="card">${renderNestedCategory(subCat)}</section>`)
      .join("");
    
    // Count total items across nested structure
    const itemCount = actualItems.length + subCategories.reduce((acc, sc) => acc + countItems(sc), 0);

    return `
      <details>
        <summary>
          <div class="card-title">
            <h2>${escapeHtml(title)}</h2>
            <span>${escapeHtml(subtitle || `OSINT resources (${itemCount})`)}</span>
          </div>
          <div class="chev" aria-hidden="true">⌄</div>
        </summary>
        <div class="card-body">
          ${subCatsHtml || ''}
          ${actualItems.length > 0 ? `<ul>${itemsHtml}</ul>` : ''}
          ${actualItems.length === 0 && subCatsHtml === '' ? `<li class="muted">No items in this category.</li>` : ''}
        </div>
      </details>
    `;
  };

  // Helper function to count total items recursively
  const countItems = (cat) => {
    const items = Array.isArray(cat.items) ? cat.items.length : 0;
    const subCats = Array.isArray(cat.categories) 
      ? cat.categories.reduce((acc, sc) => acc + countItems(sc), 0)
      : 0;
    return items + subCats;
  };

  const renderCard = (cat, idx) => {
    const title = cleanTitle(cat.title);
    const hasSubCategories = Array.isArray(cat.categories) && cat.categories.length > 0;
    
    // If category has sub-categories, use nested rendering
    if (hasSubCategories) {
      return `
        <section class="card" data-category="${escapeHtml(title)}" data-index="${idx}">
          ${renderNestedCategory(cat)}
        </section>
      `;
    }
    
    // Otherwise, use flat rendering
    const subtitle = (cat.subtitle || "").trim();
    const items = Array.isArray(cat.items) ? cat.items : [];
    const list = items.map(renderItem).join("");

    return `
      <section class="card" data-category="${escapeHtml(title)}" data-index="${idx}">
        <details ${idx === 0 ? "open" : ""}>
          <summary>
            <div class="card-title">
              <h2>${escapeHtml(title)}</h2>
              <span>${escapeHtml(subtitle || `OSINT resources (${items.length})`)}</span>
            </div>
            <div class="chev" aria-hidden="true">⌄</div>
          </summary>
          <div class="card-body">
            <ul>
              ${list || `<li class="muted">No items in this category.</li>`}
            </ul>
          </div>
        </details>
      </section>
    `;
  };

  const setCount = (n) => {
    if (itemCountEl) itemCountEl.textContent = String(n);
  };

  const applyFilter = (q) => {
    const query = (q || "").trim().toLowerCase();
    let visibleItems = 0;

    const allCards = [];
    containers.forEach(container => {
      if (container) {
        allCards.push(...container.querySelectorAll("section.card"));
      }
    });
    
    // Helper function to recursively filter nested sections
    const filterSection = (section) => {
      const cardTitleEl = section.querySelector(":scope > details > summary .card-title h2");
      const cardTitle = cardTitleEl ? cardTitleEl.innerText.toLowerCase() : "";
      
      // Find direct items (not in nested sections)
      const directItems = Array.from(section.querySelectorAll(":scope > details > .card-body > ul > li.item"));
      
      // Find nested sections
      const nestedSections = Array.from(section.querySelectorAll(":scope > details > .card-body > section.card"));
      
      let anyVisibleInSection = false;

      // Filter direct items
      directItems.forEach((li) => {
        const hay = (li.getAttribute("data-search") || "").toLowerCase();
        const show = !query || cardTitle.includes(query) || hay.includes(query);
        li.style.display = show ? "" : "none";
        if (show) {
          visibleItems += 1;
          anyVisibleInSection = true;
        }
      });

      // Recursively filter nested sections
      nestedSections.forEach((nestedSection) => {
        const nestedVisible = filterSection(nestedSection);
        if (nestedVisible) {
          anyVisibleInSection = true;
        }
      });

      // Hide empty categories during search (also check card title)
      const sectionMatches = !query || cardTitle.includes(query) || anyVisibleInSection;
      section.style.display = sectionMatches ? "" : "none";
      
      return sectionMatches;
    };

    allCards.forEach((card) => {
      filterSection(card);
    });

    setCount(visibleItems);
  };

  const initSearch = () => {
    if (!searchInput) return;
    searchInput.addEventListener("input", () => applyFilter(searchInput.value));
  };

  const render = (data) => {
    let cats = Array.isArray(data?.categories) ? data.categories : [];
    
    // Sort categories alphabetically by cleaned title
    cats = cats.sort((a, b) => {
      const titleA = cleanTitle(a.title).toLowerCase();
      const titleB = cleanTitle(b.title).toLowerCase();
      return titleA.localeCompare(titleB);
    });
    
    // Clear all containers
    containers.forEach(container => {
      if (container) container.innerHTML = '';
    });

    if (cats.length === 0) {
      containers[0].innerHTML = `
        <section class="card">
          <div class="card-head">
            <div class="card-title">
              <h2>No categories found</h2>
              <span>Check the JSON format in <code>${escapeHtml(JSON_PATH)}</code>.</span>
            </div>
          </div>
        </section>
      `;
    } else {
      // Distribute cards across three columns using round-robin
      cats.forEach((cat, idx) => {
        const targetIndex = idx % 3;
        const targetContainer = containers[targetIndex];
        if (targetContainer) {
          targetContainer.innerHTML += renderCard(cat, idx);
        }
      });
    }

    const total = cats.reduce((acc, c) => acc + countItems(c), 0);
    setCount(total);
    initSearch();
  };

  const showError = (msg) => {
    containers.forEach(container => {
      if (container) container.innerHTML = '';
    });
    
    if (containers[0]) {
      containers[0].innerHTML = `
        <section class="card">
          <div class="card-head">
            <div class="card-title">
              <h2>Failed to load OSINT data</h2>
              <span>${escapeHtml(msg)}</span>
            </div>
          </div>
          <div class="card-body">
            <p class="muted">
              Make sure <code>${escapeHtml(JSON_PATH)}</code> is in the same folder as this HTML file, and you are serving the folder over HTTP (not opening the file directly).
            </p>
          </div>
        </section>
      `;
    }
    setCount(0);
  };

  fetch(JSON_PATH, { cache: "no-store" })
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status} while fetching ${JSON_PATH}`);
      return r.json();
    })
    .then(render)
    .catch((e) => showError(e?.message || String(e)));
})();
