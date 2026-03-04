// ===========================================
// GAME VARIABLES AND INITIALIZATION
// ===========================================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const backgroundCanvas = document.getElementById('backgroundCanvas');
const backgroundCtx = backgroundCanvas.getContext('2d');
// Page elements
const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');
const startGameBtn = document.getElementById('startGameBtn');
const usernameInput = document.getElementById('usernameInput');
const joystickDot = document.getElementById('joystickDot');
const joystickStatus = document.getElementById('joystickStatus');
const characterOptions = document.getElementById('characterOptions');
const loadingIndicator = document.getElementById('loadingIndicator');
const loadingText = document.getElementById('loadingText');
// Game UI elements
const scoreElement = document.getElementById('score');
const playerNameDisplay = document.getElementById('playerNameDisplay');
const levelDisplay = document.getElementById('levelDisplay');
const difficultyDisplay = document.getElementById('difficultyDisplay');
const playerNameTag = document.getElementById('playerNameTag');
const heartsContainer = document.getElementById('heartsContainer');
const timerDisplay = document.getElementById('timerDisplay');
// Overlay elements
const countdownOverlay = document.getElementById('countdownOverlay');
const countdownText = document.getElementById('countdownText');
const countdownPlayerName = document.getElementById('countdownPlayerName');
const countdownLevel = document.getElementById('countdownLevel');
const levelUpOverlay = document.getElementById('levelUpOverlay');
const levelUpTitle = document.getElementById('levelUpTitle');
const levelUpMessage = document.getElementById('levelUpMessage');
const levelUpStats = document.getElementById('levelUpStats');
const nextLevelBtn = document.getElementById('nextLevelBtn');
const gameEndOverlay = document.getElementById('gameEndOverlay');
const gameEndTitle = document.getElementById('gameEndTitle');
const gameEndScore = document.getElementById('gameEndScore');
const gameEndStats = document.getElementById('gameEndStats');
const restartBtn = document.getElementById('restartBtn');
const menuBtn = document.getElementById('menuBtn');
const soundToggleGame = document.getElementById('soundToggleGame');
// Sound elements
const menuMusicBtn = document.getElementById('menuMusicBtn');
const menuSoundBtn = document.getElementById('menuSoundBtn');

// ===========================================
// GAMEPAD VARIABLES
// ===========================================
let gamepadConnected = false;
let gamepadIndex = -1;
let gamepadLastButtons = [];

// ===========================================
// GAME STATE
// ===========================================
let gameRunning = false;
let score = 0;
let lives = 5;
let currentLevel = 1;
let gameTime = 0;
let startTime = 0;
let gameInterval;
let countdownInterval;
let canJump = true;
let cameraX = 0;
let worldWidth = 0;
let playerName = "";
let selectedCharacter = "Karakter-cowo";
// TIMER Variables
let levelTimeLimit = 20;
let levelTimeRemaining = 20;
let timerInterval = null;
let isTimerRunning = false;
let timeUpTriggered = false;
// Characters
const characters = [
{
id: "Karakter-cowo",
name: "Karakter Cowo",
src: "Karakter-cowo.png",
description: "Karakter utama laki-laki"
},
{
id: "Karakter-cewe",
name: "Karakter Cewe",
src: "Karakter-cewe.png",
description: "Karakter utama perempuan"
},
{
id: "Karakter-guru",
name: "Karakter Guru",
src: "Karakter-guru.png",
description: "Karakter guru"
}
];
// ===========================================
// AUDIO SYSTEM - SUARA MARIO BROS ASLI!
// ===========================================
let soundEnabled = true;
let backgroundMusicEnabled = true;
let soundEffectsEnabled = true;
let audioContextUnlocked = false;
// SPEECH SYNTHESIS
let speechSynthesis = window.speechSynthesis;
let speechUtterance = null;
const audio = {
backgroundMusic: new Audio(),
marioJumpSound: new Audio(),     // SUARA LOMPAT MARIO "BOING!"
marioCoinSound: new Audio(),     // SUARA KOIN MARIO "TUING TUING!"
damageSound: new Audio(),
levelCompleteSound: new Audio(),
gameOverSound: new Audio(),
winSound: new Audio(),
shootSound: new Audio(),
enemyDieSound: new Audio(),
platformBreakSound: new Audio()
};
// ===========================================
// LEVEL SETTINGS - PROJECTILE SPAWN RATE DISESUAIKAN
// ===========================================
const levels = [
{
name: "easy",
displayName: "Mudah",
lives: 5,
playerSpeed: 4.5,
enemySpeed: 1.8,
enemySpawnRate: 120,
projectileSpeed: 4,
projectileSpawnRate: 150,  // DIPERBESAR = lebih jarang (sedikit peluru)
jumpForce: 14,
gravity: 0.7,
coinBonus: 100,
worldMultiplier: 3.0,
coinCount: 20,
enemyCount: 4,
platformHeights: [80, 120, 100, 150, 120, 90, 160],
backgroundSpeed: 0.3,
breakablePlatformCount: 3,
timeLimit: 20
},
{
name: "medium",
displayName: "Medium",
lives: 5,
playerSpeed: 5.0,
enemySpeed: 2.2,
enemySpawnRate: 90,
projectileSpeed: 5,
projectileSpawnRate: 80,   // SEDANG (lumayan peluru)
jumpForce: 15,
gravity: 0.75,
coinBonus: 150,
worldMultiplier: 3.5,
coinCount: 25,
enemyCount: 6,
platformHeights: [100, 150, 120, 180, 140, 100],
backgroundSpeed: 0.4,
breakablePlatformCount: 4,
timeLimit: 40
},
{
name: "hard",
displayName: "Sulit",
lives: 5,
playerSpeed: 5.5,
enemySpeed: 2.6,
enemySpawnRate: 60,
projectileSpeed: 6,
projectileSpawnRate: 50,   // KECIL = lebih sering (banyak peluru)
jumpForce: 16,
gravity: 0.8,
coinBonus: 200,
worldMultiplier: 4.0,
coinCount: 30,
enemyCount: 8,
platformHeights: [120, 160, 140, 200, 160, 120, 80],
backgroundSpeed: 0.5,
breakablePlatformCount: 5,
timeLimit: 60
}
];
let currentLevelSettings = levels[0];
// Game objects
let platforms = [];
let breakablePlatforms = [];
let enemies = [];
let projectiles = [];
let coins = [];
let finish = {};
let player = {};
let levelScore = 0;
let levelCoinsCollected = 0;
let levelTotalCoins = 0;
let levelStartTime = 0;
// Animation
let walkAnimationFrame = 0;
let isWalking = false;
// Death animation
let isGameOverDying = false;
let gameOverDeathYVelocity = 0;
// Assets
let gameAssets = {
playerImage: null,
backgroundImage: null,
finishImage: null,
platformImage: null,
groundImage: null,
coinImage: null,
enemyImage: null,
projectileImage: null
};
let assetsLoaded = 0;
let totalAssets = 0;

// ===========================================
// DEBUG FUNCTIONS
// ===========================================
function debugLog(message) {
console.log(`[DEBUG] ${message}`);
if (loadingText) {
loadingText.textContent = message;
}
}

// ===========================================
// GAMEPAD FUNCTIONS
// ===========================================
function initializeGamepad() {
debugLog("Menginisialisasi gamepad...");
// Event listener untuk koneksi gamepad
window.addEventListener('gamepadconnected', (e) => {
gamepadConnected = true;
gamepadIndex = e.gamepad.index;
gamepadLastButtons = Array(e.gamepad.buttons.length).fill(false);
updateJoystickStatus(true);
debugLog(`🎮 Gamepad terhubung: ${e.gamepad.id} (Index: ${e.gamepad.index})`);
});
// Event listener untuk diskoneksi gamepad
window.addEventListener('gamepaddisconnected', (e) => {
gamepadConnected = false;
gamepadIndex = -1;
gamepadLastButtons = [];
updateJoystickStatus(false);
debugLog(`🎮 Gamepad terputus: ${e.gamepad.id}`);
});
// Cek gamepad yang sudah terhubung saat halaman dimuat
checkInitialGamepadConnection();
}

function checkInitialGamepadConnection() {
const gamepads = navigator.getGamepads();
for (let i = 0; i < gamepads.length; i++) {
if (gamepads[i]) {
gamepadConnected = true;
gamepadIndex = i;
gamepadLastButtons = Array(gamepads[i].buttons.length).fill(false);
updateJoystickStatus(true);
debugLog(`🎮 Gamepad terdeteksi: ${gamepads[i].id} (Index: ${i})`);
break;
}
}
}

