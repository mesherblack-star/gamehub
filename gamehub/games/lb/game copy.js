const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const log = document.getElementById("log");

// ================= ASSETS =================
const bgImg = new Image();
bgImg.src = "background.png";

// Sounds
const bgm = new Audio("bgm.mp3");
bgm.loop = true;
bgm.volume = 0.4;

const eatSound = new Audio("eat.wav");
const deadSound = new Audio("dead.wav");

// Player images
const playerIdle = new Image();
playerIdle.src = "player_idle_1.png";

const playerLeft = [
  Object.assign(new Image(), { src: "player_left_1_1.png" }),
  Object.assign(new Image(), { src: "player_left_2_1.png" })
];

const playerRight = [
  Object.assign(new Image(), { src: "player_right_1_1.png" }),
  Object.assign(new Image(), { src: "player_right_2_1.png" })
];

const playerEat = [
  Object.assign(new Image(), { src: "player_eat_1_1.png" }),
  Object.assign(new Image(), { src: "player_eat_2_1.png" })
];

const playerDead = new Image();
playerDead.src = "player_dead_1.png";

// Item images
const foodImages = [
  Object.assign(new Image(), { src: "food.png" }),
  Object.assign(new Image(), { src: "food_1.png" }),
  Object.assign(new Image(), { src: "food_2.png" }),
  Object.assign(new Image(), { src: "food_3.png" })
];

const imgObstacle = new Image();
imgObstacle.src = "obstacle.png";

const imgMagnet = new Image();
imgMagnet.src = "magnet_1.png";

const imgAnti = new Image();
imgAnti.src = "anti_obstacle_1.png";

// ================= CANVAS =================
function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
}

// ================= PLAYER =================
const player = {
  x: 0,
  y: 0,
  size: 0
};

function scaleObjects() {
  player.size = canvas.width * 0.05;
}

// ================= GAME STATE =================
let foods = [];
let obstacles = [];
let score = 0;
let running = false;

let foodTimer = 0;
let obstacleTimer = 0;
let obstacleSpeed = 0;

// Animation
let playerState = "idle";
let animFrame = 0;
let animTick = 0;

// Ability
let magnetActive = false;
let magnetTimer = 0;

// ================= INIT =================
resizeCanvas();
scaleObjects();

window.addEventListener("resize", () => {
  resizeCanvas();
  scaleObjects();
  player.y = canvas.height - player.size * 1.5;
});

// ================= CONTROL =================
let lastX = canvas.width / 2;

// Mouse
canvas.addEventListener("mousemove", e => {
  if (!running) return;

  const rect = canvas.getBoundingClientRect();
  let x = e.clientX - rect.left - player.size / 2;

  x = Math.max(0, Math.min(canvas.width - player.size, x));

  if (x < lastX) playerState = "left";
  else if (x > lastX) playerState = "right";

  player.x = x;
  lastX = x;
});

// Touch
canvas.addEventListener(
  "touchmove",
  e => {
    if (!running) return;
    e.preventDefault();

    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    let x = touch.clientX - rect.left - player.size / 2;

    x = Math.max(0, Math.min(canvas.width - player.size, x));

    if (x < lastX) playerState = "left";
    else if (x > lastX) playerState = "right";

    player.x = x;
    lastX = x;
  },
  { passive: false }
);

// ================= GAME =================
function startGame() {
  foods = [];
  obstacles = [];
  score = 0;
  running = true;

  magnetActive = false;
  magnetTimer = 0;
  foodTimer = 0;
  obstacleTimer = 0;

  player.x = canvas.width / 2 - player.size / 2;
  player.y = canvas.height - player.size * 1.5;
  playerState = "idle";
  lastX = player.x;

  scoreEl.textContent = score;
  log.textContent = "Game dimulai!";

  bgm.currentTime = 0;
  bgm.play();
}

function stopGame() {
  running = false;
  bgm.pause();
  log.textContent = "⏹️ Anda menyerah";
}

function gameOver() {
  running = true;
  playerState = "dead";

  bgm.pause();
  deadSound.currentTime = 0;
  deadSound.play();

  log.textContent = "💀 Game Over!???";
}

