var mic;
var spectrum;
var fft;
var maxes = []
const SENSITIVITY = 50; // How fast the avg moves
const LOWER_BOUND = 150; // Hz
const UPPER_BOUND = 250; // Hz
var gap = 2 // Granularity - gap between frequencies that are tested.

function setup()
{
	createCanvas(640, 600);
	mic = new p5.AudioIn()
	mic.start();
	fft = new p5.FFT();
	fft.setInput(mic)
}

function draw()
{
	background(0);
	noStroke();
	micLevel = mic.getLevel();
	fft.analyze();

	var max = {freq: 0, energy: 0}
	
	for (let freq = LOWER_BOUND; freq < UPPER_BOUND; freq += gap) {
		// Labels
		if (freq % 10 === 0) {
			const y = getY(freq)
			text(freq, 550, y)
		}

		// Get energy of this freq, and draw it
		const energy = fft.getEnergy(freq, freq + gap)
		drawFreqLine(freq, 5, energy)

		// Find primary frequency
		max = (energy > max.energy) ? {freq, energy} : max
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
	
	drawFreqLine(rollingAvgFreq, 10, 255);
}

function drawFreqLine(freq, thickness=10, energy=255)
{
	const line = {
		x: 0,
		y: getY(freq),
		w: width * energy/255,
		h: thickness,
	};
	fill(0, 50, 250);
	rect(line.x, line.y, line.w, line.h);
}

function getY(freq)
{
	return map(freq, LOWER_BOUND, UPPER_BOUND, height, 0);
}
