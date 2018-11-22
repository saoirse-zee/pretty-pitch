var mic;
var spectrum;
var fft;
var maxes = []
const SENSITIVITY = 50; // How fast the avg moves
const LOWER_BOUND = 150; // Hz
const UPPER_BOUND = 300; // Hz
var gap = 20 // Granularity - gap between frequencies that are tested.

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
	/*	TODO
		1. Get spectrum.
			do 16 bins
			try maximum smoothing, which means 1
		2. Loop over spectrum array. Find the freq with the most energy.
		3. Push this onto the maxes array.
		4. Use the maxes array to find the rolling avg, as currently doing.
	*/

	background(0);
	noStroke();

	micLevel = mic.getLevel();
	
	fft.analyze();

	var max = {freq: 0, energy: 0}
	
	for (let freq = LOWER_BOUND; freq < UPPER_BOUND; freq += gap) {
		// Grid
		drawFreqLine(freq, 1);
		const y = getY(freq)
		textAlign(CENTER)
		text(freq, width/2, y)

		// Get energy of this freq, and draw it
		const energy = fft.getEnergy(freq, freq + gap)
		drawFreqLine(freq, 5, energy)

		// Find primary frequency
		max = (energy > max.energy) ? {freq, energy} : max
	}
	
	// Rolling average
	if (micLevel > 0.001) {
		maxes.push(max)
	}
	if (maxes.length > SENSITIVITY) {
		maxes.splice(0, 1)
	}
	const sumFreq = maxes.reduce((s, m) => s + m.freq, 0)
	const avgFreq = sumFreq / maxes.length
	
	drawFreqLine(avgFreq, 10, 10);
	
	spectrum = fft.analyze(); // QUESTION: Is this being used?
	
	// Mic level
	fill(255, 0, 50);
	ellipse(width / 2, constrain(height - micLevel * height * 5, 0, height), 10, 10);
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
