const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

export default class BackgroundPoint {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.radius = 2
    this.color = 'rgba(43, 43, 43, 0.2)'
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
  }

  update() {
    this.draw()
  }
}