let CANVAS = require('./canvas.js');
let PRIMITIVES = require('./primitives.js');
let COORDINATES = require('./coordinates.js');
let OPTIMIZER = require('./optimizer.js');

let LAYER = require('./layer.js');
let PATH = require('path');

//--------------------------------

let outputDir = '/home/isa/Downloads';
let outputPath = PATH.join(outputDir, 'OUT.png');

// Create main canvas
let forest = CANVAS.CreateImageCanvas(1920, 1080, PATH.join(outputDir, 'forest.png'));

// Create other canvases
let pikachu = CANVAS.CreateImageCanvas(877, 910, PATH.join(outputDir, 'pikachu.png'));

let swirl = LAYER.Swirl('?', 180);
let negate = LAYER.Negate('?');
pikachu.ApplyFxOrMod(swirl);
pikachu.ApplyFxOrMod(negate);

let polygon = CANVAS.CreateImageCanvas(800, 800, PATH.join(outputDir, 'polygon.png'));

// Create primitives for main canvas.
let transparentCanvas = CANVAS.CreateColorCanvas(forest.Width(), forest.Height(), 'none');
let circle = PRIMITIVES.CreateCircle(COORDINATES.Create(800, 500), COORDINATES.Create(500, 600), '#0000ff', 5, 'none');
let line = PRIMITIVES.CreateLine(COORDINATES.Create(0, 0), COORDINATES.Create(1920, 1080), '#ff0000', 100);
transparentCanvas.AddPrimitive(circle, 0, 0);
transparentCanvas.AddPrimitive(line, 0, 0);

// Draw layers in desired order
forest.Draw(polygon, 0, 0);
forest.Draw(pikachu, 0, 0);
forest.Draw(transparentCanvas, 0, 0);


forest.Render(outputPath).then(success => {
  console.log('Success :-)');
}).catch(error => {
  console.log(`ERROR: ${error}`);
});