function updateJoystickStatus(connected) {
if (joystickDot) {
if (connected) {
joystickDot.classList.add('connected');
joystickDot.classList.remove('disconnected');
if (joystickStatus) joystickStatus.textContent = "Joystick terhubung! 🎮";
} else {
joystickDot.classList.remove('connected');
joystickDot.classList.remove('disconnected');
if (joystickStatus) joystickStatus.textContent = "Hubungkan joystick untuk kontrol alternatif";
}
}
const gamepadStatus = document.getElementById('gamepadStatus');
const gamepadText = document.getElementById('gamepadText');
if (gamepadStatus) {
if (connected) {
gamepadStatus.classList.add('connected');
gamepadStatus.classList.remove('disconnected');
if (gamepadText) gamepadText.textContent = "Joystick: Terhubung 🎮";
} else {
gamepadStatus.classList.remove('connected');
gamepadStatus.classList.add('disconnected');
if (gamepadText) gamepadText.textContent = "Joystick: Tidak terdeteksi";
}
}
}

function checkGamepadInput() {
if (!gamepadConnected || !gameRunning || isGameOverDying || timeUpTriggered) {
return;
}
const gamepads = navigator.getGamepads();
const gamepad = gamepads[gamepadIndex];
if (!gamepad) {
gamepadConnected = false;
updateJoystickStatus(false);
return;
}
// Baca Analog Kiri (Axis 0 = kiri/kanan)
const leftStickX = gamepad.axes[0];
// Kontrol gerakan dengan analog kiri
if (Math.abs(leftStickX) > 0.3) {
if (leftStickX < -0.3) {
// Bergerak ke kiri
player.keyStates.left = true;
player.keyStates.right = false;
} else if (leftStickX > 0.3) {
// Bergerak ke kanan
player.keyStates.right = true;
player.keyStates.left = false;
}
} else {
// Analog netral, hentikan gerakan
player.keyStates.left = false;
player.keyStates.right = false;
}
// Deteksi tombol yang ditekan
for (let i = 0; i < gamepad.buttons.length; i++) {
const button = gamepad.buttons[i];
const isPressed = button.pressed || button.value > 0.5;
const wasPressed = gamepadLastButtons[i];
if (isPressed && !wasPressed) {
// Tombol baru ditekan
handleGamepadButtonPress(i, button);
}
gamepadLastButtons[i] = isPressed;
}
}

function handleGamepadButtonPress(buttonIndex, button) {
// Tombol A (biasanya index 0) atau X (biasanya index 2) = Lompat
if (buttonIndex === 0 || buttonIndex === 2) {
if (player && player.isOnGround) {
player.jump();
debugLog("🎮 Gamepad Jump: BOING!");
}
}
// Tombol Start (biasanya index 9 atau 11 tergantung gamepad) = Reset Game
if (buttonIndex === 9 || buttonIndex === 11) {
resetGame();
debugLog("🎮 Gamepad Reset: Game direset!");
}
}

function resetGamepadState() {
gamepadConnected = false;
gamepadIndex = -1;
gamepadLastButtons = [];
updateJoystickStatus(false);
}

// ===========================================
// AUDIO FUNCTIONS - MARIO BROS STYLE!
// ===========================================
function initializeAudio() {
debugLog("Menginisialisasi audio ala Mario Bros...");
audio.backgroundMusic.src = "backsound.mp3";
audio.marioJumpSound.src = "mario-jump.mp3";     // SUARA LOMPAT MARIO "BOING!"
audio.marioCoinSound.src = "mario-coin.mp3";     // SUARA KOIN MARIO "TUING TUING!"
audio.damageSound.src = "damage.mp3";
audio.levelCompleteSound.src = "complete.mp3";
audio.gameOverSound.src = "gameover.mp3";
audio.winSound.src = "win.mp3";
audio.shootSound.src = "shoot.mp3";
audio.enemyDieSound.src = "enemy-die.mp3";
audio.platformBreakSound.src = "break.mp3";
Object.values(audio).forEach(sound => {
sound.preload = "auto";
sound.volume = 0.7;
});
audio.backgroundMusic.loop = true;
audio.backgroundMusic.volume = 0.4;
audio.marioJumpSound.volume = 1.0;      // BOING!
audio.marioCoinSound.volume = 1.0;       // TUING TUING!
audio.shootSound.volume = 0.3;
audio.enemyDieSound.volume = 0.6;
audio.platformBreakSound.volume = 0.5;
menuMusicBtn.addEventListener('click', function() {
unlockAudioContext();
toggleBackgroundMusic();
});
menuSoundBtn.addEventListener('click', function() {
unlockAudioContext();
toggleSoundEffects();
});
soundToggleGame.addEventListener('click', function() {
unlockAudioContext();
toggleAllSound();
});
updateSoundButtons();
debugLog("✅ SUARA MARIO AKTIF! Jump: BOING! Coin: TUING TUING!");
}
function unlockAudioContext() {
if (audioContextUnlocked) return;
try {
const AudioContext = window.AudioContext || window.webkitAudioContext;
if (AudioContext) {
const context = new AudioContext();
if (context.state === 'suspended') context.resume();
audioContextUnlocked = true;
}
} catch (e) {}
}
function playSound(soundName, volume = 0.7) {
if (!soundEnabled || !soundEffectsEnabled) return;
const sound = audio[soundName];
if (!sound) return;
unlockAudioContext();
try {
const audioClone = sound.cloneNode();
audioClone.volume = volume;
audioClone.play().catch(() => {});
audioClone.addEventListener('ended', () => audioClone.remove());
setTimeout(() => {
if (!audioClone.paused) {
audioClone.pause();
audioClone.remove();
}
}, 3000);
} catch (e) {}
}

// ===========================================
// SPEECH COUNTDOWN
// ===========================================
function speakCountdown(number) {
if (!soundEnabled || !soundEffectsEnabled) return;
try {
if (speechSynthesis.speaking) {
speechSynthesis.cancel();
}
let text = "";
if (number === 3) text = "Three";
else if (number === 2) text = "Two";
else if (number === 1) text = "One";
else if (number === 0) text = "Go";
if (text) {
speechUtterance = new SpeechSynthesisUtterance(text);
speechUtterance.lang = 'en-US';
speechUtterance.rate = 0.9;
speechUtterance.pitch = 1;
speechUtterance.volume = 0.8;
speechSynthesis.speak(speechUtterance);
debugLog(`🔊 SPEECH: ${text}`);
}
} catch (e) {
debugLog(`❌ Speech error: ${e}`);
}
}
function toggleBackgroundMusic() {
backgroundMusicEnabled = !backgroundMusicEnabled;
if (backgroundMusicEnabled && soundEnabled) {
audio.backgroundMusic.play().catch(e => {});
menuMusicBtn.classList.add('active');
} else {
audio.backgroundMusic.pause();
menuMusicBtn.classList.remove('active');
}
updateSoundButtons();
}
function toggleSoundEffects() {
soundEffectsEnabled = !soundEffectsEnabled;
updateSoundButtons();
}
function toggleAllSound() {
soundEnabled = !soundEnabled;
if (soundEnabled) {
document.getElementById('soundIcon').textContent = "🔊";
document.getElementById('soundText').textContent = "Suara: ON";
if (backgroundMusicEnabled) audio.backgroundMusic.play().catch(e => {});
} else {
document.getElementById('soundIcon').textContent = "🔇";
document.getElementById('soundText').textContent = "Suara: OFF";
audio.backgroundMusic.pause();
if (speechSynthesis.speaking) speechSynthesis.cancel();
}
updateSoundButtons();
}
function updateSoundButtons() {
if (backgroundMusicEnabled && soundEnabled) menuMusicBtn.classList.add('active');
else menuMusicBtn.classList.remove('active');
if (soundEffectsEnabled && soundEnabled) menuSoundBtn.classList.add('active');
else menuSoundBtn.classList.remove('active');
}
function playBackgroundMusic() {
if (!soundEnabled || !backgroundMusicEnabled) return;
unlockAudioContext();
audio.backgroundMusic.currentTime = 0;
audio.backgroundMusic.play().catch(e => {});
}
function stopBackgroundMusic() {
audio.backgroundMusic.pause();
}

