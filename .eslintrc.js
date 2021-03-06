module.exports = {
    "extends": "standard",
    "plugins": [
        "standard"
    ],
    "rules": {
        "no-var": "error",
        "brace-style": ["error", "1tbs"]
    },
    "globals": {
        // p5 globals
        "createCanvas": false,
        "p5": false,
        "background": false,
        "noStroke": false,
        "rect": false,
        "rectMode": false,
        "map": false,
        "height": false,
        "width": false,
        "fill": false,
        "color": false,
        "text": false,
        "textSize": false,
        "textAlign": false,
        "CENTER": false,
        "mousePressed": false,
        "mouseReleased": false,
        "mouseDragged": false,
        "mouseY": false,

        // browser
        "localStorage": false,
    }
};