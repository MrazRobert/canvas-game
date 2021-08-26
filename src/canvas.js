import utils from './utils'
import './style.scss'
import 'font-awesome/css/font-awesome.css'
import gsap from 'gsap'

import Player from './player'
import Enemy from './enemy'
import Particle from './particle'
import Projectile from './projectile'
import SpeedBoost from './speedboost'
import PointsText from './pointstext'

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const scoreElement = document.querySelector('#scoreElement')
const startGameBtn = document.querySelector('#startGameBtn')
const modalElement = document.querySelector('#modalElement')
const bigScoreElement = document.querySelector('#bigScoreElement')

// const x = canvas.width / 2
// const y = canvas.height / 2

let mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
}

let movement = {
  moveForward: false,
  moveBackward: false,
  moveLeft: false,
  moveRight: false,
}

let player
let projectiles
let enemies
let particles
let score
let speedBoosts
let pointsTexts

let gameOver = false

// event listeners
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

addEventListener('mousemove', (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})

addEventListener('mousedown', (event) => {
  isShooting = true
})

addEventListener('mouseup', () => {
  isShooting = false
})

startGameBtn.addEventListener('click', () => {
  init()
  animate()
  spawnEnemies()
  spawnPowerUps()
  modalElement.style.display = 'none'
})

function actionByKey(key) {
  const keys = {
    KeyW: 'moveForward',
    KeyS: 'moveBackward',
    KeyA: 'moveLeft',
    KeyD: 'moveRight',
  };
  return keys[key];
}

// initialize
function init() {
  gameOver = false
  player = new Player(canvas.width / 2, canvas.height / 2, 10, 'white')
  projectiles = []
  enemies = []
  particles = []
  score = 0
  scoreElement.innerHTML = score
  bigScoreElement.innerHTML = score
  speedBoosts = []
  pointsTexts = []
}

function randomXY(radius) {
  let x
  let y
  if (Math.random() < 0.5) {
    x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
    y = Math.random() * canvas.height
  } else {
    x = Math.random() * canvas.width
    y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
  }
  return {x, y}
}

function spawnEnemies() {
  setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4
    const {x, y} = randomXY(radius)
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
  }, 2000)
}

function spawnPowerUps() {
  setInterval(() => {
    const size = 13
    const {x, y} = randomXY(size)
    const color = 'rgba(207, 255, 233, 0.2)'
    const angle = Math.atan2(
      Math.random() * canvas.height - y,
      Math.random() * canvas.width - x
    )

    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle)
    }

    speedBoosts.push(new SpeedBoost(x, y, size, color, velocity))
  }, 20000)
}

// animation loop
let animationId
function animate() {
  animationId = requestAnimationFrame(animate)
  c.fillStyle = 'rgba(0, 0, 0, 0.1)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  if (!gameOver) {
    player.update(movement)
  }
  if (isShooting) {
    shooting()
  }
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
    enemy.update(player)

    const dist = Math.hypot(
      player.x - enemy.x,
      player.y - enemy.y
    )
    // end game
    // let end = false
    if (dist - enemy.radius - player.radius < 1 && !gameOver) {
      for (let i = 0; i < player.radius * 10; i++) {
        const hue = utils.randomIntFromRange(30, 60)
        const light = utils.randomIntFromRange(50, 100)
        const opacity = 1
        particles.push(
          new Particle(
            player.x,
            player.y,
            Math.random() * 2,
            `hsla(${hue},100%,${light}%,${opacity})`,
            {
              x: (Math.random() - 0.5) * (Math.random() * 6),
              y: (Math.random() - 0.5) * (Math.random() * 6)
            }
          )
        )
      }
      if (!gameOver) {
        gameOver = true
        player.x = 0
        player.y = -1000
        setTimeout(() => {
          cancelAnimationFrame(animationId)
          modalElement.style.display = 'flex'
          bigScoreElement.innerHTML = score
        }, 3000)
      }
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
          // create points text
          pointsTexts.push(
            new PointsText(projectile.x, projectile.y, '100')
          )
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
          // create points text
          pointsTexts.push(
            new PointsText(projectile.x, projectile.y, '250')
          )
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
  speedBoosts.forEach((speedBoost, index) => {
    speedBoost.update()

    const dist = Math.hypot(
      player.x - speedBoost.x,
      player.y - speedBoost.y
    )
    let timeOut = null;
    if (dist - speedBoost.size - player.radius < 1) {
      clearTimeout(timeOut)
      player.color = 'rgb(122, 255, 195)'
      projectileColor = 'rgb(122, 255, 195)'
      player.speed = 6
      shootingDensity = 9
      timeOut = setTimeout (() => {
        player.color = 'white'
        projectileColor = 'white'
        player.speed = 3
        shootingDensity = 3
      }, 10000)

      speedBoosts.splice(index, 1);
    }
    // remove from edges of screen
    if (speedBoost.x + speedBoost.size < 0 ||
      speedBoost.x - speedBoost.size > canvas.width ||
      speedBoost.y + speedBoost.size < 0 ||
      speedBoost.y - speedBoost.size > canvas.height
    ) {
      setTimeout(() => {
        speedBoosts.splice(index, 1)
      }, 0)
    }
  })
  pointsTexts.forEach((pointsText, index) => {
    pointsText.update()

    if (pointsText.alpha <= 0) {
      pointsTexts.splice(index, 1)
    }
  })
}

// adding projectile to projectiles array
let projectileColor = 'white'
let isShooting = false
let shootingDensity = 3
let count = 20
const shooting = () => {
  if (count < 0) {
    count = 20
    const angle = Math.atan2(
      mouse.y - player.y,
      mouse.x - player.x
    )
    
    const velocity = {
      x: Math.cos(angle) * 5,
      y: Math.sin(angle) * 5
    }
    
    if (!gameOver) {
      projectiles.push(
        new Projectile(
          player.x,
          player.y,
          5,
          projectileColor,
          velocity
        )
      )
    }
  }
  count -= shootingDensity
}
