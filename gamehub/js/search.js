// ============================================
// search.js - Search & Filter Module
// ============================================

const Search = (() => {
  let searchTimeout = null;
  let currentFilters = { genre: '', minRating: '', year: '' };

  // ── Debounced Search ──
  const debounce = (fn, delay = 300) => {
    return (...args) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => fn(...args), delay);
    };
  };

  // ── Init Navbar Search ──
  const initNavbarSearch = (inputId, dropdownId) => {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);
    if (!input || !dropdown) return;

    const doSearch = debounce(async (query) => {
      if (!query.trim()) {
        dropdown.classList.remove('show');
        return;
      }
      try {
        const results = await Games.searchGames(query);
        renderDropdown(results, dropdown, query);
      } catch (err) {
        console.error('Search error:', err);
      }
    }, 300);

    input.addEventListener('input', (e) => doSearch(e.target.value));
    input.addEventListener('focus', (e) => {
      if (e.target.value.trim()) doSearch(e.target.value);
    });

    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });
  };

  const renderDropdown = (results, dropdown, query) => {
    if (!results.length) {
      dropdown.innerHTML = `<div style="padding:16px;text-align:center;color:var(--text-muted);font-size:0.875rem">No games found for "${query}"</div>`;
      dropdown.classList.add('show');
      return;
    }

    dropdown.innerHTML = results.slice(0, 6).map(g => `
      <div class="search-result-item" onclick="window.location.href='game.html?id=${g.id}'">
        <img class="search-result-thumb" src="${g.cover_url || 'assets/placeholder.jpg'}" alt="${g.title}" loading="lazy">
        <div class="search-result-info">
          <div class="title">${highlight(g.title, query)}</div>
          <div class="genre">${g.genre || 'Unknown'} · ${Rating.renderStars(g.avg_rating)} ${g.avg_rating}</div>
        </div>
      </div>
    `).join('');
    dropdown.classList.add('show');
  };

  const highlight = (text, query) => {
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark style="background:rgba(124,58,237,0.3);color:var(--accent-neon);border-radius:2px">$1</mark>');
  };

  // ── Init Filter Bar ──
  const initFilterBar = (containerId, onFilter) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const genreSelect = container.querySelector('[data-filter="genre"]');
    const ratingSelect = container.querySelector('[data-filter="rating"]');
    const yearSelect = container.querySelector('[data-filter="year"]');

    const applyFilters = () => {
      currentFilters = {
        genre: genreSelect?.value || '',
        minRating: ratingSelect?.value || '',
        year: yearSelect?.value || ''
      };
      if (onFilter) onFilter(currentFilters);
    };

    [genreSelect, ratingSelect, yearSelect].forEach(el => {
      el?.addEventListener('change', applyFilters);
    });

    // Populate year select
    if (yearSelect) {
      const currentYear = new Date().getFullYear();
      yearSelect.innerHTML = '<option value="">All Years</option>';
      for (let y = currentYear; y >= 2000; y--) {
        yearSelect.innerHTML += `<option value="${y}">${y}</option>`;
      }
    }
  };

  // ── Populate Genre Select ──
  const populateGenreSelect = async (selectEl) => {
    if (!selectEl) return;
    try {
      const genres = await Games.fetchGenres();
      const current = selectEl.value;
      selectEl.innerHTML = '<option value="">All Genres</option>' +
        genres.map(g => `<option value="${g}">${g}</option>`).join('');
      if (current) selectEl.value = current;
    } catch (err) {
      console.error('Genre fetch error:', err);
    }
  };

  const getFilters = () => ({ ...currentFilters });

  return { initNavbarSearch, initFilterBar, populateGenreSelect, getFilters, debounce };
})();

window.Search = Search;
