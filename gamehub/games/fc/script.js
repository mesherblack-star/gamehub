// ======================
// AUDIO SYSTEM - PERBAIKAN
// ======================

// Audio elements
let backgroundMusic;
let musicToggleBtn;
let sfxToggleBtn;

// Audio preferences
let musicMuted = localStorage.getItem('musicMuted') === 'true';
let sfxMuted = localStorage.getItem('sfxMuted') === 'true';

// Web Audio API for SFX
let audioContext;

// SFX functions
function playSFX(type) {
  if (sfxMuted || !audioContext) return;
  
  try {
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Different frequencies for different rarities and actions
    let frequency = 440;
    let duration = 0.3;
    let waveType = 'sine';
    
    switch(type) {
      case 'common':
        frequency = 392.00; // G4
        duration = 0.2;
        waveType = 'sine';
        break;
      case 'rare':
        frequency = 523.25;
        duration = 0.3;
        waveType = 'sine';
        break;
      case 'epic':
        frequency = 659.25;
        duration = 0.5;
        waveType = 'triangle';
        break;
      case 'legendary':
        frequency = 783.99;
        duration = 0.7;
        waveType = 'sawtooth';
        break;
      case 'mythic':
        frequency = 1046.50;
        duration = 1.0;
        waveType = 'square';
        break;
      case 'click':
        frequency = 329.63;
        duration = 0.1;
        waveType = 'sine';
        break;
      case 'success':
        frequency = 587.33;
        duration = 0.4;
        waveType = 'sine';
        break;
      case 'error':
        frequency = 261.63;
        duration = 0.3;
        waveType = 'sine';
        break;
      case 'grab':
        frequency = 392.00;
        duration = 0.6;
        waveType = 'sawtooth';
        break;
      case 'miss':
        frequency = 220.00;
        duration = 0.4;
        waveType = 'sine';
        break;
      case 'reveal':
        frequency = 523.25;
        duration = 0.8;
        waveType = 'triangle';
        break;
    }
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = waveType;
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
    
  } catch (e) {
    console.log("SFX error:", e);
  }
}

// Create audio controls
function createAudioControls() {
  const controls = document.createElement('div');
  controls.className = 'audio-controls';
  
  controls.innerHTML = `
    <button id="musicToggle" class="audio-btn" title="Toggle Music">
      <i class="fas fa-volume-up"></i>
    </button>
    <button id="sfxToggle" class="audio-btn" title="Toggle SFX">
      <i class="fas fa-bell"></i>
    </button>
  `;
  
  document.body.appendChild(controls);
  
  backgroundMusic = document.getElementById('backgroundMusic');
  musicToggleBtn = document.getElementById('musicToggle');
  sfxToggleBtn = document.getElementById('sfxToggle');
  
  // Initialize audio context
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    console.log('🎵 AudioContext created');
  } catch (e) {
    console.log('🎵 AudioContext not supported:', e);
  }
  
  // Set initial volume
  if (backgroundMusic) {
    backgroundMusic.volume = 0.5;
  }
  
  // Apply saved mute states
  if (musicMuted) {
    if (backgroundMusic) backgroundMusic.pause();
    musicToggleBtn.classList.add('muted');
    musicToggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
  } else {
    // Try to play music
    if (backgroundMusic) {
      backgroundMusic.play()
        .then(() => {
          console.log('🎵 Music started in gacha.html');
          musicToggleBtn.classList.remove('muted');
          musicToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        })
        .catch(e => {
          console.log('🎵 Autoplay prevented in gacha.html:', e);
          musicToggleBtn.innerHTML = '<i class="fas fa-volume-off"></i>';
          musicToggleBtn.title = "Click to start music";
        });
    }
  }
  
  if (sfxMuted) {
    sfxToggleBtn.classList.add('muted');
    sfxToggleBtn.innerHTML = '<i class="fas fa-bell-slash"></i>';
  }
  
  // Music toggle
  musicToggleBtn.addEventListener('click', () => {
    musicMuted = !musicMuted;
    
    if (musicMuted) {
      if (backgroundMusic) backgroundMusic.pause();
      musicToggleBtn.classList.add('muted');
      musicToggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
      // Resume audio context
      if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      // Play music
      if (backgroundMusic) {
        backgroundMusic.play()
          .then(() => {
            console.log('🎵 Music resumed');
            musicToggleBtn.classList.remove('muted');
            musicToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
          })
          .catch(e => {
            console.log('🎵 Failed to play music:', e);
          });
      }
    }
    
    localStorage.setItem('musicMuted', musicMuted);
    playSFX('click');
  });
  
  // SFX toggle
  sfxToggleBtn.addEventListener('click', () => {
    sfxMuted = !sfxMuted;
    
    if (sfxMuted) {
      sfxToggleBtn.classList.add('muted');
      sfxToggleBtn.innerHTML = '<i class="fas fa-bell-slash"></i>';
    } else {
      if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      sfxToggleBtn.classList.remove('muted');
      sfxToggleBtn.innerHTML = '<i class="fas fa-bell"></i>';
      playSFX('click');
    }
    
    localStorage.setItem('sfxMuted', sfxMuted);
  });
}

// Initialize audio
function initAudio() {
  console.log('🎵 Initializing audio in gacha.html');
  createAudioControls();
  
  // Resume audio on user interaction
  const startAudio = () => {
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    // Try to play music
    if (backgroundMusic && backgroundMusic.paused && !musicMuted) {
      backgroundMusic.play()
        .then(() => {
          console.log('🎵 Music started after interaction');
          if (musicToggleBtn) {
            musicToggleBtn.classList.remove('muted');
            musicToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
          }
        })
        .catch(e => {
          console.log('🎵 Still can\'t play music:', e);
        });
    }
  };
  
  // Add event listeners for audio start
  ['click', 'touchstart', 'keydown'].forEach(event => {
    document.addEventListener(event, startAudio, { once: true });
  });
  
  // Play welcome sound
  setTimeout(() => {
    playSFX('success');
  }, 1000);
}

