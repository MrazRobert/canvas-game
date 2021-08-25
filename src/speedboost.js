const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

export default class SpeedBoost {
  constructor(x, y, size, color, velocity) {
    this.x = x
    this.y = y
    this.size = size
    this.color = color
    this.velocity = velocity
    this.rotationSpeed = 0
  }

  draw() {
    c.save();
    c.beginPath();
    c.moveTo(this.x + this.size * Math.cos(0), this.y + this.size * Math.sin(0));
    
    for (let side = 0; side < 7; side++) {
    c.lineTo(this.x + this.size * Math.cos(this.rotationSpeed + side * 2 * Math.PI / 6), this.y + this.size * Math.sin(this.rotationSpeed + side * 2 * Math.PI / 6));
    }
    c.fillStyle = this.color;
    c.shadowBlur = 10;
    c.shadowColor = 'rgb(122, 255, 195)';
    c.fill();
    c.restore();

    c.beginPath();
    c.strokeStyle = 'rgb(48, 117, 86)'
    c.moveTo(this.x - 5 * Math.cos(this.rotationSpeed), this.y - 5 * Math.sin(this.rotationSpeed));
    c.lineTo(this.x + 5 * Math.cos(this.rotationSpeed), this.y + 5 * Math.sin(this.rotationSpeed));
    c.moveTo(this.x + 5 * Math.sin(this.rotationSpeed), this.y - 5 * Math.cos(this.rotationSpeed));
    c.lineTo(this.x - 5 * Math.sin(this.rotationSpeed), this.y + 5 * Math.cos(this.rotationSpeed));
    c.stroke();
  }

  update() {
    this.draw();
    this.x += this.velocity.x
    this.y += this.velocity.y
    this.rotationSpeed += 0.01
  }
}