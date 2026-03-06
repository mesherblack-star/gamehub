// home.js - Dengan Favorite Feature
// Data game contoh
const featuredGames = [
    {
        id: 1,
        title: "Nusaword",
        genre: "Teka-teki Kata",
        description: "Game teka-teki kata yang menantang dengan tema budaya Nusantara.",
        image: "images/Nusaword Putih.jpeg",
        icon: "fas fa-font",
        link: "nusa.html",
        players: "1-4",
        difficulty: "Sedang",
        
    },
    {
        id: 2,
        title: "Flavor Match",
        genre: "Memori Rasa",
        description: "Game mengingat dan mencocokkan rasa makanan khas Indonesia.",
        image: "images/Flavor Match.jpeg",
        icon: "fas fa-utensils",
        link: "index.html",
        players: "1-2",
        difficulty: "Mudah",
      
    },

    {
        id: 3,
        title: "Culture Quiz",
        genre: "Quiz",
        description: "Uji pengetahuanmu tentang budaya tradisional Indonesia.",
        image: "images/culture quiz.jpeg",
        icon: "fas fa-mask",
        link: "home test game.html",
        players: "1",
        difficulty: "Sedang",
        
    }
];

// Favorite system
let favorite = JSON.parse(localStorage.getItem('favorite')) || [];

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Loaded - Initializing components...');
    
    // Inisialisasi komponen
    initMobileMenu();
    initSearchModal();
    renderFeaturedGames();
    initGameCardInteractions();
    initInfoModals();
    initFavoriteSystem(); // Initialize favorite
    
    // Setup smooth navigation highlighting
    initNavHighlighting();
    
    // Animasi scroll
    initScrollAnimations();
    
    // Efek paralaks
    initParallaxEffect();
    
    // Update favorite count
    updateFavoriteCount();
});

// FUNGSI FAVORITE BARU
function initFavoriteSystem() {
    // Add favorite button to nav
    addFavoriteButton();
    
    // Create favorite modal
    createFavoriteModal();
}

function addFavoriteButton() {
    const navActions = document.querySelector('.nav-actions');
    
    const favoriteBtn = document.createElement('button');
    favoriteBtn.className = 'btn-favorite-nav';
    favoriteBtn.innerHTML = `
        <i class="fas fa-heart"></i>
        <span class="favorite-count">0</span>
    `;
    
    favoriteBtn.addEventListener('click', showFavoriteModal);
    
    // Insert before search button
    navActions.insertBefore(favoriteBtn, navActions.querySelector('.btn-search'));
}

function updateFavoriteCount() {
    const countElement = document.querySelector('.favorite-count');
    if (countElement) {
        countElement.textContent = favorite.length;
        
        // Add animation if count changes
        if (favorite.length > 0) {
            countElement.style.animation = 'none';
            setTimeout(() => {
                countElement.style.animation = 'bounce 0.5s';
            }, 10);
        }
    }
}

