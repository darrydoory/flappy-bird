const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");
const highScoreDisplay = document.getElementById("highScore");
const scoreDisplay = document.getElementById("scoreDisplay");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const birdImg = new Image();
birdImg.src = 'bird.png';

const pipeTopImg = new Image();
pipeTopImg.src = 'pipeTop.png';

const pipeBottomImg = new Image();
pipeBottomImg.src = 'pipeBottom.png';

const bird = { x: 50, y: 200, width: 70, height: 50, gravity: 0.6, lift: -12, velocity: 0 };
let pipes = [];
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameOver = false;
let gameStarted = false;
let pipeInterval;

function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function updateBird() {
    if (gameStarted) {
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;
        if (bird.y + bird.height > canvas.height || bird.y < 0) {
            gameOver = true;
        }
    }
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.drawImage(pipeTopImg, pipe.x, 0, pipe.width, pipe.topHeight);
        ctx.drawImage(pipeBottomImg, pipe.x, pipe.bottomY, pipe.width, canvas.height - pipe.bottomY);
    });
}

function addPipe() {
    let gap = 250;
    let minHeight = 50;
    let maxHeight = canvas.height - gap - minHeight;
    let topHeight = Math.floor(Math.random() * (maxHeight - minHeight) + minHeight);
    let bottomY = topHeight + gap;
    pipes.push({ x: canvas.width, width: 100, topHeight, bottomY });
}

function updatePipes() {
    pipes.forEach((pipe, index) => {
        pipe.x -= 4;
        if (pipe.x + pipe.width < 0) {
            pipes.splice(index, 1);
            score++;
            scoreDisplay.textContent = score;
        }
        if (
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.topHeight || bird.y + bird.height > pipe.bottomY)
        ) {
            gameOver = true;
        }
    });
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
    updateBird();
    updatePipes();

    if (gameOver) {
        clearInterval(pipeInterval);
        finalScore.textContent = score;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
        }
        highScoreDisplay.textContent = highScore;
        gameOverScreen.style.display = "block";
        return;
    }
    requestAnimationFrame(gameLoop);
}

function restartGame() {
    bird.y = 200;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    gameStarted = false;
    gameOverScreen.style.display = "none";
    scoreDisplay.textContent = 0;
    clearInterval(pipeInterval);
    gameLoop();
}

document.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
        if (!gameStarted) {
            gameStarted = true;
            pipeInterval = setInterval(addPipe, 2000);
        }
        bird.velocity = bird.lift;
    }
});

gameLoop();