// ===========================================
// TIMER FUNCTIONS
// ===========================================
function startLevelTimer() {
if (timerInterval) {
clearInterval(timerInterval);
timerInterval = null;
}
levelTimeRemaining = levelTimeLimit;
timeUpTriggered = false;
isTimerRunning = true;
updateTimerDisplay();
debugLog(`Timer started: ${levelTimeRemaining}s`);
timerInterval = setInterval(function() {
if (gameRunning && !isGameOverDying && !timeUpTriggered &&
levelUpOverlay.style.display !== 'flex' && gameEndOverlay.style.display !== 'flex') {
levelTimeRemaining--;
updateTimerDisplay();
debugLog(`Timer: ${levelTimeRemaining}s`);
if (levelTimeRemaining <= 5) {
timerDisplay.classList.add('timer-warning');
} else if (levelTimeRemaining <= 10) {
timerDisplay.classList.remove('timer-warning');
} else {
timerDisplay.classList.remove('timer-warning');
}
if (levelTimeRemaining <= 0 && !timeUpTriggered) {
levelTimeRemaining = 0;
updateTimerDisplay();
debugLog("⏰ TIME'S UP! Game Over");
timeUpTriggered = true;
isTimerRunning = false;
clearInterval(timerInterval);
timerInterval = null;
if (gameRunning) {
gameRunning = false;
if (gameInterval) {
clearInterval(gameInterval);
gameInterval = null;
}
stopBackgroundMusic();
playSound('gameOverSound');
const playTime = Math.floor((Date.now() - startTime) / 1000);
gameEndTitle.textContent = "GAME OVER";
gameEndScore.textContent = `Skor akhir: ${score}`;
gameEndStats.innerHTML = `
Nama: <strong>${playerName}</strong><br>
Level: <strong>${currentLevelSettings.displayName} (${currentLevel}/3)</strong><br>
Waktu bermain: <strong>${playTime} detik</strong><br>
Penyebab: <strong style="color:#FF4444;">Waktu Habis ⏱️</strong>
`;
gameEndOverlay.style.display = "flex";
}
}
}
}, 1000);
}
function stopTimer() {
if (timerInterval) {
clearInterval(timerInterval);
timerInterval = null;
}
isTimerRunning = false;
debugLog("Timer stopped");
}
function updateTimerDisplay() {
if (timerDisplay) {
if (levelTimeRemaining < 0) levelTimeRemaining = 0;
timerDisplay.textContent = `${levelTimeRemaining}s`;
if (levelTimeRemaining <= 5) {
timerDisplay.style.color = '#FF4444';
} else if (levelTimeRemaining <= 10) {
timerDisplay.style.color = '#FFA500';
} else {
timerDisplay.style.color = '#2196F3';
}
}
}
function resetTimer() {
stopTimer();
levelTimeRemaining = levelTimeLimit;
timeUpTriggered = false;
isTimerRunning = false;
updateTimerDisplay();
timerDisplay.classList.remove('timer-warning');
timerDisplay.style.color = '#2196F3';
debugLog(`Timer reset to ${levelTimeRemaining}s`);
}

// ===========================================
// FALLBACK ASSETS
// ===========================================
function createFallbackAssets() {
// Player
const playerCanvas = document.createElement('canvas');
playerCanvas.width = 100;
playerCanvas.height = 140;
const playerCtx = playerCanvas.getContext('2d');
playerCtx.fillStyle = '#4169E1';
playerCtx.fillRect(20, 30, 60, 80);
playerCtx.fillStyle = '#FFCC99';
playerCtx.beginPath();
playerCtx.arc(50, 20, 15, 0, Math.PI * 2);
playerCtx.fill();
playerCtx.fillStyle = '#000';
playerCtx.beginPath();
playerCtx.arc(45, 18, 3, 0, Math.PI * 2);
playerCtx.arc(55, 18, 3, 0, Math.PI * 2);
playerCtx.fill();
const playerImg = new Image();
playerImg.src = playerCanvas.toDataURL();
gameAssets.playerImage = playerImg;
// Background
const bgCanvas = document.createElement('canvas');
bgCanvas.width = 800;
bgCanvas.height = 600;
const bgCtx = bgCanvas.getContext('2d');
const skyGradient = bgCtx.createLinearGradient(0, 0, 0, 400);
skyGradient.addColorStop(0, '#87CEEB');
skyGradient.addColorStop(1, '#42A5F5');
bgCtx.fillStyle = skyGradient;
bgCtx.fillRect(0, 0, 800, 400);
bgCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
for (let i = 0; i < 5; i++) {
const x = i * 200;
const y = 100 + Math.sin(i) * 20;
const size = 40;
bgCtx.beginPath();
bgCtx.arc(x, y, size, 0, Math.PI * 2);
bgCtx.arc(x - size * 0.6, y, size * 0.8, 0, Math.PI * 2);
bgCtx.arc(x + size * 0.6, y, size * 0.8, 0, Math.PI * 2);
bgCtx.fill();
}
bgCtx.fillStyle = '#8B4513';
bgCtx.fillRect(0, 400, 800, 200);
const bgImg = new Image();
bgImg.src = bgCanvas.toDataURL();
gameAssets.backgroundImage = bgImg;
// Coin
const coinCanvas = document.createElement('canvas');
coinCanvas.width = 40;
coinCanvas.height = 40;
const coinCtx = coinCanvas.getContext('2d');
coinCtx.fillStyle = '#FFD700';
coinCtx.beginPath();
coinCtx.arc(20, 20, 18, 0, Math.PI * 2);
coinCtx.fill();
coinCtx.fillStyle = '#FFA500';
coinCtx.beginPath();
coinCtx.arc(20, 20, 14, 0, Math.PI * 2);
coinCtx.fill();
coinCtx.fillStyle = '#FFFFFF';
coinCtx.font = 'bold 16px Arial';
coinCtx.textAlign = 'center';
coinCtx.textBaseline = 'middle';
coinCtx.fillText('$', 20, 20);
const coinImg = new Image();
coinImg.src = coinCanvas.toDataURL();
gameAssets.coinImage = coinImg;
// Platform
const platformCanvas = document.createElement('canvas');
platformCanvas.width = 200;
platformCanvas.height = 30;
const platformCtx = platformCanvas.getContext('2d');
platformCtx.fillStyle = '#8B4513';
platformCtx.fillRect(0, 0, 200, 30);
const platformImg = new Image();
platformImg.src = platformCanvas.toDataURL();
gameAssets.platformImage = platformImg;
// Ground
const groundCanvas = document.createElement('canvas');
groundCanvas.width = 100;
groundCanvas.height = 50;
const groundCtx = groundCanvas.getContext('2d');
groundCtx.fillStyle = '#8B4513';
groundCtx.fillRect(0, 0, 100, 50);
const groundImg = new Image();
groundImg.src = groundCanvas.toDataURL();
gameAssets.groundImage = groundImg;
// Finish
const finishCanvas = document.createElement('canvas');
finishCanvas.width = 200;
finishCanvas.height = 150;
const finishCtx = finishCanvas.getContext('2d');
finishCtx.fillStyle = '#8B4513';
finishCtx.fillRect(50, 50, 100, 100);
finishCtx.fillStyle = '#4169E1';
finishCtx.fillRect(70, 70, 60, 40);
const finishImg = new Image();
finishImg.src = finishCanvas.toDataURL();
gameAssets.finishImage = finishImg;
// Enemy
const enemyCanvas = document.createElement('canvas');
enemyCanvas.width = 50;
enemyCanvas.height = 45;
const enemyCtx = enemyCanvas.getContext('2d');
enemyCtx.fillStyle = '#8B4513';
enemyCtx.beginPath();
enemyCtx.ellipse(25, 22, 20, 15, 0, 0, Math.PI * 2);
enemyCtx.fill();
enemyCtx.fillStyle = '#000';
enemyCtx.beginPath();
enemyCtx.arc(20, 18, 3, 0, Math.PI * 2);
enemyCtx.arc(30, 18, 3, 0, Math.PI * 2);
enemyCtx.fill();
const enemyImg = new Image();
enemyImg.src = enemyCanvas.toDataURL();
gameAssets.enemyImage = enemyImg;
// Projectile
const projCanvas = document.createElement('canvas');
projCanvas.width = 20;
projCanvas.height = 10;
const projCtx = projCanvas.getContext('2d');
projCtx.fillStyle = '#FF4500';
projCtx.beginPath();
projCtx.ellipse(10, 5, 8, 4, 0, 0, Math.PI * 2);
projCtx.fill();
const projImg = new Image();
projImg.src = projCanvas.toDataURL();
gameAssets.projectileImage = projImg;
debugLog("Fallback assets dibuat");
}

// ===========================================
// CHARACTER SELECTION
// ===========================================
function initializeCharacterSelection() {
characterOptions.innerHTML = '';
characters.forEach(character => {
const option = document.createElement('div');
option.className = 'character-option';
option.dataset.id = character.id;
const fallbackSVG = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="80" viewBox="0 0 60 80"><rect width="60" height="80" fill="%234169E1" opacity="0.3"/><circle cx="30" cy="25" r="15" fill="%23FFCC99"/><rect x="15" y="40" width="30" height="30" fill="%234169E1"/></svg>';
option.innerHTML = `
<img src="${character.src}" alt="${character.name}" class="character-img"
onerror="this.src='${fallbackSVG}'">
<div class="character-name">${character.name}</div>
<div class="character-desc">${character.description}</div>
`;
option.addEventListener('click', () => selectCharacter(character.id));
characterOptions.appendChild(option);
});
if (characters.length > 0) selectCharacter(characters[0].id);
}
function selectCharacter(characterId) {
document.querySelectorAll('.character-option').forEach(opt => opt.classList.remove('selected'));
const selectedOption = document.querySelector(`.character-option[data-id="${characterId}"]`);
if (selectedOption) {
selectedOption.classList.add('selected');
selectedCharacter = characterId;
if (playerName.trim()) startGameBtn.disabled = false;
}
}

