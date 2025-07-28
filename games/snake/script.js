document.addEventListener('DOMContentLoaded', () => {
   const canvas = document.getElementById('gameCanvas');
   const ctx = canvas.getContext('2d');
   const scoreElement = document.getElementById('score');
   const restartButton = document.getElementById('restart-button');

   const gridSize = 20;
   let snake = [];
   let food = {};
   let direction = '';
   let score = 0;
   let gameOver = false;
   let gameInterval = null;
   let gameStarted = false;

   function main() {
      if (gameOver) {
         ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
         ctx.fillRect(0, 0, canvas.width, canvas.height);
         ctx.fillStyle = 'white';
         ctx.font = '40px Poppins, sans-serif';
         ctx.textAlign = 'center';
         ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 20);
         restartButton.style.display = 'block';
         clearInterval(gameInterval);
         gameStarted = false;
         return;
      }

      update();
      draw();
   }

   function update() {
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

      ctx.fillStyle = '#0f0';
      snake.forEach(segment => {
         ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
      });

      ctx.fillStyle = '#f00';
      ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
   }

   function generateFood() {
      food = {
         x: Math.floor(Math.random() * (canvas.width / gridSize)),
         y: Math.floor(Math.random() * (canvas.height / gridSize))
      };

      for (const segment of snake) {
         if (segment.x === food.x && segment.y === food.y) {
            generateFood();
            return;
         }
      }
   }

   function handleKeyPress(event) {
      const keyPressed = event.key;

      if (keyPressed === ' ' && !gameStarted) {
         startGame();
         return;
      }

      if (!gameStarted) {
         return;
      }

      const goingUp = direction === 'up';
      const goingDown = direction === 'down';
      const goingLeft = direction === 'left';
      const goingRight = direction === 'right';

      if ((keyPressed === 'ArrowUp' || keyPressed.toLowerCase() === 'w') && !goingDown) { direction = 'up'; }
      if ((keyPressed === 'ArrowDown' || keyPressed.toLowerCase() === 's') && !goingUp) { direction = 'down'; }
      if ((keyPressed === 'ArrowLeft' || keyPressed.toLowerCase() === 'a') && !goingRight) { direction = 'left'; }
      if ((keyPressed === 'ArrowRight' || keyPressed.toLowerCase() === 'd') && !goingLeft) { direction = 'right'; }
   }

   function startGame() {
      gameStarted = true;
      snake = [{ x: 10, y: 10 }];
      direction = 'right';
      score = 0;
      scoreElement.textContent = score;
      gameOver = false;
      restartButton.style.display = 'none';
      generateFood();
      if (gameInterval) clearInterval(gameInterval);
      gameInterval = setInterval(main, 150);
   }

   function showInitialScreen() {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.font = '22px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Pressione Espaço para Iniciar', canvas.width / 2, canvas.height / 2);
   }

   document.addEventListener('keydown', handleKeyPress);
   restartButton.addEventListener('click', startGame);

   showInitialScreen();
});