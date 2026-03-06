// ================= DATABASE =================
const databaseKata = [
  "MIEACEH","KUAHPLIEKU","AYAMTANGKAP","SIEREUBOH","ROTICANE","MARTABAK","GULAIKAMBING","SAMBALGANJA","LEPATA","EUNGKOTPAYA",
  "NANIURA","MIEGOMAK","BABIPANGGANG","ARSIK","SAKSANG","DALINIHORBO","OMBUSOMBUS","MANUKNAPINADAR","SAYURTAUCO","TIPATIPA",
  "RENDANG","SATEPADANG","DENDENGBALADO","ASAMPADEH","SALA","LAMANG","KALIO","PANGEK","DENDENGBATOKOK","GULAI",
  "GULAI","ASAMPEDAS","MIESAGU","BOLUKEMOJO","LAKSE","IKANSELAIS","GULAITUNJANG","ROTIJALA","NASILEMAK","SAMBALEBI",
  "NASIGEMUK","GULAI","DAGINGHITAM","IKANSALAI","TEMPOYAK","PADAMARAN","KUEGANDUS","DODOL","GULAITERJUN","IKANMASAK",
  "PEMPEK","TEKWAN","MODEL","LAKSAN","CELIMPUNGAN","PINDANG","BURGO","KEMPLANG","MAKSUBA","MIECELOR",
  "LEMPAH","OTAKOTAK","RUSIP","MIEBANGKA","PANTIAW","GANGANIKAN","KERICU","BONGLIPIANG","SATEIKAN","GETAS",
  "PENDAP","LEMEA","BAGARHIU","REBUNGASAM","GULAIKEMBANG","IKANPAIT","KUETAT","LEMPUKDURIAN","GULAIIKAN","TEMPOYAK",
  "SERUIT","GULAITABOH","ENGKAKKETAN","IKANBAKAR","KERIPIKPISANG","SAMBALASAM","PINDANG","LEMPENG","GABING","GULAIIKAN",
  "KERAKTELOR","SOTOBETAWI","GADOGADO","SEMURJENGKOL","ASINAN","NASIUDUK","KETOPRAK","LAKSA","SOTOTANGKAR","ROTIBUAYA",
  "SATEBANDENG","RABEG","ANGEUNLADA","PECAKBANDENG","BALOKMENES","NASISUMSUM","EMPING","SAYURBESAN","KETAN","JOJORONG",
  "NASILIWET","KAREDOK","LOTEK","BATAGOR","SURABI","PEPESIKAN","SOTOBANDUNG","TAHUSUMEDANG","EMPALGEPUK","COMBRO",
  "LUMPIA","SOTOKUDUS","TAHUGIMBAL","GARANGASEM","NASIGANDUL","TEMPEMENDOAN","WINGKOBABAT","GETUK","BREKECEK","NASIMEGONO",
  "GUDEG","KRECEKMERCON","BAKPIA","SATEKLATHAK","MANGUTLELE","BRONGKOS","NASITIWUL","PEYEK","JADAHTEMPE","YANGKO",
  "RAWON","RUJAKCINGUR","LONTONG","SOTOLAMONGAN","PECEL","TAHUTEK","SATEMADURA","NASIKRAWU","SEGOTEMPONG","BEBEKSINJAY",
  "AYAMBETUTU","BABIGULING","LAWAR","SATELILIT","NASICAMPUR","TUMAYAM","SEROMBOTAN","TIPATCANTOK","JAJELAKLAK","SAMBALMATAH",
  "AYAMTALIWANG","PLECINGKANGKUNG","BEBERUKTERONG","SATEBULAYAK","NASIBALAP","ARES","SATEREMBIGA","POTENGTUJAK","IKANBAKARNTB","KELAQBATIH",
  "SEISAPI","JAGUNGBOSE","CATEMAKJAGUNG","DAGINGASAP","KOLOFLORES","SAMBALLUAT","RUMPURAMPE","JAGUNGTITI","LAWARNTT","UBINUABOSI",
  "BUBURPEDAS","PENGKANG","CHAIKUE","SOTONGPANGKONG","ASAMPEDAS","KERUPUKBASAH","LEMANG","TEMPOYAK","KUESEMAT","IKANMASAK",
  "JUHUSINGKAH","WADIIKAN","KALUMPE","IKANBAUBAR","GANGANHUMBUT","JUHUROTAN","PAISIKAN","SAMBALRIMBANG","LEMANGDAYAK","PANGANANROTAN",
  "SOTOBANJAR","KETUPAT","LONTONGORARI","NASIITIK","AMPARANTATAK","BINGKA","GANGANASAM","WADAIIPAU","PAISHARUAN","IKANHARUAN",
  "AMPLANG","NASIBEKAPOR","AYAMCINCANE","GENCERUAN","SAMBALRAJA","SATEPAYAU","NASIKUNING","PEPES","GEGICAK","IKANASIN",
  "LAWAKALTARA","NASISUBUT","IKANASAPTARAKAN","SAMBALTEMBILANG","GULAIKAYAN","KERUPUKTARAKAN","PEPESUDANG","SAGUKALTARA","IKANBAKAR","IKANSALAI",
  "TINUTUAN","CAKALANGFUFU","IKANWOKU","RICAROA","PANIKI","DABUDABU","SATEKOLOMBI","IKANKUAHASAM","NASIJAHA","KLAPERTAART",
  "BINTEBILUHUTA","ILABULO","PUTUNGO","AYAMILONI","PERKEDELNIKE","BILENTHANGO","TUNAASAP","NASIJAHAGTLO","KUEKARAWO","MILUSIRAM",
  "KALEDO","UTADADA","UTAKELO","PARAPE","LALAMPAPALU","DANGESAGU","NASIBUNGKUS","SUPIKANKAILI","SAMBALPARIA","SATEIKANTOLI",
  "COTOMAKASSAR","SOPKONRO","PALLUBASA","SOPSAUDARA","BARONGKO","KAPURUNG","NASUPALEKKO","PARAPEMKS","JALANGKOTE","SONGKOLLO",
  "JEPA","BAUPEAPI","SAMBUSA","GOLLAKAMBU","PUPUMANDAR","TUMPITUMPI","LOKAANJOROI","NASIKUNING","KUEPASO","IKANASAP",
  "SINONGGI","KABUTO","IKANPARENDE","LAPALAPA","KASOAMI","KAMBUSE","IKANBAKAR","GOGOS","DANGE","SAMBALCOLO",
  "PAPEDA","IKANKUAHKUNING","GOHUIKAN","KOHUKOHU","KASBI","IKANASAR","SAGULEMPENG","SAGUTUMBUK","SATETUNA","BAGEA",
  "IKANKUAHPALA","GOHU","SAGUTUMANG","IKANASARTIDORE","SATEGURITA","NASIJAHATIDORE","KASBI","IKANBAKARPALA","SAGUGULUNG","BAGEA",
  "UDANGSELINGKUH","AUNUSENEBRE","SAGUBAKAR", "IKANASAR","SAYURGANEMO","SAGULEMPENG","COLOCOLO","IKANBAKAR","SAGUTUMBUK","IKANKUAH",
  "SAGULEMAK","IKANKUAHKUNING","AUNUIKAN","SAGUBOLA","IKANASAPARFAK","BUNGAPEPAYA","IKANBAKAR","KASBI","SAGUGORENG","SAMBAL",
  "IKANBAKARMISOL","SAGUTUMBUK","IKANKUAH","SAGUBAKAR","UDANGBAKARLAUT","GANEMO","IKANASAP","KASBI","SAGULEMPENGSORONG","COLOCOLO",
  "IKANBAKAR","SAGUTUMBUK","IKANASAR","SAGUBAKAR","SAYURUMBI","IKANKUAH","SAGUKERING","IKANGORENG","KASBI","SAGULUNAK",
  "BAKARBATU","UBIBAKAR","DAGINGASAPPEG","SAYURPAKIS","UBITUMBUK","JAGUNGBAKAR","DAUNSINGKONG","IKANASAPPEG","UBIREBUS","DAGINGBAKAR",
  "SAGUSEPAT","IKANASAR","UDANGBAKAR","SAGUTUMBUK","IKANBAKAR","GANEMO","KASBI","SAGUGORENG","IKANKUAHSELATAN","SAGUBAKARSELATAN",
  "NASIGORENG","SOTO","SATE","BAKSO","PECEL","KETUPAT","OPORAYAM","REMPAHNUSANTARA","JAJANNUSANTARA"
];

