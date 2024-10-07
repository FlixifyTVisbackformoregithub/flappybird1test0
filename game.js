const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game Variables
let bird = { x: 50, y: 150, width: 20, height: 20, gravity: 0.6, lift: -12, velocity: 0 };
let pipes = [];
let frame = 0;
let score = 0;
let gameOver = false;

// Event Listener for Key Press
document.addEventListener("keydown", function (event) {
    if (event.code === "Space" && !gameOver) {
        bird.velocity += bird.lift;
    } else if (event.code === "Space" && gameOver) {
        resetGame();
    }
});

// Function to Reset Game
function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    frame = 0;
    score = 0;
    gameOver = false;
}

// Function to Create Pipes
function createPipes() {
    if (frame % 90 === 0) {
        let height = Math.random() * (canvas.height / 2);
        pipes.push({ x: canvas.width, y: height, width: 50, heightBottom: canvas.height - height - 150 });
    }
}

// Function for Collision Detection
function detectCollision(pipe) {
    if (bird.x + bird.width > pipe.x && bird.x < pipe.x + pipe.width) {
        if (bird.y < pipe.y || bird.y + bird.height > pipe.y + pipe.heightBottom) {
            return true;
        }
    }
    return false;
}

// Function to Update Game
function updateGame() {
    // Gravity
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
    
    // Push Pipes
    if (!gameOver) {
        createPipes();

        // Remove Off-screen Pipes and Track Score
        for (let i = pipes.length - 1; i >= 0; i--) {
            pipes[i].x -= 3; // Move pipes to the left
            if (pipes[i].x + pipes[i].width < 0) {
                pipes.splice(i, 1);
                score++;
            } else if (detectCollision(pipes[i])) {
                gameOver = true;
            }
        }
    }

    // Check for Ground Collision
    if (bird.y + bird.height >= canvas.height || bird.y < 0) {
        gameOver = true;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the Bird
    ctx.fillStyle = "#ff0"; // Bird color
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    // Draw the Pipes
    ctx.fillStyle = "#0f0"; // Pipe color
    for (let pipe of pipes) {
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.y);
        ctx.fillRect(pipe.x, pipe.y + pipe.heightBottom, pipe.width, canvas.height - pipe.y - pipe.heightBottom);
    }

    // Show Score
    ctx.fillStyle = "#000"; // Score color
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);

    // Show Game Over
    if (gameOver) {
        ctx.fillText("Game Over! Press Space to Restart.", 30, canvas.height / 2);
    } else {
        frame++;
        requestAnimationFrame(updateGame);
    }
}

// Start the Game
updateGame();