// ===========================================
// ASSET LOADING
// ===========================================
function loadGameAssets(callback) {
debugLog("Memulai loading assets...");
loadingIndicator.style.display = 'block';
createFallbackAssets();
const selectedChar = characters.find(c => c.id === selectedCharacter);
if (!selectedChar) {
if (callback) callback();
return;
}
const assetsToLoad = [
{ name: 'playerImage', src: selectedChar.src, isCritical: true },
{ name: 'backgroundImage', src: 'Background.png', isCritical: false },
{ name: 'finishImage', src: 'Sekolah.png', isCritical: false },
{ name: 'platformImage', src: 'Platform.png', isCritical: false },
{ name: 'groundImage', src: 'Permukaan.png', isCritical: false },
{ name: 'coinImage', src: 'lompat coin.png', isCritical: false },
{ name: 'enemyImage', src: 'lawan.png', isCritical: false },
{ name: 'projectileImage', src: 'peluru.png', isCritical: false }
];
totalAssets = assetsToLoad.length;
assetsLoaded = 0;
let failedAssets = [];
assetsToLoad.forEach(asset => {
const img = new Image();
img.onload = () => {
assetsLoaded++;
debugLog(`✅ Asset berhasil dimuat: ${asset.src}`);
gameAssets[asset.name] = img;
checkAssetsLoaded(callback, failedAssets);
};
img.onerror = () => {
assetsLoaded++;
debugLog(`❌ Gagal memuat asset: ${asset.src}`);
failedAssets.push(asset.name);
checkAssetsLoaded(callback, failedAssets);
};
img.src = asset.src;
setTimeout(() => {
if (!img.complete && !gameAssets[asset.name]) {
debugLog(`⏰ Timeout loading asset: ${asset.src}`);
assetsLoaded++;
failedAssets.push(asset.name);
checkAssetsLoaded(callback, failedAssets);
}
}, 3000);
});
}
function checkAssetsLoaded(callback, failedAssets = []) {
const progress = Math.round((assetsLoaded / totalAssets) * 100);
loadingText.textContent = `Memuat aset game... ${progress}% (${assetsLoaded}/${totalAssets})`;
if (assetsLoaded >= totalAssets) {
loadingIndicator.style.display = 'none';
if (callback) callback();
}
}

// ===========================================
// BACKGROUND PREVIEW
// ===========================================
function drawBackgroundPreview() {
backgroundCanvas.width = window.innerWidth;
backgroundCanvas.height = window.innerHeight;
backgroundCtx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
const gradient = backgroundCtx.createLinearGradient(0, 0, 0, backgroundCanvas.height);
gradient.addColorStop(0, '#0f0c29');
gradient.addColorStop(0.5, '#302b63');
gradient.addColorStop(1, '#24243e');
backgroundCtx.fillStyle = gradient;
backgroundCtx.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
backgroundCtx.fillStyle = '#FFD700';
backgroundCtx.font = 'bold 24px Arial';
backgroundCtx.textAlign = 'center';
backgroundCtx.fillText('PETUALANGAN KE SEKOLAH ala MARIO', backgroundCanvas.width/2, backgroundCanvas.height/2 - 50);
backgroundCtx.fillStyle = '#87CEEB';
backgroundCtx.font = '16px Arial';
backgroundCtx.fillText('BOING! Lompat ala Mario - TUING TUING! Koin', backgroundCanvas.width/2, backgroundCanvas.height/2);
backgroundCtx.filter = 'blur(3px)';
backgroundCtx.globalAlpha = 0.6;
backgroundCtx.drawImage(backgroundCanvas, 0, 0);
backgroundCtx.filter = 'none';
backgroundCtx.globalAlpha = 1.0;
}

// ===========================================
// PAGE MANAGEMENT
// ===========================================
function showPage(pageId) {
document.querySelectorAll('.page').forEach(page => {
page.classList.remove('active');
page.classList.add('hidden');
});
const targetPage = document.getElementById(pageId);
targetPage.classList.remove('hidden');
setTimeout(() => targetPage.classList.add('active'), 10);
}
function startGameFromMenu() {
playerName = usernameInput.value.trim();
if (!playerName) {
playerName = "Player";
usernameInput.value = "Player";
}
playerNameDisplay.textContent = playerName;
showPage('page2');
loadGameAssets(() => {
setTimeout(() => {
resizeCanvas();
startCountdown();
}, 100);
});
}
function returnToMenu() {
resetGame();
resetGamepadState();
showPage('page1');
usernameInput.focus();
}

// ===========================================
// GAME INITIALIZATION
// ===========================================
function resizeCanvas() {
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 60;
backgroundCanvas.width = window.innerWidth;
backgroundCanvas.height = window.innerHeight;
if (!gameRunning) {
initGameElements();
drawStaticScreen();
drawBackgroundPreview();
}
}
function updateLevelIndicator() {
levelDisplay.textContent = `${currentLevel}/3`;
}

// ===========================================
// PLATFORMS
// ===========================================
function createPlatforms() {
const groundLevel = canvas.height - 50;
platforms = [];
breakablePlatforms = [];
platforms.push({
x: 0,
y: groundLevel,
width: worldWidth,
height: 50,
isGround: true,
isActive: true,
texture: 'ground'
});
const platformHeights = currentLevelSettings.platformHeights;
for (let i = 0; i < platformHeights.length; i++) {
const progress = (i + 1) / (platformHeights.length + 1);
platforms.push({
x: worldWidth * progress * 0.8,
y: groundLevel - platformHeights[i],
width: 150 + (i * 20),
height: 20,
color: '#8B4513',
isGround: false,
isActive: true,
texture: 'platform',
isBreakable: false
});
}
for (let i = 0; i < currentLevelSettings.breakablePlatformCount; i++) {
const progress = (i + 1) / (currentLevelSettings.breakablePlatformCount + 1);
const xPos = worldWidth * progress * 0.6 + 200;
const yPos = groundLevel - 200 - (i * 30);
const breakablePlatform = {
x: xPos,
y: yPos,
width: 100,
height: 20,
color: '#C0A080',
isGround: false,
isActive: true,
texture: 'breakable',
isBreakable: true,
breakTimer: 0,
isBreaking: false,
health: 2
};
platforms.push(breakablePlatform);
breakablePlatforms.push(breakablePlatform);
}
platforms.push({
x: worldWidth - 300,
y: groundLevel - 120,
width: 250,
height: 30,
color: '#32CD32',
isGround: false,
isActive: true,
texture: 'finish',
isBreakable: false
});
}