// ===== LOADING SIMULATION =====
const loadingScreen = document.getElementById("loadingScreen");
const progressBar = document.getElementById("progress");
let kataTersisa = [...databaseKata];

// ================= WARNA CERAH =================
const colors = [
  "#34a853", "#fbbc05", "#ea4335", "#4285f4", "#f4b400",
  "#0f9d58", "#db4437", "#4285f4", "#f4b400", "#e37400"
];

// ================= GAME STATE =================
let level = 1;
let gridSize = 8;
let grid = [];
let words = [];
let foundWords = [];
let isDrag = false;
let selectedCells = [];
let direction = null;
let lives = 3;
let score = 0;
let timeLeft = 0;
let timerInterval = null;
let lastCompletedLevel = 0; 

// ================= ELEMENT =================
const gridDiv = document.getElementById("grid");
const wordListDiv = document.getElementById("wordList");
const levelText = document.getElementById("levelText");
const heartsDiv = document.getElementById("hearts");
const scoreDiv = document.getElementById("score");
const popup = document.getElementById("popup");
const levelSelect = document.getElementById("levelSelect");
const gamePanel = document.querySelector(".game-panel");
const nextLevelBtn = document.getElementById("nextLevelBtn");;
const backBtn = document.getElementById("backBtn");
const bgMusic = document.getElementById("bgMusic");
const audioToggle = document.getElementById("audioToggle");
const knob = audioToggle.querySelector(".knob");

  document.querySelectorAll(".level-card").forEach(card => {
    card.addEventListener("click", () => {
          document.body.classList.add("game-active");
      if (card.classList.contains("locked")) {
        alert("Level ini masih terkunci! Selesaikan level sebelumnya terlebih dahulu.");
        return;
      }
    
      const selectedLevel = parseInt(card.dataset.level);
      document.querySelectorAll(".level-card").forEach(c => {
        c.classList.remove("active");
      });
      card.classList.add("active");
      level = selectedLevel;
      const startIdx = (level - 1) * 10;
      const endIdx = startIdx + 10;
      kataTersisa = databaseKata.slice(startIdx, endIdx);

      lives = 3;
      localStorage.setItem("savedLives", lives);
      score = 0;
      scoreDiv.textContent = "Skor: " + score;
      
      localStorage.setItem("currentLevel", level);
      localStorage.setItem("savedKata", JSON.stringify(kataTersisa));
      localStorage.setItem("savedScore", score);
      
      levelSelect.style.display = "none";
      gamePanel.style.display = "block";
      backBtn.classList.add("show");
      audioToggle.style.display = "block";
      
      if (musicOn) {
        bgMusic.play().catch(e => {
          console.warn("Gagal memutar audio otomatis:", e);
        });
      }
      startLevel();
    });
  });

