const ALL_IMAGES = [
  'wedang_jahe','es_buah','es_campur','es_selendang','es_kacang',
  'nasi_tumpeng','ayam_betutu','nasi_gudeg','wedang_ronde',
  'soto_ayam','es_kuwut','nasi_uduk','bika_ambon','dadar_gulung',
  'es_cendol','es_pisang','klepon','kolak','kue_cucur','kue_lapis',
  'lemper','onde_onde','pastel','pempek','sate_madura','putu_ayu',
  'tempe_mendoan'
];

/* ======================
   ELEMENT
====================== */
const homeScreen   = document.getElementById('homeScreen');
const gameScreen   = document.getElementById('gameScreen');
const menuOverlay  = document.getElementById('menuOverlay');
const soundStatus  = document.getElementById('soundStatus');

const grid        = document.getElementById('grid');
const scoreEl     = document.getElementById('score');
const levelEl     = document.getElementById('level');
const timeFill    = document.getElementById('timeFill');
const bestScoreEl = document.getElementById('bestScore');
const lastScoreEl = document.getElementById('lastScore');
const matchedEl   = document.getElementById('matched');

/* ======================
   STORAGE
====================== */
let bestScore    = Number(localStorage.getItem('bestScore')) || 0;
let lastScore    = Number(localStorage.getItem('lastScore')) || 0;
let soundEnabled = JSON.parse(localStorage.getItem('soundEnabled') ?? 'true');

bestScoreEl.textContent = bestScore;
lastScoreEl.textContent = lastScore;
soundStatus.textContent = soundEnabled ? 'ON' : 'OFF';

/* ======================
   SOUND EFFECT
====================== */
const sounds = {
  click:     new Audio('sounds/click.mp3'),
  flip:      new Audio('sounds/flip.mp3'),
  match:     new Audio('sounds/match.mp3'),
  wrong:     new Audio('sounds/wrong.mp3'),
  levelup:   new Audio('sounds/levelup.mp3'),
  gameover:  new Audio('sounds/gameover.mp3'),
  bestscore: new Audio('sounds/bestscore.mp3')
};

// 🎵 BACKSOUND GAME
const bgm = new Audio('sounds/bgm/soundgame.mp3');
bgm.loop = true;
bgm.volume = 0.35;

// volume SFX
Object.values(sounds).forEach(s => s.volume = 0.55);

function playSound(name) {
  if (!soundEnabled || !sounds[name]) return;
  sounds[name].currentTime = 0;
  sounds[name].play();
}

function playBGM() {
  if (!soundEnabled) return;
  bgm.currentTime = 0;
  bgm.play();
}

function stopBGM() {
  bgm.pause();
}

/* ======================
   GAME STATE
====================== */
let level   = 1;
let score   = 0;
let first   = null;
let lock    = true;
let matched = 0;
let totalPairs = 0;
let timer;
let timeLeft = 100;
let preview  = true;

/* ======================
   START GAME
====================== */
function startGame() {
  playSound('click');
  playBGM();

  homeScreen.style.display = 'none';
  gameScreen.style.display = 'block';

  score = 0;
  level = 1;
  startLevel();
}

/* ======================
   PAIRS BY LEVEL
====================== */
function getPairsByLevel(lvl) {
  if (lvl <= 2) return 4;
  if (lvl <= 4) return 6;
  if (lvl <= 6) return 8;
  if (lvl <= 8) return 10;
  return Math.min(
    12 + Math.floor((lvl - 8) * 0.8),
    Math.floor(ALL_IMAGES.length / 2)
  );
}

/* ======================
   GRID LAYOUT
====================== */
function setGridLayout(total) {
  if (total <= 16) grid.style.gridTemplateColumns = 'repeat(4, 60px)';
  else if (total <= 20) grid.style.gridTemplateColumns = 'repeat(5, 60px)';
  else grid.style.gridTemplateColumns = 'repeat(6, 60px)';
}

/* ======================
   MATCHED DISPLAY
====================== */
function updateMatchedDisplay() {
  if (matchedEl) {
    matchedEl.textContent = `${matched}/${totalPairs * 2}`;
  }
}

