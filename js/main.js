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
    // jump still a bit buggy if jumping too many times in a row
    jumpRight(){
        let XPosOld = this.XPos;
        let YPosOld = this.YPos;
        let jumpUpInterval;
        let jumpDownInterval;
        if(this.YPos === 0) { // only jump up if you're on the ground
            jumpUpInterval = setInterval(() => { 
                if(this.XPos < XPosOld + 100){
                this.XPos += 1;
                this.YPos += 1;
                this.DOMElement.style.left = this.XPos + "px";
                this.DOMElement.style.bottom = this.YPos + "px";
                }
            }, 1)
        }
        
        setTimeout(() => {
            clearInterval(jumpUpInterval);
            jumpDownInterval = setInterval(() => { 
            if(this.YPos > YPosOld){
                this.XPos += 1;
                this.YPos -= 1;
                this.DOMElement.style.left = this.XPos + "px";
                this.DOMElement.style.bottom = this.YPos + "px";
                }
        }, 1)
        }, 400) // stop the jumpUpInterval and start the jumpDown after half the jump

        setTimeout(() => {
            clearInterval(jumpDownInterval);
        }, 800) // clear the jumpDownInterval after landing

// jump refactor
        // let jumpDown = false;
        // let jumpCounter = 0;

        // let jumpInterval = setInterval( () => {
        //     if(jumpCounter < 50 && jumpDown === false){
        //         this.XPos++
        //         this.YPos++;
        //         this.DOMElement.style.left = this.XPos + "px";
        //         this.DOMElement.style.bottom = this.YPos + "px";
        //         jumpCounter++
        //     }
        //     if(jumpCounter === 50) jumpDown === true;
        //     if(jumpCounter >= 0 && jumpDown === true){
        //         this.XPos++
        //         this.YPos--;
        //         this.DOMElement.style.left = this.XPos + "px";
        //         this.DOMElement.style.bottom = this.YPos + "px";
        //         jumpCounter--
        //     }
        //     if(jumpCounter === -1) clearInterval(jumpInterval);
        // }, 1)
    }
    // a bit buggy

    jumpLeft(){
        let XPosOld = this.XPos;
        let YPosOld = this.YPos;
        let jumpUpInterval;
        let jumpDownInterval;
        if(this.YPos === 0) { // only jump up if you're on the ground
            jumpUpInterval = setInterval(() => { 
                if(this.XPos > XPosOld - 100){
                this.XPos -= 1;
                this.YPos += 1;
                this.DOMElement.style.left = this.XPos + "px";
                this.DOMElement.style.bottom = this.YPos + "px";
                }
            }, 1)
        }
        
        setTimeout(() => {
            clearInterval(jumpUpInterval);
            jumpDownInterval = setInterval(() => { 
            if(this.YPos > YPosOld){
                this.XPos -= 1;
                this.YPos -= 1;
                this.DOMElement.style.left = this.XPos + "px";
                this.DOMElement.style.bottom = this.YPos + "px";
                }
        }, 1)
        }, 400) // stop the jumpUpInterval and start the jumpDown after half the jump

        setTimeout(() => {
            clearInterval(jumpDownInterval);
        }, 800) // clear the jumpDownInterval after landing
    }

    growPlayer(){
        let oldWidth = this.width
        let oldHeight = this.height;
        let growPlayerInterval = setInterval(() => {
        if(this.width <= oldWidth+10 && this.height <= oldHeight+10) { // should be flexible (i.e. grow multiple times)
            this.width += 5;
            this.height += 5;
            this.DOMElement.style.width = this.width + "px"
            this.DOMElement.style.height = this.height + "px"
        } else {
            clearInterval(growPlayerInterval)
            detectCollision(); // this is dangerous if we do not remove fly instance, frog could grow forever due to permanent collision
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
        this.maxBoardPosY = boardHeight/3;
        this.XPos = Math.floor(Math.random() * (this.maxBoardPosX - this.minBoardPosX + 1)) + this.minBoardPosX;
        this.YPos = Math.floor(Math.random() * (this.maxBoardPosY - this.minBoardPosY + 1)) + this.minBoardPosY;
        this.DOMElement = null;

        this.createFly()
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
}

const flyArray = [new Fly(0)];
let ID = 1;

setInterval(() => {
    let newFly = new Fly(ID);
    flyArray.push(newFly);
    ID++;
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

    if(event.code === "Space"){
        // attention not to jump outside the board
        if(player.direction === "left" && player.XPos > 200){ // board jump limit should be dynamic depending on player size
            player.jumpLeft()
        }

        if(player.direction === "right" && player.XPos < boardWidth - 200){ // potentially make jump smaller if board is exceeded
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