// ===== SET AWAL UI (PAKSA SEMBUNYI) =====
backBtn.classList.remove("show");
audioToggle.style.display = "none";
let musicOn = true;

function updateAudioUI() {
  audioToggle.classList.toggle("off", !musicOn);
  knob.textContent = musicOn ? "🔊" : "🔇";
}

audioToggle.onclick = () => {
  musicOn = !musicOn;
  updateAudioUI();

  if (musicOn) {
    bgMusic.play().catch(() => {});
  } else {
    bgMusic.pause();
  }
};

updateAudioUI();

// ================= FUNCTIONS =================
let isFirstGame = true;

function startLevel(){
  gridSize = 8 + Math.floor(level / 2);
  const jumlahKata = Math.min(3 + level, kataTersisa.length);
  foundWords = [];
  grid = Array(gridSize * gridSize).fill("");

  levelText.textContent = "Level " + level;
  gamePanel.className = "game-panel"; 
  if (level >= 10) {
    gamePanel.classList.add("wide-mode");
  if (level >= 20) {
    gamePanel.classList.add("level-20-plus");
    }
  } else {
    gamePanel.classList.remove("wide-mode", "level-20-plus");
  }

  if (kataTersisa.length === 0) {
    const box = Math.ceil(level / 5);
    const startIdx = (box - 1) * 10;
    const endIdx = startIdx + 10;
    kataTersisa = databaseKata.slice(startIdx, endIdx);
    localStorage.setItem("savedKata", JSON.stringify(kataTersisa));
  }

if (kataTersisa.length === 0) {
  const box = Math.ceil(level / 5);
  const startIdx = (box - 1) * 10;
  const endIdx = startIdx + 10;
  kataTersisa = databaseKata.slice(startIdx, endIdx);
  localStorage.setItem("savedKata", JSON.stringify(kataTersisa));
}

words = [];
let tries = 0;
const targetWords = Math.min(3 + level, kataTersisa.length);

if (targetWords <= 0) {
  alert("Error: Tidak ada kata tersedia untuk level ini!");
  gamePanel.style.display = "none";
  levelSelect.style.display = "block";
  return;
}

  while(words.length < jumlahKata && tries < 1000){
    tries++;
    if(kataTersisa.length === 0) break;
    const idx = Math.floor(Math.random() * kataTersisa.length);
    const word = kataTersisa[idx];
    if (!words.includes(word) && canPlaceWord(word)) {
      words.push(word);
      kataTersisa.splice(idx, 1);
    }
  }

  isiHurufAcak();
  renderGrid();
  renderWords();
  renderHearts();
  startTimer(); 
}

