/* ==========================================
   BIRTHDAY PAGE - MAIN JAVASCRIPT
   ========================================== */

// ---------- Loading Screen ----------
let loadingProgress = 0;
const loadingBar = document.getElementById('loading-bar');
const loadingPercentage = document.getElementById('loading-percentage');
const loadingScreen = document.getElementById('loading-screen');
const loginScreen = document.getElementById('login-screen');

const loadingInterval = setInterval(() => {
  loadingProgress += 2;
  if (loadingProgress > 100) loadingProgress = 100;
  loadingBar.style.width = loadingProgress + '%';
  loadingPercentage.textContent = loadingProgress + '%';

  if (loadingProgress >= 100) {
    clearInterval(loadingInterval);
    setTimeout(() => {
      loadingScreen.classList.add('opacity-0');
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        loginScreen.classList.remove('hidden');
      }, 1000);
    }, 300);
  }
}, 100);

// ---------- Password Login ----------
function checkPassword() {
  const input = document.getElementById('password-input').value.trim().toLowerCase();
  const errorMsg = document.getElementById('password-error');

  if (input === 'love') {
    loginScreen.classList.add('hidden');
    showLetter();
  } else {
    errorMsg.classList.remove('hidden');
    setTimeout(() => errorMsg.classList.add('hidden'), 2000);
  }
}

// ---------- Audio Controls ----------
let audioCtx = null;
let isPlaying = false;
const bgSong = document.getElementById('bg-song');

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playSong() {
  bgSong.currentTime = 0;
  bgSong.play();
  bgSong.onended = function() {};
}

function toggleAudio() {
  initAudio();
  const icon = document.getElementById('audio-icon');
  if (!isPlaying) {
    isPlaying = true;
    playSong();
    icon.className = "fa-solid fa-pause text-xl text-champagne";
  } else {
    isPlaying = false;
    bgSong.pause();
    icon.className = "fa-solid fa-music text-xl text-champagne";
  }
}

// ---------- Candle Blow ----------
function blowCandle(element) {
  const flame = element.querySelector('.real-flame');
  if (flame) {
    flame.style.display = 'none';
    triggerConfetti();
  }
}

function blowAllCandles() {
  const flames = document.querySelectorAll('#candles-container .real-flame');
  flames.forEach(f => f.style.display = 'none');
  triggerConfetti();
}

// ---------- Memory Card Game ----------
const gameEmojis = ['👑','💎','🎀','🍰','🦋','🌸'];
let gameCards = [];
let flippedCards = [];
let matchedPairs = 0;
let gameMoves = 0;
let gameLocked = false;

function initGame() {
  const board = document.getElementById('game-board');
  const winMsg = document.getElementById('game-win');
  winMsg.classList.add('hidden');
  matchedPairs = 0;
  gameMoves = 0;
  flippedCards = [];
  gameLocked = false;
  document.getElementById('game-moves').textContent = '0';
  document.getElementById('game-pairs').textContent = '0';

  const pairs = [...gameEmojis, ...gameEmojis];
  gameCards = pairs.sort(() => Math.random() - 0.5);

  board.innerHTML = gameCards.map((emoji, i) => `
    <div class="game-card" data-index="${i}" onclick="flipCard(this)">
      <div class="game-card-inner">
        <div class="game-card-front"></div>
        <div class="game-card-back">${emoji}</div>
      </div>
    </div>
  `).join('');
}

function flipCard(card) {
  if (gameLocked) return;
  if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
  if (flippedCards.length >= 2) return;

  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    gameMoves++;
    document.getElementById('game-moves').textContent = gameMoves;
    gameLocked = true;

    const [a, b] = flippedCards;
    const emojiA = gameCards[a.dataset.index];
    const emojiB = gameCards[b.dataset.index];

    if (emojiA === emojiB) {
      a.classList.add('matched');
      b.classList.add('matched');
      matchedPairs++;
      document.getElementById('game-pairs').textContent = matchedPairs;
      flippedCards = [];
      gameLocked = false;

      if (matchedPairs === 6) {
        setTimeout(() => {
          document.getElementById('game-win').classList.remove('hidden');
          triggerConfetti();
        }, 500);
      }
    } else {
      setTimeout(() => {
        a.classList.remove('flipped');
        b.classList.remove('flipped');
        flippedCards = [];
        gameLocked = false;
      }, 900);
    }
  }
}

