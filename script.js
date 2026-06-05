const hitSound = new Audio("sounds/hit.wav");
const scoreSound = new Audio("sounds/score.wav");
const winSound = new Audio("sounds/win.wav");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const scoreBoard = document.getElementById("scoreBoard");

const player1ScoreEl =
document.getElementById("player1Score");

const player2ScoreEl =
document.getElementById("player2Score");

const countdownOverlay =
document.getElementById("countdownOverlay");

const pauseOverlay =
document.getElementById("pauseOverlay");

const winnerOverlay =
document.getElementById("winnerOverlay");

const winnerText =
document.getElementById("winnerText");

let gameMode = "single";
let aiSpeed = 5;

let gameRunning = false;
let paused = false;
let gameOver = false;

const WINNING_SCORE = 5;

const paddleWidth = 15;
const paddleHeight = 100;

const keys = {};

let player1 = {
    x:20,
    y:250,
    score:0
};

let player2 = {
    x:canvas.width - 35,
    y:250,
    score:0
};

let ball = {
    x:canvas.width/2,
    y:canvas.height/2,
    radius:10,
    dx:5,
    dy:5
};

/* ---------------- MODE ---------------- */

document
.getElementById("singlePlayer")
.onclick = () => {

    gameMode = "single";

    alert("Single Player Selected");
};

document
.getElementById("twoPlayer")
.onclick = () => {

    gameMode = "multi";

    alert("Two Player Selected");
};

/* ---------------- START GAME ---------------- */

document
.getElementById("startGame")
.onclick = () => {

    aiSpeed = parseInt(
        document.getElementById("difficulty").value
    );

    menu.style.display = "none";

    canvas.style.display = "block";

    scoreBoard.style.display = "flex";

    document.getElementById(
        "gameControls"
    ).style.display = "block";

    startCountdown();
};

/* ---------------- COUNTDOWN ---------------- */

function startCountdown(){

    let count = 3;

    countdownOverlay.style.display = "flex";

    countdownOverlay.innerHTML = count;

    let interval = setInterval(()=>{

        count--;

        if(count > 0){

            countdownOverlay.innerHTML = count;
        }

        else if(count === 0){

            countdownOverlay.innerHTML = "GO!";
        }

        else{

            clearInterval(interval);

            countdownOverlay.style.display =
            "none";

            gameRunning = true;

            gameLoop();
        }

    },1000);
}

/* ---------------- KEYBOARD ---------------- */

document.addEventListener(
"keydown",
(e)=>{

    keys[e.key.toLowerCase()] = true;

    if(e.key.toLowerCase()==="p"){

        paused = true;

        pauseOverlay.style.display =
        "flex";
    }

    if(e.key.toLowerCase()==="r"){

        paused = false;

        pauseOverlay.style.display =
        "none";

        if(gameOver){

            restartGame();
        }
    }

    if(e.key==="Escape"){

        backToMenu();
    }
});

document.addEventListener(
"keyup",
(e)=>{

    keys[e.key.toLowerCase()] = false;
});

/* ---------------- BUTTONS ---------------- */

document
.getElementById("restartBtn")
.onclick = restartGame;

document
.getElementById("playAgainBtn")
.onclick = restartGame;

document
.getElementById("mainMenuBtn")
.onclick = backToMenu;

document
.getElementById("winnerMenuBtn")
.onclick = backToMenu;

document
.getElementById("fullscreenBtn")
.onclick = ()=>{

    document.documentElement
    .requestFullscreen();
};

/* ---------------- DRAW ---------------- */

function drawPaddle(x,y){

    ctx.fillStyle = "cyan";

    ctx.shadowColor = "cyan";

    ctx.shadowBlur = 20;

    ctx.fillRect(
        x,
        y,
        paddleWidth,
        paddleHeight
    );

    ctx.shadowBlur = 0;
}

function drawBall(){

    ctx.beginPath();

    ctx.arc(
        ball.x,
        ball.y,
        ball.radius,
        0,
        Math.PI*2
    );

    ctx.fillStyle = "white";

    ctx.shadowColor = "white";

    ctx.shadowBlur = 20;

    ctx.fill();

    ctx.closePath();

    ctx.shadowBlur = 0;
}

function drawCenterLine(){

    for(
        let i=0;
        i<canvas.height;
        i+=30
    ){

        ctx.fillStyle = "#555";

        ctx.fillRect(
            canvas.width/2 - 2,
            i,
            4,
            20
        );
    }
}

function draw(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawCenterLine();

    drawPaddle(
        player1.x,
        player1.y
    );

    drawPaddle(
        player2.x,
        player2.y
    );

    drawBall();
}

/* ---------------- MOVE PADDLES ---------------- */

function movePaddles(){

    if(keys["w"] &&
       player1.y > 0){

        player1.y -= 8;
    }

    if(keys["s"] &&
       player1.y + paddleHeight <
       canvas.height){

        player1.y += 8;
    }

    if(gameMode === "multi"){

        if(keys["arrowup"] &&
           player2.y > 0){

            player2.y -= 8;
        }

        if(keys["arrowdown"] &&
           player2.y + paddleHeight <
           canvas.height){

            player2.y += 8;
        }
    }

    else{

        if(ball.y >
           player2.y +
           paddleHeight/2){

            player2.y += aiSpeed;
        }

        else{

            player2.y -= aiSpeed;
        }
    }
}

/* ---------------- BALL ---------------- */

function moveBall(){

    ball.x += ball.dx;

    ball.y += ball.dy;

    if(
        ball.y + ball.radius >
        canvas.height ||

        ball.y - ball.radius < 0
    ){

        ball.dy *= -1;
    }

    if(
        ball.x - ball.radius <
        player1.x + paddleWidth &&

        ball.y > player1.y &&

        ball.y <
        player1.y + paddleHeight
    ){

        ball.dx *= -1.05;
        hitSound.currentTime = 0;
        hitSound.play();
    }

    if(
        ball.x + ball.radius >
        player2.x &&

        ball.y > player2.y &&

        ball.y <
        player2.y + paddleHeight
    ){

        ball.dx *= -1.05;
        hitSound.currentTime = 0;
        hitSound.play();
    }

    if(ball.x < 0){
        player2.score++;

        scoreSound.currentTime = 0;
        scoreSound.play();

        updateScore();

        resetBall();

  
    }

    if(ball.x > canvas.width){

        player1.score++;

        scoreSound.currentTime = 0;
        scoreSound.play();

        updateScore();

        resetBall();
    }

    checkWinner();
}

/* ---------------- SCORE ---------------- */

function updateScore(){

    player1ScoreEl.innerHTML =
    player1.score;

    player2ScoreEl.innerHTML =
    player2.score;
}

/* ---------------- WINNER ---------------- */

function checkWinner(){

    if(player1.score >=
       WINNING_SCORE){

        gameOver = true;
        winSound.currentTime = 0;
        winSound.play();

        winnerText.innerHTML =
        "🏆 PLAYER 1 WINS";

        winnerOverlay.style.display =
        "flex";
    }

    if(player2.score >=
       WINNING_SCORE){

        gameOver = true;
        winSound.currentTime = 0;
        winSound.play();

        winnerText.innerHTML =
        "🏆 PLAYER 2 WINS";

        winnerOverlay.style.display =
        "flex";
    }
}

/* ---------------- RESET ---------------- */

function resetBall(){

    ball.x =
    canvas.width/2;

    ball.y =
    canvas.height/2;

    ball.dx =
    5 * (
    Math.random() > .5
    ? 1
    : -1
    );

    ball.dy = 5;
}

function restartGame(){

    player1.score = 0;
    player2.score = 0;

    player1.y = 250;
    player2.y = 250;

    updateScore();

    gameOver = false;

    winnerOverlay.style.display =
    "none";

    resetBall();
}

function backToMenu(){

    gameRunning = false;

    paused = false;

    gameOver = false;

    menu.style.display = "block";

    canvas.style.display = "none";

    scoreBoard.style.display = "none";

    document.getElementById(
        "gameControls"
    ).style.display = "none";

    pauseOverlay.style.display =
    "none";

    winnerOverlay.style.display =
    "none";

    restartGame();
}

/* ---------------- LOOP ---------------- */

function gameLoop(){

    if(!gameRunning){
        return;
    }

    if(!paused && !gameOver){

        movePaddles();

        moveBall();

        draw();
    }

    requestAnimationFrame(
        gameLoop
    );
}