function getTimeForLevel(level) {
  if (level >= 1 && level <= 2) {
    return 15; // 15 detik
  } else if (level >= 3 && level <= 4) {
    return 20; // 20 detik
  } else if (level >= 5 && level <= 6) {
    return 25; // 25 detik
  } else if (level >= 7 && level <= 8) {
    return 30; // 30 detik
  } else if (level >= 9 && level <= 10) {
    return 35; // 35 detik
  } else if (level >= 11 && level <= 12) {
    return 40; // 40 detik
  } else if (level >= 13 && level <= 14) {
    return 45; // 45 detik
  } else if (level >= 15 && level <= 16) {
    return 50; // 50 detik
  } else if (level >= 17 && level <= 18) {
    return 55; // 55 detik
  } else if (level >= 19 && level <= 20) {
    return 60; // 60 detik
  }
  return 15; // default
}

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timeLeft = getTimeForLevel(level);
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    lives = 0;
    gameOver();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  document.getElementById("timer").textContent = `Waktu: ${minutes}:${seconds}`;
}  

function canPlaceWord(word){
  const directions = [{x:1,y:0},{x:0,y:1},{x:1,y:1},{x:1,y:-1}];
  let placed = false;
  let attempts = 0;
  while(!placed && attempts < 1000){
    attempts++;
    const dir = directions[Math.floor(Math.random() * directions.length)];
    let x = Math.floor(Math.random() * gridSize);
    let y = Math.floor(Math.random() * gridSize);
    let posisi = [];
    let valid = true;
    for(let i = 0; i < word.length; i++){
      let nx = x + dir.x * i;
      let ny = y + dir.y * i;
      if(nx < 0 || ny < 0 || nx >= gridSize || ny >= gridSize){
        valid = false;
        break;
      }
      let idx = ny * gridSize + nx;
      if(grid[idx] && grid[idx] !== word[i]){
        valid = false;
        break;
      }
      posisi.push({x: nx, y: ny});
    }
    if(valid){
      for(let p of posisi){
        for(let dy = -1; dy <= 1; dy++){
          for(let dx = -1; dx <= 1; dx++){
            let cx = p.x + dx;
            let cy = p.y + dy;
            if(cx < 0 || cy < 0 || cx >= gridSize || cy >= gridSize) continue;
            let cidx = cy * gridSize + cx;
            if(grid[cidx] && !posisi.some(pp => pp.x === cx && pp.y === cy)){
              valid = false;
            }
          }
        }
      }
    }
    if(valid){
      posisi.forEach((p,i)=>{
        grid[p.y * gridSize + p.x] = word[i];
      });
      placed = true;
    }
  }
  return placed;
}

