import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getDatabase, ref, push, query, orderByChild, limitToLast, get } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBCHFQ5b9pzojBLyUV5hHMM1PKOTM09KTE",
  authDomain: "guilhermeportella-47661.firebaseapp.com",
  databaseURL: "https://guilhermeportella-47661-default-rtdb.firebaseio.com",
  projectId: "guilhermeportella-47661",
  storageBucket: "guilhermeportella-47661.firebasestorage.app",
  messagingSenderId: "86680299174",
  appId: "1:86680299174:web:caf8beded5dadcee907667",
  measurementId: "G-PF8LV4SCNN"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const playerForm = document.getElementById('playerForm');
const playerNameInput = document.getElementById('playerName');
const startButton = document.getElementById('startButton');
const rankingList = document.getElementById('rankingList');

let currentPlayer = '';
let player = {
    x: 50,
    y: canvas.height - 60,
    width: 30,
    height: 30,
    dy: 0,
    gravity: 0.5,
    jumpPower: -10,
    score: 0,
    isJumping: false,
    rotation: 0
};

let obstacles = [];
let obstacleFrequency = 1500;
let gameOver = false;

let clouds = Array.from({ length: 3 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * 100,
    width: 60,
    speed: 1
}));

let trees = Array.from({ length: 4 }, () => ({
    x: Math.random() * canvas.width,
    width: 40,
    height: 60
}));

let gameStarted = false;
const startMessage = document.getElementById('startMessage');

let obstacleInterval;

let minObstacleDistance = 200; 
let lastObstacleX = 0;

function startGame() {
    if (!gameStarted) {
        document.addEventListener('keydown', handleKeydown);
        drawInitialScene();
    }
}

function handleKeydown(e) {
    if (e.code === 'Space') {
        if (!gameStarted) {
            gameStarted = true;
            startMessage.classList.add('hidden');
            obstacleInterval = setInterval(generateObstacle, obstacleFrequency);
            requestAnimationFrame(gameLoop);
        } else if (!player.isJumping) {
            player.dy = player.jumpPower;
            player.isJumping = true;
        }
    }
}

function drawInitialScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#90EE90';
    ctx.fillRect(0, canvas.height - 30, canvas.width, 30);

    drawPlayer();
}

function generateObstacle() {
    const difficultyFactor = Math.floor(player.score / 10);
    
    const obstacle = {
        x: canvas.width,
        y: canvas.height - 40,
        width: 20 + (difficultyFactor * 2),
        height: 40 + (difficultyFactor * 3),
        speed: 5 + (difficultyFactor * 0.5)
    };

    minObstacleDistance = Math.max(150, 200 - (difficultyFactor * 5));

    const lastObstacle = obstacles[obstacles.length - 1];
    if (!lastObstacle || (lastObstacle.x < canvas.width - minObstacleDistance)) {
        obstacle.height += Math.random() * 20 - 10;
        
        obstacle.speed += Math.random() * 2 - 1;

        obstacles.push(obstacle);
        lastObstacleX = obstacle.x;
    }
}

function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawClouds();

    ctx.fillStyle = '#90EE90';
    ctx.fillRect(0, canvas.height - 30, canvas.width, 30);

    drawTrees();

    updatePlayer();
    updateObstacles();
    checkCollisions();
    drawPlayer();
    drawObstacles();
    updateScore();

    requestAnimationFrame(gameLoop);
}

function updatePlayer() {
    player.dy += player.gravity;
    player.y += player.dy;

    if (player.y + player.height >= canvas.height - 30) {
        player.y = canvas.height - 60;
        player.dy = 0;
        player.isJumping = false;
    }
}

function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= obstacles[i].speed;

        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            player.score++;

            if (player.score % 5 === 0) { 
                obstacleFrequency = Math.max(800, obstacleFrequency - 100); 
                clearInterval(obstacleInterval);
                obstacleInterval = setInterval(generateObstacle, obstacleFrequency);
            }
        }
    }
}