// Init game on load
setTimeout(initGame, 100);

// ---------- Birthday Timer ----------
function updateTimer() {
  const birth = new Date(2005, 4, 25);
  const now = new Date();
  let diff = now - birth;

  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;

  const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  const years = Math.floor(totalDays / 365.25);
  const remainingDays = totalDays - Math.floor(years * 365.25);
  const months = Math.floor(remainingDays / 30.44);
  const days = Math.floor(remainingDays - months * 30.44);

  document.getElementById('timer-years').textContent = years;
  document.getElementById('timer-months').textContent = months;
  document.getElementById('timer-days').textContent = days;
  document.getElementById('timer-hours').textContent = hours;
  document.getElementById('timer-minutes').textContent = minutes;
  document.getElementById('timer-seconds').textContent = seconds;
}
updateTimer();
setInterval(updateTimer, 1000);

// ---------- Letter Modal ----------
const letterMsg = 'يا نوران يا أحلى وأجمل بنوتة في الدنيا.. كل سنة وانتِ بخير وسعادة وحب! دي سنة جديدة يا رب تحقق فيها كل أحلامك وتفضلي دايماً متألقة وhappy زي ما انتِ. ربنا يخليكي لينا ويبعد عنك أي حاجة وحشة. انتِ تستاهلي كل الخير والحلو في الدنيا. فاكرة دايماً إنك أجمل هدية في حياتنا! 💖';
let letterInterval = null;

function showLetter() {
  document.getElementById('letter-modal').classList.remove('hidden');
  document.getElementById('main-content').classList.add('hidden');
  playSong();
  const textEl = document.getElementById('letter-text');
  const enterBtn = document.getElementById('letter-enter-btn');
  textEl.textContent = '';
  enterBtn.classList.add('hidden');
  let i = 0;
  if (letterInterval) clearInterval(letterInterval);
  letterInterval = setInterval(() => {
    if (i < letterMsg.length) {
      textEl.textContent += letterMsg[i];
      i++;
    } else {
      clearInterval(letterInterval);
      enterBtn.classList.remove('hidden');
      triggerConfetti();
    }
  }, 40);
}

function enterWebsite() {
  document.getElementById('letter-modal').classList.add('hidden');
  document.getElementById('main-content').classList.remove('hidden');
  triggerConfetti();
  initAudio();
}

// ---------- Epilogue Modal ----------
const epilogueMsg = 'يا نوران.. اتمنى تكون المفاجاة دي رسمت ضحكة حلوة على وشك القمور ده! تفضلي دايماً منورة حياتنا ومصدر البهجة والسعادة لكل اللي حواليكي.. كل سنة وانتِ ارق واجمل بنوتة في الدنيا!';
let epilogueInterval = null;

function openEpilogueModal() {
  document.getElementById('epilogue-modal').classList.remove('hidden');
  const textEl = document.getElementById('epilogue-text');
  textEl.textContent = '';
  let i = 0;
  if (epilogueInterval) clearInterval(epilogueInterval);
  epilogueInterval = setInterval(() => {
    if (i < epilogueMsg.length) {
      textEl.textContent += epilogueMsg[i];
      i++;
    } else {
      clearInterval(epilogueInterval);
      triggerConfetti();
    }
  }, 45);
}

function closeEpilogueModal() {
  document.getElementById('epilogue-modal').classList.add('hidden');
  if (epilogueInterval) clearInterval(epilogueInterval);
}

// ---------- Confetti ----------
function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 85,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FF69B4', '#D4AF37', '#FFF0F5', '#8B263E']
    });
  }
}

// ---------- Sparkle Particles Canvas ----------
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

for (let i = 0; i < 35; i++) {
  particles.push({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 2 + 1,
    color: ['#FFD700', '#FF69B4', '#FFFFFF'][Math.floor(Math.random() * 3)],
    speedY: Math.random() * 0.5 + 0.2
  });
}

function animateParticles() {
  ctx.clearRect(0, 0, width, height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    p.y -= p.speedY;
    if (p.y < 0) p.y = height;
  });
  requestAnimationFrame(animateParticles);
}

animateParticles();