function createFavoriteModal() {
    // Create modal HTML
    const modalHTML = `
        <div class="favorite-modal">
            <div class="favorite-modal-content">
                <div class="favorite-header">
                    <h3><i class="fas fa-heart"></i> Favorit</h3>
                    <button class="close-favorite"><i class="fas fa-times"></i></button>
                </div>
                <div class="favorite-body">
                    <div class="favorite-empty">
                        <i class="far fa-heart"></i>
                        <h4>Favorit Kosong</h4>
                        <p>Tambahkan game ke Favorit dengan menekan tombol hati ❤️</p>
                    </div>
                    <div class="favorite-items">
                        <!-- Favorite items will be loaded here -->
                    </div>
                </div>
                <div class="favorite-footer">
                    <button class="btn-clear-favorite">
                        <i class="fas fa-trash"></i> Hapus Semua
                    </button>
                    <button class="btn-close-favorite">
                        <i class="fas fa-times"></i> Tutup
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listeners
    const modal = document.querySelector('.favorite-modal');
    const closeBtn = modal.querySelector('.close-favorite');
    const closeFooterBtn = modal.querySelector('.btn-close-favorite');
    const clearBtn = modal.querySelector('.btn-clear-favorite');
    
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    closeFooterBtn.addEventListener('click', () => modal.classList.remove('active'));
    
    clearBtn.addEventListener('click', () => {
        if (favorite.length > 0) {
            if (confirm('Apakah Anda yakin ingin menghapus semua game dari favorit?')) {
                favorite = [];
                localStorage.setItem('favorite', JSON.stringify(favorite));
                updateFavoriteModal();
                updateFavoriteCount();
                showToast('Semua game dihapus dari favorit!', 'info');
            }
        }
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

function showFavoriteModal() {
    const modal = document.querySelector('.favorite-modal');
    updateFavoriteModal();
    modal.classList.add('active');
}

function updateFavoriteModal() {
    const favoriteItemsContainer = document.querySelector('.favorite-items');
    const emptyState = document.querySelector('.favorite-empty');
    
    if (favorite.length === 0) {
        emptyState.style.display = 'block';
        favoriteItemsContainer.innerHTML = '';
        return;
    }
    
    emptyState.style.display = 'none';
    
    let itemsHTML = '';
    
    favorite.forEach(gameId => {
        const game = featuredGames.find(g => g.id == gameId);
        if (game) {
            itemsHTML += `
                <div class="favorite-item" data-id="${game.id}">
                    <div class="favorite-item-image">
                        <img src="${game.image}" alt="${game.title}">
                    </div>
                    <div class="favorite-item-info">
                        <h4>${game.title}</h4>
                        <span class="game-genre">${game.genre}</span>
                    </div>
                    <div class="favorite-item-actions">
                        <button class="btn-play-favorite" data-id="${game.id}" data-link="${game.link}">
                            <i class="fas fa-play"></i>
                        </button>
                        <button class="btn-remove-favorite" data-id="${game.id}">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `;
        }
    });
    
    favoriteItemsContainer.innerHTML = itemsHTML;
    
    // Add event listeners to favorite items
    document.querySelectorAll('.btn-play-favorite').forEach(btn => {
        btn.addEventListener('click', function() {
            const gameId = this.getAttribute('data-id');
            const gameLink = this.getAttribute('data-link');
            const game = featuredGames.find(g => g.id == gameId);
            
            if (game) {
                showToast(`Membuka ${game.title}...`, 'success');
                setTimeout(() => {
                    window.location.href = gameLink;
                }, 500);
            }
        });
    });
    
    document.querySelectorAll('.btn-remove-favorite').forEach(btn => {
        btn.addEventListener('click', function() {
            const gameId = this.getAttribute('data-id');
            removeFromFavorite(gameId);
        });
    });
}

function toggleFavorite(gameId) {
    const gameIdNum = parseInt(gameId);
    const index = favorite.indexOf(gameIdNum);

    if (index === -1) {
        // Add to favorite
        favorite.push(gameIdNum);
        showToast('Ditambahkan ke Favorit!', 'success');
    } else {
        // Remove from favorite
        favorite.splice(index, 1);
        showToast('Dihapus dari Favorit!', 'info');
    }

    // Save to localStorage
    localStorage.setItem('favorite', JSON.stringify(favorite));

    // Update UI
    updateFavoriteCount();

    // Update heart icon on game card
    const heartIcon = document.querySelector(`.game-card[data-id="${gameId}"] .btn-favorite i`);
    if (heartIcon) {
        if (index === -1) {
            heartIcon.classList.remove('far');
            heartIcon.classList.add('fas');
        } else {
            heartIcon.classList.remove('fas');
            heartIcon.classList.add('far');
        }
    }

    return index === -1; // Return true if added, false if removed
}

function removeFromFavorite(gameId) {
    const gameIdNum = parseInt(gameId);
    favorite = favorite.filter(id => id != gameIdNum);
    localStorage.setItem('favorite', JSON.stringify(favorite));
    updateFavoriteModal();
    updateFavoriteCount();

    // Update heart icon on game card
    const heartIcon = document.querySelector(`.game-card[data-id="${gameId}"] .btn-favorite i`);
    if (heartIcon) {
        heartIcon.classList.remove('fas');
        heartIcon.classList.add('far');
    }

    showToast('Game dihapus dari favorit!', 'info');
}

// Fungsi untuk menu mobile
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!menuToggle || !navMenu) {
        console.error('Menu elements not found');
        return;
    }
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        menuToggle.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Tutup menu saat mengklik link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(navLink => {
                navLink.classList.remove('active');
            });
            link.classList.add('active');
        });
    });
}

// PERBAIKAN: Fungsi untuk modal pencarian
function initSearchModal() {
    const searchModal = document.querySelector('.search-modal');

    if (!searchModal) {
        console.error('Search modal not found');
        return;
    }
    
    // Tutup modal pencarian
    const closeSearchBtn = searchModal.querySelector('.close-search');
    if (closeSearchBtn) {
        closeSearchBtn.addEventListener('click', function() {
            searchModal.classList.remove('active');
            const searchInput = searchModal.querySelector('input');
            if (searchInput) {
                searchInput.value = '';
            }
            const resultsContainer = searchModal.querySelector('.search-results');
            if (resultsContainer) {
                resultsContainer.innerHTML = '<p>Hasil pencarian akan muncul di sini</p>';
            }
        });
    }
    
    // Tutup modal dengan klik di luar
    searchModal.addEventListener('click', function(e) {
        if (e.target === searchModal) {
            searchModal.classList.remove('active');
            const searchInput = searchModal.querySelector('input');
            if (searchInput) {
                searchInput.value = '';
            }
            const resultsContainer = searchModal.querySelector('.search-results');
            if (resultsContainer) {
                resultsContainer.innerHTML = '<p>Hasil pencarian akan muncul di sini</p>';
            }
        }
    });
    
    // Submit pencarian
    const searchSubmitBtn = searchModal.querySelector('.btn-search-submit');
    if (searchSubmitBtn) {
        searchSubmitBtn.addEventListener('click', function() {
            const searchInput = searchModal.querySelector('input');
            if (searchInput) {
                const query = searchInput.value.trim();
                if (query) {
                    performSearch(query);
                }
            }
        });
    }
    
    // Submit pencarian dengan Enter
    const searchInput = searchModal.querySelector('input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    performSearch(query);
                }
            }
        });
    }

    // Nav search functionality
    const searchInputNav = document.querySelector('.search-input-nav');
    const btnSearchNav = document.querySelector('.btn-search-nav');

    if (searchInputNav && btnSearchNav) {
        btnSearchNav.addEventListener('click', () => {
            const query = searchInputNav.value.trim();
            if (query) {
                searchModal.classList.add('active');
                const modalInput = searchModal.querySelector('input');
                if (modalInput) {
                    modalInput.value = query;
                    performSearch(query);
                }
            } else {
                searchModal.classList.add('active');
                const modalInput = searchModal.querySelector('input');
                if (modalInput) modalInput.focus();
            }
        });

        searchInputNav.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInputNav.value.trim();
                if (query) {
                    searchModal.classList.add('active');
                    const modalInput = searchModal.querySelector('input');
                    if (modalInput) {
                        modalInput.value = query;
                        performSearch(query);
                    }
                }
            }
        });
    }
    
    function performSearch(query) {
        const resultsContainer = searchModal.querySelector('.search-results');
        if (!resultsContainer) return;
        
        // Filter game berdasarkan query
        const filteredGames = featuredGames.filter(game => 
            game.title.toLowerCase().includes(query.toLowerCase()) || 
            game.genre.toLowerCase().includes(query.toLowerCase()) ||
            game.description.toLowerCase().includes(query.toLowerCase())
        );
        
        if (filteredGames.length > 0) {
            let resultsHTML = '<h4>Hasil pencarian:</h4><div class="search-games-list">';
            
            filteredGames.forEach(game => {
                const isInFavorite = favorite.includes(game.id);
                resultsHTML += `
                    <div class="search-game-item" data-id="${game.id}">
                        <div class="search-game-image">
                            <img src="${game.image}" alt="${game.title}">
                        </div>
                        <div class="search-game-info">
                            <h5>${game.title}</h5>
                          
                            <div class="search-game-actions">
                                <button class="btn-play-search" data-id="${game.id}" data-link="${game.link}">
                                    <i class="fas fa-play"></i> Main
                                </button>
                                <button class="btn-favorite-search ${isInFavorite ? 'active' : ''}" data-id="${game.id}">
                                    <i class="${isInFavorite ? 'fas' : 'far'} fa-heart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            resultsHTML += '</div>';
            resultsContainer.innerHTML = resultsHTML;
            
            // Add click event to search results
            document.querySelectorAll('.search-game-item').forEach(item => {
                item.addEventListener('click', function(e) {
                    if (!e.target.closest('.search-game-actions')) {
                        const gameId = this.getAttribute('data-id');
                        const game = featuredGames.find(g => g.id == gameId);
                        
                        if (game) {
                            searchModal.classList.remove('active');
                            searchInput.value = '';
                            
                            // Show game preview
                            showGamePreview(gameId);
                        }
                    }
                });
            });
            
            // Play button in search results
            document.querySelectorAll('.btn-play-search').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const gameId = this.getAttribute('data-id');
                    const gameLink = this.getAttribute('data-link');
                    const game = featuredGames.find(g => g.id == gameId);
                    
                    if (game) {
                        searchModal.classList.remove('active');
                        searchInput.value = '';
                        window.location.href = gameLink;
                    }
                });
            });
            
            // Favorite button in search results
            document.querySelectorAll('.btn-favorite-search').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const gameId = this.getAttribute('data-id');
                    toggleFavorite(gameId);
                    
                    // Update button state
                    const icon = this.querySelector('i');
                    if (favorite.includes(parseInt(gameId))) {
                        this.classList.add('active');
                        icon.classList.remove('far');
                        icon.classList.add('fas');
                    } else {
                        this.classList.remove('active');
                        icon.classList.remove('fas');
                        icon.classList.add('far');
                    }
                });
            });
            
        } else {
            resultsContainer.innerHTML = `
                <div class="search-result-empty">
                    <i class="fas fa-search"></i>
                    <h4>Tidak ditemukan game dengan kata kunci: "${query}"</h4>
                    <p>Coba dengan kata kunci lain atau jelajahi semua game di halaman beranda.</p>
                </div>
            `;
        }
    }
}