// ======================
// RARITY CONFIGURATION DENGAN COMMON
// ======================
const RARITY_CONFIG = {
  common: { 
    prob: 35,
    points: 5, 
    animals: [
      { name: 'GoldFish', img: 'assets/GoldFish.png' },
      { name: 'Guinea Pig', img: 'assets/Guinea Pig.png' },
      { name: 'Hedgehog', img: 'assets/Hedgehog.png' },
      { name: 'Pigeon', img: 'assets/Pigeon.png' },
      { name: 'Raccoon', img: 'assets/Raccoon.png' }
    ],
    eggImg: 'assets/Telur Common.png',
    color: '#95A5A6'
  },
  rare: { 
    prob: 29,
    points: 10, 
    animals: [
      { name: 'Capybara', img: 'assets/Capybara.png' },
      { name: 'Fennec Fox', img: 'assets/Fennec Fox.png' },
      { name: 'Meerkat', img: 'assets/Meerkat.png' },
      { name: 'Red Panda', img: 'assets/Red Panda.png' },
      { name: 'Slow Loris', img: 'assets/Slow Loris.png' }
    ],
    eggImg: 'assets/Telur Rare.png',
    color: '#3498db'
  },
  epic: { 
    prob: 21,
    points: 20, 
    animals: [
      { name: 'Axolotl', img: 'assets/Axolotl.png' },
      { name: 'Kangaroo', img: 'assets/Kangaroo.png' },
      { name: 'Okapi', img: 'assets/Okapi.png' },
      { name: 'Platypus', img: 'assets/Platypus.png' },
      { name: 'Snow Leopard', img: 'assets/Snow Leopard.png' }
    ],
    eggImg: 'assets/Telur Epic.png',
    color: '#9b59b6'
  },
  legendary: { 
    prob: 9,
    points: 50, 
    animals: [
      { name: 'African Elephant', img: 'assets/African Elephant.png' },
      { name: 'Bengal Tiger', img: 'assets/Bengal Tiger.png' },
      { name: 'Dragon Lizard', img: 'assets/Dragon Lizard.png' },
      { name: 'Emperor Penguin', img: 'assets/Emperor Penguin.png' },
      { name: 'Polar Bear', img: 'assets/Polar Bear.png' }
    ],
    eggImg: 'assets/Telur Legend.png',
    color: '#f1c40f'
  },
  mythic: { 
    prob: 6,
    points: 100, 
    animals: [
      { name: 'Cat?', img: 'assets/Uiia.png' },
      { name: 'Usagi', img: 'assets/Usagi.png' },
      { name: 'Fish?', img: 'assets/Fih.png' }
    ],
    eggImg: 'assets/Telur Mitos.png',
    color: '#e74c3c'
  }
};

// ======================
// BUFF SYSTEM
// ======================

let currentBuff = null;
let MAX_ATTEMPTS = 3; // Default - HANYA SATU DEKLARASI

// Check for active buff
function checkActiveBuff() {
  const buffExpires = localStorage.getItem('buffExpires');
  
  // Check if buff has expired
  if (buffExpires && Date.now() > parseInt(buffExpires)) {
    // Buff expired, remove it
    localStorage.removeItem('selectedBuff');
    localStorage.removeItem('buffExpires');
    currentBuff = null;
    return;
  }
  
  currentBuff = localStorage.getItem('selectedBuff');
  
  if (currentBuff) {
    console.log(`🎯 Buff aktif: ${currentBuff}`);
    
    // Apply buff effects
    if (currentBuff === 'extra-attempts') {
      MAX_ATTEMPTS = 5; // 3 default + 2 extra
      console.log(`🎯 +2 kesempatan! Total: ${MAX_ATTEMPTS} kesempatan`);
    }
    
    // Update UI to show active buff
    updateBuffUI();
  }
}

// Update RARITY_CONFIG based on buff
function getRarityConfigWithBuff() {
  if (!currentBuff) {
    return {
      common: { prob: 35, points: 5 },
      rare: { prob: 29, points: 10 },
      epic: { prob: 21, points: 20 },
      legendary: { prob: 9, points: 50 },
      mythic: { prob: 6, points: 100 }
    };
  }
  
  if (currentBuff === 'bad-luck') {
    return {
      common: { prob: 50, points: 5 },
      rare: { prob: 23, points: 10 },
      epic: { prob: 17, points: 20 },
      legendary: { prob: 7, points: 50 },
      mythic: { prob: 3, points: 100 }
    };
  }
  
  if (currentBuff === 'luck-boost') {
    return {
      common: { prob: 20, points: 5 },
      rare: { prob: 30, points: 10 },
      epic: { prob: 25, points: 20 },
      legendary: { prob: 15, points: 50 },
      mythic: { prob: 10, points: 100 }
    };
  }
  
  // Default
  return {
    common: { prob: 35, points: 5 },
    rare: { prob: 29, points: 10 },
    epic: { prob: 21, points: 20 },
    legendary: { prob: 9, points: 50 },
    mythic: { prob: 6, points: 100 }
  };
}

// Get random rarity with buff consideration
function getRandomRarity() {
  const buffRarityConfig = getRarityConfigWithBuff();
  const rand = Math.random() * 100;
  let cumulative = 0;
  
  cumulative += buffRarityConfig.common.prob;
  if (rand < cumulative) return 'common';
  
  cumulative += buffRarityConfig.rare.prob;
  if (rand < cumulative) return 'rare';
  
  cumulative += buffRarityConfig.epic.prob;
  if (rand < cumulative) return 'epic';
  
  cumulative += buffRarityConfig.legendary.prob;
  if (rand < cumulative) return 'legendary';
  
  return 'mythic';
}

// Update UI to show active buff
function updateBuffUI() {
  if (!currentBuff) return;
  
  // Add buff indicator to header
  const headerBar = document.querySelector('.header-bar');
  let buffIndicator = document.getElementById('buffIndicator');
  
  if (!buffIndicator) {
    buffIndicator = document.createElement('div');
    buffIndicator.id = 'buffIndicator';
    buffIndicator.style.cssText = `
      display: flex;
      align-items: center;
      gap: 5px;
      background: rgba(0, 0, 0, 0.3);
      padding: 5px 10px;
      border-radius: 10px;
      margin-left: 10px;
      font-size: 0.8rem;
    `;
    
    const playerInfo = document.querySelector('.player-info');
    if (playerInfo && playerInfo.parentNode) {
      playerInfo.parentNode.insertBefore(buffIndicator, playerInfo.nextSibling);
    }
  }
  
  let buffText = '';
  let buffColor = '';
  
  switch(currentBuff) {
    case 'bad-luck':
      buffText = '⚠️ BAD LUCK';
      buffColor = '#E74C3C';
      break;
    case 'luck-boost':
      buffText = '🍀 LUCK BOOST';
      buffColor = '#3498DB';
      break;
    case 'extra-attempts':
      buffText = '➕ +2 KESEMPATAN';
      buffColor = '#F39C12';
      break;
  }
  
  buffIndicator.innerHTML = `
    <div style="color: ${buffColor}; font-weight: bold;">
      <i class="fas fa-magic"></i> ${buffText}
    </div>
  `;
  
  // Update attempts display
  attemptsEl.textContent = `${MAX_ATTEMPTS - currentAttempt}/${MAX_ATTEMPTS}`;
  attemptsLeftEl.textContent = MAX_ATTEMPTS - currentAttempt;
}