// ======== HEARTS ========
function renderHearts(){
  heartsDiv.innerHTML = " ";
  for(let i = 0; i < lives; i++){
    const span = document.createElement("span");
    span.textContent = "❤️";
    heartsDiv.appendChild(span);
  }
}

function crackHeart(){
  const spans = heartsDiv.querySelectorAll("span");
  if(spans.length > 0){
    const last = spans[spans.length - 1];
    last.classList.add("crack");
    setTimeout(() => last.remove(), 300);
  }
  localStorage.setItem("savedLives", lives);
}

function gameOver(){
  if (timerInterval) clearInterval(timerInterval);
  localStorage.setItem("currentLevel", level);
  localStorage.setItem("savedScore", score);

const box = Math.ceil(level / 5);
const startIdx = (box - 1) * 10;
const endIdx = startIdx + 10;
const resetKata = databaseKata.slice(startIdx, endIdx);
localStorage.setItem("savedKata", JSON.stringify(resetKata));
localStorage.setItem("justGameOver", "true");

  lives = 3;
  localStorage.setItem("savedLives", lives);
  gamePanel.style.display = "none";
  document.getElementById("gameOverPopup").style.display = "flex";

  if (musicOn) {
    bgMusic.pause();
  }
}

// ======== ISI HURUF ACAK ========
function isiHurufAcak(){
  const huruf = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  grid = grid.map(c => c || huruf[Math.floor(Math.random() * huruf.length)]);
}

// ======== RENDER GRID ========
function renderGrid(){
  gridDiv.innerHTML = "";
  const cellSize = gamePanel.classList.contains("level-20-plus") ? 32 :
                   gamePanel.classList.contains("wide-mode") ? 36 : 40;
  gridDiv.style.gridTemplateColumns = `repeat(${gridSize}, 40px)`;
  grid.forEach((l, i) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.textContent = l;
    cell.dataset.index = i;
    cell.onmousedown = () => startSelect(cell);
    cell.onmouseover = () => dragSelect(cell);
    gridDiv.appendChild(cell);
  });
  document.onmouseup = endSelect;
  setTimeout(() => {
    const gridWidth = gridDiv.offsetWidth;
    const topBar = document.getElementById("topBar");
    topBar.style.width = `${gridWidth}px`;
  }, 10); 
}

// ======== RENDER WORDS AS CARDS (ACAK) ========
function renderWords(){
  wordListDiv.innerHTML = "";
  const shuffledWords = [...words].sort(() => Math.random() - 0.5);
  let gap = "10px";
  if (gamePanel.classList.contains("level-20-plus")) {
    gap = "8px";
  } else if (gamePanel.classList.contains("wide-mode")) {
    gap = "12px";
  }

  wordListDiv.style.gap = gap;
  shuffledWords.forEach((w, i) => {
    const p = document.createElement("div");
    p.textContent = w;
    p.id = w;
    p.className = "word-card";
    wordListDiv.appendChild(p);
  });
}