// ===========================================
// ENEMIES
// ===========================================
function createEnemies() {
enemies = [];
const groundLevel = canvas.height - 50;
const enemyCount = currentLevelSettings.enemyCount;
for (let i = 0; i < enemyCount; i++) {
const progress = i / enemyCount;
const width = 50;
const height = 45;
let yPos = groundLevel - height - 5;
let xPos = worldWidth * progress * 0.7 + 200;
if (i % 2 === 0 && platforms.length > 2) {
const platformIndex = Math.min(i + 1, platforms.length - 2);
const platform = platforms[platformIndex];
if (platform && platform.isActive) {
yPos = platform.y - height;
xPos = platform.x + platform.width / 2 - width/2;
}
}
enemies.push({
x: xPos,
y: yPos,
width: width,
height: height,
originalHeight: height,
originalY: yPos,
speed: currentLevelSettings.enemySpeed,
direction: i % 2 === 0 ? 1 : -1,
isAlive: true,
shootTimer: Math.floor(Math.random() * 30),
shootCooldown: currentLevelSettings.projectileSpawnRate,
stompCount: 0,
isSquashed: false,
squashTimer: 0,
moveRange: 120,
startX: xPos
});
}
debugLog(`Dibuat ${enemies.length} musuh`);
}
function spawnProjectile(enemy) {
if (!enemy || !enemy.isAlive || enemy.isSquashed) return;
if (!player) return;
if (isGameOverDying) return;
if (!gameRunning) return;
if (timeUpTriggered) return;
const direction = player.x > enemy.x ? 1 : -1;
const projectileX = enemy.x + (direction === 1 ? enemy.width : 0);
const projectileY = enemy.y + enemy.height / 2;
projectiles.push({
x: projectileX,
y: projectileY,
width: 20,
height: 10,
speed: currentLevelSettings.projectileSpeed * direction,
direction: direction,
isActive: true,
color: '#FF4500'
});
playSound('shootSound', 0.3);
}
function checkEnemyStomp(enemy) {
if (!enemy.isAlive || enemy.isSquashed) return false;
if (isGameOverDying) return false;
if (!gameRunning) return false;
if (timeUpTriggered) return false;
const playerBottom = player.y + player.height;
const playerTop = player.y;
const playerLeft = player.x + player.width * 0.2;
const playerRight = player.x + player.width * 0.8;
const enemyTop = enemy.y;
const enemyBottom = enemy.y + enemy.height;
const enemyLeft = enemy.x;
const enemyRight = enemy.x + enemy.width;
const isFalling = player.velocityY > 0;
const isAbove = playerBottom >= enemyTop && playerTop < enemyTop + enemy.height * 0.3;
const isHorizontalOverlap = playerRight > enemyLeft && playerLeft < enemyRight;
if (isFalling && isAbove && isHorizontalOverlap) {
enemy.stompCount++;
enemy.isSquashed = true;
enemy.squashTimer = 45;
enemy.originalHeight = enemy.height;
enemy.originalY = enemy.y;
enemy.height = enemy.originalHeight * 0.3;
enemy.y = enemy.originalY + (enemy.originalHeight * 0.7);
if (enemy.stompCount >= 3) {
enemy.isAlive = false;
score += 500;
levelScore += 500;
playSound('enemyDieSound');
debugLog("💀 Robot mati setelah diinjak 3x!");
} else {
score += 150;
levelScore += 150;
playSound('coinSound');
}
scoreElement.textContent = score;
player.velocityY = -player.jumpForce * 0.8;
return true;
}
return false;
}
function checkEnemyDamage(enemy) {
if (!enemy.isAlive || enemy.isSquashed) return false;
if (player.invincible) return false;
if (isGameOverDying) return false;
if (!gameRunning) return false;
if (timeUpTriggered) return false;
const playerLeft = player.x + player.width * 0.2;
const playerRight = player.x + player.width * 0.8;
const playerTop = player.y + player.height * 0.1;
const playerBottom = player.y + player.height * 0.9;
const enemyLeft = enemy.x;
const enemyRight = enemy.x + enemy.width;
const enemyTop = enemy.y;
const enemyBottom = enemy.y + enemy.height;
const horizontalCollision = playerRight > enemyLeft && playerLeft < enemyRight;
const verticalCollision = playerBottom > enemyTop && playerTop < enemyBottom;
const isStomping = player.velocityY > 0 && playerBottom <= enemyTop + enemy.height * 0.3;
if (horizontalCollision && verticalCollision && !isStomping) {
return true;
}
return false;
}
function updateAndDrawEnemies() {
for (let i = enemies.length - 1; i >= 0; i--) {
const enemy = enemies[i];
if (!enemy.isAlive) {
enemies.splice(i, 1);
continue;
}
if (!enemy.isSquashed && !isGameOverDying && gameRunning && !timeUpTriggered) {
checkEnemyStomp(enemy);
}
if (!player.invincible && !isGameOverDying && gameRunning && !timeUpTriggered) {
if (checkEnemyDamage(enemy)) {
player.takeDamage();
}
}
if (enemy.isSquashed) {
enemy.squashTimer--;
const screenX = enemy.x - cameraX;
ctx.fillStyle = '#5D3A1A';
ctx.fillRect(screenX, enemy.y, enemy.width, enemy.height);
if (enemy.squashTimer <= 0) {
enemy.isSquashed = false;
enemy.height = enemy.originalHeight;
enemy.y = enemy.originalY;
}
continue;
}
enemy.x += enemy.speed * enemy.direction;
if (enemy.x < enemy.startX - enemy.moveRange) {
enemy.x = enemy.startX - enemy.moveRange;
enemy.direction = 1;
} else if (enemy.x > enemy.startX + enemy.moveRange) {
enemy.x = enemy.startX + enemy.moveRange;
enemy.direction = -1;
}
enemy.shootTimer++;
if (enemy.shootTimer >= enemy.shootCooldown) {
spawnProjectile(enemy);
enemy.shootTimer = 0;
}
const screenX = enemy.x - cameraX;
if (screenX + enemy.width > -50 && screenX < canvas.width + 50) {
if (gameAssets.enemyImage && gameAssets.enemyImage.complete) {
try {
ctx.drawImage(gameAssets.enemyImage, screenX, enemy.y, enemy.width, enemy.height);
} catch (e) {
drawFallbackEnemy(screenX, enemy);
}
} else {
drawFallbackEnemy(screenX, enemy);
}
for (let s = 0; s < 3; s++) {
ctx.fillStyle = s < enemy.stompCount ? '#FF4444' : '#AAAAAA';
ctx.beginPath();
ctx.arc(screenX + enemy.width/2 - 15 + (s * 15), enemy.y - 20, 5, 0, Math.PI * 2);
ctx.fill();
}
ctx.fillStyle = enemy.shootTimer > enemy.shootCooldown * 0.8 ? '#FF0000' : '#FFD700';
ctx.beginPath();
ctx.arc(screenX + enemy.width/2, enemy.y - 35, 5, 0, Math.PI * 2);
ctx.fill();
}
}
}
function drawFallbackEnemy(screenX, enemy) {
ctx.fillStyle = '#8B4513';
ctx.beginPath();
ctx.ellipse(screenX + enemy.width/2, enemy.y + enemy.height/2,
enemy.width/2, enemy.height/2, 0, 0, Math.PI * 2);
ctx.fill();
ctx.fillStyle = '#000';
ctx.beginPath();
ctx.arc(screenX + enemy.width/2 - 5, enemy.y + enemy.height/2 - 3, 2, 0, Math.PI * 2);
ctx.arc(screenX + enemy.width/2 + 5, enemy.y + enemy.height/2 - 3, 2, 0, Math.PI * 2);
ctx.fill();
}

// ===========================================
// PROJECTILES
// ===========================================
function updateAndDrawProjectiles() {
for (let i = projectiles.length - 1; i >= 0; i--) {
const proj = projectiles[i];
proj.x += proj.speed;
if (proj.x < cameraX - 100 || proj.x > cameraX + canvas.width + 100 ||
proj.x < 0 || proj.x > worldWidth) {
projectiles.splice(i, 1);
continue;
}
const screenX = proj.x - cameraX;
if (screenX + proj.width > 0 && screenX < canvas.width) {
if (gameAssets.projectileImage && gameAssets.projectileImage.complete) {
try {
ctx.drawImage(gameAssets.projectileImage, screenX, proj.y - proj.height/2, proj.width, proj.height);
} catch (e) {
drawFallbackProjectile(screenX, proj);
}
} else {
drawFallbackProjectile(screenX, proj);
}
}
if (!isGameOverDying && !player.invincible && gameRunning && !timeUpTriggered) {
const playerHitbox = {
x: player.x + player.width * 0.2,
y: player.y + player.height * 0.1,
width: player.width * 0.6,
height: player.height * 0.8
};
const projHitbox = {
x: proj.x - proj.width/2,
y: proj.y - proj.height/2,
width: proj.width,
height: proj.height
};
if (checkCollision(playerHitbox, projHitbox)) {
player.takeDamage();
projectiles.splice(i, 1);
}
}
}
}
function drawFallbackProjectile(screenX, proj) {
ctx.fillStyle = proj.color || '#FF4500';
ctx.beginPath();
ctx.ellipse(screenX, proj.y, proj.width/2, proj.height/2, 0, 0, Math.PI * 2);
ctx.fill();
ctx.fillStyle = '#FFA500';
ctx.beginPath();
ctx.ellipse(screenX - 2, proj.y, proj.width/3, proj.height/3, 0, 0, Math.PI * 2);
ctx.fill();
}

// ===========================================
// PLATFORM COLLISION
// ===========================================
function checkPlatformCollision() {
if (isGameOverDying) return;
if (!gameRunning) return;
if (timeUpTriggered) return;
player.isOnGround = false;
for (let platform of platforms) {
if (!platform || !platform.isActive) continue;
const playerBottom = player.y + player.height;
const playerRight = player.x + player.width;
const playerLeft = player.x;
const platformTop = platform.y;
const platformLeft = platform.x;
const platformRight = platform.x + platform.width;
if (playerBottom >= platformTop &&
playerBottom <= platformTop + 25 &&
playerRight > platformLeft + 5 &&
playerLeft < platformRight - 5 &&
player.velocityY >= 0) {
player.y = platformTop - player.height;
player.velocityY = 0;
player.isJumping = false;
player.isOnGround = true;
canJump = true;
player.platformBelow = platform;
if (platform.isBreakable && !platform.isBreaking) {
platform.isBreaking = true;
platform.breakTimer = 30;
playSound('platformBreakSound');
}
break;
}
}
for (let platform of platforms) {
if (platform.isBreakable && platform.isBreaking) {
platform.breakTimer--;
if (platform.breakTimer <= 0) {
platform.isActive = false;
}
}
}
}
function drawPlatforms() {
platforms.forEach(platform => {
if (!platform || !platform.isActive) return;
const screenX = platform.x - cameraX;
if (screenX + platform.width > -100 && screenX < canvas.width + 100) {
if (!platform.isGround) {
if (platform.isBreakable) {
if (platform.isBreaking) {
ctx.globalAlpha = Math.sin(Date.now() * 0.02) * 0.3 + 0.4;
}
const gradient = ctx.createLinearGradient(screenX, platform.y, screenX, platform.y + platform.height);
gradient.addColorStop(0, '#C0A080');
gradient.addColorStop(1, '#A09080');
ctx.fillStyle = gradient;
ctx.fillRect(screenX, platform.y, platform.width, platform.height);
ctx.fillStyle = '#8B4513';
for (let i = 0; i < 5; i++) {
ctx.fillRect(screenX + (i * 20) + 5, platform.y, 3, platform.height);
}
ctx.globalAlpha = 1.0;
if (platform.isBreaking) {
ctx.fillStyle = '#FF4500';
ctx.font = 'bold 12px Arial';
ctx.textAlign = 'center';
ctx.fillText(`${Math.ceil(platform.breakTimer / 60)}s`,
screenX + platform.width/2, platform.y - 5);
}
} else if (platform.texture === 'finish') {
const gradient = ctx.createLinearGradient(screenX, platform.y, screenX, platform.y + platform.height);
gradient.addColorStop(0, '#4CAF50');
gradient.addColorStop(1, '#2E7D32');
ctx.fillStyle = gradient;
ctx.fillRect(screenX, platform.y, platform.width, platform.height);
} else if (gameAssets.platformImage && gameAssets.platformImage.complete) {
try {
ctx.drawImage(gameAssets.platformImage, screenX, platform.y, platform.width, platform.height);
} catch (e) {
ctx.fillStyle = platform.color || '#8B4513';
ctx.fillRect(screenX, platform.y, platform.width, platform.height);
}
} else {
ctx.fillStyle = platform.color || '#8B4513';
ctx.fillRect(screenX, platform.y, platform.width, platform.height);
}
}
}
});
}

