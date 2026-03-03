// ============================================
// ui.js - UI Utilities & Components
// ============================================

const UI = (() => {

  // ── Toast Notifications ──
  let toastContainer = null;

  const initToasts = () => {
    toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }
  };

  const toast = (message, type = 'info', duration = 3500) => {
    if (!toastContainer) initToasts();
    const icons = { success: '✓', error: '✗', info: 'ℹ', warning: '⚠' };
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span class="toast-icon">${icons[type] || icons.info}</span><span class="toast-message">${message}</span>`;
    toastContainer.appendChild(t);
    setTimeout(() => {
      t.classList.add('exit');
      t.addEventListener('animationend', () => t.remove());
    }, duration);
  };

  // ── Sidebar Toggle ──
  const initSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('sidebar-toggle');
    const mainContent = document.getElementById('main-content');
    const overlay = document.getElementById('sidebar-overlay');
    if (!sidebar || !toggle) return;

    const isMobile = () => window.innerWidth <= 768;

    const saved = localStorage.getItem('sidebarCollapsed');
    if (!isMobile() && saved === 'true') {
      sidebar.classList.add('collapsed');
      mainContent?.classList.add('expanded');
    }

    toggle.addEventListener('click', () => {
      if (isMobile()) {
        sidebar.classList.toggle('mobile-open');
        overlay?.classList.toggle('show');
      } else {
        const collapsed = sidebar.classList.toggle('collapsed');
        mainContent?.classList.toggle('expanded', collapsed);
        localStorage.setItem('sidebarCollapsed', collapsed);
      }
    });

    overlay?.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
      overlay.classList.remove('show');
    });

    window.addEventListener('resize', () => {
      if (!isMobile()) {
        sidebar.classList.remove('mobile-open');
        overlay?.classList.remove('show');
      }
    });
  };

  // ── Dark/Light Mode Toggle ──
  const initThemeToggle = () => {
    const btn = document.getElementById('theme-toggle');
    const saved = localStorage.getItem('theme') || 'dark';
    if (saved === 'light') {
      document.body.classList.add('light-mode');
      updateThemeIcon(true);
    }
    btn?.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light-mode');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      updateThemeIcon(isLight);
    });
  };

  const updateThemeIcon = (isLight) => {
    const icon = document.querySelector('#theme-toggle svg, #theme-toggle .icon');
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.title = isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode';
  };

  // ── Active Nav Item ──
  const setActiveNav = () => {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-item[data-page]').forEach(item => {
      const page = item.dataset.page;
      item.classList.toggle('active', page === path);
    });
  };

  // ── Update Auth UI ──
  const updateAuthUI = async () => {
    const user = Auth.getCurrentUser();
    const profile = Auth.getCurrentProfile();
    const authBtn = document.getElementById('auth-btn');
    const userMenu = document.getElementById('user-menu');

    if (user) {
      if (authBtn) authBtn.style.display = 'none';
      if (userMenu) {
        userMenu.style.display = 'flex';
        const avatar = userMenu.querySelector('.user-avatar');
        const username = document.getElementById('dropdown-username');
        const email = document.getElementById('dropdown-email');

        if (avatar) {
          if (profile?.avatar_url) {
            avatar.innerHTML = `<img src="${profile.avatar_url}" alt="${profile?.username || 'User'}">`;
          } else {
            const initial = (profile?.username || user.email || 'U')[0].toUpperCase();
            avatar.textContent = initial;
          }
        }
        if (username) username.textContent = profile?.username || user.email?.split('@')[0] || 'User';
        if (email) email.textContent = user.email || '';
      }
    } else {
      if (authBtn) authBtn.style.display = 'flex';
      if (userMenu) userMenu.style.display = 'none';
    }
  };

  // ── Game Card HTML ──
  const gameCardHTML = (game, opts = {}) => {
    const stars = Rating.renderStars(game.avg_rating);
    const badge = opts.badge || (game.isNew ? 'new' : game.isHot ? 'hot' : game.isTop ? 'top' : '');
    const badgeHTML = badge ? `<span class="card-badge badge-${badge}">${badge === 'top' ? '⭐ Top' : badge === 'new' ? '🆕 New' : '🔥 Hot'}</span>` : '';

    return `
      <div class="game-card" onclick="window.location.href='game.html?id=${game.id}'" data-id="${game.id}">
        <div class="card-thumb">
          <img data-src="${game.cover_url || 'assets/placeholder.jpg'}" alt="${game.title}" src="assets/placeholder.jpg" class="lazy">
          ${badgeHTML}
          <button class="card-bookmark ${opts.bookmarked ? 'bookmarked' : ''}" onclick="event.stopPropagation(); UI.handleBookmark(this, '${game.id}')" title="Bookmark">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="${opts.bookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
          <div class="card-thumb-overlay">
            <div class="card-play-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg>
              View Details
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="card-genre">${game.genre || 'Game'}</div>
          <h3 class="card-title">${game.title}</h3>
          <div class="card-meta">
            <div class="card-rating">
              ${stars}
              <span style="margin-left:4px">${game.avg_rating || '—'}</span>
              <span style="color:var(--text-muted);font-weight:400;margin-left:2px">(${game.rating_count})</span>
            </div>
            <span class="card-release">${game.release_date ? new Date(game.release_date).getFullYear() : ''}</span>
          </div>
        </div>
      </div>
    `;
  };

  // ── Skeleton Cards ──
  const skeletonCardsHTML = (count = 8) => Array(count).fill(0).map(() => `
    <div class="skeleton-card">
      <div class="skeleton-thumb skeleton"></div>
      <div class="skeleton-body">
        <div class="skeleton-line short skeleton"></div>
        <div class="skeleton-line title skeleton"></div>
        <div class="skeleton-line medium skeleton"></div>
      </div>
    </div>
  `).join('');

  // ── Pagination HTML ──
  const paginationHTML = (current, total) => {
    if (total <= 1) return '';
    let html = '<div class="pagination">';
    html += `<button class="page-btn" ${current === 1 ? 'disabled' : ''} onclick="UI.gotoPage(${current - 1})">&#8249;</button>`;
    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || Math.abs(i - current) <= 2) {
        html += `<button class="page-btn ${i === current ? 'active' : ''}" onclick="UI.gotoPage(${i})">${i}</button>`;
      } else if (Math.abs(i - current) === 3) {
        html += `<span class="page-btn" style="pointer-events:none;border:none;background:none;color:var(--text-muted)">…</span>`;
      }
    }
    html += `<button class="page-btn" ${current === total ? 'disabled' : ''} onclick="UI.gotoPage(${current + 1})">&#8250;</button>`;
    html += '</div>';
    return html;
  };

  // ── Page Navigation ──
  let pageChangeCallback = null;
  const onPageChange = (cb) => { pageChangeCallback = cb; };
  const gotoPage = (page) => { if (pageChangeCallback) pageChangeCallback(page); };

  // ── Lazy Loading Images ──
  const initLazyImages = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.onload = () => img.classList.add('loaded');
            img.onerror = () => { img.src = 'assets/placeholder.jpg'; img.classList.add('loaded'); };
            delete img.dataset.src;
            observer.unobserve(img);
          }
        }
      });
    }, { rootMargin: '100px' });

    document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
  };

  // ── Observe new lazy images ──
  const observeLazyImages = () => {
    setTimeout(initLazyImages, 50);
  };

  // ── User Menu Dropdown ──
  const initUserMenu = () => {
    const btn = document.querySelector('.user-avatar');
    const dropdown = document.getElementById('user-dropdown');
    if (!btn || !dropdown) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('show');
    });

    document.addEventListener('click', () => dropdown.classList.remove('show'));
  };

  // ── Handle Bookmark (UI) ──
  const handleBookmark = async (btn, gameId) => {
    const user = Auth.getCurrentUser();
    if (!user) {
      toast('Please login to bookmark games', 'info');
      setTimeout(() => window.location.href = 'login.html', 1200);
      return;
    }
    try {
      const added = await Games.toggleBookmark(user.id, gameId);
      btn.classList.toggle('bookmarked', added);
      const svg = btn.querySelector('svg');
      if (svg) svg.setAttribute('fill', added ? 'currentColor' : 'none');
      toast(added ? 'Added to bookmarks' : 'Removed from bookmarks', added ? 'success' : 'info');
    } catch (err) {
      toast('Failed to update bookmark', 'error');
    }
  };

  // ── Loading State ──
  const showLoading = (el, html = '') => {
    if (typeof el === 'string') el = document.getElementById(el);
    if (el) el.innerHTML = html || skeletonCardsHTML();
  };

  const hideLoading = (el, html) => {
    if (typeof el === 'string') el = document.getElementById(el);
    if (el) el.innerHTML = html;
  };

  // ── Empty State ──
  const emptyStateHTML = (icon, title, text) => `
    <div class="empty-state">
      <div class="empty-icon">${icon}</div>
      <div class="empty-title">${title}</div>
      <p class="empty-text">${text}</p>
    </div>
  `;

  // ── Modal ──
  const showModal = (id) => {
    const modal = document.getElementById(id);
    const overlay = document.getElementById('modal-overlay');
    if (modal) modal.classList.add('show');
    if (overlay) overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  };

  const hideModal = (id) => {
    const modal = document.getElementById(id);
    const overlay = document.getElementById('modal-overlay');
    if (modal) modal.classList.remove('show');
    if (overlay) overlay.classList.remove('show');
    document.body.style.overflow = '';
  };

  return {
    toast, initSidebar, initThemeToggle, setActiveNav, updateAuthUI,
    gameCardHTML, skeletonCardsHTML, paginationHTML, initLazyImages,
    observeLazyImages, initUserMenu, handleBookmark, showLoading,
    hideLoading, emptyStateHTML, showModal, hideModal,
    onPageChange, gotoPage, initToasts
  };
})();

window.UI = UI;
