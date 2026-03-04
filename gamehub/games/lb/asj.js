  // ===== Animasi Slime Jatuh =====
  const canvas = document.getElementById('lobbyCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const slimeImg = new Image();
  slimeImg.src = 'player_idle_1.png'; // pakai sprite slime idle

  const slimes = [];
  const totalSlimes = 3;

  for(let i=0;i<totalSlimes;i++){
    slimes.push({
      x: Math.random() * (canvas.width - 100),
      y: -Math.random()*canvas.height,
      size: 80 + Math.random()*40,
      speed: 1 + Math.random()*2
    });
  }

  function animateLobby() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // background hitam
    ctx.fillStyle = '#111';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // gambar slime
    slimes.forEach(s => {
      ctx.drawImage(slimeImg, s.x, s.y, s.size, s.size);
      s.y += s.speed;
      if(s.y > canvas.height) s.y = -s.size;
    });

    requestAnimationFrame(animateLobby);
  }

  animateLobby();

  // Resize canvas saat jendela diubah
  window.addEventListener('resize', ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });