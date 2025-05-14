const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


let birdX = 50;
let birdY = 200;
let birdVelocity = 0;
const gravity = 0.5;
const flapStrength = -10;
let pipeArray = [];
let score = 0;
let gameInterval;


const pipeWidth = 50;
const pipeGap = 150;
const minPipeHeight = 50;


const birdImg = new Image();
birdImg.src = 'bird.png'; 
const topPipeImg = new Image();
topPipeImg.src = 'pipe_top.png'; 
const bottomPipeImg = new Image();
bottomPipeImg.src = 'pipe_bottom.png';

function startGame() {
    birdX = 50;
    birdY = 200;
    birdVelocity = 0;
    pipeArray = [];
    score = 0;
    clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, 20); 
}

function updateGame() {
   
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    birdVelocity += gravity;
    birdY += birdVelocity;

    
    ctx.drawImage(birdImg, birdX, birdY, 30, 30);


    if (pipeArray.length === 0 || pipeArray[pipeArray.length - 1].x < canvas.width - 200) {
        addPipe();
    }


    for (let i = 0; i < pipeArray.length; i++) {
        pipeArray[i].x -= 2; 

        
        ctx.drawImage(topPipeImg, pipeArray[i].x, 0, pipeWidth, pipeArray[i].topHeight);

        
        ctx.drawImage(bottomPipeImg, pipeArray[i].x, pipeArray[i].bottomY, pipeWidth, canvas.height - pipeArray[i].bottomY);

    
        if (
            birdX < pipeArray[i].x + pipeWidth &&
            birdX + 30 > pipeArray[i].x &&
            (birdY < pipeArray[i].topHeight || birdY + 30 > pipeArray[i].bottomY)
        ) {
            gameOver();
            return;
        }


        if (pipeArray[i].x + pipeWidth < birdX && !pipeArray[i].counted) {
            score++;
            pipeArray[i].counted = true;
        }
    }


    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 20);

    if (birdY < 0 || birdY + 30 > canvas.height) {
        gameOver();
    }

    
}

function addPipe() {
    const topHeight = Math.floor(Math.random() * (canvas.height / 2 - minPipeHeight)) + minPipeHeight;
    const bottomY = topHeight + pipeGap;
    pipeArray.push({
        x: canvas.width,
        topHeight: topHeight,
        bottomY: bottomY,
        counted: false
    });
}

function flap() {
    birdVelocity = flapStrength;
}

function gameOver() {
    clearInterval(gameInterval);
    ctx.fillStyle = 'red';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2 - 15);
    ctx.font = '16px Arial';
    ctx.fillText('Clique ou toque para reiniciar', canvas.width / 2 - 120, canvas.height / 2 + 15);
    canvas.addEventListener('click', startGame);
    canvas.addEventListener('touchstart', startGame);
}

// Event listeners para controlar o pássaro
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        flap();
    }
});
canvas.addEventListener('click', flap);
canvas.addEventListener('touchstart', flap);

// Inicia o jogo
startGame();