// board setup

const board = document.querySelector("#board");
let boardWidth = 954;
let boardHeight = 636;
board.style.width = boardWidth + "px";
board.style.height = boardHeight + "px";

// class Player

class Player{
    constructor(){
        this.width = 50;
        this.height = 50;
        this.minBoardPos = this.width;
        this.maxBoardPos = boardWidth - this.width;
        this.XPos = 0
        this.YPos = 0
        this.direction = "right";

        this.DOMElement = document.querySelector("#player");
        this.DOMElement.style.width = this.width + "px"
        this.DOMElement.style.height = this.height + "px"
        this.DOMElement.style.left = this.XPos + "px";
        this.DOMElement.style.bottom = this.YPos + "px";

    }
    // DRY
    moveLeft(){
        if(this.XPos > 0){
            this.XPos -= 10;
            this.direction = "left";
            this.DOMElement.style.left = this.XPos + "px";
        }    
    }
    moveRight(){
        if(this.XPos < boardWidth - this.width){
            this.XPos += 10;
            this.direction = "right";
            this.DOMElement.style.left = this.XPos + "px";
        }
    }
    jumpRight(){
        let jumpCounter = 0;
        let jumpInterval = setInterval(() => {
                if(jumpCounter < 50){
                    this.XPos++
                    this.YPos +=2;
                    this.DOMElement.style.left = this.XPos + "px";
                    this.DOMElement.style.bottom = this.YPos + "px";
                    jumpCounter++
                }
                if(jumpCounter >= 50 && jumpCounter < 100){
                    this.XPos++
                    this.YPos -=2;
                    this.DOMElement.style.left = this.XPos + "px";
                    this.DOMElement.style.bottom = this.YPos + "px";
                    jumpCounter++
                }
                if(jumpCounter === 100) {
                    clearInterval(jumpInterval)
                }
        }, 1)
    }


    jumpLeft(){
        let jumpCounter = 0;
        let jumpInterval = setInterval(() => {
                if(jumpCounter < 50){
                    this.XPos--;
                    this.YPos+=2;
                    this.DOMElement.style.left = this.XPos + "px";
                    this.DOMElement.style.bottom = this.YPos + "px";
                    jumpCounter++
                }
                if(jumpCounter >= 50 && jumpCounter < 100){
                    this.XPos--;
                    this.YPos-=2;
                    this.DOMElement.style.left = this.XPos + "px";
                    this.DOMElement.style.bottom = this.YPos + "px";
                    jumpCounter++
                }
                if(jumpCounter === 100) {
                    clearInterval(jumpInterval)
                }
        }, 1)
    }

    jumpUp(){
        let jumpCounter = 0;
        let jumpInterval = setInterval(() => {
                if(jumpCounter < 50){
                    this.YPos+=3;
                    this.DOMElement.style.left = this.XPos + "px";
                    this.DOMElement.style.bottom = this.YPos + "px";
                    jumpCounter++
                }
                if(jumpCounter >= 50 && jumpCounter < 100){
                    this.YPos-=3;
                    this.DOMElement.style.left = this.XPos + "px";
                    this.DOMElement.style.bottom = this.YPos + "px";
                    jumpCounter++
                }
                if(jumpCounter === 100) {
                    clearInterval(jumpInterval)
                }
        }, 1)
    }


    growPlayer(){
        let oldWidth = this.width
        let oldHeight = this.height;
        const maxWidth = 130;
        const maxHeight = 130;
        let growPlayerInterval = setInterval(() => {
        if(this.width <= oldWidth+10 && this.height <= oldHeight+10 
            && this.width < maxWidth && this.height < maxHeight) // frog can grow multiple times until reaches growth limit 
            { 
            this.width += 5;
            this.height += 5;
            this.DOMElement.style.width = this.width + "px"
            this.DOMElement.style.height = this.height + "px"
        } else {
            clearInterval(growPlayerInterval)
            detectCollision();
        }
    }, 70) // potentially wrap another timeout around it to delay the growth a bit
    }

}

const player = new Player();

// fly setup

