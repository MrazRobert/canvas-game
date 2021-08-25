const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

export default class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }

  update(player) {
    this.draw()
    this.x += this.velocity.x
    this.y += this.velocity.y

    const angle = Math.atan2(
      player.y - this.y,
      player.x - this.x
    )

    this.velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle)
    }
  }
}
