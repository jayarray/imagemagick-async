let GUID = require('./guid.js');
let API = require('./api.js');
let COORDINATES = require('./coordinates.js');
let PATH = require('path');
let LINUX_COMMANDS = require('linux-commands-async');

//----------------------------------

let outputDir = '/home/isa/Downloads';
let format = 'png';

// Create FX
let radius = 10;
let sigma = 10;
let hasTransparency = true;
let blur = API.Blur('?', radius, sigma, hasTransparency);

// Create main canvas
let canvasWidth = 1080;
let canvasHeight = 1080;
let canvas = API.ColorCanvas(canvasHeight, canvasWidth, 'black');

// Create label
let labelWidth = null;
let labelHeight = null;
let labelText = 'isa';
let labelFont = 'Candice';
let labelFontSize = 72;
let labelStrokeWidth = 1;
let labelStrokeColor = '#00ff55';
let labelFillColor = null;
let labelUnderColor = null;
let labelBackgroundColor = null;
let labelGravity = 'Center';
let label = API.LabelCanvas(labelWidth, labelHeight, labelText, labelFont, labelFontSize, labelStrokeWidth, labelStrokeColor, labelFillColor, labelUnderColor, labelBackgroundColor, labelGravity);
//label.ApplyFxOrMod(blur);


// RENDER
let outputPath = PATH.join(outputDir, 'name_logo.png');

label.Render(outputPath).then(success => {
  console.log('Success :-)');
}).catch(error => {
  console.log(`ERROR: ${error}`);
});