// ======== DRAG SELECTION SYSTEM ========
function startSelect(cell){
  clearSelect();
  isDrag = true;
  direction = null;
  select(cell);
}
function dragSelect(cell){
  if(!isDrag || selectedCells.includes(cell)) return;
  const last = selectedCells[selectedCells.length - 1];
  const d = getDirection(last, cell);
  if(selectedCells.length === 1) direction = d;
  if(!direction || d.x !== direction.x || d.y !== direction.y) return;
  select(cell);
}
function endSelect(){
  if(!isDrag) return;
  isDrag = false;

  const word = selectedCells.map(c => c.textContent).join("");
  const reverse = word.split("").reverse().join("");

  if(words.includes(word) || words.includes(reverse)){
    const w = words.includes(word) ? word : reverse;
    if(!foundWords.includes(w)) foundWords.push(w);
    const wordElem = document.getElementById(w);

    const color = colors[Math.floor(Math.random() * colors.length)];
    wordElem.classList.add("found-word");
    wordElem.style.color = color;
    selectedCells.forEach(c => {
  c.classList.remove("selected");
  c.classList.remove("found");
  void c.offsetWidth; 
  c.classList.add("found");
  c.style.backgroundColor = color;
  c.style.color = "#fff";
  c.style.fontWeight = "bold";
});
  } else {
    selectedCells.forEach(c => c.classList.remove("selected"));
    lives--;
    crackHeart();
    if(lives <= 0){
      gameOver();
    }
  }
  clearSelect();

  if (words.length > 0 && foundWords.length === words.length) {
  if (timerInterval) clearInterval(timerInterval);
}

if (words.length > 0 && foundWords.length === words.length) {
  setTimeout(() => {
    const levelUpSound = new Audio('sounds/levelup.mp3');
    levelUpSound.volume = 0.5;
    levelUpSound.play().catch(e => console.log('Sound error:', e));
    const popupContainer = document.getElementById('popup');
    popupContainer.style.display = "flex";
    createConfettiEffect();
  }, 400);
}
}

// ======== HELPERS ========
function getDirection(a, b){
  const ai = +a.dataset.index;
  const bi = +b.dataset.index;
  return {
    x: Math.sign((bi % gridSize) - (ai % gridSize)),
    y: Math.sign(Math.floor(bi / gridSize) - Math.floor(ai / gridSize))
  };
}
function select(cell){
  cell.classList.add("selected");
  selectedCells.push(cell);
}
function clearSelect(){
  selectedCells.forEach(c => c.classList.remove("selected"));
  selectedCells = [];
}

function updateLevelCards() {
  const lastCompleted = parseInt(localStorage.getItem("lastCompletedLevel")) || 0;
  const currentLevel = parseInt(localStorage.getItem("currentLevel")) || 1;

  console.log("Last Completed Level:", lastCompleted);
  console.log("Current Level:", currentLevel);

  document.querySelectorAll(".level-card").forEach(card => {
    const levelNum = parseInt(card.dataset.level);
    const levelNumberElement = card.querySelector('.level-number');
    card.classList.remove("active", "locked");
    
    if (levelNum === 1 || lastCompleted >= levelNum - 1) {
      card.classList.remove("locked");
      levelNumberElement.textContent = levelNum;
      
    if (levelNum === currentLevel) {
      card.classList.add("active");
      }
    } else {
      card.classList.add("locked");
      levelNumberElement.innerHTML = '<span class="lock-icon">🔒</span>';
    }
  });
}

function createProgressBar(card) {
  const barContainer = document.createElement("div");
  barContainer.className = "progress-container";
  barContainer.innerHTML = `
    <div class="progress-bar" style="width: 0%; background: #ff9e00;"></div>
  `;
  card.appendChild(barContainer);
  return barContainer.querySelector(".progress-bar");
}

function createProgressText(card) {
  const text = document.createElement("div");
  text.className = "progress-text";
  text.style.fontSize = "14px";
  text.style.marginTop = "8px";
  text.style.textAlign = "center";
  card.appendChild(text);
  return text;
}

