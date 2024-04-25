class Game{
    constructor(){
        this.timeRemaining = 60;
        this.flyCounter = 0
        this.flyArray = [];
        this.addFlyInterval = null;
        this.timerInterval = null;
        this.bonusLevel = false;
        
        // load board
        this.board = document.querySelector("#board");
        this.boardWidth = 954; //
        this.boardHeight = 636; //
        this.board.style.width = this.boardWidth + "px";
        this.board.style.height = this.boardHeight + "px";

        // load DOM elements
        this.timer = document.querySelector("#timer");
        this.instructions = document.querySelector("#instructions")
        this.bonusView = document.querySelector("#bonus-view")
        this.nightMode = document.querySelector("#night-mode")
        this.startButton = document.querySelector("#start-button")
        this.startBonusButton = document.querySelector("#start-bonus-button")

        // load audio
        this.flySound = new Audio("./audio/flybuzz.mp3");
        this.popSound = new Audio("./audio/pop.mp3");
        this.bonusSound = new Audio("./audio/level-up.mp3")
        this.background = new Audio("./audio/background.mp3")
        this.flySound.volume = 0.5;
        this.popSound.volume = 0.5;

    } 
    startGame(){
        this.flyCounter++
        this.flyArray.push(new Fly(this.flyCounter));
        this.addFlies()
        // this.hideFlies()
        this.playFlySound();
        this.detectCollision();
        this.updateTimer()
    }
    startBonusGame(){
        this.nightMode.classList.toggle("hide");
        this.timeRemaining = 90;
        player.width = 50;
        player.height = 50;
        player.DOMElement.style.width = player.width + "px"
        player.DOMElement.style.height = player.height + "px"
        this.background.play();
        this.flyCounter++
        this.flyArray.push(new Fly(this.flyCounter));
        this.addFlies()
        // this.hideFlies()
        // this.playFlySound();
        this.detectCollision();
        this.updateTimer()
    }
    listenGameKeys(){
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
                }
        
                if(player.direction === "right" && player.YPos === 0 && player.XPos < this.boardWidth - player.width){ // potentially make jump smaller if board is exceeded
                    player.jumpRight()
                }
            }
        })
    }
    addFlies(){
        let spawnTime;
        if(this.bonusLevel === false) spawnTime = 3000;
        if(this.bonusLevel === true) spawnTime = 1500;
        this.addFlyInterval = setInterval(() => {
            this.flyCounter++;
            let newFly = new Fly(this.flyCounter);
            this.flyArray.push(newFly);
        }, spawnTime)
    }
    playFlySound(){
        this.flySound.play()
        this.flySound.loop = true
    }
    detectCollision(){
        setInterval(() => {
            this.flyArray.forEach((fly, index) => 
            {
            if (player.XPos < fly.XPos + fly.width &&
                player.XPos + player.width > fly.XPos &&
                player.YPos < fly.YPos + fly.height &&
                player.YPos + player.height > fly.YPos) {
                    document.querySelector(`#Fly${fly.ID}`).remove();
                    this.flyArray.splice(index, 1)
                    this.popSound.play();
                    player.growPlayer();
            }
            if(this.flyArray.length === 0) {
                clearInterval(this.addFlyInterval);
                clearInterval(this.timerInterval);
                this.flySound.pause();
                this.bonusView.classList.toggle("hide");
                this.bonusSound.play();
                this.bonusLevel = true;
            }
            })
        }, 100);
    }
    updateTimer(){
        this.updateTime();
        
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateTime();
            if(this.timeRemaining === 0) location.href = "gameover.html";
        }, 1000)
    }
    updateTime(){
        let minutes;
        let seconds;  
        // Convert the time remaining in seconds to minutes and seconds, and pad the numbers with zeros if needed
        minutes = Math.floor(this.timeRemaining / 60).toString().padStart(2, "0");
        seconds = (this.timeRemaining % 60).toString().padStart(2, "0");
    
        // Display the time remaining in the time remaining container
        this.timer.innerText = `Time Remaining: ${minutes}:${seconds}`;
    }
}

