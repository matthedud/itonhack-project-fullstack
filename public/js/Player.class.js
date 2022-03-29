const playerSize = 6
let moveSpeed = 0.1

class Player {
  constructor(id, name, position = { x: 0, y: 0, direction: 0 }) {
    this.id = id
    this.userID = null
    this.name = name
    this.position = { x: position.x, y: position.y, direction: position.direction }
    this.controller = null //if the player use controller
    this.keyboard = new KeyBoard()
    this.logs = []
    this.logInterval = null
    this.moveInterval = null
    this.moveRate = 30

    this.game = null
    //---------FOR UX----------
    // this.score = 0
    // this.canShoot = true
    // this.avatar = new Image()
    // this.avatar.src = "./Image/player/topgun.gif"
    // this.shootSound = new Audio('./Audio/GunShotSnglShotEx PE1097508.mp3');
    // this.reloadSound = new Audio('./Audio/GunCockSingle PE1096303.mp3');
    // this.deadSound = new Audio('./Audio/Wilhelm Scream sound effect.mp3')
    //-------------------------
  }
  draw() {
    // draw circle for player

    ctx.fillStyle = "red"
    ctx.beginPath()
    ctx.arc(canvasWidth / 2 - playerSize, canvasHeight / 2 - playerSize, playerSize, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fill()

    // draw direction for player
    // ctx.beginPath()
    // const xDirection = this.x + Math.cos(this.direction) * playerSize
    // const yDirection = this.y + Math.sin(this.direction) * playerSize
    // ctx.moveTo(this.x + xOffset, this.y)
    // ctx.lineTo(xDirection + xOffset, yDirection)
    // ctx.closePath()
    // ctx.stroke()
  }

  //get new coordonates with input and time passed

  newCoord() {
    let newx = this.position.x
    let newy = this.position.y
    let currentSpeed = moveSpeed

    if (this.isMovingDiagonal()) currentSpeed = (currentSpeed / 2) * 1.41

    if (this.controller) {
      const gp = navigator.getGamepads()[this.controller?.index]
      newy = moveSpeed * Number(gp.axes[1].toFixed(1))
      newx = moveSpeed * Number(gp.axes[0].toFixed(1))
    } else {
      if (this.keyboard.up) newy -= currentSpeed
      if (this.keyboard.down) newy += currentSpeed
      if (this.keyboard.right) newx += currentSpeed
      if (this.keyboard.left) newx -= currentSpeed
    }
    return { x: newx, y: newy }
  }

  startMove(game) {
    this.moveInterval = setInterval(() => {
      const { x, y } = this.newCoord()
      if (!game.isWall(x, y)) {
        this.position.x = x
        this.position.y = y
        game.checkVictory(this)
      }
    }, this.moveRate)
  }

  stopMove(){
    clearInterval(this.moveInterval)
    this.moveInterval = null
  }

  isMovingDiagonal() {
    return this.keyboard.up + this.keyboard.down + this.keyboard.right + this.keyboard.left - 1
  }

  drawBIG(x, y, cellWidth, cellheight) {
    context.fillStyle = "red"
    context.strokeStyle = "green"
    context.beginPath()
    context.arc(x * cellWidth, y * cellheight, playerSize, 0, 2 * Math.PI)
    context.closePath()
    context.fill()
  }

  log() {
    this.logs.push({ x: this.position.x, y: this.position.y })
  }

  startLogs(recordRate) {
    this.logInterval = setInterval(() => {
      this.log()
    }, recordRate)
  }

  stopLogs() {
    clearInterval(this.logInterval)
  }
}