// Fungsi untuk merender game unggulan
function renderFeaturedGames() {
    const gamesGrid = document.querySelector('.games-grid');
    
    if (!gamesGrid) {
        console.error('Games grid not found');
        return;
    }
    
    console.log('Rendering featured games...', featuredGames.length);
    
    gamesGrid.innerHTML = '';
    
    featuredGames.forEach(game => {
        const isInFavorite = favorite.includes(game.id);
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.setAttribute('data-id', game.id);
        
        gameCard.innerHTML = `
            <div class="gradient-border">
                <div class="game-image">
                    <img src="${game.image}" alt="${game.title}" loading="lazy">
                    <span class="game-badge">🔥 Trending</span>
                    <div class="game-overlay">
                        <button class="btn-quick-view">
                            <i class="fas fa-eye"></i> Quick View
                        </button>
                    </div>
                </div>
                <div class="game-content">
                    <div class="game-header">
                        <h3 class="game-title">${game.title}</h3>
                       
                    </div>
                    <span class="game-genre">${game.genre}</span>
                    <p class="game-description">${game.description}</p>
                    
                    <div class="game-meta">
                        <div class="meta-item">
                            <i class="fas fa-users"></i>
                            <span>${game.players || '1'} Players</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-bolt"></i>
                            <span>${game.difficulty || 'Medium'}</span>
                        </div>
                       
                    </div>
                    
                    <div class="game-actions">
                        <button class="btn-play" data-id="${game.id}" data-link="${game.link}">
                            <i class="fas fa-play"></i> Play Now
                        </button>
                        <button class="btn-favorite ${isInFavorite ? 'active' : ''}">
                            <i class="${isInFavorite ? 'fas' : 'far'} fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        gamesGrid.appendChild(gameCard);
    });
    
    console.log('Featured games rendered successfully');
}

// Fungsi untuk interaksi kartu game
function initGameCardInteractions() {
    console.log('Initializing game card interactions...');
    
    // Wait for DOM to update
    setTimeout(() => {
        // Quick view button
        document.querySelectorAll('.btn-quick-view').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const gameCard = this.closest('.game-card');
                const gameId = gameCard.getAttribute('data-id');
                showGamePreview(gameId);
            });
        });
        
        // Play button
        document.querySelectorAll('.btn-play').forEach(btn => {
            btn.addEventListener('click', function() {
                const gameId = this.getAttribute('data-id');
                const gameLink = this.getAttribute('data-link');
                const game = featuredGames.find(g => g.id == gameId);
                
                if (game) {
                    // Animasi tombol
                    const originalHTML = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                    this.disabled = true;
                    
                    // Simulasi loading
                    setTimeout(() => {
                        this.innerHTML = originalHTML;
                        this.disabled = false;
                        showToast(`Membuka ${game.title}...`, 'success');
                        
                        // Redirect to game page
                        setTimeout(() => {
                            window.location.href = gameLink;
                        }, 1000);
                    }, 1500);
                }
            });
        });
        
        // Favorite button
        document.querySelectorAll('.btn-favorite').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const gameCard = this.closest('.game-card');
                const gameId = gameCard.getAttribute('data-id');
                
                if (toggleFavorite(parseInt(gameId))) {
                    // Added to favorite
                    this.classList.add('active');
                } else {
                    // Removed from favorite
                    this.classList.remove('active');
                }
            });
        });
        
        // Hover effects
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
                this.style.boxShadow = '0 20px 40px rgba(211, 47, 47, 0.3)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
            });
        });
    }, 100);
}

// FUNGSI BARU: Show game preview modal
function showGamePreview(gameId) {
    const game = featuredGames.find(g => g.id == gameId);
    if (!game) return;
    
    const isInFavorite = favorite.includes(game.id);
    
    // Buat modal preview
    const modal = document.createElement('div');
    modal.className = 'game-preview-modal';
    modal.innerHTML = `
        <div class="preview-content">
            <button class="close-preview"><i class="fas fa-times"></i></button>
            <div class="preview-header">
                <img src="${game.image}" alt="${game.title}">
                <div class="preview-info">
                    <h3>${game.title}</h3>
                    <span class="game-genre">${game.genre}</span>
                </div>
            </div>
            <div class="preview-body">
                <p>${game.description}</p>
                <div class="preview-features">
                    <h4>🎮 Fitur Utama:</h4>
                    <ul>
                        <li><i class="fas fa-check"></i> Tema budaya Indonesia</li>
                        <li><i class="fas fa-check"></i> Multiplayer support</li>
                        <li><i class="fas fa-check"></i> Leaderboard online</li>
                        <li><i class="fas fa-check"></i> Berbagai tingkat kesulitan</li>
                    </ul>
                </div>
                <div class="preview-actions">
                    <button class="btn-play-preview" data-id="${game.id}" data-link="${game.link}">
                        <i class="fas fa-play"></i> Main Sekarang
                    </button>
                    <button class="btn-favorite-preview ${isInFavorite ? 'active' : ''}" data-id="${game.id}">
                        <i class="${isInFavorite ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                    <button class="btn-share">
                        <i class="fas fa-share-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Style modal
    const style = document.createElement('style');
    style.textContent = `
        .game-preview-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            animation: fadeIn 0.3s ease forwards;
            backdrop-filter: blur(10px);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .preview-content {
            background: linear-gradient(135deg, #1a1a1a, #2c2c2c);
            width: 90%;
            max-width: 800px;
            border-radius: 20px;
            padding: 30px;
            position: relative;
            border: 1px solid rgba(211, 47, 47, 0.3);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
            animation: slideUp 0.3s ease forwards;
        }
        
        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        .close-preview {
            position: absolute;
            top: 20px;
            right: 20px;
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            transition: transform 0.3s ease;
            z-index: 10;
        }
        
        .close-preview:hover {
            transform: rotate(90deg);
            color: #D32F2F;
        }
        
        .preview-header {
            display: flex;
            gap: 30px;
            margin-bottom: 30px;
            align-items: center;
        }
        
        .preview-header img {
            width: 200px;
            height: 150px;
            object-fit: cover;
            border-radius: 15px;
            border: 2px solid #D32F2F;
        }
        
        .preview-info {
            flex: 1;
        }
        
        .preview-info h3 {
            font-size: 2rem;
            margin-bottom: 10px;
            color: white;
        }
        
        .preview-body {
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.6;
        }
        
        .preview-features {
            margin: 20px 0;
            padding: 20px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
        }
        
        .preview-features ul {
            list-style: none;
            padding: 0;
            margin: 15px 0;
        }
        
        .preview-features li {
            margin: 10px 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .preview-features i {
            color: #4CAF50;
        }
        
        .preview-actions {
            display: flex;
            gap: 15px;
            margin-top: 30px;
        }
        
        .btn-play-preview {
            flex: 3;
            padding: 15px;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            background: linear-gradient(135deg, #D32F2F, #FF5252);
            color: white;
        }
        
        .btn-play-preview:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(211, 47, 47, 0.4);
        }
        
        .btn-favorite-preview, .btn-share {
            flex: 1;
            padding: 15px;
            border: none;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
        }
        
        .btn-favorite-preview {
            background: rgba(255, 255, 255, 0.1);
            color: #FF5252;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .btn-favorite-preview.active {
            background: rgba(255, 82, 82, 0.2);
            border-color: #FF5252;
        }
        
        .btn-favorite-preview:hover {
            background: rgba(255, 82, 82, 0.3);
        }
        
        .btn-share {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .btn-share:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        @media (max-width: 768px) {
            .preview-header {
                flex-direction: column;
                text-align: center;
            }
            
            .preview-header img {
                width: 100%;
                height: 200px;
            }
            
            .preview-actions {
                flex-direction: column;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Close modal
    modal.querySelector('.close-preview').onclick = () => {
        modal.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            modal.remove();
            style.remove();
        }, 300);
    };
    
    // Close on background click
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => {
                modal.remove();
                style.remove();
            }, 300);
        }
    };
    
    // Play button in modal
    modal.querySelector('.btn-play-preview').onclick = () => {
        const btn = modal.querySelector('.btn-play-preview');
        const gameId = btn.getAttribute('data-id');
        const gameLink = btn.getAttribute('data-link');
        const game = featuredGames.find(g => g.id == gameId);
        
        if (game) {
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            btn.disabled = true;
            
            showToast(`Membuka ${game.title}...`, 'success');
            
            setTimeout(() => {
                window.location.href = gameLink;
            }, 1000);
        }
    };
    
    // Favorite button in modal
    modal.querySelector('.btn-favorite-preview').onclick = () => {
        const btn = modal.querySelector('.btn-favorite-preview');
        const gameId = btn.getAttribute('data-id');
        
        if (toggleFavorite(parseInt(gameId))) {
            btn.classList.add('active');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '<i class="far fa-heart"></i>';
        }
    };
    
    // Share button
    modal.querySelector('.btn-share').onclick = () => {
        if (navigator.share) {
            navigator.share({
                title: game.title,
                text: game.description,
                url: window.location.origin + '/' + game.link
            });
        } else {
            navigator.clipboard.writeText(window.location.origin + '/' + game.link);
            showToast('Link disalin ke clipboard!', 'info');
        }
    };
}

// FUNGSI: Show toast notification
function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Add toast styles if not already added
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast {
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: rgba(26, 26, 26, 0.95);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(211, 47, 47, 0.3);
                border-left: 4px solid #D32F2F;
                padding: 15px 20px;
                border-radius: 10px;
                color: white;
                transform: translateX(150%);
                transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                z-index: 1000;
                max-width: 300px;
                animation: slideInRight 0.3s forwards;
            }
            
            .toast-success {
                border-left-color: #4CAF50;
            }
            
            .toast-info {
                border-left-color: #2196F3;
            }
            
            .toast-error {
                border-left-color: #f44336;
            }
            
            @keyframes slideInRight {
                from { transform: translateX(150%); }
                to { transform: translateX(0); }
            }
            
            .toast-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .toast i {
                font-size: 1.2rem;
            }
            
            .toast-success i { color: #4CAF50; }
            .toast-info i { color: #2196F3; }
            .toast-error i { color: #f44336; }
        `;
        document.head.appendChild(style);
    }
    
    // Show toast
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(150%)';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// Fungsi untuk info modals (FAQ & Privacy)
function initInfoModals() {
    // FAQ Modal
    const faqLinks = document.querySelectorAll('.faq-link');
    const faqModal = document.getElementById('faq-modal');
    
    if (faqLinks.length && faqModal) {
        const closeFaqBtn = faqModal.querySelector('.close-info');
        
        faqLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                faqModal.classList.add('active');
            });
        });
        
        closeFaqBtn.addEventListener('click', function() {
            faqModal.classList.remove('active');
        });
        
        faqModal.addEventListener('click', function(e) {
            if (e.target === faqModal) {
                faqModal.classList.remove('active');
            }
        });
    }
    
    // Privacy Modal
    const privacyLinks = document.querySelectorAll('.privacy-link');
    const privacyModal = document.getElementById('privacy-modal');
    
    if (privacyLinks.length && privacyModal) {
        const closePrivacyBtn = privacyModal.querySelector('.close-info');
        
        privacyLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                privacyModal.classList.add('active');
            });
        });
        
        closePrivacyBtn.addEventListener('click', function() {
            privacyModal.classList.remove('active');
        });
        
        privacyModal.addEventListener('click', function(e) {
            if (e.target === privacyModal) {
                privacyModal.classList.remove('active');
            }
        });
    }
}

// Fungsi untuk highlighting nav link yang aktif
function initNavHighlighting() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!sections.length || !navLinks.length) return;
    
    // Highlight nav link berdasarkan scroll position
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Handle click on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only for anchor links
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Smooth scroll to section
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Fungsi untuk animasi scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Animasi untuk section
    document.querySelectorAll('.section-header, .game-card, .about-content, .contact-content, .feature-card').forEach(el => {
        observer.observe(el);
    });
}

// Fungsi untuk efek paralaks pada hero section
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        
        const characters = document.querySelectorAll('.character');
        characters.forEach((char, index) => {
            char.style.transform = `translateY(${rate * (0.1 + index * 0.05)}px)`;
        });
    });
}