// ===== CONFETTI EFFECT UNTUK LEVEL SELESAI =====
function createConfettiEffect() {
  const confettiPieces = 50;
  const colors = ["#2a9d8f", "#ffb347", "#ff6b6b", "#4ecdc4", "#ffd93d"];
  
  for (let i = 0; i < confettiPieces; i++) {
    const confetti = document.createElement("div");
    confetti.style.position = "fixed";
    confetti.style.width = "10px";
    confetti.style.height = "10px";
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.borderRadius = "50%";
    confetti.style.pointerEvents = "none";
    confetti.style.left = Math.random() * 100 + "%";
    confetti.style.top = "-10px";
    confetti.style.zIndex = "9999";
    confetti.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
    
    document.body.appendChild(confetti);
    
    const duration = Math.random() * 2 + 2;
    const horizontalDrift = (Math.random() - 0.5) * 300;
    const spin = Math.random() * 720;
    
    confetti.animate(
      [
        { 
          transform: "translateY(0px) rotate(0deg)",
          opacity: 1 
        },
        { 
          transform: `translateY(${window.innerHeight + 10}px) translateX(${horizontalDrift}px) rotate(${spin}deg)`,
          opacity: 0 
        }
      ],
      {
        duration: duration * 1000,
        easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)"
      }
    );
    
    setTimeout(() => confetti.remove(), duration * 1000);
  }
}

nextLevelBtn.onclick = () => {
  if (timerInterval) clearInterval(timerInterval);
  const completedLevel = level;
  const currentLastCompleted = parseInt(localStorage.getItem("lastCompletedLevel")) || 0;

  if (completedLevel > currentLastCompleted) {
    localStorage.setItem("lastCompletedLevel", completedLevel);
  }

  if (completedLevel >= 20) {
    document.getElementById("finalScore").textContent = score;
    document.getElementById("gameCompletedPopup").style.display = "flex";
    popup.style.display = "none";
    gamePanel.style.display = "none";
    
    if (musicOn) {
      bgMusic.pause();
    }
    
    return; 
  }

  level++;
  score += 5;
  scoreDiv.textContent = "Skor: " + score;
  localStorage.removeItem("currentLevel");
  const box = Math.ceil(level / 5);
  const startIdx = (box - 1) * 10;
  const endIdx = startIdx + 10;
  kataTersisa = databaseKata.slice(startIdx, endIdx);
  localStorage.setItem("savedKata", JSON.stringify(kataTersisa));

  popup.style.display = "none";
  startLevel();
  setTimeout(updateLevelCards, 100);
};

backBtn.onclick = () => {
  if (timerInterval) clearInterval(timerInterval);
  document.body.classList.remove("game-active");
  
  gamePanel.style.display = "none";
  levelSelect.style.display = "block";
  backBtn.classList.remove("show");
  audioToggle.style.display = "none";
  level = 1;
  score = 0;
  lives = 3;
  updateLevelCards();
};

window.onload = () => {
  document.querySelector(".game-panel").style.display = "none";
  backBtn.classList.remove("show");
  audioToggle.style.display = "none";
  document.querySelector(".home-container").style.display = "block";
  loadingScreen.style.display = "none";
  levelSelect.style.display = "none";

  const justGameOver = localStorage.getItem("justGameOver") === "true";

  if (musicOn && !justGameOver) {
    bgMusic.play().catch(() => {});
  }

  if (justGameOver) {
    localStorage.removeItem("justGameOver");
  }

  const savedLevel = localStorage.getItem("lastCompletedLevel");
  if (savedLevel) {
    lastCompletedLevel = parseInt(savedLevel);
  }

  const savedLives = localStorage.getItem("savedLives");
  if (savedLives !== null) {
    lives = parseInt(savedLives);
  } else {
    lives = 3; 
  }

  // ===== EVENT LISTENER UNTUK BUTTON MULAI GAME =====
  const startBtn = document.getElementById("start-btn");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      document.querySelector(".home-container").style.display = "none";
      loadingScreen.style.display = "flex";
      let progress = 0;
      progressBar.style.width = "0%";

      const loadingInterval = setInterval(() => {
        progress += 10;
        progressBar.style.width = progress + "%";
        if (progress >= 100) {
          clearInterval(loadingInterval);
          loadingScreen.style.display = "none";
          levelSelect.style.display = "block";
          gamePanel.style.display = "none";
          backBtn.classList.remove("show");
          audioToggle.style.display = "none";
          updateLevelCards();
        }
      }, 200);
    });
  }

   const backToHomeBtn = document.querySelector(".btn-back-to-home");
