const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

export default class Player {
  constructor(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.speed = 3
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }

  update(movement) {
    this.draw()
    if (movement.moveForward && this.y > this.radius) {
      this.y -= this.speed
    }
    if (movement.moveBackward && this.y + this.radius < canvas.height) {
      this.y += this.speed
    }
    if (movement.moveLeft && this.x > this.radius) {
      this.x -= this.speed
    }
    if (movement.moveRight && this.x + this.radius < canvas.width) {
      this.x += this.speed
    }
  }
}