// ===========================================
// COINS - DENGAN SUARA MARIO "TUING TUING!"
// ===========================================
function createCoins() {
coins = [];
const groundLevel = canvas.height - 50;
const coinCount = currentLevelSettings.coinCount;
for (let i = 0; i < coinCount; i++) {
const progress = i / coinCount;
const platformIndex = Math.floor(progress * (platforms.length - 2)) + 1;
const platform = platforms[platformIndex];
if (platform && platform.isActive) {
coins.push({
x: platform.x + platform.width * 0.5,
y: platform.y - 30,
collected: false,
type: 'normal'
});
}
}
breakablePlatforms.forEach(platform => {
if (platform.isActive) {
coins.push({
x: platform.x + platform.width * 0.5,
y: platform.y - 30,
collected: false,
type: 'special'
});
}
});
levelTotalCoins = coins.length;
levelCoinsCollected = 0;
}
function drawCoins() {
const coinSize = Math.max(16, canvas.width * 0.022);
coins.forEach(coin => {
if (!coin || coin.collected) return;
const screenX = coin.x - cameraX;
if (screenX + coinSize > -50 && screenX < canvas.width + 50) {
if (gameAssets.coinImage && gameAssets.coinImage.complete) {
try {
ctx.drawImage(gameAssets.coinImage, screenX - coinSize/2, coin.y - coinSize/2, coinSize, coinSize);
} catch (e) {
drawFallbackCoin(screenX, coin.y, coinSize);
}
} else {
drawFallbackCoin(screenX, coin.y, coinSize);
}
}
});
}
function drawFallbackCoin(x, y, size) {
ctx.save();
ctx.translate(x, y);
ctx.fillStyle = '#FFD700';
ctx.beginPath();
ctx.arc(0, 0, size/2, 0, Math.PI * 2);
ctx.fill();
ctx.fillStyle = '#FFA500';
ctx.beginPath();
ctx.arc(0, 0, size/3, 0, Math.PI * 2);
ctx.fill();
ctx.fillStyle = '#FFFFFF';
ctx.font = `bold ${size/3}px Arial`;
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('$', 0, 0);
ctx.restore();
}

// ===========================================
// FINISH
// ===========================================
function createFinish() {
finish = {
x: worldWidth - 280,
y: canvas.height - 50 - 120 - 100,
width: 200,
height: 150,
draw() {
const screenX = this.x - cameraX;
if (screenX + this.width > -100 && screenX < canvas.width + 100) {
if (gameAssets.finishImage && gameAssets.finishImage.complete) {
try {
ctx.drawImage(gameAssets.finishImage, screenX, this.y, this.width, this.height);
} catch (e) {
this.drawFallback(screenX);
}
} else {
this.drawFallback(screenX);
}
}
},
drawFallback(screenX) {
ctx.fillStyle = '#8B4513';
ctx.fillRect(screenX, this.y + this.height - 100, 20, 100);
ctx.fillStyle = '#FF0000';
ctx.beginPath();
ctx.moveTo(screenX + 20, this.y + this.height - 90);
ctx.lineTo(screenX + 80, this.y + this.height - 70);
ctx.lineTo(screenX + 20, this.y + this.height - 50);
ctx.closePath();
ctx.fill();
},
get hitbox() {
return {
x: this.x + this.width * 0.2,
y: this.y + this.height * 0.3,
width: this.width * 0.6,
height: this.height * 0.5
};
}
};
}

// ===========================================
// PLAYER - DENGAN SUARA MARIO "BOING!"
// ===========================================
function initGameElements() {
debugLog("Menginisialisasi elemen game...");
currentLevelSettings = levels[currentLevel - 1];
worldWidth = canvas.width * currentLevelSettings.worldMultiplier;
levelTimeLimit = currentLevelSettings.timeLimit;
player = {
x: 100,
y: 0,
width: 50,
height: 70,
velocityX: 0,
velocityY: 0,
speed: currentLevelSettings.playerSpeed,
jumpForce: currentLevelSettings.jumpForce,
gravity: currentLevelSettings.gravity,
isJumping: false,
isOnGround: false,
facingRight: true,
lastJumpTime: 0,
jumpCooldown: 300,
isFalling: false,
platformBelow: null,
keyStates: { left: false, right: false },
invincible: false,
invincibleTimer: 0,
updateSize() {
this.width = Math.max(40, canvas.width * 0.04);
this.height = this.width * 1.4;
this.speed = Math.max(currentLevelSettings.playerSpeed, canvas.width * 0.004);
this.jumpForce = Math.max(currentLevelSettings.jumpForce, canvas.height * 0.025);
},
draw() {
ctx.save();
let drawX = this.x - cameraX;
let drawY = this.y;
if (this.invincible && Math.floor(gameTime / 5) % 2 === 0 && !isGameOverDying && gameRunning) {
ctx.globalAlpha = 0.5;
}
if (isWalking && this.isOnGround && !isGameOverDying && gameRunning) {
drawY += Math.sin(walkAnimationFrame * 0.3) * 2;
}
if (!this.facingRight) {
ctx.translate(drawX + this.width, drawY);
ctx.scale(-1, 1);
drawX = 0;
drawY = 0;
}
if (gameAssets.playerImage && gameAssets.playerImage.complete) {
try {
ctx.drawImage(gameAssets.playerImage, drawX, drawY, this.width, this.height);
} catch (e) {
this.drawFallback(drawX, drawY);
}
} else {
this.drawFallback(drawX, drawY);
}
ctx.restore();
},
drawFallback(drawX, drawY) {
ctx.fillStyle = '#4169E1';
ctx.fillRect(drawX + 5, drawY + 15, this.width - 10, this.height - 30);
ctx.fillStyle = '#FFCC99';
ctx.beginPath();
ctx.arc(drawX + this.width/2, drawY + 10, 15, 0, Math.PI * 2);
ctx.fill();
ctx.fillStyle = '#000';
ctx.beginPath();
ctx.arc(drawX + this.width/2 - 5, drawY + 8, 3, 0, Math.PI * 2);
ctx.arc(drawX + this.width/2 + 5, drawY + 8, 3, 0, Math.PI * 2);
ctx.fill();
},
update() {
if (isGameOverDying) {
gameOverDeathYVelocity += this.gravity * 0.8;
this.y += gameOverDeathYVelocity;
if (this.y > canvas.height + 200) {
isGameOverDying = false;
gameOverDeathYVelocity = 0;
gameOver();
}
return;
}
if (!gameRunning) return;
if (timeUpTriggered) return;
if (this.invincible) {
this.invincibleTimer--;
if (this.invincibleTimer <= 0) this.invincible = false;
}
if (this.keyStates.left) this.velocityX = -this.speed;
else if (this.keyStates.right) this.velocityX = this.speed;
else this.velocityX = 0;
if (Math.abs(this.velocityX) > 0.5 && this.isOnGround) {
isWalking = true;
walkAnimationFrame++;
} else {
isWalking = false;
}
if (this.velocityX > 0.5) this.facingRight = true;
else if (this.velocityX < -0.5) this.facingRight = false;
let newX = this.x + this.velocityX;
if (newX < 50) newX = 50;
else if (newX > worldWidth - this.width - 100) newX = worldWidth - this.width - 100;
this.x = newX;
if (!this.isOnGround) {
this.velocityY += this.gravity;
if (this.velocityY > 15) this.velocityY = 15;
}
this.y += this.velocityY;
this.isOnGround = false;
this.platformBelow = null;
checkPlatformCollision();
const groundLevel = canvas.height - 50 - this.height;
if (this.y >= groundLevel && !this.isOnGround) {
this.y = groundLevel;
this.velocityY = 0;
this.isJumping = false;
this.isOnGround = true;
canJump = true;
this.platformBelow = platforms[0];
}
updateCamera();
updatePlayerNameTag();
},
jump() {
if (isGameOverDying) return;
if (!gameRunning) return;
if (timeUpTriggered) return;
const now = Date.now();
if (canJump && this.isOnGround && now - this.lastJumpTime > this.jumpCooldown) {
this.velocityY = -this.jumpForce;
this.isJumping = true;
this.isOnGround = false;
canJump = false;
this.lastJumpTime = now;
this.platformBelow = null;
// PLAY MARIO JUMP SOUND - BOING!
playSound('marioJumpSound', 0.7);
debugLog("🦘 MARIO JUMP! BOING!");
}
},
respawn() {
this.invincible = true;
this.invincibleTimer = 120;
this.velocityX = 0;
this.velocityY = 0;
debugLog(`Respawn di posisi (${Math.round(this.x)}, ${Math.round(this.y)})`);
},
takeDamage() {
if (isGameOverDying) return;
if (timeUpTriggered) return;
if (!this.invincible && gameRunning) {
lives--;
updateHeartsDisplay();
playSound('damageSound');
debugLog(`Karakter terkena damage! Nyawa tersisa: ${lives}`);
if (lives <= 0) {
debugLog("NYAWA HABIS! Game Over - Karakter jatuh...");
isGameOverDying = true;
gameOverDeathYVelocity = -8;
this.velocityX = 0;
this.keyStates.left = false;
this.keyStates.right = false;
stopTimer();
} else {
debugLog("Nyawa masih ada, respawn di tempat...");
this.respawn();
}
}
},
get hitbox() {
return {
x: this.x + this.width * 0.2,
y: this.y + this.height * 0.1,
width: this.width * 0.6,
height: this.height * 0.8
};
},
get screenX() {
return this.x - cameraX;
}
};
createPlatforms();
createCoins();
createEnemies();
createFinish();
player.updateSize();
const groundLevel = canvas.height - 50 - player.height;
player.x = 100;
player.y = groundLevel;
player.velocityX = 0;
player.velocityY = 0;
player.isJumping = false;
player.isOnGround = true;
player.facingRight = true;
player.keyStates = { left: false, right: false };
player.invincible = false;
player.invincibleTimer = 0;
canJump = true;
isWalking = false;
walkAnimationFrame = 0;
player.lastJumpTime = 0;
player.platformBelow = platforms[0];
projectiles = [];
isGameOverDying = false;
gameOverDeathYVelocity = 0;
updateHeartsDisplay();
resetTimer();
}