if (backToHomeBtn) {
  backToHomeBtn.addEventListener("click", () => {
    if (timerInterval) clearInterval(timerInterval);
    document.body.classList.remove("game-active");
    levelSelect.style.display = "none";
    document.querySelector(".home-container").style.display = "block";
    level = 1;
    score = 0;
    lives = 3;
    updateLevelCards();
    
    if (musicOn) {
      bgMusic.pause();
    }
  });
}

  // ===== EVENT LISTENER UNTUK POPUP GAME OVER =====
  const retryBtn = document.getElementById("retryBtn");
  const quitBtn = document.getElementById("quitBtn");
  const gameOverPopup = document.getElementById("gameOverPopup");

  if (retryBtn && quitBtn && gameOverPopup) {
    retryBtn.addEventListener("click", () => {
      if (timerInterval) clearInterval(timerInterval);
      const box = Math.ceil(level / 5);
      const startIdx = (box - 1) * 10;
      const endIdx = startIdx + 10;
      kataTersisa = databaseKata.slice(startIdx, endIdx);
      localStorage.setItem("savedKata", JSON.stringify(kataTersisa));
      lives = 3;
      localStorage.setItem("savedLives", lives);
      gameOverPopup.style.display = "none";
      gamePanel.style.display = "block";

      if (musicOn) {
        bgMusic.play().catch(e => {
          console.warn("Gagal memutar audio:", e);
        });
      }
      startLevel();
    });

    quitBtn.addEventListener("click", () => {
  document.body.classList.remove("game-active");
  gameOverPopup.style.display = "none";
  gamePanel.style.display = "none";
  levelSelect.style.display = "block";
  backBtn.classList.remove("show");
  audioToggle.style.display = "none";
  level = 1;
  score = 0;
  lives = 3;
  updateLevelCards();
});
  }
  
  // ===== EVENT LISTENER UNTUK POPUP GAME COMPLETED =====
  const gameCompletedPopup = document.getElementById("gameCompletedPopup");
  const playAgainBtn = document.getElementById("playAgainBtn");
  const backToMenuBtn = document.getElementById("backToMenuBtn");

  if (playAgainBtn && backToMenuBtn && gameCompletedPopup) {
    playAgainBtn.addEventListener("click", () => {
      if (timerInterval) clearInterval(timerInterval);
      localStorage.removeItem("lastCompletedLevel");
      localStorage.removeItem("currentLevel");
      localStorage.removeItem("savedKata");
      localStorage.removeItem("savedScore");
      localStorage.removeItem("savedLives");
      level = 1;
      score = 0;
      lives = 3;
      kataTersisa = [...databaseKata];
      gameCompletedPopup.style.display = "none";
      gamePanel.style.display = "block";

      if (musicOn) {
        bgMusic.play().catch(e => {
          console.warn("Gagal memutar audio:", e);
        });
      }
      startLevel();
    });

    backToMenuBtn.addEventListener("click", () => {
  if (timerInterval) clearInterval(timerInterval);
  document.body.classList.remove("game-active");
  localStorage.removeItem("currentLevel");
  localStorage.removeItem("savedKata");
  localStorage.removeItem("savedLives");
  gameCompletedPopup.style.display = "none";
  levelSelect.style.display = "block";
  gamePanel.style.display = "none";
  backBtn.classList.remove("show");
  audioToggle.style.display = "none";
  level = 1;
  score = 0;
  lives = 3;
  updateLevelCards();
});
  }
};