// Clear buff after game
function clearBuff() {
  localStorage.removeItem('selectedBuff');
  localStorage.removeItem('buffExpires');
  currentBuff = null;
}

// ======================
// GAME VARIABLES
// ======================

const EGG_COUNT = 20;
let currentUsername = '';
let currentScore = 0;
let currentAttempt = 0;
let collectedAnimals = [];
let eggs = [];
let clawPosition = 50;
let currentEggResult = null;
let isGrabbing = false;

// Gamepad variables
let gamepadConnected = false;
let gamepadIndex = null;
let lastGamepadUpdate = 0;
let grabButtonPressed = false;
let circleButtonPressed = false;
let lastCircleButtonPress = 0;

// Controller detection
let controllerType = 'keyboard';

// DOM Elements
const gameScreen = document.getElementById('gameScreen');
const resultModal = document.getElementById('resultModal');
const leaderboardModal = document.getElementById('leaderboardModal');
const eggResultPopup = document.getElementById('eggResultPopup');
const animalRevealPopup = document.getElementById('animalRevealPopup');
const welcomeBox = document.getElementById('welcomeBox');
const welcomePlayer = document.getElementById('welcomePlayer');
const scoreDisplayBox = document.getElementById('scoreDisplayBox');
const displayScoreEl = document.getElementById('displayScore');

// Header elements
const currentPlayerEl = document.getElementById('currentPlayer');
const coinsEl = document.getElementById('coins');
const diamondsEl = document.getElementById('diamonds');
const attemptsEl = document.getElementById('attempts');
const attemptsLeftEl = document.getElementById('attemptsLeft');
const collectionScoreEl = document.getElementById('collectionScore');

// Display elements
const displayMessageEl = document.getElementById('displayMessage');

// Game elements
const basket = document.getElementById('basket');
const clawHead = document.getElementById('clawHead');
const clawRope = document.getElementById('clawRope');
const clawArm = document.getElementById('clawArm');
const clawImage = document.getElementById('clawImage');
const clawRopeContainer = document.getElementById('clawRopeContainer');

// Control hint elements
const controlHint = document.querySelector('.control-hint span');

// Result modal elements
const finalMessage = document.getElementById('finalMessage');
const totalScoreEl = document.getElementById('totalScore');
const eggsCollectedEl = document.getElementById('eggsCollected');
const resultDetails = document.getElementById('resultDetails');

// Egg result elements
const eggResultTitle = document.getElementById('eggResultTitle');
const eggResultImage = document.getElementById('eggResultImage');
const eggResultText = document.getElementById('eggResultText');
const eggRarityBadge = document.getElementById('eggRarityBadge');
const hatchEggBtn = document.getElementById('hatchEggBtn');
const closeEggBtn = document.getElementById('closeEggBtn');

// Animal reveal elements
const animalRevealTitle = document.getElementById('animalRevealTitle');
const animalRevealImage = document.getElementById('animalRevealImage');
const animalNameEl = document.getElementById('animalName');
const animalRarityEl = document.getElementById('animalRarity');
const animalPointsEl = document.getElementById('animalPoints');
const animalRevealText = document.getElementById('animalRevealText');
const closeAnimalBtn = document.getElementById('closeAnimalBtn');

// Buttons
const backToMenuBtn = document.getElementById('backToMenuBtn');
const backToMenuBtn2 = document.getElementById('backToMenuBtn2');
const viewLeaderboardBtn = document.getElementById('viewLeaderboardBtn');
const viewLeaderboardBtnMini = document.getElementById('viewLeaderboardBtnMini');
const backToResultBtn = document.getElementById('backToResultBtn');

// ======================
// UTILS
// ======================

function getRandomAnimal(rarity) {
  const list = RARITY_CONFIG[rarity].animals;
  return list[Math.floor(Math.random() * list.length)];
}

function saveToLeaderboard(name, score) {
  console.log('💾 Menyimpan ke leaderboard:', name, score);
  
  let leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
  
  const entry = {
    name: name,
    score: score,
    date: new Date().toLocaleDateString('id-ID'),
    timestamp: new Date().getTime()
  };
  
  leaderboard.push(entry);
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 10);
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  
  console.log('✅ Leaderboard tersimpan:', leaderboard);
}

function loadLeaderboard() {
  const lb = JSON.parse(localStorage.getItem('leaderboard') || '[]');
  const leaderboardList = document.getElementById('leaderboardList');
  leaderboardList.innerHTML = '';
  
  const ol = document.createElement('ol');
  
  lb.forEach((entry, i) => {
    const li = document.createElement('li');
    
    const info = document.createElement('div');
    info.className = 'leaderboard-info';
    
    const name = document.createElement('div');
    name.className = 'leaderboard-name';
    name.textContent = entry.name;
    
    const score = document.createElement('div');
    score.className = 'leaderboard-score';
    score.textContent = `${entry.score} poin`;
    
    const date = document.createElement('div');
    date.className = 'leaderboard-date';
    date.textContent = entry.date;
    
    info.appendChild(name);
    info.appendChild(score);
    info.appendChild(date);
    
    li.appendChild(info);
    ol.appendChild(li);
  });
  
  leaderboardList.appendChild(ol);
}

function markUsernameUsed(username) {
  let used = JSON.parse(localStorage.getItem('usedUsernames') || '[]');
  used.push(username.toLowerCase());
  localStorage.setItem('usedUsernames', JSON.stringify(used));
}

function updateDisplayMessage(message, type = 'info') {
  displayMessageEl.textContent = message;
  displayMessageEl.style.color = {
    info: '#FFD166',
    success: '#2ECC71',
    error: '#FF6B8B',
    warning: '#F39C12',
    mythic: '#e74c3c',
    common: '#95A5A6'
  }[type];
  
  displayMessageEl.style.animation = 'none';
  setTimeout(() => {
    displayMessageEl.style.animation = 'blink 0.5s 3';
  }, 10);
}

// ======================
// CONTROLLER DETECTION & SIMPLE GUIDANCE
// ======================

function detectControllerType(gamepad) {
  if (!gamepad) return 'keyboard';
  
  const id = gamepad.id.toLowerCase();
  
  if (id.includes('xbox') || id.includes('microsoft') || id.includes('045e')) {
    return 'xbox';
  } else if (id.includes('playstation') || id.includes('sony') || id.includes('054c')) {
    return 'ps';
  } else if (id.includes('nintendo') || id.includes('pro controller') || id.includes('057e')) {
    return 'nintendo';
  } else {
    return 'generic';
  }
}

