const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
const bird = {
    x: 50,
    y: 150,
    radius: 10,
    gravity: 0.3,
    lift: -5,
    velocity: 0
};

const pipes = [];
const pipeWidth = 40;
const pipeGap = 120;
let frameCount = 0;
let score = 0;

// Event listener for bird jump
document.addEventListener('keydown', () => {
    bird.velocity = bird.lift;
});

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bird
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.closePath();

    // Bird physics
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Prevent bird from falling out of canvas
    if (bird.y + bird.radius > canvas.height) {
        bird.y = canvas.height - bird.radius;
        bird.velocity = 0;
    }

    // Create pipes
    if (frameCount % 90 === 0) {
        const pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
        pipes.push({
            x: canvas.width,
            y: 0,
            width: pipeWidth,
            height: pipeHeight
        });
        pipes.push({
            x: canvas.width,
            y: pipeHeight + pipeGap,
            width: pipeWidth,
            height: canvas.height - pipeHeight - pipeGap
        });
    }

   // Draw and move pipes
pipes.forEach((pipe, index) => {
    ctx.fillStyle = 'green';
    ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
    pipe.x -= 2;

    // Check for collision
    if (bird.x - bird.radius < pipe.x + pipe.width &&
        bird.x + bird.radius > pipe.x &&
        bird.y - bird.radius < pipe.y + pipe.height &&
        bird.y + bird.radius > pipe.y) {
        resetGame();
    }

    // Remove off-screen pipes and increment score
    if (pipe.x + pipe.width < 0) {
        pipes.splice(index, 1);
        if (index % 2 === 1) { // Increment score only for the bottom pipe
            score++;
        }
    }
});

    // Display score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);

    frameCount++;
    requestAnimationFrame(gameLoop);
}

// Reset game
function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    frameCount = 0;
}

// Start game
resetGame();
gameLoop();  