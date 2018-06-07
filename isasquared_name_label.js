let GUID = require('./guid.js');
let API = require('./api.js');
let COORDINATES = require('./coordinates.js');
let PATH = require('path');
let LINUX_COMMANDS = require('linux-commands-async');

//----------------------------------

let outputDir = '/home/isa/Downloads';
let fontDir = PATH.join(outputDir, 'Font Samples');
let format = 'png';

// Create FX
let radius = 10;
let sigma = 10;
let hasTransparency = true;
let blur = API.Blur('?', radius, sigma, hasTransparency);


// Get all fonts
console.log('\nListing available fonts...');

API.Fonts().then(fonts => {
  console.log(`Found ${fonts.length} fonts!`);
  console.log(`\nPreparing fonts...`);

  let actions = [];

  let excludedFonts = ['Lohit'];
  fonts.filter(x => x.name == 'aakar').forEach(font => {
    // Create main canvas
    let canvasWidth = 1080;
    let canvasHeight = 1080;
    let canvas = API.ColorCanvas(canvasHeight, canvasWidth, 'none');

    // Create label
    let labelWidth = canvasWidth;
    let labelHeight = canvasHeight;
    let labelText = 'ISA';
    let labelFont = font.name;
    let labelFontSize = 200;
    let labelKerning = 20;
    let labelStrokeWidth = 1;
    let labelStrokeColor = '#ffffff';
    let labelFillColor = labelStrokeColor;
    let labelUnderColor = null;
    let labelBackgroundColor = 'none';
    let labelGravity = 'Center';
    let label = API.LabelCanvas(labelWidth, labelHeight, labelText, labelFont, labelFontSize, labelKerning, labelStrokeWidth, labelStrokeColor, labelFillColor, labelUnderColor, labelBackgroundColor, labelGravity);

    canvas.Draw(label, 0, 0);

    let outputPath = PATH.join(fontDir, `${labelFont}.${format}`);
    actions.push(canvas.Render(outputPath));
  });

  // Render all
  console.log(`Done!`);
  console.log('\nRendering all fonts...');

  Promise.all(actions).then(success => {
    console.log(`Done!`);
    console.log('\nSuccess :-)');
  }).catch(error => {
    console.log(`ERROR rendering fonts: ${error}`);
  });
}).catch(error => {
  console.log(`ERROR listing fonts: ${error}`);
});