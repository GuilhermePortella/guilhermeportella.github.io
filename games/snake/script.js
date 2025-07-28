document.addEventListener('DOMContentLoaded', () => {
   const canvas = document.getElementById('gameCanvas');
   const ctx = canvas.getContext('2d');
   const scoreElement = document.getElementById('score');
   const restartButton = document.getElementById('restart-button');
   const nameModal = document.getElementById('name-modal');
   const playerNameInput = document.getElementById('playerNameInput');
   const startGameButton = document.getElementById('start-game-button');
   const leaderboardList = document.getElementById('leaderboard-list');

   const gridSize = 20;
   let snake = [];
   let food = {};
   let direction = '';
   let nextDirection = '';
   let playerName = '';
   let score = 0;
   let gameOver = false;
   let gameInterval = null;
   let gameStarted = false;

   const firebaseConfig = {
      apiKey: "AIzaSyBGwL4mcZXQd4p089oXJFOWMQPSMwrKhCc",
      authDomain: "snake-42dd0.firebaseapp.com",
      databaseURL: "https://snake-42dd0-default-rtdb.firebaseio.com",
      projectId: "snake-42dd0",
      storageBucket: "snake-42dd0.firebasestorage.app",
      messagingSenderId: "779170410632",
      appId: "1:779170410632:web:6d18d36ebd84f16e296f3d",
      measurementId: "G-9XPR7SDP6N"
   };

   firebase.initializeApp(firebaseConfig);
   const database = firebase.database();

   function main() {
      if (gameOver) {
         if (gameStarted) {
            saveScoreToFirebase(playerName, score);
            gameStarted = false;
         }
         ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
         ctx.fillRect(0, 0, canvas.width, canvas.height);
         ctx.fillStyle = 'white';
         ctx.font = '40px Poppins, sans-serif';
         ctx.textAlign = 'center';
         ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 20);
         restartButton.style.display = 'block';
         clearInterval(gameInterval);
         return;
      }

      update();
      draw();
   }

   function update() {
      direction = nextDirection;

      const head = { ...snake[0] };

      switch (direction) {
         case 'up': head.y--; break;
         case 'down': head.y++; break;
         case 'left': head.x--; break;
         case 'right': head.x++; break;
      }

      if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize) {
         gameOver = true;
         return;
      }

      for (let i = 1; i < snake.length; i++) {
         if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
            return;
         }
      }

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
         score++;
         scoreElement.textContent = score;
         generateFood();
      } else {
         snake.pop();
      }
   }

   function draw() {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00aaff';
      snake.forEach(segment => {
         ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
      });

      ctx.fillStyle = '#f00';
      ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
   }

   function generateFood() {
      let foodIsOnSnake;
      do {
         foodIsOnSnake = false;
         food = {
            x: Math.floor(Math.random() * (canvas.width / gridSize)),
            y: Math.floor(Math.random() * (canvas.height / gridSize))
         };
         for (const segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
               foodIsOnSnake = true;
               break;
            }
         }
      } while (foodIsOnSnake);
   }

   function handleKeyPress(event) {
      const keyPressed = event.key;

      if (nameModal.style.display !== 'none') {
         return;
      }
      if (!gameStarted || gameOver) {
         return;
      }

      const goingUp = direction === 'up';
      const goingDown = direction === 'down';
      const goingLeft = direction === 'left';
      const goingRight = direction === 'right';

      if ((keyPressed === 'ArrowUp' || keyPressed.toLowerCase() === 'w') && !goingDown) { nextDirection = 'up'; }
      if ((keyPressed === 'ArrowDown' || keyPressed.toLowerCase() === 's') && !goingUp) { nextDirection = 'down'; }
      if ((keyPressed === 'ArrowLeft' || keyPressed.toLowerCase() === 'a') && !goingRight) { nextDirection = 'left'; }
      if ((keyPressed === 'ArrowRight' || keyPressed.toLowerCase() === 'd') && !goingLeft) { nextDirection = 'right'; }
   }

   function startGame() {
      nameModal.style.display = 'none';
      gameStarted = true;
      snake = [{ x: 10, y: 10 }];
      direction = 'right';
      nextDirection = 'right';
      score = 0;
      scoreElement.textContent = score;
      gameOver = false;
      restartButton.style.display = 'none';
      generateFood();
      if (gameInterval) clearInterval(gameInterval);
      gameInterval = setInterval(main, 150);
   }

   function saveScoreToFirebase(name, score) {
      if (!name || score === 0) return;
      const newScoreRef = database.ref('snake_scores').push();
      newScoreRef.set({
         name: name,
         score: score
      });
   }

   function loadLeaderboard() {
      const scoresRef = database.ref('snake_scores').orderByChild('score').limitToLast(10);
      scoresRef.on('value', (snapshot) => {
         leaderboardList.innerHTML = '';
         const scores = [];
         snapshot.forEach((childSnapshot) => {
            scores.push(childSnapshot.val());
         });
         scores.reverse().forEach((scoreData) => {
            const li = document.createElement('li');
            li.textContent = `${scoreData.name}: ${scoreData.score}`;
            leaderboardList.appendChild(li);
         });
      });
   }

   document.addEventListener('keydown', handleKeyPress);

   restartButton.addEventListener('click', () => {
      restartButton.style.display = 'none';
      nameModal.style.display = 'flex';
   });

   startGameButton.addEventListener('click', () => {
      playerName = playerNameInput.value.trim() || 'Anônimo';
      if (playerName.length > 12) {
         playerName = playerName.substring(0, 12);
      }
      startGame();
   });

   playerNameInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
         event.preventDefault(); 
         startGameButton.click();
      }
   });

   loadLeaderboard();
});