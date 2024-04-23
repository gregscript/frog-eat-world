// board setup

const board = document.querySelector("#board");
let boardWidth = 954;
let boardHeight = 636;
board.style.width = boardWidth + "px";
board.style.height = boardHeight + "px";

// fly setup

class Fly{
    constructor(){
        this.width = 50;
        this.height = 50;
        this.minBoardPos = this.width;
        this.maxBoardPos = boardWidth - this.width;
        this.XPos = Math.floor(Math.random() * (this.maxBoardPos - this.minBoardPos + 1)) + this.minBoardPos;
        this.YPos = boardHeight/4;
        this.DOMElement = null;

        this.createFly()
    }
    createFly(){
        this.DOMElement = document.createElement("div");
        this.DOMElement.className = "fly"
        this.DOMElement.style.width = this.width + "px"
        this.DOMElement.style.height = this.height + "px"
        this.DOMElement.style.bottom = this.YPos + "px";
        this.DOMElement.style.left = this.XPos + "px";
        board.appendChild(this.DOMElement);
    }
}

const fly = new Fly();

// class Player

class Player{
    constructor(){
        this.width = 100;
        this.height = 100;
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
        let growPlayerInterval = setInterval(() => {
        if(this.width <= 120 && this.height <= 120) { // should be flexible (i.e. grow multiple times)
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
        if (player.XPos < fly.XPos + fly.width &&
            player.XPos + player.width > fly.XPos &&
            player.YPos < fly.YPos + fly.height &&
            player.YPos + player.height > fly.YPos) {
                fly.DOMElement.style.display = "none"; // rather remove instance
                player.growPlayer();
                console.log("collision")
                clearInterval(detectCollisionInterval);
        }
}, 100);
}
detectCollision();