class Player{
    constructor(){
        this.width = 50;
        this.height = 50;
        this.minBoardPos = this.width;
        this.maxBoardPos = game.boardWidth - this.width;
        this.XPos = (game.boardWidth/2) - (this.width/2)
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
        if(this.XPos < game.boardWidth - this.width){
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
        const maxWidth = 120 // tested with 130
        const maxHeight = 120; // tested with 130
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
        }
    }, 70) // potentially wrap another timeout around it to delay the growth a bit
    }

}

class Fly{
    constructor(ID){
        this.ID = ID;
        this.width = 50;
        this.height = 50;
        this.minBoardPosX = this.width;
        this.maxBoardPosX = game.boardWidth - this.width;
        if(game.bonusLevel === false) this.minBoardPosY = game.boardHeight/6;
        if(game.bonusLevel === true) this.minBoardPosY = game.boardHeight/3;
        this.maxBoardPosY = game.boardHeight/2.25;
        this.XPos = Math.floor(Math.random() * (this.maxBoardPosX - this.minBoardPosX + 1)) + this.minBoardPosX;
        this.YPos = Math.floor(Math.random() * (this.maxBoardPosY - this.minBoardPosY + 1)) + this.minBoardPosY;
        this.DOMElement = null;
        this.flyInterval;
        this.createFly();
        this.flyAround();
    }
    createFly(){
        this.DOMElement = document.createElement("div");
        if(game.bonusLevel === false) this.DOMElement.className = "fly";
        if(game.bonusLevel === true) this.DOMElement.className = "ghost";
        this.DOMElement.id = "Fly"+this.ID;
        this.DOMElement.style.width = this.width + "px"
        this.DOMElement.style.height = this.height + "px"
        this.DOMElement.style.bottom = this.YPos + "px";
        this.DOMElement.style.left = this.XPos + "px";
        board.appendChild(this.DOMElement);
    }
    flyAround(){
        let jumpCounter = 0;
        let refreshBuffer = 1;
        let accelerator = 1;
        if(game.bonusLevel === true) {
            refreshBuffer = 0.5;
            accelerator = 2
            }
        setInterval(() => {
                if(jumpCounter < 50){
                    this.XPos-=accelerator;
                    this.YPos+=accelerator;
                    this.DOMElement.style.left = this.XPos + "px";
                    this.DOMElement.style.bottom = this.YPos + "px";
                    jumpCounter++
                }
                if(jumpCounter >= 50 && jumpCounter < 100){
                    this.XPos-=accelerator;
                    this.YPos-=accelerator;
                    this.DOMElement.style.left = this.XPos + "px";
                    this.DOMElement.style.bottom = this.YPos + "px";
                    jumpCounter++
                }
                if(jumpCounter >= 100 & jumpCounter < 150){
                    this.XPos+=accelerator;
                    this.YPos-=accelerator;
                    this.DOMElement.style.left = this.XPos + "px";
                    this.DOMElement.style.bottom = this.YPos + "px";
                    jumpCounter++
                }
                if(jumpCounter >= 150 && jumpCounter < 200){
                    this.XPos+=accelerator;
                    this.YPos+=accelerator;
                    this.DOMElement.style.left = this.XPos + "px";
                    this.DOMElement.style.bottom = this.YPos + "px";
                    jumpCounter++
                }
                if(jumpCounter === 200) {
                    jumpCounter = 0;
                }
        }, refreshBuffer)
    }
}


// create game variables
const game = new Game();
game.listenGameKeys();
const player = new Player();

game.startButton.addEventListener("click", () => {
   game.instructions.classList.toggle("hide")
   game.startGame();
})

game.startBonusButton.addEventListener("click", () => {
    game.bonusView.classList.toggle("hide")
    game.startBonusGame();
 })
 


   // show timer
   // show score


