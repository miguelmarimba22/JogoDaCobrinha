const c = document.querySelector("canvas")
const ctx = c.getContext("2d");
const lblPoints = document.querySelector("span#points")
const playercor = document.querySelector("span#player-coord")
const applecor = document.querySelector("span#apple-coord")
const lbldis = document.querySelector("span#distance")
const lbldir = document.querySelector("span#direction")
const lblsize = document.querySelector("span#size")
const btnReset = document.querySelector("#reset")

let lastMoveTime=0
const moreInterval=200

let canvas = {
    "width": c.width,
    "height": c.height,
    "gridsize": 20
}

let player = { // player proprieties
    "head": {
        "position": {x:0, y:0}
    },
    "body": [],
    "size": canvas.gridsize,
    "direction": [0, 0],
    "points": 0,
    "velocity": canvas.gridsize
}

let apple = { // apple proprieties
    "position": {x:0, y:0},
    "size": canvas.gridsize,
    "eatable": false
}

const CheckKeyboard = (e) => {
    switch (e.code) {
        case "KeyW":
            player.direction.fill(0)
            player.direction[0]=-1
            break;
        case "KeyS":
            player.direction.fill(0)
            player.direction[0]=1
            break;
        case "KeyA":
            player.direction.fill(0)
            player.direction[1]=-1
            break
        case "KeyD":
            player.direction.fill(0)
            player.direction[1]=1
            break;
    }
}

const getRandomApplePosition = () => { // Generate random position of apple without on player.head.position
    const gridSize = canvas.gridsize;
    const gridWidth = canvas.width / gridSize;
    const gridHeight = canvas.height / gridSize;

    let position;
    let isValid = false;

    while (!isValid) {
        const x = Math.floor(Math.random() * gridWidth) * gridSize;
        const y = Math.floor(Math.random() * gridHeight) * gridSize;
        position = { x, y };

        const collidesWithSnake = player.body.some(segment =>
            segment.x === position.x && segment.y === position.y
        ) || (player.head.position.x === position.x && player.head.position.y === position.y);

        if (!collidesWithSnake) {
            isValid = true;
        }
    }

    return position;
}

const SetParamsGame = (timestamp) => {
    playercor.innerHTML = `Player: (X:${player.head.position.x/canvas.gridsize}, Y:${player.head.position.y/canvas.gridsize})`
    applecor.innerHTML = `Apple: (X:${apple.position.x/canvas.gridsize}, Y:${apple.position.y/canvas.gridsize})`
    lblPoints.innerHTML = `Points: ${player.points}`
    lbldis.innerHTML = `Distance: ${Math.floor(Math.sqrt(Math.pow(player.head.position.x-apple.position.x,2)+Math.pow(player.head.position.y-apple.position.y,2))/20)}`
    lblsize.innerHTML = `Size: ${player.body.length+1}`
    lbldir.innerHTML = `Direction: [${player.direction}]`  
}

const CheckCollision = () => { // check if player is colliding with the wall or apple
    if (player.head.position.x>canvas.width-canvas.gridsize || player.head.position.x<0 || player.head.position.y>canvas.height-canvas.gridsize || player.head.position.y<0) {
        player.direction.fill(0)
        alert("Game Over")
        ResetGame()
    }
    apple.eatable = true
    if (player.head.position.x === apple.position.x && player.head.position.y === apple.position.y && apple.eatable === true) {
        apple.position = getRandomApplePosition()
        if (player.body.length === 0) {
            player.body.unshift({x:player.head.position.x, y:player.head.position.y})
        } else {
            player.body.unshift({x:player.body[0].x, y:player.body[0].y})
        }
        player.points+=5
        apple.eatable = false
    }

    if (player.body.length >= 4) {
        for (segment of player.body) {
            if (player.head.position.x === segment.x && player.head.position.y === segment.y) {
                alert("Game Over")
                ResetGame()
            }
        }
    }
}

const draw = () => {
    // Characters
    // apple
    ctx.fillStyle="red"
    ctx.fillRect(apple.position.x, apple.position.y, canvas.gridsize, canvas.gridsize)
    // player
    for(let segment of player.body) {
        ctx.fillStyle="#0080FF"
        ctx.fillRect(segment.x, segment.y, canvas.gridsize, canvas.gridsize)
    }
    ctx.fillStyle="blue"
    ctx.fillRect(player.head.position.x, player.head.position.y, canvas.gridsize, canvas.gridsize)
    
    // end
    // grid
    for (let i=canvas.gridsize;i<canvas.width;i+=canvas.gridsize) {
        ctx.beginPath()
        ctx.strokeStyle="black"
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.width)
        ctx.lineWidth=2
        ctx.stroke();
    }
    for (let i=canvas.gridsize;i<canvas.height;i+=canvas.gridsize) {
        ctx.beginPath()
        ctx.strokeStyle="black"
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.height, i)
        ctx.lineWidth=2
        ctx.stroke();
    }
    // end
}

const SetDirectionPlayer = () => {  // Set direction of player
    player.head.position.y += player.direction[0] * player.velocity
    player.head.position.x += player.direction[1] * player.velocity
}

const ResetGame = () => { // Reset the canvas, but dont refresh the page
    player.body=[]
    player.direction.fill(0)
    apple.position={x:0,y:0}
    player.points=0
    start()
}

const start = () => { // Start at DOM was load
    do {
        player.head.position.x = Math.floor(Math.random()*(canvas.width/canvas.gridsize-0)+0)*20
        player.head.position.y = Math.floor(Math.random()*(canvas.height/canvas.gridsize-0)+0)*20
        apple.position = getRandomApplePosition()
    } while (player.head.position.x === apple.position.x && player.head.position.y === apple.position.y);
    loop()
}

const loop = (timestamp) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    SetParamsGame()
    CheckCollision()
    if (player.direction.some(velocity => velocity !== 0)) {
        if (timestamp-lastMoveTime>moreInterval){
            player.body.unshift({x:player.head.position.x, y:player.head.position.y})
            SetDirectionPlayer()
            player.body.pop()
            lastMoveTime=timestamp;
        }
    }
    draw()
    requestAnimationFrame(loop)
}

btnReset.addEventListener("click", ResetGame)
document.querySelector("html").addEventListener("keydown", (e) => CheckKeyboard(e))
document.addEventListener("DOMContentLoaded", start)
