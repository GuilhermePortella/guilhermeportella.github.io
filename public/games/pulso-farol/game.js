const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scene = document.getElementById('scene');
const feedback = document.getElementById('feedback');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayText = document.getElementById('overlay-text');
const scoreEl = document.getElementById('score');
const comboEl = document.getElementById('combo');
const timeEl = document.getElementById('time');
const bestEl = document.getElementById('best');
const accuracyEl = document.getElementById('accuracy');
const durationChip = document.getElementById('duration-chip');
const diffButtons = Array.from(document.querySelectorAll('[data-diff]'));
const startButton = document.getElementById('start-button');
const leaderboardList = document.getElementById('leaderboard-list');
const leaderboardDate = document.getElementById('leaderboard-date');

const LEADERBOARD_KEY = 'pulse_daily_leaderboard';
const MAX_ENTRIES = 7;
const NAME_PARTS = {
  first: [
    'Quantum',
    'Pixel',
    'Neo',
    'Turbo',
    'Binary',
    'Cosmic',
    'Retro',
    'Circuit',
    'Astro',
    'Glitch',
    'Logic'
  ],
  second: [
    'Nerd',
    'Wizard',
    'Coder',
    'Hacker',
    'Signal',
    'Beacon',
    'Rocket',
    'Matrix',
    'Byte',
    'Pilot',
    'Gizmo'
  ]
};

const state = {
  mode: 'idle',
  difficulty: 'easy',
  score: 0,
  combo: 0,
  hits: 0,
  total: 0,
  duration: 30,
  elapsed: 0,
  phase: 0,
  speed: 1.2,
  baseSpeed: 1.2,
  maxSpeed: 3.4,
  bandScale: 1,
  timeFactor: 0.05,
  comboFactor: 0.03,
  pulseRadius: 0,
  minR: 0,
  maxR: 0,
  targetR: 0,
  band: 0,
  centerX: 0,
  centerY: 0,
  stars: [],
  ripple: 0,
  messageTimer: 0,
  best: Number(localStorage.getItem('pulse_best') || 0)
};

const difficulties = {
  easy: {
    label: 'Facil',
    baseSpeed: 0.6,
    maxSpeed: 1.7,
    bandScale: 1.35,
    duration: 40,
    timeFactor: 0.02,
    comboFactor: 0.01
  },
  medium: {
    label: 'Medio',
    baseSpeed: 0.9,
    maxSpeed: 2.8,
    bandScale: 1,
    duration: 30,
    timeFactor: 0.04,
    comboFactor: 0.02
  },
  hard: {
    label: 'Dificil',
    baseSpeed: 1.55,
    maxSpeed: 4.3,
    bandScale: 0.78,
    duration: 25,
    timeFactor: 0.05,
    comboFactor: 0.03
  }
};

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function randomNerdName() {
  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  return `${pick(NAME_PARTS.first)} ${pick(NAME_PARTS.second)}`;
}

function loadLeaderboard() {
  const today = getTodayKey();
  let board = { date: today, entries: [] };
  const raw = localStorage.getItem(LEADERBOARD_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.date === today && Array.isArray(parsed.entries)) {
        board = parsed;
      }
    } catch (error) {
      board = { date: today, entries: [] };
    }
  }
  if (board.date !== today) {
    board = { date: today, entries: [] };
  }
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(board));
  return board;
}

function saveLeaderboard(board) {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(board));
}

function renderLeaderboard(board) {
  leaderboardDate.textContent = `Data: ${formatDate(board.date)}`;
  leaderboardList.innerHTML = '';
  if (!board.entries.length) {
    const empty = document.createElement('li');
    empty.className = 'leaderboard-empty';
    empty.textContent = 'Sem pontuacoes hoje.';
    leaderboardList.appendChild(empty);
    return;
  }
  board.entries.forEach((entry, index) => {
    const item = document.createElement('li');
    item.className = 'leaderboard-item';
    const rank = document.createElement('span');
    rank.className = 'leaderboard-rank';
    rank.textContent = `#${index + 1}`;
    const name = document.createElement('span');
    name.className = 'leaderboard-name';
    name.textContent = `${entry.name} - ${formatDate(entry.date)}`;
    const score = document.createElement('span');
    score.className = 'leaderboard-score';
    score.textContent = `${entry.score} pts`;
    item.append(rank, name, score);
    leaderboardList.appendChild(item);
  });
}

