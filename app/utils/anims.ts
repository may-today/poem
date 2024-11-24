import confetti from 'canvas-confetti'

export const startConfetti = () => {
  confetti({
    angle: 60,
    spread: 60,
    origin: { x: 0 },
    startVelocity: 35,
    gravity: 0.8,
    colors: ['#38bdf8', '#0284c7', '#bae6fd'],
  })
  confetti({
    angle: 120,
    spread: 60,
    origin: { x: 1 },
    startVelocity: 35,
    gravity: 0.8,
    colors: ['#38bdf8', '#0284c7', '#bae6fd'],
  })
}
