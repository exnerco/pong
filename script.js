// Find canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// Font Settings
const lato = new FontFace("Lato", "url(https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh6UVSwiPGQ.woff2)");
lato.load().then((font) => {
    document.fonts.add(font);
});

// Audio Settings
const hitPlayer = document.getElementById('ballhit');
const losePlayer = document.getElementById('lose');
const selectPlayer = document.getElementById('select');
hitPlayer.loop = false;
losePlayer.loop = false;
selectPlayer.loop = false;


// Paddle Settings
const paddleWidth = 10;
const paddleHeight = 60;
const paddleSpeed = 5;

// Ball Settings
const ballRadius = paddleWidth;
const ballSpeed = paddleSpeed * 1.12;

// Point settings
var playerOneScore = 0;
var playerTwoScore = 0;

// START CODING //

// Ball Properties
var ballX = canvas.width / 2;
var ballY = canvas.height / 2;
var ballSpeedX = ballSpeed; 
var ballSpeedY = ballSpeed; 

// Player Paddle Properties
const paddleOneX = 20;
var paddleOneY = canvas.height / 2 - paddleHeight / 2;

const paddleTwoX = canvas.width - paddleWidth - paddleOneX;
var paddleTwoY = canvas.height - paddleWidth;

// Input Properties
var wordedOffset = 0;
var arrowedOffset = 0;


// Render all of our objects
function render() {
    // Render Player Paddles
    renderPaddle(paddleOneX, paddleOneY, paddleWidth, paddleHeight); // Player 1
    renderPaddle(paddleTwoX, paddleTwoY, paddleWidth, paddleHeight); // Player 2

    // Render Ball
    renderBall();

    // Render scores
    renderScores();
}

// Unrender all of our objects
function unRender() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Render Paddles
function renderPaddle(x, y, w, h) {
    ctx.fillStyle = window.getComputedStyle(canvas).color; 
    ctx.fillRect(x, y, w, h);
}

// Render Ball
function renderBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = window.getComputedStyle(canvas).color;
    ctx.fill();
    ctx.closePath();
}

// Render scores
function renderScores() {
    ctx.font = '24px Lato';
    ctx.fillStyle = window.getComputedStyle(canvas).color;
    ctx.fillText(playerOneScore, canvas.width / 2 - 20, 40);
    ctx.fillText(playerTwoScore, canvas.width / 2 + 20, 40);
}
  
// Event Listeners
document.addEventListener('keydown', keydown);
document.addEventListener('keyup', keyup);

// Fixed Update
function fixedUpdate() {
    move();
    scoring();
}

// Function responsible for moving
function move() {
    // Paddles
    paddleOneY -= wordedOffset;
    paddleTwoY -= arrowedOffset; 

    // Ball
    // Update ball position
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Check collision with walls
    if (ballY + ballRadius >= canvas.height || ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY; // Reverse vertical speed
        playSound(hitPlayer);
    }

    // Check collision with paddles
    if (
        ballX + ballRadius >= paddleTwoX &&
        ballY + ballRadius >= paddleTwoY &&
        ballY - ballRadius <= paddleTwoY + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX; // Reverse horizontal speed
        playSound(hitPlayer);
    }
    if (
        ballX - ballRadius <= paddleOneX + paddleWidth &&
        ballY + ballRadius >= paddleOneY &&
        ballY - ballRadius <= paddleOneY + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX; // Reverse horizontal speed
        playSound(hitPlayer);
    }
}

// Function responsible for triggering stuff when key is pressed
function keydown(event) {
    // Player 1
    if (event.keyCode === 87 && event.keyCode !== 83) {
        if (paddleOneY >= 0) wordedOffset = paddleSpeed;
    }
    else if (event.keyCode === 83 && event.keyCode !== 87) {
        if (paddleOneY <= canvas.height - paddleHeight) wordedOffset = -paddleSpeed;
    }

    // Player 2
    if (event.keyCode === 38 && event.keyCode !== 40) {
        if (paddleTwoY >= 0) arrowedOffset = paddleSpeed;
    }
    else if (event.keyCode === 40 && event.keyCode !== 38) {
        if (paddleTwoY <= canvas.height - paddleHeight) arrowedOffset = -paddleSpeed;
    }
}

// Function responsible for triggering stuff when key is released
function keyup(event) {
    // Player 1
    if (event.keyCode === 87 || event.keyCode === 83) {
        wordedOffset = 0;
    }

    // Player 2
    else if (event.keyCode === 38 || event.keyCode == 40) {
        arrowedOffset = 0;
    }
}

// Add boundaries 
function boundaries() {
    // Player 1
    if (paddleOneY < 0) {
        wordedOffset = 0
        paddleOneY = 0;
    }
    if (paddleOneY > canvas.height - paddleHeight) {
        wordedOffset = 0;
        paddleOneY = canvas.height - paddleHeight;
    }

    // Player 2
    if (paddleTwoY < 0) {
        arrowedOffset = 0;
        paddleTwoY = 0;
    }

    if (paddleTwoY > canvas.height - paddleHeight) {
        arrowedOffset = 0;
        paddleTwoY = canvas.height - paddleHeight;
    }
}

// Function to play sound
function playSound(player) {
    player.pause();
    player.currentTime = 0;
    player.play();
}

// Score system
function scoring() {
    // Player 1
    if (ballX + ballRadius > canvas.width) {
      playerOneScore++;
      resetGame(true);
    }
    // Player 2
    else if (ballX - ballRadius < 0) {
      playerTwoScore++;
      resetGame(false);
    }
}

// Reset the game
function resetGame(isPlayer1) {
    playSound(losePlayer);
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    if(!isPlayer1) ballSpeedX = ballSpeed;
    else ballSpeedX = -ballSpeed;
    ballSpeedY = ballSpeed;
    if (!isPlayer1) {
        paddleOneY = canvas.height / 2 - paddleHeight / 2;
        paddleTwoY = canvas.height - paddleHeight;
    }
    else {
        paddleOneY = canvas.height - paddleHeight;
        paddleTwoY = canvas.height / 2 - paddleHeight / 2;
    }
}

// It's self explanitory
const gameLoop = function() {
    unRender();
    render();
    boundaries();
    fixedUpdate();
    requestAnimationFrame(gameLoop);
}

window.onload = gameLoop();