function updateControllerGuidance() {
  // Simple guidance - hanya untuk gerakan dan grab
  let moveInstructions = '';
  let grabInstructions = '';
  
  if (gamepadConnected) {
    if (controllerType === 'ps') {
      moveInstructions = 'Gunakan <kbd>←</kbd> <kbd>→</kbd> D-Pad atau <kbd>L-STICK</kbd> untuk bergerak';
      grabInstructions = 'Tekan <kbd>X</kbd> untuk menjangkau';
    } else if (controllerType === 'xbox') {
      moveInstructions = 'Gunakan <kbd>←</kbd> <kbd>→</kbd> D-Pad atau <kbd>L-STICK</kbd> untuk bergerak';
      grabInstructions = 'Tekan <kbd>A</kbd> untuk menjangkau';
    } else if (controllerType === 'nintendo') {
      moveInstructions = 'Gunakan <kbd>←</kbd> <kbd>→</kbd> D-Pad atau <kbd>L-STICK</kbd> untuk bergerak';
      grabInstructions = 'Tekan <kbd>B</kbd> untuk menjangkau';
    } else {
      moveInstructions = 'Gunakan <kbd>←</kbd> <kbd>→</kbd> D-Pad atau <kbd>L-STICK</kbd> untuk bergerak';
      grabInstructions = 'Tekan <kbd>TOMBOL BAWAH</kbd> untuk menjangkau';
    }
  } else {
    moveInstructions = 'Gunakan <kbd>A</kbd> <kbd>D</kbd> untuk bergerak';
    grabInstructions = 'Tekan <kbd>SPACE</kbd> untuk menjangkau';
  }
  
  // Update welcome box (sederhana)
  const welcomeText = welcomeBox.querySelector('p');
  if (welcomeText) {
    welcomeText.innerHTML = `
      ${moveInstructions}<br>
      ${grabInstructions}
      ${gamepadConnected ? '<br><small style="color:#2ECC77;font-size:0.9em;">🎮 Controller terdeteksi!</small>' : ''}
    `;
  }
  
  // Update control hint (sederhana di kiri)
  if (controlHint) {
    controlHint.innerHTML = `
      <div style="display: flex; align-items: center; gap: 5px;">
        <span style="color:#FFD166">${moveInstructions}</span>
        <span style="margin: 0 5px">|</span>
        <span style="color:#FF6B8B">${grabInstructions}</span>
      </div>
    `;
  }
}

// ======================
// SISTEM GRAVITASI TELUR BERANTAKAN
// ======================

function generateScatteredEggs() {
  basket.innerHTML = '';
  eggs = [];
  
  const basketFloor = document.createElement('div');
  basketFloor.className = 'basket-floor';
  basket.appendChild(basketFloor);
  
  const basketWidth = basket.offsetWidth - 70;
  const basketHeight = basket.offsetHeight - 90;
  
  for (let i = 0; i < EGG_COUNT; i++) {
    const egg = document.createElement('div');
    egg.className = 'egg';
    
    const rarity = getRandomRarity(); // Menggunakan fungsi buff-aware
    
    egg.dataset.rarity = rarity;
    egg.dataset.id = i;
    egg.style.backgroundImage = "url('assets/telur.png')";
    
    // Posisi acak di dasar keranjang
    let posX, posY;
    let collision = true;
    let attempts = 0;
    
    while (collision && attempts < 100) {
      posX = 10 + Math.random() * (basketWidth - 60);
      posY = 10 + Math.random() * 60;
      
      collision = false;
      
      for (const existingEgg of eggs) {
        const dx = posX - existingEgg.x;
        const dy = posY - existingEgg.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 45) {
          collision = true;
          break;
        }
      }
      
      attempts++;
    }
    
    const rotation = Math.random() * 360;
    
    egg.style.left = `${posX}px`;
    egg.style.bottom = `${posY}px`;
    egg.style.transform = `rotate(${rotation}deg) scale(1.1)`;
    egg.style.zIndex = 30 + Math.floor(posY / 5);
    
    egg.classList.add(`stack-${(i % 5) + 1}`);
    egg.classList.add('scattered');
    egg.classList.add('in-basket');
    
    egg.style.setProperty('--bounce-delay', `${Math.random() * 2}s`);
    
    const eggData = {
      element: egg,
      rarity: rarity,
      id: i,
      isGrabbed: false,
      x: posX,
      y: posY
    };
    
    eggs.push(eggData);
    basket.appendChild(egg);
    
    setTimeout(() => {
      egg.classList.add('falling');
      
      setTimeout(() => {
        egg.classList.remove('falling');
      }, 800);
    }, i * 50);
  }
}

// ======================
// CLAW ROPE FUNCTIONALITY
// ======================

function updateClawRope() {
  // Tali tidak perlu update posisi left karena sudah mengikuti claw head
  const clawHeadRect = clawHead.getBoundingClientRect();
  const machineFrameRect = document.querySelector('.machine-frame').getBoundingClientRect();
  
  // Hitung tinggi rope berdasarkan posisi claw head yang sebenarnya
  const ropeHeight = clawHeadRect.top - machineFrameRect.top + (clawHeadRect.height / 2);
  const finalHeight = Math.max(30, ropeHeight);
  
  clawRope.style.height = `${finalHeight}px`;
}

function updateClawPosition(percent) {
  if (isGrabbing) return;
  
  clawPosition = Math.max(5, Math.min(95, percent));
  
  // Update posisi claw head
  clawHead.style.left = `${clawPosition}%`;
  
  // Update posisi rope container agar mengikuti claw head
  clawRopeContainer.style.left = `${clawPosition}%`;
  
  eggs.forEach(e => {
    if (e.element) e.element.classList.remove('highlight');
  });
  
  let closestEgg = null;
  let minDist = Infinity;
  
  eggs.forEach(eggData => {
    if (eggData.isGrabbed || !eggData.element) return;
    
    const rect = eggData.element.getBoundingClientRect();
    const basketRect = basket.getBoundingClientRect();
    const clawX = basketRect.left + (basketRect.width * clawPosition / 100);
    const eggCenterX = rect.left + rect.width / 2;
    const dist = Math.abs(eggCenterX - clawX);
    
    if (dist < minDist && dist < 100) {
      minDist = dist;
      closestEgg = eggData;
    }
  });
  
  if (closestEgg && closestEgg.element) {
    closestEgg.element.classList.add('highlight');
  }
}

// ======================
// GAMEPAD CONTROLLER
// ======================