// ===========================================
// DRAWING
// ===========================================
function drawParallaxBackground() {
ctx.fillStyle = '#87CEEB';
ctx.fillRect(0, 0, canvas.width, canvas.height * 0.6);
if (gameAssets.backgroundImage && gameAssets.backgroundImage.complete) {
try {
const parallaxSpeed = currentLevelSettings.backgroundSpeed || 0.3;
const offsetX = cameraX * parallaxSpeed;
const bgWidth = gameAssets.backgroundImage.width;
const tileCount = Math.ceil(canvas.width / bgWidth) + 2;
const startTileX = -Math.floor(offsetX / bgWidth) - 1;
for (let i = 0; i < tileCount; i++) {
const tileX = i * bgWidth - (offsetX % bgWidth);
ctx.drawImage(gameAssets.backgroundImage, tileX, 0, bgWidth, canvas.height);
}
} catch (e) {
drawFallbackBackground();
}
} else {
drawFallbackBackground();
}
const groundLevel = canvas.height - 50;
if (gameAssets.groundImage && gameAssets.groundImage.complete) {
try {
const groundWidth = gameAssets.groundImage.width;
const tileCount = Math.ceil(worldWidth / groundWidth) + 2;
const startX = -Math.floor(cameraX / groundWidth) * groundWidth - (cameraX % groundWidth);
for (let i = 0; i < tileCount; i++) {
ctx.drawImage(gameAssets.groundImage, startX + i * groundWidth, groundLevel, groundWidth, 50);
}
} catch (e) {
ctx.fillStyle = '#8B4513';
ctx.fillRect(0, groundLevel, canvas.width, 50);
}
} else {
ctx.fillStyle = '#8B4513';
ctx.fillRect(0, groundLevel, canvas.width, 50);
}
}
function drawFallbackBackground() {
const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.6);
skyGradient.addColorStop(0, '#87CEEB');
skyGradient.addColorStop(1, '#42A5F5');
ctx.fillStyle = skyGradient;
ctx.fillRect(0, 0, canvas.width, canvas.height * 0.6);
ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
for (let i = 0; i < 5; i++) {
const x = (cameraX * 0.1 + i * 300) % (canvas.width + 400) - 200;
const y = 100 + (i * 30);
const size = 40;
ctx.beginPath();
ctx.arc(x, y, size, 0, Math.PI * 2);
ctx.arc(x - size * 0.6, y, size * 0.8, 0, Math.PI * 2);
ctx.arc(x + size * 0.6, y, size * 0.8, 0, Math.PI * 2);
ctx.fill();
}
}
function drawStaticScreen() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
drawParallaxBackground();
drawPlatforms();
drawCoins();
if (finish && finish.draw) finish.draw();
if (player && player.draw) player.draw();
}
function updateCamera() {
if (isGameOverDying) return;
if (!gameRunning) return;
if (timeUpTriggered) return;
const targetX = player.x - canvas.width * 0.3;
cameraX += (targetX - cameraX) * 0.1;
cameraX = Math.max(0, Math.min(cameraX, worldWidth - canvas.width));
}
function updatePlayerNameTag() {
if (!playerNameTag || !player || isGameOverDying || !gameRunning || timeUpTriggered) {
playerNameTag.style.display = 'none';
return;
}
const screenX = player.screenX + player.width / 2;
const screenY = player.y - 20;
if (screenX > 0 && screenX < canvas.width && screenY > 0 && screenY < canvas.height) {
playerNameTag.style.display = 'block';
playerNameTag.style.left = (screenX - playerNameTag.offsetWidth / 2) + 'px';
playerNameTag.style.top = screenY + 'px';
playerNameTag.textContent = playerName;
} else {
playerNameTag.style.display = 'none';
}
}

// ===========================================
// COLLISION CHECKS
// ===========================================
function checkCollision(obj1, obj2) {
return obj1.x < obj2.x + obj2.width &&
obj1.x + obj1.width > obj2.x &&
obj1.y < obj2.y + obj2.height &&
obj1.y + obj1.height > obj2.y;
}
function checkCoinCollision() {
if (isGameOverDying) return;
if (!gameRunning) return;
if (timeUpTriggered) return;
const detectionRadius = canvas.width * 0.02;
coins.forEach((coin) => {
if (!coin || coin.collected) return;
const distance = Math.sqrt(
Math.pow(player.x + player.width/2 - coin.x, 2) +
Math.pow(player.y + player.height/2 - coin.y, 2)
);
if (distance < detectionRadius + player.width/2) {
coin.collected = true;
const bonus = coin.type === 'special' ? 200 : 100;
score += bonus;
levelScore += bonus;
levelCoinsCollected++;
scoreElement.textContent = score;
// PLAY MARIO COIN SOUND - TUING TUING!
playSound('marioCoinSound', 0.8);
debugLog("🪙 MARIO COIN! TUING TUING!");
// EFEK LOMPAT KECIL SAAT AMBIL KOIN ala MARIO
player.velocityY = -player.jumpForce * 0.5;
}
});
}
function checkFinish() {
if (isGameOverDying) return;
if (!gameRunning) return;
if (timeUpTriggered) return;
if (!player || !finish || !finish.hitbox) return;
if (checkCollision(player.hitbox, finish.hitbox)) {
if (currentLevel < 3) levelComplete();
else winGame();
}
}

