const CELL_SIZE = 20;
const CANVAS_SIZE = 400;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
const DIRECTION = {
    LEFT: 0,
    RIGHT: 1,
    UP: 2,
    DOWN: 3,
}

var MOVE_INTERVAL = 150;
let level = 1;
let life = 3;
let score = 0;

// gambar hati
let gambarHati = new Image();
gambarHati.src = "./Asset/hati.png";

function initPosition() {
    return {
        x: Math.floor(Math.random() * WIDTH),
        y: Math.floor(Math.random() * HEIGHT),
    }
}

function initHeadAndBody() {
    let head = initPosition();
    let body = [{x: head.x, y: head.y}];
    return {
        head: head,
        body: body,
    }
}

// audio eat
let audioEat = new Audio();
audioEat.src = "./Asset/makan.mp3";

// audio loose
let audioLoose = new Audio();
audioLoose.src = "./Asset/lose.mp3";

function initDirection() {
    return Math.floor(Math.random() * 4);
}

function initSnake(color) {
    return {
        color: color,
        ...initHeadAndBody(),
        direction: initDirection(),
    }
}
let snake1 = initSnake();

//tambah apple
let apples = [{
    color: "red",
    position: initPosition(),
},
{
    color: "green",
    position: initPosition(),
}]

//tambah nyawa
let hearts = [{
    color: "pink",
    appear: false,
    position: initPosition(),
}]

function updateHeart(){
    let lifeElement = document.getElementById('nyawa');
	lifeElement.innerHTML = '';
	for (var i = 0; i < life; i++) {
		let node = document.createElement('IMG');
		node.src = './Asset/hati.png';
		lifeElement.appendChild(node);

	}
}