class Fly{
    constructor(ID){
        this.ID = ID;
        this.width = 50;
        this.height = 50;
        this.minBoardPosX = this.width;
        this.maxBoardPosX = boardWidth - this.width;
        this.minBoardPosY = boardHeight/6;
        this.maxBoardPosY = boardHeight/2.25;
        this.XPos = Math.floor(Math.random() * (this.maxBoardPosX - this.minBoardPosX + 1)) + this.minBoardPosX;
        this.YPos = Math.floor(Math.random() * (this.maxBoardPosY - this.minBoardPosY + 1)) + this.minBoardPosY;
        this.DOMElement = null;
        this.createFly();
        this.flyAround();
    }
    createFly(){
        this.DOMElement = document.createElement("div");
        this.DOMElement.className = "fly"
        this.DOMElement.id = "Fly"+this.ID;
        this.DOMElement.style.width = this.width + "px"
        this.DOMElement.style.height = this.height + "px"
        this.DOMElement.style.bottom = this.YPos + "px";
        this.DOMElement.style.left = this.XPos + "px";
        board.appendChild(this.DOMElement);
    }
    flyAround(){
        let jumpCounter = 0;
        let flyInterval = setInterval(() => {
                if(jumpCounter < 50){
                    this.XPos--;
                    this.YPos+=1;
                    this.DOMElement.style.left = this.XPos + "px";
                    this.DOMElement.style.bottom = this.YPos + "px";
                    jumpCounter++
                }
                if(jumpCounter >= 50 && jumpCounter < 100){
                    this.XPos--;
                    this.YPos-=1;
                    this.DOMElement.style.left = this.XPos + "px";
                    this.DOMElement.style.bottom = this.YPos + "px";
                    jumpCounter++
                }
                if(jumpCounter >= 100 & jumpCounter < 150){
                    this.XPos++;
                    this.YPos-=1;
                    this.DOMElement.style.left = this.XPos + "px";
                    this.DOMElement.style.bottom = this.YPos + "px";
                    jumpCounter++
                }
                if(jumpCounter >= 150 && jumpCounter < 200){
                    this.XPos++;
                    this.YPos+=1;
                    this.DOMElement.style.left = this.XPos + "px";
                    this.DOMElement.style.bottom = this.YPos + "px";
                    jumpCounter++
                }
                if(jumpCounter === 200) {
                    jumpCounter = 0;
                }
        }, 1)
    }
}

// start game view
// add instructions
// 

// "Press Space to start game"
// launch sound

const fliesSound = new Audio("./audio/fliesbuzzing.mp3");
const flySound = new Audio("./audio/flysbuzzing.mp3");
fliesSound.volume = 0.5;
flySound.volume = 0.5;

// create 3 flies at game start
const flyArray = [new Fly(1), new Fly(2), new Fly(3)];

// every 1 second check how many flies are there and then change sound accordingly
// fliesSound.play()
// flySound.play()

// create additional fly every 2 seconds, starting at ID #4
let startID = 4
setInterval(() => {
    let newFly = new Fly(startID);
    flyArray.push(newFly);
    startID++;
}, 2000)


// To Do: adjust frog image Direction with direction change
addEventListener("keydown", (event) => {
    // console.log(event.code);
    if(event.code === "ArrowLeft"){
        player.moveLeft();
    }
    if(event.code === "ArrowRight"){
        player.moveRight();

    }

    if(event.code === "ArrowUp"){
        if(player.YPos === 0) player.jumpUp();
    }

    if(event.code === "Space"){
        // attention not to jump outside the board
        if(player.direction === "left" && player.YPos === 0 && player.XPos > player.width){ // board jump limit should be dynamic depending on player size
            player.jumpLeft()
            console.log("left");
        }

        if(player.direction === "right" && player.YPos === 0 && player.XPos < boardWidth - player.width){ // potentially make jump smaller if board is exceeded
            player.jumpRight()
        }
    }
})

// collision detection (= frog eats fly):

function detectCollision(){
let detectCollisionInterval = setInterval(() => {
        flyArray.forEach((fly, index) => 
        {
        if (player.XPos < fly.XPos + fly.width &&
            player.XPos + player.width > fly.XPos &&
            player.YPos < fly.YPos + fly.height &&
            player.YPos + player.height > fly.YPos) {
                document.querySelector(`#Fly${fly.ID}`).remove();
                flyArray.splice(index, 1)
                player.growPlayer();
                clearInterval(detectCollisionInterval);
        }
        if(flyArray.length === 0) location.href = "win.html";
        })
}, 100);
}
detectCollision();


let timeRemaining = 60;
const timer = document.querySelector("#timer");
let minutes;
let seconds;

function updateTime() {
  // Convert the time remaining in seconds to minutes and seconds, and pad the numbers with zeros if needed
  minutes = Math.floor(timeRemaining / 60).toString().padStart(2, "0");
  seconds = (timeRemaining % 60).toString().padStart(2, "0");

  // Display the time remaining in the time remaining container
  timer.innerText = `Time Remaining: ${minutes}:${seconds}`;
}
updateTime();

setInterval(() => {
    timeRemaining--;
    updateTime();
    if(timeRemaining === 0) location.href = "gameover.html";
}, 1000)

