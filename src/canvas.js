import utils from './utils'
import './style.scss'
import 'font-awesome/css/font-awesome.css'
import gsap from 'gsap'

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const scoreElement = document.querySelector('#scoreElement')
const startGameBtn = document.querySelector('#startGameBtn')
const modalElement = document.querySelector('#modalElement')
const bigScoreElement = document.querySelector('#bigScoreElement')

let movement = {
  moveForward: false,
  moveBackward: false,
  moveLeft: false,
  moveRight: false,
}

class Player {
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

  update() {
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

class Projectile {
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

  update() {
    this.draw()
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
  }
}

class Enemy {
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

  update() {
    this.draw()
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y

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

const friction = 0.99
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.velocity = velocity
    this.alpha = 1
  }

  draw() {
    c.save()
    c.globalAlpha = this.alpha
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
    c.restore()
  }

  update() {
    this.draw()
    this.velocity.x *= friction
    this.velocity.y *= friction
    this.x = this.x + this.velocity.x
    this.y = this.y + this.velocity.y
    this.alpha -= 0.01
  }
}

const x = canvas.width / 2
const y = canvas.height / 2

let player = new Player(x, y, 10, 'white')
let projectiles = []
let enemies = []
let particles = []
let score = 0

function init() {
  player = new Player(x, y, 10, 'white')
  projectiles = []
  enemies = []
  particles = []
  score = 0
  scoreElement.innerHTML = score
  bigScoreElement.innerHTML = score
}

function spawnEnemies() {
  setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4
    let x
    let y
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
      y = Math.random() * canvas.height
    } else {
      x = Math.random() * canvas.width
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
    }
    const color = `hsl(${Math.random() * 360}, 50%, 50%)`

    const angle = Math.atan2(
      player.y - y,
      player.x - x
    )

    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle)
    }

    enemies.push(new Enemy(x, y, radius, color, velocity))
  }, 1000)
}

let animationId
function animate() {
  animationId = requestAnimationFrame(animate)
  c.fillStyle = 'rgba(0, 0, 0, 0.1)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1)
    } else {
      particle.update()
    }
  })
  projectiles.forEach((projectile, index) => {
    projectile.update()

    // remove from edges of screen
    if (projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(index, 1)
      }, 0)
    }
  })
  enemies.forEach((enemy, enemyIndex) => {
    enemy.update()

    const dist = Math.hypot(
      player.x - enemy.x,
      player.y - enemy.y
    )

    // end game
    if (dist - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(animationId)
      modalElement.style.display = 'flex'
      bigScoreElement.innerHTML = score
    }

    projectiles.forEach((projectile, projectileIndex) => {
      const dist = Math.hypot(
        projectile.x - enemy.x,
        projectile.y - enemy.y
      )

      // when projectiles touch enemy
      if (dist - enemy.radius - projectile.radius < 1) {

        // create explosions
        for (let i = 0; i < enemy.radius * 2; i++) {
          particles.push(
            new Particle(
              projectile.x,
              projectile.y,
              Math.random() * 2,
              enemy.color,
              {
                x: (Math.random() - 0.5) * (Math.random() * 6),
                y: (Math.random() - 0.5) * (Math.random() * 6)
              }
            )
          )
        }

        if (enemy.radius - 10 > 5) {

          // increase our score
          score += 100
          scoreElement.innerHTML = score

          gsap.to(enemy, {
            radius: enemy.radius - 10
          })
          setTimeout(() => {
            projectiles.splice(projectileIndex, 1)
          }, 0)

        } else {
          // increase our score
          score += 250
          scoreElement.innerHTML = score
          // remove from scene altogether
          setTimeout(() => {
            enemies.splice(enemyIndex, 1)
            projectiles.splice(projectileIndex, 1)
          }, 0)
        }
      }
    })
  })
}

function actionByKey(key) {
  const keys = {
    KeyW: 'moveForward',
    KeyS: 'moveBackward',
    KeyA: 'moveLeft',
    KeyD: 'moveRight',
  };
  return keys[key];
}

addEventListener('keydown', (e) => {
  if (actionByKey(e.code)) {
    movement[actionByKey(e.code)] = true 
  }
})

addEventListener('keyup', (e) => {
  if (actionByKey(e.code)) {
    movement[actionByKey(e.code)] = false 
  }
})

addEventListener('click', (event) => {
  const angle = Math.atan2(
    event.clientY - player.y,
    event.clientX - player.x
  )
  
  const velocity = {
    x: Math.cos(angle) * 5,
    y: Math.sin(angle) * 5
  }

  projectiles.push(
    new Projectile(
      player.x,
      player.y,
      5,
      'white',
      velocity
    )
  )
})

startGameBtn.addEventListener('click', () => {
  init()
  animate()
  spawnEnemies()
  modalElement.style.display = 'none'
})