function drawCell(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawImagePixel(ctx, x, y, img) {
	ctx.drawImage(img, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function drawScore(snake) {
    let scoreCanvas;
    if (snake.color == snake1.color) {
        scoreCanvas = document.getElementById("score1Board");
    } else {
        scoreCanvas = document.getElementById("score2Board");
    }
    let scoreCtx = scoreCanvas.getContext("2d");

    scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    scoreCtx.font = "18px Arial";
    scoreCtx.fillStyle = snake.color
    scoreCtx.fillText(score, 1, scoreCanvas.scrollHeight / 1);
}

// fungsi leveling
// default kecepatan adalah 150 dan akan berkurang 30 seiring bertambah level
function leveling(){
    if(score % 5 === 0){
        MOVE_INTERVAL = MOVE_INTERVAL - 30;
        level = level + 1;
        console.log("level :" + level)

        // update level
        let teksLevel;
        teksLevel = document.getElementById("level");
        teksLevel.innerText = level;
        
        // update speed
        let teksSpeed;
        teksSpeed = document.getElementById("kecepatan");
        teksSpeed.innerText = MOVE_INTERVAL;
    }
}

function draw() {
    setInterval(function() {
        let snakeCanvas = document.getElementById("snakeBoard");
        let ctx = snakeCanvas.getContext("2d");

        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        
        // kepala
        var imgKepala = document.getElementById("kepala");
        drawImagePixel(ctx, snake1.head.x, snake1.head.y, imgKepala);
        //memanjangakan badan
        for (let i = 1; i < snake1.body.length; i++) {
            var imgBadan = document.getElementById("body");
            drawImagePixel(ctx, snake1.body[i].x, snake1.body[i].y, imgBadan);
        }

        //apple
        for (let i = 0; i < apples.length; i++) {
            let apple = apples[i];

            // DrawImage apple dan gunakan image id:
            var img = document.getElementById("apple");
            ctx.drawImage(img, apple.position.x * CELL_SIZE, apple.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }

        //hati
    if (hearts.appear){
        for(let i = 0; i < hearts.length; i++){
            let heart = hearts[i];

            var img1 = document.getElementById("heart");
            ctx.drawImage(img1, heart.position.x * CELL_SIZE, heart.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE); 
            }
        }

        drawScore(snake1);
    }, REDRAW_INTERVAL);
}

function teleport(snake) {
    if (snake.head.x < 0) {
        snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.x >= WIDTH) {
        snake.head.x = 0;
    }
    if (snake.head.y < 0) {
        snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
    }
    if (snake.head.y >= HEIGHT) {
        snake.head.y = 0;
    }
}

function eat(snake, apples,hearts) {
    for (let i = 0; i < apples.length; i++) {
        let apple = apples[i];
        if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
            audioEat.play();
            apple.position = initPosition();
            score++;
            leveling();
            snake.body.push({x: snake.head.x, y: snake.head.y});
            hearts.appear = primeNumber(score);
		    console.log(hearts.appear);
		    hearts.position = initPosition();
        }
    }
    //nambah makan hati 1 
    for (let i = 0; i < hearts.length; i++) {
        let heart = hearts[i];
        if (snake.head.x == heart.position.x && snake.head.y == heart.position.y) {
            audioEat.play();
            heart.position = initPosition();
            life++;
            updateHeart();
        }
    }
}

//bilangan prima
function primeNumber(score){
    if (score == 1){
        return false;
    }

    for (let i = 2; i < score; i++) {
		if (score % i == 0) {
			return false;
		}
	}
	return true;
} 


function moveLeft(snake) {
    snake.head.x--;
    teleport(snake);
    eat(snake, apples,hearts);
    //leveling(snake);
}

function moveRight(snake) {
    snake.head.x++;
    teleport(snake);
    eat(snake, apples,hearts);
    //leveling(snake);
}

function moveDown(snake) {
    snake.head.y++;
    teleport(snake);
    eat(snake, apples,hearts);
    //leveling(snake);
}

function moveUp(snake) {
    snake.head.y--;
    teleport(snake);
    eat(snake, apples,hearts);
    //leveling(snake);
}

function checkCollision(snakes) {
    let isCollide = false;
    //this
    for (let i = 0; i < snakes.length; i++) {
        for (let j = 0; j < snakes.length; j++) {
            for (let k = 1; k < snakes[j].body.length; k++) {
                if (snakes[i].head.x == snakes[j].body[k].x && snakes[i].head.y == snakes[j].body[k].y) {
                    isCollide = true;
                }
            }
        }
    }
    if (isCollide && life > 1) {
        life--;
        audioLoose.play();
        updateHeart();
    } else if(isCollide && life === 1){
        audioLoose.play();
        alert("Game over");
        location.reload();
    }
    return isCollide;
}

function move(snake) {
    switch (snake.direction) {
        case DIRECTION.LEFT:
            moveLeft(snake);
            break;
        case DIRECTION.RIGHT:
            moveRight(snake);
            break;
        case DIRECTION.DOWN:
            moveDown(snake);
            break;
        case DIRECTION.UP:
            moveUp(snake);
            break;
    }
    moveBody(snake);
    if (!checkCollision([snake1])) {
        setTimeout(function() {
            move(snake);
        }, MOVE_INTERVAL);
    } else {
        initGame();
    }
}


function moveBody(snake) {
    snake.body.unshift({ x: snake.head.x, y: snake.head.y });
    snake.body.pop();
}

function turn(snake, direction) {
    const oppositeDirections = {
        [DIRECTION.LEFT]: DIRECTION.RIGHT,
        [DIRECTION.RIGHT]: DIRECTION.LEFT,
        [DIRECTION.DOWN]: DIRECTION.UP,
        [DIRECTION.UP]: DIRECTION.DOWN,
    }

    if (direction !== oppositeDirections[snake.direction]) {
        snake.direction = direction;
    }
}

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        turn(snake1, DIRECTION.LEFT);
    } else if (event.key === "ArrowRight") {
        turn(snake1, DIRECTION.RIGHT);
    } else if (event.key === "ArrowUp") {
        turn(snake1, DIRECTION.UP);
    } else if (event.key === "ArrowDown") {
        turn(snake1, DIRECTION.DOWN);
    }

    
})

function initGame() {
    move(snake1);
}

initGame();