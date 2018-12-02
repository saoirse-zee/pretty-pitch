let mic
let fft
const maxes = []
const SENSITIVITY = 50 // How fast the avg moves
const LOWER_BOUND = 100 // Hz
const UPPER_BOUND = 250 // Hz
const gap = 1 // Granularity - gap between frequencies that are tested.
let mouseOnLava = false
let lavaLineLocked = false
let lavaFreq = localStorage.getItem('lavaFreq') || 200

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

  const lavaY = getY(lavaFreq)
  const bottomLavaRect = lavaY + 8
  const topLavaRect = lavaY - 8
  mouseOnLava = (mouseY < bottomLavaRect) && (mouseY > topLavaRect)

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
  drawLavaLine(lavaFreq)
}

function drawLabel (freq) {
  fill(207, 196, 102)
  textSize(16)
  textAlign(CENTER)
  if (freq % 10 === 0) {
    const x = width / 2
    const y = getY(freq)
    text(freq, x, y + 6)
  }
}

function drawPitchLine (freq) {
  const c = color('hsla(190, 100%, 50%, 0.5)')
  fill(c)
  const line = {
    x: width / 2,
    y: getY(freq),
    w: width,
    h: 15
  }
  rect(line.x, line.y, line.w, line.h)
}

function drawLavaLine (freq) {
  const c = mouseOnLava
    ? color('hsla(360, 100%, 50%, 0.8)')
    : color('hsla(340, 100%, 50%, 0.5)')
  fill(c)
  const h = mouseOnLava ? 18 : 15
  const y = getY(freq)
  const line = {
    x: width / 2,
    y,
    w: width,
    h
  }
  rectMode(CENTER)
  rect(line.x, line.y, line.w, line.h)
}

function drawFreqLine (freq, thickness, energy = 255) {
  const c = color('hsla(190, 100%, 50%, 0.1)')
  fill(c)
  const line = {
    x: width / 2,
    y: getY(freq),
    w: width * energy / 255,
    h: thickness
  }
  rect(line.x, line.y, line.w, line.h)
}

/**
 * Get y position from frequency
 */
function getY (freq) {
  return map(freq, LOWER_BOUND, UPPER_BOUND, height, 0)
}

/**
 * Get frequency from y position
 */
function getFreq (y) {
  return map(y, height, 0, LOWER_BOUND, UPPER_BOUND)
}

// eslint-disable-next-line no-unused-vars
function mousePressed () {
  if (mouseOnLava) {
    lavaLineLocked = true
  } else {
    lavaLineLocked = false
  }
}

// eslint-disable-next-line no-unused-vars
function mouseDragged () {
  if (lavaLineLocked) {
    lavaFreq = getFreq(mouseY)
  }
}

// eslint-disable-next-line no-unused-vars
function mouseReleased () {
  if (lavaLineLocked) {
    localStorage.setItem('lavaFreq', lavaFreq)
  }
}