function checkGamepadConnection() {
  const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
  
  for (let i = 0; i < gamepads.length; i++) {
    if (gamepads[i] && gamepads[i].connected) {
      gamepadConnected = true;
      gamepadIndex = i;
      controllerType = detectControllerType(gamepads[i]);
      updateControllerGuidance();
      return gamepads[i];
    }
  }
  
  gamepadConnected = false;
  gamepadIndex = null;
  controllerType = 'keyboard';
  updateControllerGuidance();
  return null;
}

function handleCircleButtonAction() {
  const currentTime = Date.now();
  if (currentTime - lastCircleButtonPress < 300) return;
  
  lastCircleButtonPress = currentTime;
  
  // 1. Jika di popup TELUR
  if (!eggResultPopup.classList.contains('hidden')) {
    hatchEgg();
    return true;
  }
  
  // 2. Jika di popup HEWAN
  if (!animalRevealPopup.classList.contains('hidden')) {
    animalRevealPopup.classList.add('hidden');
    updateUI();
    return true;
  }
  
  return false;
}

function updateGamepadControls() {
  if (!gamepadConnected) return;
  
  const now = Date.now();
  if (now - lastGamepadUpdate < 16) return;
  
  const gamepad = navigator.getGamepads()[gamepadIndex];
  if (!gamepad) return;
  
  lastGamepadUpdate = now;
  
  // Gerakan dengan stick kiri atau D-pad
  let moveInput = 0;
  
  const stickLeftRight = gamepad.axes[0];
  if (Math.abs(stickLeftRight) > 0.15) {
    moveInput = stickLeftRight * 1.5;
  }
  
  if (gamepad.buttons[14] && gamepad.buttons[14].pressed) {
    moveInput = -1.2;
  }
  if (gamepad.buttons[15] && gamepad.buttons[15].pressed) {
    moveInput = 1.2;
  }
  
  if (moveInput !== 0 && !isGrabbing && currentAttempt < MAX_ATTEMPTS) {
    const speed = 1.2;
    updateClawPosition(clawPosition + (moveInput * speed));
  }
  
  // TOMBOL UNTUK GRAB
  const crossPressed = gamepad.buttons[0] && gamepad.buttons[0].pressed;
  const squarePressed = gamepad.buttons[2] && gamepad.buttons[2].pressed;
  
  if ((crossPressed || squarePressed) && !isGrabbing && currentAttempt < MAX_ATTEMPTS) {
    if (!grabButtonPressed) {
      grabButtonPressed = true;
      grabEgg();
    }
  } else {
    grabButtonPressed = false;
  }
  
  // TOMBOL CIRCLE untuk membuka telur
  const circlePressed = gamepad.buttons[1] && gamepad.buttons[1].pressed;
  
  if (circlePressed) {
    if (!circleButtonPressed) {
      circleButtonPressed = true;
      handleCircleButtonAction();
    }
  } else {
    circleButtonPressed = false;
  }
}

function startGamepadPolling() {
  function gamepadLoop() {
    if (gamepadConnected || checkGamepadConnection()) {
      updateGamepadControls();
    }
    requestAnimationFrame(gamepadLoop);
  }
  
  gamepadLoop();
}

// ======================
// LEADERBOARD FUNCTIONS
// ======================

function showLeaderboard() {
  console.log('📊 showLeaderboard() dipanggil');
  
  loadLeaderboard();
  
  if (!resultModal.classList.contains('hidden')) {
    resultModal.classList.add('hidden');
  }
  
  if (!eggResultPopup.classList.contains('hidden')) {
    eggResultPopup.classList.add('hidden');
  }
  
  if (!animalRevealPopup.classList.contains('hidden')) {
    animalRevealPopup.classList.add('hidden');
  }
  
  leaderboardModal.classList.remove('hidden');
  playSFX('click');
}

function hideLeaderboard() {
  leaderboardModal.classList.add('hidden');
  playSFX('click');
}

// ======================
// GAME INITIALIZATION
// ======================

function initGame() {
  currentUsername = localStorage.getItem('currentUsername') || 'Pemain';
  currentPlayerEl.textContent = currentUsername;
  welcomePlayer.textContent = currentUsername.toUpperCase();
  
  // Check for active buff
  checkActiveBuff();
  
  welcomeBox.classList.remove('hidden');
  scoreDisplayBox.classList.remove('hidden');
  
  currentScore = 0;
  currentAttempt = 0;
  collectedAnimals = [];
  isGrabbing = false;
  
  updateUI();
  updateDisplayMessage('SELAMAT DATANG ' + currentUsername.toUpperCase(), 'success');
  
  generateScatteredEggs();
  
  clawPosition = 50;
  clawHead.style.left = '50%';
  clawRopeContainer.style.left = '50%';
  clawHead.classList.remove('grabbing', 'has-egg');
  
  clawRope.style.height = '30px';
  clawHead.style.top = '30px';
  
  updateClawPosition(clawPosition);
  updateClawRope();
  
  // Update guidance based on controller
  updateControllerGuidance();
  
  // Mulai polling gamepad
  startGamepadPolling();
}

// ======================
// GAME CONTROLS
// ======================

