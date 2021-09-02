const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

export default class Enemy {
  constructor(x, y, radius, color, velocity, motion) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
    this.radians = 1
    this.motion = motion
    this.widthOfCircularMotion = Math.random() * (5 - 2) + 2
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

    if (this.motion === 'circular') {
      this.x += Math.cos(this.radians) * this.widthOfCircularMotion
      this.y += Math.sin(this.radians) * this.widthOfCircularMotion
      this.radians += 0.05
    }
    
    if (this.motion === 'wavy') {
      const angleInDeg = Math.abs(angle) * 180 / Math.PI
      if (angleInDeg > 45 && angleInDeg < 135) {
        this.x += Math.cos(this.radians)
      }
      else {
        this.y += Math.sin(this.radians)
      }
      this.radians += 0.05
    }
  }
}