/* ======================
   START LEVEL
====================== */
function startLevel() {
  clearInterval(timer);
  grid.innerHTML = '';
  matched = 0;
  first = null;
  lock = true;
  preview = true;

  levelEl.textContent = level;
  scoreEl.textContent = score;

  const pairs = getPairsByLevel(level);
  totalPairs = pairs;
  updateMatchedDisplay();

  const chosen = shuffle([...ALL_IMAGES]).slice(0, pairs);
  const cardsData = shuffle([...chosen, ...chosen]);

  setGridLayout(cardsData.length);

  timeLeft = 100;
  timeFill.style.width = '100%';

  const cards = [];

  cardsData.forEach(img => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-face front"></div>
        <div class="card-face back">
          <img src="assets/${img}.png" alt="${img.replace('_', ' ')}">
        </div>
      </div>`;
    card.onclick = () => flip(card, img, cardsData.length);
    grid.appendChild(card);
    cards.push(card);
  });

  previewCards(cards);
}

/* ======================
   PREVIEW
====================== */
function previewCards(cards) {
  let maxTime = 0;

  cards.forEach(card => {
    const openDelay = rand(80, 400);
    const openDuration = rand(300, 700);
    maxTime = Math.max(maxTime, openDelay + openDuration);

    setTimeout(() => card.classList.add('open'), openDelay);
    setTimeout(() => card.classList.remove('open'), openDelay + openDuration);
  });

  setTimeout(() => {
    preview = false;
    lock = false;
    startTimer();
  }, maxTime + 200);
}

/* ======================
   TIMER
====================== */
function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft -= 0.5;
    timeFill.style.width = Math.max(0, timeLeft) + '%';
    if (timeLeft <= 0) gameOver();
  }, 100);
}

/* ======================
   FLIP CARD
====================== */
function flip(card, img, total) {
  if (lock || preview || card.classList.contains('open')) return;

  playSound('flip');
  card.classList.add('open');

  if (!first) {
    first = { card, img };
  } else {
    lock = true;

    if (first.img === img) {
      matched += 2;
      score += 50;
      playSound('match');

      scoreEl.textContent = score;
      updateMatchedDisplay();

      resetFlip();

      if (matched === total) {
        setTimeout(() => {
          playSound('levelup');
          level++;
          startLevel();
        }, 700);
      }
    } else {
      playSound('wrong');
      setTimeout(() => {
        card.classList.remove('open');
        first.card.classList.remove('open');
        resetFlip();
      }, 600);
    }
  }
}

function resetFlip() {
  first = null;
  lock = false;
}

/* ======================
   GAME OVER
====================== */
function gameOver() {
  clearInterval(timer);
  stopBGM();
  playSound('gameover');

  localStorage.setItem('lastScore', score);
  lastScoreEl.textContent = score;

  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem('bestScore', bestScore);
    bestScoreEl.textContent = bestScore;
    playSound('bestscore');
  }

  gameScreen.style.display = 'none';
  homeScreen.style.display = 'block';
}

/* ======================
   MENU
====================== */
function openMenu() {
  playSound('click');
  clearInterval(timer);
  bgm.pause();
  menuOverlay.style.display = 'flex';
}

function resumeGame() {
  playSound('click');
  menuOverlay.style.display = 'none';
  if (soundEnabled) bgm.play();
  startTimer();
}

function restartGame() {
  playSound('click');
  menuOverlay.style.display = 'none';
  clearInterval(timer);
  startLevel();
}

function exitGame() {
  playSound('click');
  stopBGM();
  menuOverlay.style.display = 'none';
  gameScreen.style.display = 'none';
  homeScreen.style.display = 'block';
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  localStorage.setItem('soundEnabled', soundEnabled);
  soundStatus.textContent = soundEnabled ? 'ON' : 'OFF';

  if (soundEnabled) {
    bgm.play();
  } else {
    bgm.pause();
  }

  playSound('click');
}

/* ======================
   UTIL
====================== */
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ======================
   INIT
====================== */
document.addEventListener('DOMContentLoaded', () => {
  updateMatchedDisplay();
});