function grabEgg() {
  if (currentAttempt >= MAX_ATTEMPTS || isGrabbing) return;
  
  playSFX('grab');
  isGrabbing = true;
  currentAttempt++;
  
  updateDisplayMessage('MENJANGKAU...', 'warning');
  updateUI();
  
  let closestEgg = null;
  let minDist = Infinity;
  
  eggs.forEach(eggData => {
    if (eggData.isGrabbed || !eggData.element) return;
    
    const rect = eggData.element.getBoundingClientRect();
    const basketRect = basket.getBoundingClientRect();
    const clawX = basketRect.left + (basketRect.width * clawPosition / 100);
    const eggCenterX = rect.left + rect.width / 2;
    const dist = Math.abs(eggCenterX - clawX);
    
    // ✅ PERBAIKAN: Grab distance diperlebar dari 70 ke 90
    if (dist < minDist && dist < 90) {
      minDist = dist;
      closestEgg = eggData;
    }
  });
  
  clawHead.classList.add('grabbing');
  clawHead.style.transition = 'top 0.8s ease-in-out';
  clawRope.style.transition = 'height 0.8s ease-in-out';
  
  // ✅ PERBAIKAN: Target depth diperdalam dari 300 ke 400
  const targetHeight = 400;
  
  setTimeout(() => {
    clawRope.style.height = `${targetHeight}px`;
    clawHead.style.top = `${targetHeight - 20}px`;
  }, 10);
  
  setTimeout(() => {
    if (closestEgg && minDist < 90) {
      closestEgg.isGrabbed = true;
      closestEgg.element.classList.add('caught');
      closestEgg.element.classList.remove('highlight', 'scattered');
      
      clawHead.classList.add('has-egg');
      
      const rarity = closestEgg.rarity;
      const animalData = getRandomAnimal(rarity);
      const points = RARITY_CONFIG[rarity].points;
      
      // Probabilitas telur jatuh (ngelos) - 30% chance
      const willDrop = Math.random() < 0.3;
      
      if (!willDrop) {
        // Sukses mengangkat telur
        currentScore += points;
        currentEggResult = {
          rarity: rarity,
          animal: animalData,
          points: points,
          eggImg: RARITY_CONFIG[rarity].eggImg
        };
        
        collectedAnimals.push({
          ...animalData,
          points: points,
          rarity: rarity
        });
        
        if (rarity === 'mythic') {
          updateDisplayMessage('🔥 MYTHIC DITEMUKAN! 🔥', 'mythic');
        } else if (rarity === 'legendary') {
          updateDisplayMessage('✨ LEGENDARY DITEMUKAN! ✨', 'warning');
        } else if (rarity === 'epic') {
          updateDisplayMessage('💜 EPIC DITEMUKAN! 💜', 'info');
        } else if (rarity === 'rare') {
          updateDisplayMessage('🔵 RARE DITEMUKAN! 🔵', 'info');
        } else {
          updateDisplayMessage('⚪ COMMON DITEMUKAN!', 'common');
        }
      } else {
        // Telur jatuh saat diangkat (ngelos)
        currentEggResult = null;
        updateDisplayMessage('😱 TELUR JATUH!', 'error');
        
        // Efek visual telur jatuh dari capit
        setTimeout(() => {
          closestEgg.element.classList.remove('caught');
          closestEgg.element.classList.add('dropping');
          clawHead.classList.remove('has-egg');
          
          // Animasi telur jatuh kembali ke basket
          const originalBottom = closestEgg.element.style.bottom;
          closestEgg.element.style.transition = 'all 0.6s cubic-bezier(0.5, 0, 0.75, 0)';
          closestEgg.element.style.bottom = originalBottom;
          closestEgg.element.style.opacity = '1';
          closestEgg.element.style.transform = `rotate(${Math.random() * 720 - 360}deg) scale(1.1)`;
          
          playSFX('miss');
          
          setTimeout(() => {
            closestEgg.element.classList.remove('dropping');
            closestEgg.element.classList.add('scattered', 'in-basket');
            closestEgg.element.style.transition = '';
            closestEgg.isGrabbed = false;
            
            // ✅ PERBAIKAN: Reset isGrabbing saat telur jatuh supaya joystick bisa digerakkan lagi
            isGrabbing = false;
          }, 600);
        }, 200);
      }
      
    } else {
      currentEggResult = null;
      updateDisplayMessage('GAGAL!', 'error');
    }
    
    setTimeout(() => {
      clawHead.style.transition = 'top 0.8s ease-in-out';
      clawRope.style.transition = 'height 0.8s ease-in-out';
      
      clawRope.style.height = '30px';
      clawHead.style.top = '30px';
      
      setTimeout(() => {
        clawHead.classList.remove('grabbing');
        clawHead.style.transition = '';
        clawRope.style.transition = '';
        
        if (currentEggResult) {
          if (closestEgg && closestEgg.element) {
            closestEgg.element.style.display = 'none';
          }
          
          setTimeout(() => {
            showEggResultPopup();
            clawHead.classList.remove('has-egg');
          }, 500);
        } else {
          // ✅ PERBAIKAN: Hanya reset isGrabbing jika BUKAN skenario telur jatuh
          // (karena sudah di-reset di atas untuk skenario telur jatuh)
          if (closestEgg && minDist < 90) {
            // Ini skenario telur jatuh, isGrabbing sudah di-reset di atas
          } else {
            // Ini skenario gagal grab, reset isGrabbing
            setTimeout(() => showMissPopup(), 500);
          }
        }
        
        // ✅ PERBAIKAN: Reset isGrabbing hanya untuk kasus sukses atau miss (bukan drop)
        if (!currentEggResult && (!closestEgg || minDist >= 90)) {
          isGrabbing = false;
        } else if (currentEggResult) {
          isGrabbing = false;
        }
        
        if (currentAttempt >= MAX_ATTEMPTS) {
          setTimeout(() => endGame(), 1500);
        }
      }, 800);
    }, 500);
  }, 800);
}

// ======================
// POPUP FUNCTIONS
// ======================

function showEggResultPopup() {
  const { rarity, animal, points, eggImg } = currentEggResult;
  
  // Play SFX based on rarity
  playSFX(rarity);
  
  eggResultTitle.innerHTML = `<i class="fas fa-egg"></i> TELUR DIDAPAT!`;
  eggResultImage.style.backgroundImage = `url('${eggImg}')`;
  eggResultImage.className = 'egg-spin';
  
  // Tambah class berdasarkan rarity
  if (rarity === 'mythic') {
    eggResultImage.classList.add('mythic');
  } else if (rarity === 'common') {
    eggResultImage.classList.add('common');
  }
  
  eggRarityBadge.dataset.rarity = rarity;
  eggRarityBadge.querySelector('.rarity-text').textContent = rarity.toUpperCase();
  eggRarityBadge.style.background = RARITY_CONFIG[rarity].color;
  
  let rarityText = rarity.toUpperCase();
  let description = '';
  
  if (rarity === 'mythic') {
    rarityText = '🔥 MYTHIC 🔥';
    description = 'Hewan LEGENDARY yang sangat langka!';
  } else if (rarity === 'legendary') {
    description = 'Hewan langka dengan kekuatan khusus!';
  } else if (rarity === 'epic') {
    description = 'Hewan kuat dengan kemampuan unik!';
  } else if (rarity === 'rare') {
    description = 'Hewan yang menggemaskan!';
  } else {
    description = 'Hewan umum yang lucu!';
  }
  
  // Instruksi sederhana untuk membuka telur
  let openInstruction = '';
  if (gamepadConnected) {
    if (controllerType === 'ps') {
      openInstruction = 'Tekan <kbd>O</kbd> di controller';
    } else if (controllerType === 'xbox') {
      openInstruction = 'Tekan <kbd>B</kbd> di controller';
    } else if (controllerType === 'nintendo') {
      openInstruction = 'Tekan <kbd>A</kbd> di controller';
    } else {
      openInstruction = 'Tekan tombol kanan di controller';
    }
  } else {
    openInstruction = 'Tekan <kbd>O</kbd> atau <kbd>B</kbd> di keyboard';
  }
  
  eggResultText.innerHTML = `
    Kamu mendapatkan <span style="color: ${RARITY_CONFIG[rarity].color}; font-weight: bold;">${rarityText} EGG</span>!<br>
    <span style="color: #2ECC71; font-weight: bold;">+${points} Points</span><br><br>
    ${description}<br><br>
    <div style="background: rgba(231, 76, 60, 0.2); padding: 10px; border-radius: 8px; margin: 10px 0; text-align: center;">
      <div style="color: #FFD166; font-size: 14px;">
        ${openInstruction} untuk membuka telur
      </div>
    </div>
  `;
  
  closeEggBtn.style.display = 'none';
  hatchEggBtn.style.display = 'flex';
  hatchEggBtn.innerHTML = '<i class="fas fa-magic"></i> BUKA TELUR';
  
  eggResultPopup.classList.remove('hidden');
  
  // Tambah event listener keyboard
  document.addEventListener('keydown', handleEggPopupKeydown);
}

