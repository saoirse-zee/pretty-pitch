var mic;
var spectrum;
var fft;
var maxes = []
const SENSITIVITY = 50; // How fast the avg moves
const LOWER_BOUND = 10; // Hz
const UPPER_BOUND = 300; // Hz

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
	fill(100, 0, 10);

	micLevel = mic.getLevel();

	fft.analyze();

	var max = {freq: 0, energy: 0}
	var gap = 20
	for (let freq = LOWER_BOUND; freq < UPPER_BOUND; freq += gap) {
		const energy = fft.getEnergy(freq, freq + gap)
		max = (energy > max.energy) ? {freq, energy} : max
		
		const x = getX(freq)
		const h = getY(energy)
		rect(x, height, gap - 1, h)
	}

	// Rolling average
	if (micLevel > 0.005) {
		maxes.push(max)
	}
	if (maxes.length > SENSITIVITY) {
		maxes.splice(0, 1)
	}
	const sumFreq = maxes.reduce((s, m) => s + m.freq, 0)
	const avgFreq = sumFreq / maxes.length
	const x = getX(avgFreq)
	const h = -300
	fill(0, 50, 250);
	rect(x, height, gap, h)




	spectrum = fft.analyze();
	// for (var i = 0; i < spectrum.length; i++) {
	// 	var x = map(i, 0, spectrum.length, 0, width);
	// 	var h = -height + map(spectrum[i], 0, 255, height, 0);
	// 	rect(x, height, width / spectrum.length, h)
	// }

	fill(0, 0, 255);
	ellipse(width / 2, constrain(height - micLevel * height * 5, 0, height), 10, 10);
}

function getY(energy)
{
	return -height + map(energy, 0, 255, height, 0);
}
function getX(frequency)
{
	return frequency
}