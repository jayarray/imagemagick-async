let CANVAS = require('./canvas.js');
let PRIMITIVES = require('./primitives.js');
let COORDINATES = require('./coordinates.js');
let OPTIMIZER = require('./optimizer.js');

let LAYER = require('./layer.js');
let PATH = require('path');

//--------------------------------

let outputDir = '/home/isa/Downloads';
let outputPath = PATH.join(outputDir, 'OUT.png');

let forest = CANVAS.CreateImageCanvas(1920, 1080, PATH.join(outputDir, 'forest.png'));
let pikachu = CANVAS.CreateImageCanvas(877, 910, PATH.join(outputDir, 'pikachu.png'));
let polygon = CANVAS.CreateImageCanvas(800, 800, PATH.join(outputDir, 'polygon.png'));

forest.Draw(polygon, 0, 0);
forest.Draw(pikachu, 0, 0);


forest.Render(outputPath).then(success => {
  console.log('Success :-)');
}).catch(error => {
  console.log(`ERROR: ${error}`);
});