function formatDate(dateKey) {
  const parts = String(dateKey || '').split('-');
  if (parts.length !== 3) {
    return String(dateKey || '');
  }
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function addScoreToLeaderboard(score) {
  const board = loadLeaderboard();
  if (score <= 0) {
    renderLeaderboard(board);
    return;
  }
  board.entries.push({
    name: randomNerdName(),
    score: score,
    date: board.date
  });
  board.entries.sort((a, b) => b.score - a.score);
  board.entries = board.entries.slice(0, MAX_ENTRIES);
  saveLeaderboard(board);
  renderLeaderboard(board);
}

bestEl.textContent = state.best;

function applyDifficulty(level) {
  const setting = difficulties[level] || difficulties.medium;
  state.difficulty = level;
  state.baseSpeed = setting.baseSpeed;
  state.maxSpeed = setting.maxSpeed;
  state.bandScale = setting.bandScale;
  state.duration = setting.duration;
  state.timeFactor = setting.timeFactor;
  state.comboFactor = setting.comboFactor;
  if (state.mode !== 'playing') {
    state.elapsed = 0;
    state.speed = state.baseSpeed;
  }
  diffButtons.forEach((button) => {
    const isActive = button.dataset.diff === level;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
  if (durationChip) {
    durationChip.textContent = `Duracao: ${setting.duration}s`;
  }
  if (state.mode === 'idle') {
    overlayText.textContent = `Clique em Novo jogo para comecar. Dificuldade: ${setting.label}.`;
  }
  updateHud();
  resize();
  localStorage.setItem('pulse_diff', level);
}

function setDifficultyButtonsEnabled(enabled) {
  diffButtons.forEach((button) => {
    button.disabled = !enabled;
  });
}

function setOverlay(title, text) {
  overlayTitle.textContent = title;
  overlayText.textContent = text;
  overlay.classList.add('is-visible');
  overlay.setAttribute('aria-hidden', 'false');
}

function hideOverlay() {
  overlay.classList.remove('is-visible');
  overlay.setAttribute('aria-hidden', 'true');
}

function calcAccuracy() {
  return state.total ? Math.round((state.hits / state.total) * 100) : 0;
}

function updateHud() {
  scoreEl.textContent = Math.floor(state.score);
  comboEl.textContent = state.combo;
  timeEl.textContent = Math.max(0, Math.ceil(state.duration - state.elapsed));
  accuracyEl.textContent = `${calcAccuracy()}%`;
  bestEl.textContent = state.best;
}

function showFeedback(message) {
  feedback.textContent = message;
  feedback.classList.add('show');
  state.messageTimer = 0.6;
}

function updateStartButton() {
  if (!startButton) {
    return;
  }
  if (state.mode === 'playing') {
    startButton.disabled = true;
    startButton.textContent = 'Em jogo';
  } else if (state.mode === 'ended') {
    startButton.disabled = false;
    startButton.textContent = 'Jogar de novo';
  } else {
    startButton.disabled = false;
    startButton.textContent = 'Novo jogo';
  }
}

function startGame() {
  state.mode = 'playing';
  state.score = 0;
  state.combo = 0;
  state.hits = 0;
  state.total = 0;
  state.elapsed = 0;
  state.phase = 0;
  state.speed = state.baseSpeed;
  state.ripple = 0;
  state.messageTimer = 0;
  setDifficultyButtonsEnabled(false);
  updateStartButton();
  hideOverlay();
  updateHud();
}

function endGame() {
  state.mode = 'ended';
  const finalScore = Math.floor(state.score);
  if (finalScore > state.best) {
    state.best = finalScore;
    localStorage.setItem('pulse_best', String(finalScore));
  }
  updateHud();
  addScoreToLeaderboard(finalScore);
  setOverlay(
    'Tempo esgotado',
    `Pontos ${finalScore} - Precisao ${calcAccuracy()}% - Clique em Novo jogo`
  );
  setDifficultyButtonsEnabled(true);
  updateStartButton();
}

function registerHit() {
  if (state.mode !== 'playing') {
    return;
  }
  state.total += 1;
  const diff = Math.abs(state.pulseRadius - state.targetR);
  const bandRadius = state.band / 2;
  if (diff <= bandRadius) {
    state.hits += 1;
    const perfect = diff <= bandRadius * 0.4;
    state.combo += 1;
    const base = perfect ? 18 : 12;
    const bonus = Math.min(20, state.combo * (perfect ? 2 : 1));
    state.score += base + bonus;
    state.ripple = 1;
    showFeedback(perfect ? 'Perfeito!' : 'Boa!');
  } else {
    state.combo = 0;
    showFeedback('Fora!');
  }
  updateHud();
}

function handleInput() {
  if (state.mode === 'idle' || state.mode === 'ended') {
    showFeedback('Use o botao Novo jogo');
    return;
  }
  registerHit();
}

function generateStars(size) {
  const count = Math.floor(size / 7);
  state.stars = Array.from({ length: count }, () => ({
    x: Math.random() * size,
    y: Math.random() * size * 0.75,
    r: Math.random() * 1.4 + 0.4,
    a: Math.random() * 0.5 + 0.15
  }));
}

function resize() {
  const cssSize = canvas.clientWidth;
  if (!cssSize) {
    return;
  }
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  canvas.width = cssSize * dpr;
  canvas.height = cssSize * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  state.centerX = cssSize / 2;
  state.centerY = cssSize / 2;
  const base = cssSize / 2;
  state.minR = base * 0.35;
  state.maxR = base * 0.85;
  state.targetR = base * 0.6;
  state.band = base * 0.18 * state.bandScale;
  generateStars(cssSize);
}

function drawBackground(width, height) {
  const bg = ctx.createRadialGradient(
    state.centerX,
    state.centerY,
    state.minR * 0.3,
    state.centerX,
    state.centerY,
    state.maxR * 1.8
  );
  bg.addColorStop(0, '#214d63');
  bg.addColorStop(1, '#0b2538');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  state.stars.forEach((star, index) => {
    const twinkle = 0.5 + 0.5 * Math.sin(state.phase * 0.7 + index);
    ctx.fillStyle = `rgba(255, 233, 200, ${star.a * twinkle})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  for (let i = 0; i < 4; i++) {
    const baseY = height * (0.68 + i * 0.08);
    ctx.beginPath();
    for (let x = 0; x <= width; x += 20) {
      const offset = Math.sin(x * 0.02 + state.phase + i) * 3;
      if (x === 0) {
        ctx.moveTo(x, baseY + offset);
      } else {
        ctx.lineTo(x, baseY + offset);
      }
    }
    ctx.stroke();
  }
}

function drawTargetRing() {
  ctx.save();
  ctx.beginPath();
  ctx.arc(state.centerX, state.centerY, state.targetR, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 203, 128, 0.28)';
  ctx.lineWidth = state.band;
  ctx.shadowColor = 'rgba(255, 203, 128, 0.2)';
  ctx.shadowBlur = 18;
  ctx.stroke();
  ctx.restore();
}

function drawPulse() {
  ctx.save();
  ctx.beginPath();
  ctx.arc(state.centerX, state.centerY, state.pulseRadius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 236, 196, 0.95)';
  ctx.lineWidth = 4;
  ctx.shadowColor = 'rgba(255, 206, 138, 0.6)';
  ctx.shadowBlur = 14;
  ctx.stroke();
  ctx.restore();
}

function drawRipple() {
  if (state.ripple <= 0) {
    return;
  }
  const alpha = state.ripple;
  ctx.save();
  ctx.beginPath();
  ctx.arc(
    state.centerX,
    state.centerY,
    state.targetR + (1 - alpha) * state.band,
    0,
    Math.PI * 2
  );
  ctx.strokeStyle = `rgba(255, 216, 158, ${0.6 * alpha})`;
  ctx.lineWidth = 2 + alpha * 4;
  ctx.stroke();
  ctx.restore();
}

function drawLighthouse() {
  const towerW = state.minR * 0.5;
  const towerH = state.minR * 0.85;
  const x = state.centerX;
  const y = state.centerY + state.minR * 0.15;
  ctx.save();
  ctx.fillStyle = '#f6eadc';
  ctx.beginPath();
  ctx.moveTo(x - towerW * 0.5, y + towerH * 0.45);
  ctx.lineTo(x + towerW * 0.5, y + towerH * 0.45);
  ctx.lineTo(x + towerW * 0.3, y - towerH * 0.45);
  ctx.lineTo(x - towerW * 0.3, y - towerH * 0.45);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#d9c8b5';
  ctx.fillRect(x - towerW * 0.3, y - towerH * 0.6, towerW * 0.6, towerH * 0.15);

  ctx.beginPath();
  ctx.arc(x, y - towerH * 0.65, towerW * 0.18, 0, Math.PI * 2);
  ctx.fillStyle = '#ffb35c';
  ctx.shadowColor = 'rgba(255, 179, 92, 0.6)';
  ctx.shadowBlur = 12;
  ctx.fill();
  ctx.restore();
}

function draw() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  ctx.clearRect(0, 0, width, height);
  drawBackground(width, height);
  drawTargetRing();
  drawPulse();
  drawRipple();
  drawLighthouse();
}

function tick(now) {
  if (!tick.last) {
    tick.last = now;
  }
  const dt = Math.min(0.033, (now - tick.last) / 1000);
  tick.last = now;

  if (state.mode === 'playing') {
    state.elapsed += dt;
    const difficulty = state.elapsed * state.timeFactor + state.combo * state.comboFactor;
    state.speed = Math.min(state.maxSpeed, state.baseSpeed + difficulty);
    if (state.elapsed >= state.duration) {
      state.elapsed = state.duration;
      endGame();
    }
  } else {
    state.speed = 0.65;
  }

  state.phase += dt * state.speed * Math.PI * 2;
  const wave = (Math.sin(state.phase) + 1) / 2;
  state.pulseRadius = state.minR + wave * (state.maxR - state.minR);

  if (state.ripple > 0) {
    state.ripple = Math.max(0, state.ripple - dt * 2);
  }

  if (state.messageTimer > 0) {
    state.messageTimer = Math.max(0, state.messageTimer - dt);
    if (state.messageTimer === 0) {
      feedback.classList.remove('show');
    }
  }

  if (state.mode === 'playing') {
    updateHud();
  }

  draw();
  requestAnimationFrame(tick);
}

scene.addEventListener('pointerdown', (event) => {
  event.preventDefault();
  scene.focus();
  handleInput();
});

scene.addEventListener('keydown', (event) => {
  if (event.code === 'Space' || event.code === 'Enter') {
    event.preventDefault();
    handleInput();
  }
});

if (startButton) {
  startButton.addEventListener('click', () => {
    if (state.mode !== 'playing') {
      startGame();
    }
  });
}

diffButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (state.mode === 'playing') {
      showFeedback('Termine a rodada para mudar');
      return;
    }
    applyDifficulty(button.dataset.diff);
  });
});

window.addEventListener('resize', resize, { passive: true });
applyDifficulty(localStorage.getItem('pulse_diff') || 'easy');
setDifficultyButtonsEnabled(true);
renderLeaderboard(loadLeaderboard());
resize();
updateHud();
updateStartButton();
requestAnimationFrame(tick);
