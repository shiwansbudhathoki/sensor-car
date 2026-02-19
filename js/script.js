// Mobile menu (optional - can be expanded)
document.addEventListener('DOMContentLoaded', () => {

  // Quiz logic
  const quizContainer = document.querySelector('.quiz-container');
  if (quizContainer) {
    const questions = [
      {
        question: "Which sensor is most commonly used for obstacle detection in sensor cars?",
        options: ["IR sensor", "Ultrasonic sensor", "LDR", "Temperature sensor"],
        answer: 1
      },
      {
        question: "What does PWM stand for in motor control?",
        options: ["Pulse Width Modulation", "Power Wave Motion", "Pulse Wave Multiplier", "Power With Motor"],
        answer: 0
      },
      {
        question: "Line following robots usually use:",
        options: ["Ultrasonic sensors", "IR array / multiple IR sensors", "Gyroscope", "Barometer"],
        answer: 1
      },
      {
        question: "Which microcontroller is most popular for beginner sensor car projects?",
        options: ["Raspberry Pi", "ESP32", "Arduino Uno/Nano", "STM32"],
        answer: 2
      }
    ];

    let currentQuestion = 0;
    let score = 0;

    const questionEl = document.getElementById('question');
    const optionsEl = document.getElementById('options');
    const nextBtn = document.getElementById('next-btn');
    const resultEl = document.getElementById('result');

    function loadQuestion() {
      const q = questions[currentQuestion];
      questionEl.textContent = q.question;
      optionsEl.innerHTML = '';

      q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.textContent = option;
        btn.addEventListener('click', () => checkAnswer(index, btn));
        optionsEl.appendChild(btn);
      });

      nextBtn.style.display = 'none';
    }

    function checkAnswer(selected, button) {
      const correct = questions[currentQuestion].answer;

      if (selected === correct) {
        button.classList.add('correct');
        score++;
      } else {
        button.classList.add('wrong');
        optionsEl.children[correct].classList.add('correct');
      }

      // Disable all buttons
      [...optionsEl.children].forEach(btn => btn.disabled = true);
      nextBtn.style.display = 'block';
    }

    nextBtn.addEventListener('click', () => {
      currentQuestion++;
      if (currentQuestion < questions.length) {
        loadQuestion();
      } else {
        questionEl.textContent = "Quiz Completed!";
        optionsEl.innerHTML = '';
        resultEl.textContent = `Your score: ${score} / ${questions.length}`;
        nextBtn.style.display = 'none';
      }
    });

    // Start quiz
    loadQuestion();
  }

  // Simple car dodging game
  const canvas = document.getElementById('gameCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 600;

    let car = { x: 180, y: 480, width: 60, height: 100, speed: 5 };
    let obstacles = [];
    let score = 0;
    let gameOver = false;
    let keys = {};

    function spawnObstacle() {
      const x = Math.random() * (canvas.width - 60);
      obstacles.push({ x, y: -100, width: 60, height: 100 });
    }

    function update() {
      if (gameOver) return;

      // Player movement
      if (keys['ArrowLeft'] && car.x > 0) car.x -= car.speed;
      if (keys['ArrowRight'] && car.x < canvas.width - car.width) car.x += car.speed;

      // Obstacles movement
      obstacles.forEach((obs, i) => {
        obs.y += 4;

        // Collision detection
        if (
          car.x < obs.x + obs.width &&
          car.x + car.width > obs.x &&
          car.y < obs.y + obs.height &&
          car.y + car.height > obs.y
        ) {
          gameOver = true;
        }

        // Remove passed obstacles
        if (obs.y > canvas.height) {
          obstacles.splice(i, 1);
          score++;
        }
      });

      // Spawn new obstacle
      if (Math.random() < 0.02) spawnObstacle();
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw road
      ctx.fillStyle = '#555';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      for (let i = 0; i < canvas.height; i += 80) {
        ctx.fillRect(canvas.width/2 - 10, i, 20, 40);
      }

      // Draw player car
      ctx.fillStyle = '#ff3366';
      ctx.fillRect(car.x, car.y, car.width, car.height);

      // Draw obstacles
      ctx.fillStyle = '#33cc33';
      obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      });

      // Score
      ctx.fillStyle = 'white';
      ctx.font = '24px Arial';
      ctx.fillText(`Score: ${score}`, 20, 40);

      if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = '48px Arial';
        ctx.fillText('GAME OVER', 50, canvas.height/2);
        ctx.font = '24px Arial';
        ctx.fillText(`Final Score: ${score}`, 110, canvas.height/2 + 60);
      }
    }

    function gameLoop() {
      update();
      draw();
      requestAnimationFrame(gameLoop);
    }

    window.addEventListener('keydown', e => keys[e.key] = true);
    window.addEventListener('keyup', e => keys[e.key] = false);

    // Start spawning
    setInterval(() => {
      if (!gameOver) spawnObstacle();
    }, 1800);

    gameLoop();
  }
});