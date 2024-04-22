// board Info 

let boardWidth = 954;
let boardHeight = 636;

// class Fly

const fly = document.querySelector(".fly");

let flyWidth = 50;
let flyHeight = 50;
fly.style.width = flyWidth + "px"
fly.style.height = flyHeight + "px"

let flyXPos = boardWidth-flyWidth*2;
let flyYPos = boardHeight/3;
fly.style.bottom = flyYPos + "px";
fly.style.left = flyXPos + "px";

// class Player

const player = document.querySelector("#player");

let playerWidth = 100;
let playerHeight = 100;
player.style.width = playerWidth + "px"
player.style.height = playerHeight + "px"

let playerYPos = 0;
let playerXPos = 0;
player.style.bottom = playerYPos + "px";
player.style.left = playerXPos + "px";

let playerDirection = "up"

// To Do: adjust frog image Direction with direction change
addEventListener("keydown", (event) => {
    // console.log(event.code);
    // method moveLeft()
    if(event.code === "ArrowLeft"){
        if(playerXPos > 0){
            playerXPos -= 10;
            playerDirection = "left";
            player.style.left = playerXPos + "px";
        }
    }
    // method moveRight()
    if(event.code === "ArrowRight"){
        if(playerXPos < boardWidth - playerWidth){
            playerXPos += 10;
            playerDirection = "right";
            player.style.left = playerXPos + "px";
        }
    }

    // method jump()
    // attention not to jump outside the board
    // jump still a bit buggy if jumping too many times in a row
    if(event.code === "Space"){
        if(playerDirection === "left" && playerXPos > 50){
            playerXPos -= 60;
            playerDirection = "left";
            player.style.left = playerXPos + "px";
        }
        if(playerDirection === "right" && playerXPos < boardWidth - playerWidth - 50){
            let playerXPosOld = playerXPos;
            let playerYPosOld = playerYPos;
            if(playerYPos === 0) { // only jump up if you're on the ground
                let jumpUpInterval = setInterval(function(){ 
                    if(playerXPos < playerXPosOld + 50 && playerYPos < playerYPosOld + 300){
                    playerXPos += 1;
                    playerYPos += 1;
                    player.style.left = playerXPos + "px";
                    player.style.bottom = playerYPos + "px";
                    }
                }, 0.5)
            }
            
            setTimeout(function(){
                let jumpDownInterval = setInterval(function(){ 
                if(playerXPos < playerXPosOld + 100 && playerYPos > playerYPosOld){
                    playerXPos += 1;
                    playerYPos -= 1;
                    player.style.left = playerXPos + "px";
                    player.style.bottom = playerYPos + "px";
                    }
            }, 1)
            }, 150)

            setTimeout(function(){
                let jumpDownInterval = setInterval(function(){ 
                if(playerXPos < playerXPosOld + 100 && playerYPos > playerYPosOld){
                    playerXPos += 1;
                    playerYPos -= 1;
                    player.style.left = playerXPos + "px";
                    player.style.bottom = playerYPos + "px";
                    }
            }, 1)
            }, 150)
        }
        // cannot clear Timeouts. this blocks code when going back left after jump.
        // clearTimeout(jumpUpInterval);
        // clearTimeout(jumpDownInterval);
    }
})

// collision detection (= frog eats fly):

function detectCollision(){
let detectCollisionInterval = setInterval(() => {
        if (playerXPos < flyXPos + flyWidth &&
            playerXPos + playerWidth > flyXPos &&
            playerYPos < flyYPos + flyHeight &&
            playerYPos + playerHeight > flyYPos) {
                fly.style.display = "none"; // rather remove instance
                growPlayer();
                console.log("collision")
                clearInterval(detectCollisionInterval);
        }
}, 70);
}
detectCollision();

function growPlayer(){
    let growPlayerInterval = setInterval(() => {
        if(playerWidth <= 120 && playerHeight <= 120) { // should be flexible (i.e. grow multiple times)
            playerWidth += 5;
            playerHeight += 5;
            player.style.width = playerWidth + "px"
            player.style.height = playerHeight + "px"
        } else {
            clearInterval(growPlayerInterval)
            detectCollision(); // this is dangerous if we do not remove fly instance, frog could grow forever due to permanent collision
        }
    }, 70) // potentially wrap another timeout around it to delay the growth a bit
}