// ================= SPAWN =================
function spawnFood() {
  const size = canvas.width * 0.025;

  let type = "normal";
  const r = Math.random();
  let img = foodImages[Math.floor(Math.random() * foodImages.length)];

  if (r < 0.1) type = "magnet";
  else if (r < 0.15) type = "bomb";

  foods.push({
    x: Math.random() * (canvas.width - size),
    y: -size,
    size,
    speed: canvas.height * 0.005,
    type,
    img
  });
}

// ✨ OBSTACLE SELALU ADA CELAH ✨
function spawnObstacle() {
  const size = canvas.width * 0.06;

  // set gap kalau belum ada / obstacle kosong
  if (obstacles.length === 0) {
    gapWidth = player.size * Math.max(15.2, 15.6 - score * 0.01);
    gapX = Math.random() * (canvas.width - gapWidth);
  }

  let x;
  let tries = 0;

  do {
    x = Math.random() * (canvas.width - size);
    tries++;
  } while (
    x + size > gapX &&
    x < gapX + gapWidth &&
    tries < 30
  );

  obstacles.push({
    x,
    y: -size,
    size
  });
}


// ================= UPDATE =================
function update() {
  if (!running) return;

  foodTimer++;
  obstacleTimer++;

  if (foodTimer > 0.60) {
    spawnFood();
    foodTimer = 0;
  }

  if (obstacleTimer > 0.90) {
    spawnObstacle();
    obstacleTimer = 0;
  }

  // FOOD
  for (let i = foods.length - 1; i >= 0; i--) {
    const f = foods[i];

    if (magnetActive) {
      f.x += (player.x - f.x) * 0.05;
      f.y += (player.y - f.y) * 0.05;
    } else {
      f.y += f.speed;
    }

    if (hit(f, player)) {
      if (f.type === "normal") {
        score++;
        scoreEl.textContent = score;

        playerState = "eat";
        animFrame = 0;
        eatSound.currentTime = 0;
        eatSound.play();

        while (obstacles.length < score) spawnObstacle();
      }

      if (f.type === "magnet") {
        magnetActive = true;
        magnetTimer = 300;
        log.textContent = "🧲 MAGNET AKTIF!???";
      }

      if (f.type === "bomb") {
        obstacles = [];
        log.textContent = "💣 OBSTACLE DIHAPUS!???";
      }

      foods.splice(i, 1);
    } else if (f.y > canvas.height) {
      foods.splice(i, 1);
    }
  }

  // MAGNET TIMER
  if (magnetActive) {
    magnetTimer--;
    if (magnetTimer <= 0) magnetActive = false;
  }

  // OBSTACLE
  obstacleSpeed = canvas.height * (0.004 + score * 0.0003);

  for (let i = obstacles.length - 1; i >= 0; i--) {
    const o = obstacles[i];
    o.y += obstacleSpeed;

    if (hit(o, player)) {
      gameOver();
    } else if (o.y > canvas.height) {
      obstacles.splice(i, 1);
    }
  }
}

// ================= DRAW =================
function draw() {
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  animTick++;
  if (animTick > 10) {
    animFrame++;
    animTick = 0;
  }

  let img = playerIdle;
  if (playerState === "left") img = playerLeft[animFrame % 2];
  else if (playerState === "right") img = playerRight[animFrame % 2];
  else if (playerState === "eat") img = playerEat[animFrame % 2];
  else if (playerState === "dead") img = playerDead;

  ctx.drawImage(img, player.x, player.y, player.size, player.size);

  foods.forEach(f => {
    let imgItem = f.img;
    if (f.type === "magnet") imgItem = imgMagnet;
    if (f.type === "bomb") imgItem = imgAnti;
    ctx.drawImage(imgItem, f.x, f.y, f.size, f.size);
  });

  obstacles.forEach(o => {
    ctx.drawImage(imgObstacle, o.x, o.y, o.size, o.size);
  });
}

// ================= COLLISION =================
function hit(a, b) {
  return (
    a.x < b.x + b.size &&
    a.x + a.size > b.x &&
    a.y < b.y + b.size &&
    a.y + a.size > b.y
  );
}

// ================= LOOP =================
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();