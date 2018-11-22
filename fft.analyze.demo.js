var osc;
var fft;
const UPPER_BOUND = 300; // Hz

function setup()
{
    createCanvas(800, 100);
    mic = new p5.AudioIn()
    mic.start();
    fft = new p5.FFT();
    fft.setInput(mic)
}

function draw()
{
    background(0);

    var spectrum = fft.analyze();
    noStroke();
    fill(0, 255, 0); // spectrum is green

    var maxEnergy = {i: -1, energy: 0}
    for (var i = 0; i < UPPER_BOUND; i++) {
        var x = map(i, 0, UPPER_BOUND, 0, width);
        const energy = spectrum[i];

        if (energy > maxEnergy.energy) {
            maxEnergy.i = i
            maxEnergy.energy = energy
        }
        var h = -height + map(energy, 0, 255, height, 0);
        rect(x, height, width / UPPER_BOUND, h);
    }

    text(maxEnergy.i, 10, 10)
    text(maxEnergy.energy, 100, 10)
}