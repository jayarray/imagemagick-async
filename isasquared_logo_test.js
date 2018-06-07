let GUID = require('./guid.js');
let API = require('./api.js');
let COORDINATES = require('./coordinates.js');
let PATH = require('path');
let LINUX_COMMANDS = require('linux-commands-async');

//--------------------------------

function GetSquareCoordinates(origin, sideLength) {
  let topLeft = COORDINATES.Create(origin.x_, origin.y_);
  let bottomLeft = COORDINATES.Create(origin.x_, origin.y_ + sideLength);
  let bottomRight = COORDINATES.Create(origin.x_ + sideLength, origin.y_ + sideLength);
  let topRight = COORDINATES.Create(origin.x_ + sideLength, origin.y_);
  return [topLeft, bottomLeft, bottomRight, topRight];
}

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

// Black square
let blackCanvas = API.ColorCanvas(canvasHeight, canvasWidth, 'none');
let blackColor = '#000000';
let blackWidth = 100;
let blackOrigin = COORDINATES.Create(270, 270);
let blackLength = 540;
let blackCoordinates = GetSquareCoordinates(blackOrigin, blackLength);
let blackSquare = API.Path(blackCoordinates, blackColor, blackWidth, blackColor, true);
let blackTransparency = API.Transparency('?', 50);
blackCanvas.AddPrimitive(blackSquare, 0, 0);
blackCanvas.ApplyFxOrMod(blackTransparency);
blackCanvas.ApplyFxOrMod(blur);

// Purple square
let purpleCanvas = API.ColorCanvas(canvasHeight, canvasWidth, 'none');
let purpleColor = '#b366ff';//'#8000ff'; //'#330066';
let purpleWidth = 100;
let purpleOrigin = COORDINATES.Create(270, 270);
let purpleLength = 540;
let purpleCoordinates = GetSquareCoordinates(purpleOrigin, purpleLength);
let purpleSquare = API.Path(purpleCoordinates, purpleColor, purpleWidth, 'none', true);
let purpleTransparency = API.Transparency('?', 50);
purpleCanvas.AddPrimitive(purpleSquare, 0, 0);
purpleCanvas.ApplyFxOrMod(purpleTransparency);
purpleCanvas.ApplyFxOrMod(blur);


canvas.Draw(purpleCanvas, 0, 0);

// Blue square
let blueCanvas = API.ColorCanvas(canvasHeight, canvasWidth, 'none');
let blueColor = '#1ab2ff'; //'#66ccff';
let blueWidth = 50;
let blueOrigin = COORDINATES.Create(270, 270);
let blueLength = 540;
let blueCoordinates = GetSquareCoordinates(blueOrigin, blueLength);
let blueSquare = API.Path(blueCoordinates, blueColor, blueWidth, 'none', true);
let blueTransparency = API.Transparency('?', 50);
blueCanvas.AddPrimitive(blueSquare, 0, 0);
blueCanvas.ApplyFxOrMod(blueTransparency);
blueCanvas.ApplyFxOrMod(blur);
canvas.Draw(blueCanvas, 0, 0);

// White square
let whiteCanvas = API.ColorCanvas(canvasHeight, canvasWidth, 'none');
let whiteColor = '#e6f7ff';
let whiteWidth = 10;
let whiteOrigin = COORDINATES.Create(270, 270);
let whiteLength = 540;
let whiteCoordinates = GetSquareCoordinates(whiteOrigin, whiteLength);
let whiteSquare = API.Path(whiteCoordinates, whiteColor, whiteWidth, 'none', true);
whiteCanvas.AddPrimitive(whiteSquare, 0, 0);
canvas.Draw(whiteCanvas, 0, 0);

// RENDER
let outputPath = PATH.join(outputDir, 'logo.png');

canvas.Render(outputPath).then(success => {
  console.log('Success :-)');
}).catch(error => {
  console.log(`ERROR: ${error}`);
});