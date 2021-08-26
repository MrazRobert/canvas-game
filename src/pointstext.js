const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

export default class PointsText {
  constructor(x, y, text) {
    this.x = x
    this.y = y
    this.text = text
    this.alpha = 0.8
  }

  draw(){
    c.font = '15px Arial';
    c.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
    c.fillText(this.text, this.x, this.y);
  }

  update() {
      this.draw()
      this.y -= 0.5
      this.alpha -= 0.01
  }
}