// ===========================================
// GAME FLOW
// ===========================================
function startCountdown() {
if (countdownInterval) {
clearInterval(countdownInterval);
countdownInterval = null;
}
if (speechSynthesis.speaking) {
speechSynthesis.cancel();
}
let count = 3;
countdownText.textContent = count;
countdownPlayerName.textContent = playerName || "Player";
countdownLevel.textContent = `Level ${currentLevel}: ${currentLevelSettings.displayName} - ${levelTimeLimit} Detik`;
countdownOverlay.classList.add('show');
unlockAudioContext();
speakCountdown(count);
countdownInterval = setInterval(() => {
count--;
if (count > 0) {
countdownText.textContent = count;
speakCountdown(count);
} else if (count === 0) {
countdownText.textContent = "GO!";
speakCountdown(0);
clearInterval(countdownInterval);
countdownInterval = null;
setTimeout(() => {
countdownOverlay.classList.remove('show');
startGame();
}, 800);
}
}, 1000);
}
function startGame() {
gameRunning = true;
timeUpTriggered = false;
levelStartTime = Date.now();
if (currentLevel === 1) startTime = Date.now();
playerNameDisplay.textContent = playerName;
difficultyDisplay.textContent = currentLevelSettings.displayName;
lives = currentLevelSettings.lives;
updateHeartsDisplay();
playBackgroundMusic();
startLevelTimer();
gameInterval = setInterval(gameLoop, 1000 / 60);
// CEK GAMEPAD SAAT GAME START
checkInitialGamepadConnection();
debugLog(`Game started - Level ${currentLevel}, Timer: ${levelTimeLimit}s`);
}
function gameLoop() {
if (!gameRunning) return;
if (timeUpTriggered) return;
gameTime++;
// CEK GAMEPAD INPUT DI SETIAP FRAME
checkGamepadInput();
ctx.clearRect(0, 0, canvas.width, canvas.height);
drawParallaxBackground();
drawPlatforms();
drawCoins();
if (finish && finish.draw) finish.draw();
updateAndDrawEnemies();
updateAndDrawProjectiles();
if (player && player.update) player.update();
if (player && player.draw) player.draw();
if (!isGameOverDying && gameRunning && !timeUpTriggered) {
checkCoinCollision();
checkFinish();
}
}
function levelComplete() {
gameRunning = false;
clearInterval(gameInterval);
stopTimer();
const levelTime = Math.floor((Date.now() - levelStartTime) / 1000);
const timeBonus = Math.max(0, levelTimeRemaining * 10);
score += timeBonus;
levelScore += timeBonus;
scoreElement.textContent = score;
levelUpTitle.textContent = "LEVEL SELESAI!";
levelUpMessage.textContent = `Selamat ${playerName}! Kamu berhasil menyelesaikan Level ${currentLevel}`;
levelUpStats.innerHTML = `
Skor Level: <strong>${levelScore}</strong><br>
Koin Dikumpulkan: <strong>${levelCoinsCollected}/${levelTotalCoins}</strong><br>
Sisa Waktu: <strong>${levelTimeRemaining} detik (+${timeBonus} poin)</strong>
`;
levelUpOverlay.style.display = "flex";
playSound('levelCompleteSound');
debugLog(`Level ${currentLevel} completed! Time remaining: ${levelTimeRemaining}s, Bonus: ${timeBonus}`);
}
function startNextLevel() {
currentLevel++;
levelScore = 0;
levelCoinsCollected = 0;
levelDisplay.textContent = `${currentLevel}/3`;
difficultyDisplay.textContent = currentLevelSettings.displayName;
lives = currentLevelSettings.lives;
updateLevelIndicator();
initGameElements();
levelUpOverlay.style.display = "none";
startCountdown();
}
function gameOver() {
gameRunning = false;
if (gameInterval) {
clearInterval(gameInterval);
gameInterval = null;
}
stopTimer();
stopBackgroundMusic();
const playTime = Math.floor((Date.now() - startTime) / 1000);
gameEndTitle.textContent = "GAME OVER";
gameEndScore.textContent = `Skor akhir: ${score}`;
let penyebab = "";
if (lives <= 0) {
penyebab = "Nyawa Habis 💔";
} else if (timeUpTriggered) {
penyebab = "Waktu Habis ⏱️";
} else {
penyebab = "Game Over";
}
gameEndStats.innerHTML = `
Nama: <strong>${playerName}</strong><br>
Level: <strong>${currentLevelSettings.displayName} (${currentLevel}/3)</strong><br>
Waktu bermain: <strong>${playTime} detik</strong><br>
Penyebab: <strong style="color:#FF4444;">${penyebab}</strong>
`;
gameEndOverlay.style.display = "flex";
playSound('gameOverSound');
debugLog(`Game Over! ${penyebab}`);
}
function winGame() {
gameRunning = false;
clearInterval(gameInterval);
stopTimer();
const playTime = Math.floor((Date.now() - startTime) / 1000);
const coinsCollected = coins.filter(c => c && c.collected).length;
const totalCoins = coins.length;
gameEndTitle.textContent = "SELAMAT!";
gameEndScore.textContent = `${playerName} berhasil menyelesaikan semua level! Skor Total: ${score}`;
gameEndStats.innerHTML = `
Nama: <strong>${playerName}</strong><br>
Level: <strong>Selesai (3/3)</strong><br>
Waktu Total: <strong>${playTime} detik</strong><br>
Koin Total: <strong>${coinsCollected}/${totalCoins}</strong>
`;
gameEndOverlay.style.display = "flex";
stopBackgroundMusic();
playSound('winSound');
debugLog("Congratulations! All levels completed!");
}
function resetGame() {
gameRunning = false;
if (gameInterval) {
clearInterval(gameInterval);
gameInterval = null;
}
if (countdownInterval) {
clearInterval(countdownInterval);
countdownInterval = null;
}
stopTimer();
if (speechSynthesis.speaking) {
speechSynthesis.cancel();
}
score = 0;
currentLevel = 1;
levelScore = 0;
levelCoinsCollected = 0;
gameTime = 0;
canJump = true;
walkAnimationFrame = 0;
isWalking = false;
cameraX = 0;
isGameOverDying = false;
gameOverDeathYVelocity = 0;
timeUpTriggered = false;
scoreElement.textContent = score;
levelDisplay.textContent = `${currentLevel}/3`;
initGameElements();
if (coins && Array.isArray(coins)) {
coins.forEach(coin => { if (coin) coin.collected = false; });
}
projectiles = [];
updateLevelIndicator();
countdownOverlay.classList.remove('show');
levelUpOverlay.style.display = "none";
gameEndOverlay.style.display = "none";
playerNameTag.style.display = "none";
stopBackgroundMusic();
drawStaticScreen();
resetGamepadState();
debugLog("Game reset");
}
function updateHeartsDisplay() {
heartsContainer.innerHTML = '';
for (let i = 0; i < lives; i++) {
const heart = document.createElement('div');
heart.className = 'heart';
heartsContainer.appendChild(heart);
}
for (let i = lives; i < currentLevelSettings.lives; i++) {
const heart = document.createElement('div');
heart.className = 'heart lost';
heartsContainer.appendChild(heart);
}
}

// ===========================================
// EVENT LISTENERS
// ===========================================
usernameInput.addEventListener('input', function() {
playerName = this.value.trim();
startGameBtn.disabled = !playerName;
if (playerName && startGameBtn.disabled) startGameBtn.disabled = false;
});
usernameInput.addEventListener('keypress', function(e) {
if (e.key === 'Enter' && !startGameBtn.disabled) startGameFromMenu();
});
startGameBtn.addEventListener('click', function() {
unlockAudioContext();
startGameFromMenu();
});
nextLevelBtn.addEventListener('click', startNextLevel);
restartBtn.addEventListener('click', () => {
gameEndOverlay.style.display = "none";
resetGame();
startCountdown();
});
menuBtn.addEventListener('click', returnToMenu);
const keys = {};
window.addEventListener('keydown', (e) => {
const key = e.key.toLowerCase();
if (key === ' ' || key === 'spacebar' || key === 'space') e.preventDefault();
keys[key] = true;
if (gameRunning && !isGameOverDying && !timeUpTriggered) {
if (keys['a'] || keys['arrowleft']) player.keyStates.left = true;
if (keys['d'] || keys['arrowright']) player.keyStates.right = true;
if ((keys['w'] || keys[' '] || key === 'space' || key === 'spacebar' || keys['arrowup']) && player && player.isOnGround) {
player.jump();
}
if (keys['r'] && e.ctrlKey) resetGame();
} else if (page1.classList.contains('active')) {
if ((key === ' ' || key === 'enter') && !startGameBtn.disabled) {
e.preventDefault();
unlockAudioContext();
startGameFromMenu();
}
}
});
window.addEventListener('keyup', (e) => {
const key = e.key.toLowerCase();
keys[key] = false;
if (gameRunning && player && !isGameOverDying && !timeUpTriggered) {
if (key === 'a' || key === 'arrowleft') player.keyStates.left = false;
if (key === 'd' || key === 'arrowright') player.keyStates.right = false;
}
});
window.addEventListener('blur', () => {
if (gameRunning && player) {
player.keyStates.left = false;
player.keyStates.right = false;
player.velocityX = 0;
}
for (let key in keys) keys[key] = false;
});
window.addEventListener('keydown', (e) => {
if (e.key === ' ' && e.target === document.body) {
e.preventDefault();
return false;
}
}, false);
window.addEventListener('resize', () => {
resizeCanvas();
if (!gameRunning) {
drawStaticScreen();
drawBackgroundPreview();
}
});

// ===========================================
// INITIALIZATION
// ===========================================
window.addEventListener('load', function() {
debugLog("Game loading...");
usernameInput.focus();
initializeCharacterSelection();
initializeAudio();
initializeGamepad();
resizeCanvas();
if (!CanvasRenderingContext2D.prototype.roundRect) {
CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
if (width < 2 * radius) radius = width / 2;
if (height < 2 * radius) radius = height / 2;
this.beginPath();
this.moveTo(x + radius, y);
this.arcTo(x + width, y, x + width, y + height, radius);
this.arcTo(x + width, y + height, x, y + height, radius);
this.arcTo(x, y + height, x, y, radius);
this.arcTo(x, y, x + width, y, radius);
this.closePath();
return this;
};
}
function animateBackgroundPreview() {
if (page1.classList.contains('active')) drawBackgroundPreview();
requestAnimationFrame(animateBackgroundPreview);
}
animateBackgroundPreview();
debugLog("✅ GAME SIAP! Suara MARIO BROS AKTIF!");
debugLog("🦘 Lompat: BOING! 🪙 Koin: TUING TUING!");
debugLog("🎮 Gamepad: Siap digunakan!");
});