function handleEggPopupKeydown(e) {
  if (e.key === 'o' || e.key === 'O' || e.key === 'b' || e.key === 'B') {
    e.preventDefault();
    hatchEgg();
  }
}

function showMissPopup() {
  playSFX('miss');
  
  eggResultTitle.innerHTML = `<i class="fas fa-times-circle"></i> GAGAL!`;
  eggResultImage.style.backgroundImage = "url('assets/telur.png')";
  eggResultImage.style.opacity = '0.5';
  eggResultImage.style.filter = 'grayscale(1)';
  
  eggRarityBadge.dataset.rarity = 'miss';
  eggRarityBadge.querySelector('.rarity-text').textContent = 'MISS';
  eggRarityBadge.style.background = '#95A5A6';
  
  eggResultText.innerHTML = `
    Capit tidak berhasil mengambil telur!<br>
    <span style="color: #E74C3C; font-weight: bold;">+0 Points</span><br><br>
    Coba lagi dengan posisi yang lebih tepat!
  `;
  
  hatchEggBtn.style.display = 'none';
  closeEggBtn.style.display = 'none';
  eggResultPopup.classList.remove('hidden');
  
  setTimeout(() => {
    if (eggResultPopup && !eggResultPopup.classList.contains('hidden')) {
      eggResultPopup.classList.add('hidden');
      hatchEggBtn.style.display = 'flex';
      closeEggBtn.style.display = 'flex';
    }
  }, 1500);
}

function hatchEgg() {
  playSFX('reveal');
  
  // Hapus event listener keyboard
  document.removeEventListener('keydown', handleEggPopupKeydown);
  
  // Tutup popup telur
  eggResultPopup.classList.add('hidden');
  
  const { rarity, animal, points } = currentEggResult;
  
  // Tampilkan popup hewan
  animalRevealTitle.innerHTML = `<i class="fas fa-paw"></i> HEWAN DITEMUKAN!`;
  animalRevealImage.style.backgroundImage = `url('${animal.img}')`;
  
  animalNameEl.textContent = animal.name;
  animalRarityEl.textContent = rarity.toUpperCase();
  animalRarityEl.style.background = RARITY_CONFIG[rarity].color;
  animalPointsEl.textContent = `+${points}`;
  
  if (rarity === 'mythic') {
    animalRevealTitle.innerHTML = `<i class="fas fa-crown"></i> MYTHIC HEWAN DITEMUKAN!`;
  } else if (rarity === 'legendary') {
    animalRevealTitle.innerHTML = `<i class="fas fa-star"></i> LEGENDARY HEWAN DITEMUKAN!`;
  } else if (rarity === 'epic') {
    animalRevealTitle.innerHTML = `<i class="fas fa-gem"></i> EPIC HEWAN DITEMUKAN!`;
  } else if (rarity === 'rare') {
    animalRevealTitle.innerHTML = `<i class="fas fa-shield-alt"></i> RARE HEWAN DITEMUKAN!`;
  } else {
    animalRevealTitle.innerHTML = `<i class="fas fa-heart"></i> COMMON HEWAN DITEMUKAN!`;
  }
  
  // Instruksi sederhana untuk melanjutkan
  let continueInstruction = '';
  if (gamepadConnected) {
    if (controllerType === 'ps') {
      continueInstruction = 'Tekan <kbd>O</kbd> di controller';
    } else if (controllerType === 'xbox') {
      continueInstruction = 'Tekan <kbd>B</kbd> di controller';
    } else if (controllerType === 'nintendo') {
      continueInstruction = 'Tekan <kbd>A</kbd> di controller';
    } else {
      continueInstruction = 'Tekan tombol kanan di controller';
    }
  } else {
    continueInstruction = 'Tekan <kbd>O</kbd> atau <kbd>B</kbd> di keyboard';
  }
  
  animalRevealText.innerHTML = `
    <span style="color: ${RARITY_CONFIG[rarity].color}; font-weight: bold;">${animal.name}</span> telah ditambahkan ke koleksi Anda!<br>
    Kumpulkan semua hewan untuk melengkapi koleksi!<br><br>
    <div style="background: rgba(52, 152, 219, 0.2); padding: 10px; border-radius: 8px; margin: 10px 0; text-align: center;">
      <div style="color: #FFD166; font-size: 14px;">
        ${continueInstruction} untuk melanjutkan
      </div>
    </div>
  `;
  
  closeAnimalBtn.innerHTML = '<i class="fas fa-check"></i> LANJUTKAN';
  closeAnimalBtn.style.display = 'flex';
  
  animalRevealPopup.classList.remove('hidden');
  
  // Tambah event listener keyboard untuk popup hewan
  document.addEventListener('keydown', handleAnimalPopupKeydown);
}

function handleAnimalPopupKeydown(e) {
  if (e.key === 'o' || e.key === 'O' || e.key === 'b' || e.key === 'B') {
    e.preventDefault();
    continueGame();
  }
}

function continueGame() {
  // Hapus event listener keyboard
  document.removeEventListener('keydown', handleAnimalPopupKeydown);
  
  // Tutup popup hewan
  animalRevealPopup.classList.add('hidden');
  
  // Update UI
  updateUI();
}

// ======================
// UI UPDATES
// ======================

function updateUI() {
  coinsEl.textContent = currentScore;
  diamondsEl.textContent = Math.floor(currentScore / 10);
  attemptsEl.textContent = `${MAX_ATTEMPTS - currentAttempt}/${MAX_ATTEMPTS}`;
  attemptsLeftEl.textContent = MAX_ATTEMPTS - currentAttempt;
  displayScoreEl.textContent = currentScore;
  collectionScoreEl.textContent = currentScore;
}