async function saveScore(name, score) {
    const scoresRef = ref(db, 'scores');
    await push(scoresRef, { name, score: Number(score) });
    updateRankingDisplay();
}

async function updateRankingDisplay() {
    const scoresRef = ref(db, 'scores');
    const topScoresQuery = query(scoresRef, orderByChild('score'), limitToLast(10));
    const snapshot = await get(topScoresQuery);
    let scores = [];
    snapshot.forEach(child => {
        scores.push(child.val());
    });
    console.log('Ranking lido do Firebase:', scores);
    scores.sort((a, b) => b.score - a.score);
    rankingList.innerHTML = '';
    if (scores.length === 0) {
        rankingList.innerHTML = '<div style="text-align:center;color:#888;">Nenhum dado de ranking ainda.</div>';
    } else {
        scores.forEach((score, index) => {
            const rankingItem = document.createElement('div');
            rankingItem.className = 'ranking-item';
            rankingItem.innerHTML = `
                <span class="ranking-position">#${index + 1} ${score.name}</span>
                <span class="ranking-score">${score.score}</span>
            `;
            rankingList.appendChild(rankingItem);
        });
    }
}

function handleGameOver() {
    gameOver = true;
    saveScore(currentPlayer, player.score).then(() => {
        startMessage.textContent = 'Game Over! Pressione ESPAÇO para reiniciar';
        startMessage.classList.remove('hidden');
        setTimeout(() => {
            document.location.reload();
        }, 2000);
    });
}

function checkCollisions() {
    for (let obstacle of obstacles) {
        if (player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
            handleGameOver();
            return;
        }
    }
}

function drawPlayer() {
    ctx.save();
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);

    if (player.isJumping) {
        player.rotation = player.dy * 2;
    } else {
        player.rotation = 0;
    }
    ctx.rotate(player.rotation * Math.PI / 180);

    ctx.fillStyle = 'blue';
    ctx.fillRect(-player.width / 2, -player.height / 2, player.width, player.height);

    if (player.isJumping) {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(-player.width / 2, player.height / 2);
        ctx.lineTo(0, player.height / 2 + 15);
        ctx.lineTo(player.width / 2, player.height / 2);
        ctx.fill();
    }

    ctx.restore();
}

function drawObstacles() {
    ctx.fillStyle = 'red';
    for (let obstacle of obstacles) {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
}

function drawClouds() {
    ctx.fillStyle = 'white';
    for (let cloud of clouds) {
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, 20, 0, Math.PI * 2);
        ctx.arc(cloud.x - 15, cloud.y + 10, 15, 0, Math.PI * 2);
        ctx.arc(cloud.x + 15, cloud.y + 10, 15, 0, Math.PI * 2);
        ctx.fill();

        cloud.x -= cloud.speed;
        if (cloud.x < -60) {
            cloud.x = canvas.width + 60;
            cloud.y = Math.random() * 100;
        }
    }
}

function drawTrees() {
    for (let tree of trees) {

        ctx.fillStyle = '#8B4513';
        ctx.fillRect(tree.x, canvas.height - tree.height - 30, 20, tree.height);

        ctx.fillStyle = '#228B22';
        ctx.beginPath();
        ctx.moveTo(tree.x - 20, canvas.height - tree.height - 30);
        ctx.lineTo(tree.x + 40, canvas.height - tree.height - 30);
        ctx.lineTo(tree.x + 10, canvas.height - tree.height - 70);
        ctx.fill();

        tree.x -= 2;
        if (tree.x < -40) {
            tree.x = canvas.width + 40;
        }
    }
}

function updateScore() {
    document.getElementById('scoreDisplay').textContent = player.score;
}


startButton.addEventListener('click', () => {
    const name = playerNameInput.value.trim();
    if (name) {
        currentPlayer = name;
        playerForm.style.display = 'none';
        startGame();
    } else {
        alert('Por favor, digite seu nome para começar!');
    }
});

updateRankingDisplay();