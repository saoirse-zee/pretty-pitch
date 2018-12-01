let mic
let fft
const maxes = []
const SENSITIVITY = 50 // How fast the avg moves
const LOWER_BOUND = 100 // Hz
const UPPER_BOUND = 250 // Hz
const gap = 1 // Granularity - gap between frequencies that are tested.

/* eslint-disable-next-line */
function setup () {
  createCanvas(640, 600)
  mic = new p5.AudioIn()
  mic.start()
  const smoothing = 0.8
  const bins = 2 ** 13
  fft = new p5.FFT(smoothing, bins)
  fft.setInput(mic)
}

/* eslint-disable-next-line */
function draw() {
  background(20)
  noStroke()
  const micLevel = mic.getLevel()
  fft.analyze()

  let max = { freq: 0, energy: 0 }

  for (let freq = LOWER_BOUND; freq < UPPER_BOUND; freq += gap) {
    // Get energy of this freq
    const energy = fft.getEnergy(freq, freq + gap)

    // Find primary frequency
    max = (energy > max.energy) ? { freq, energy } : max

    // Draw
    drawFreqLine(freq, 1, energy)
    drawLabel(freq)
  }

  // Rolling average of the primary frequency. This makes the graph less jumpy.
  if (micLevel > 0.001) {
    maxes.push(max)
  }
  if (maxes.length > SENSITIVITY) {
    maxes.splice(0, 1)
  }
  const sumOfMaxFrequencies = maxes.reduce((s, m) => s + m.freq, 0)
  const rollingAvgFreq = sumOfMaxFrequencies / maxes.length

  drawPitchLine(rollingAvgFreq)
}

function drawLabel (freq) {
  fill(207, 196, 102)
  textSize(16)
  textAlign(CENTER)
  if (freq % 10 === 0) {
    const x = width / 2
    const y = getY(freq)

    text(freq, x, y)
  }
}

function drawPitchLine (freq) {
  const c = color('hsla(190, 100%, 50%, 0.5)')
  fill(c)
  const h = 15
  const y = getY(freq) - h // Adjust for line thickness
  const line = {
    x: 0,
    y,
    w: width,
    h
  }
  rect(line.x, line.y, line.w, line.h)
}

function drawFreqLine (freq, thickness = 10, energy = 255) {
  const c = color('hsla(190, 100%, 50%, 0.1)')
  fill(c)
  const w = width * energy / 255
  const x = (width - w) / 2
  const line = {
    x,
    y: getY(freq),
    w,
    h: thickness
  }
  rect(line.x, line.y, line.w, line.h)
}

function getY (freq) {
  return map(freq, LOWER_BOUND, UPPER_BOUND, height, 0)
}