function endGame() {
  markUsernameUsed(currentUsername);
  saveToLeaderboard(currentUsername, currentScore);
  
  finalMessage.textContent = `${currentUsername}, skor akhir Anda: ${currentScore}`;
  totalScoreEl.textContent = currentScore;
  eggsCollectedEl.textContent = collectedAnimals.length;
  
  resultDetails.innerHTML = '';
  if (collectedAnimals.length > 0) {
    collectedAnimals.forEach((item, i) => {
      const p = document.createElement('p');
      p.innerHTML = `
        <span style="color: ${RARITY_CONFIG[item.rarity].color}">●</span>
        ${item.name} <span style="color: #2ECC71">+${item.points}</span>
        <span style="color: ${RARITY_CONFIG[item.rarity].color}; float: right">${item.rarity.toUpperCase()}</span>
      `;
      resultDetails.appendChild(p);
    });
  } else {
    resultDetails.innerHTML = '<p style="text-align: center; color: #95A5A6">Tidak berhasil mendapatkan hewan.</p>';
  }
  
  resultModal.classList.remove('hidden');
  
  localStorage.setItem('gameOver', 'true');
  localStorage.setItem('finalScore', currentScore);
  
  // Clear buff after game
  clearBuff();
}

// ======================
// EVENT LISTENERS
// ======================

function setupEventListeners() {
  console.log('🔧 Setting up event listeners...');
  
  // ========== KEYBOARD CONTROLS ==========
  window.addEventListener('keydown', (e) => {
    if (!isGrabbing) {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        updateClawPosition(clawPosition - 8);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        updateClawPosition(clawPosition + 8);
      } else if (e.key === ' ' || e.key === 'Enter') {
        if (!isGrabbing) grabEgg();
      }
    }
  });
  
  // ========== GAMEPAD EVENTS ==========
  window.addEventListener("gamepadconnected", (e) => {
    console.log('🎮 Gamepad terhubung:', e.gamepad.id);
    gamepadConnected = true;
    gamepadIndex = e.gamepad.index;
    controllerType = detectControllerType(e.gamepad);
    updateControllerGuidance();
    
    // Show controller connected notification
    updateDisplayMessage(`🎮 ${controllerType.toUpperCase()} CONTROLLER TERHUBUNG!`, 'success');
    playSFX('success');
  });
  
  window.addEventListener("gamepaddisconnected", (e) => {
    console.log('🎮 Gamepad terputus');
    gamepadConnected = false;
    gamepadIndex = null;
    controllerType = 'keyboard';
    updateControllerGuidance();
    
    // Show controller disconnected notification
    updateDisplayMessage('🎮 CONTROLLER TERPUTUS', 'warning');
  });
  
  // ========== WELCOME BOX ==========
  const closeWelcomeBtn = document.getElementById('closeWelcomeBtn');
  if (closeWelcomeBtn) {
    closeWelcomeBtn.addEventListener('click', () => {
      playSFX('click');
      welcomeBox.classList.add('hidden');
    });
  }
  
  // Auto hide welcome box
  setTimeout(() => {
    if (welcomeBox && !welcomeBox.classList.contains('hidden')) {
      welcomeBox.classList.add('hidden');
    }
  }, 5000);
  
  // ========== TOGGLE SIDEBAR BUTTON ==========
  const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
  const instructionsSidebar = document.getElementById('instructionsSidebar');
  const closeSidebarBtn = document.getElementById('closeSidebarBtn');
  
  if (toggleSidebarBtn && instructionsSidebar) {
    toggleSidebarBtn.addEventListener('click', () => {
      playSFX('click');
      instructionsSidebar.classList.toggle('active');
    });
  }
  
  if (closeSidebarBtn && instructionsSidebar) {
    closeSidebarBtn.addEventListener('click', () => {
      playSFX('click');
      instructionsSidebar.classList.remove('active');
    });
  }
  
  // Close sidebar when clicking outside
  document.addEventListener('click', (e) => {
    if (instructionsSidebar && instructionsSidebar.classList.contains('active')) {
      if (!instructionsSidebar.contains(e.target) && !toggleSidebarBtn.contains(e.target)) {
        instructionsSidebar.classList.remove('active');
      }
    }
  });
  
  // ========== LEADERBOARD BUTTONS ==========
  viewLeaderboardBtn.addEventListener('click', function(event) {
    showLeaderboard();
  });
  
  viewLeaderboardBtnMini.addEventListener('click', function(event) {
    showLeaderboard();
  });
  
  backToResultBtn.addEventListener('click', function(event) {
    hideLeaderboard();
    if (currentAttempt >= MAX_ATTEMPTS) {
      resultModal.classList.remove('hidden');
    }
  });
  
  // ========== OTHER BUTTONS ==========
  backToMenuBtn.addEventListener('click', () => {
    playSFX('click');
    if (confirm('Kembali ke menu utama? Progress game ini akan hilang.')) {
      window.location.href = 'index.html';
    }
  });
  
  backToMenuBtn2.addEventListener('click', () => {
    playSFX('click');
    window.location.href = 'index.html';
  });
  
  // Egg buttons
  hatchEggBtn.addEventListener('click', hatchEgg);
  
  closeAnimalBtn.addEventListener('click', continueGame);
  
  closeEggBtn.addEventListener('click', () => {
    playSFX('click');
    eggResultPopup.classList.add('hidden');
    hatchEggBtn.style.display = 'flex';
    closeEggBtn.style.display = 'flex';
    eggResultImage.style.opacity = '1';
    eggResultImage.style.filter = 'none';
    eggResultImage.className = 'egg-spin';
  });
  
  // ========== MODAL CLICK HANDLERS ==========
  leaderboardModal.addEventListener('click', (e) => {
    if (e.target === leaderboardModal) {
      playSFX('click');
      hideLeaderboard();
      if (currentAttempt >= MAX_ATTEMPTS) {
        resultModal.classList.remove('hidden');
      }
    }
  });
  
  // Escape key to close leaderboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !leaderboardModal.classList.contains('hidden')) {
      playSFX('click');
      hideLeaderboard();
      if (currentAttempt >= MAX_ATTEMPTS) {
        resultModal.classList.remove('hidden');
      }
    }
  });
  
  // Window resize
  window.addEventListener('resize', () => {
    if (eggs.length > 0) {
      updateClawPosition(clawPosition);
      updateClawRope();
    }
  });
  
  // Periodic controller check
  setInterval(checkGamepadConnection, 2000);
  
  console.log('✅ Event listeners setup complete');
}

// ======================
// INITIALIZATION
// ======================

window.addEventListener('load', () => {
  // Cek apakah sudah login
  if (!localStorage.getItem('currentUsername')) {
    window.location.href = 'index.html';
    return;
  }
  
  console.log('🚀 Game starting...');
  
  // Initialize audio system
  initAudio();
  
  // Check for controller on startup
  checkGamepadConnection();
  
  // Inisialisasi game
  initGame();
  
  // Setup event listeners
  setupEventListeners();
});