let CANVAS = require('./canvas.js');
let PRIMITIVES = require('./primitives.js');
let COORDINATES = require('./coordinates.js');
let OPTIMIZER = require('./optimizer.js');

let LAYER = require('./layer.js');
let PATH = require('path');

//--------------------------------

let outputDir = '/home/isa/Downloads';

let pikachuImg = PATH.join(outputDir, 'pikachu.png');
let degrees = 0;
let dest = PATH.join(outputDir, 'OUTPUT.png');

let swirl = LAYER.Swirl(pikachuImg, degrees);
swirl.Render(dest).then(success => {
  console.log('Success :-)');
}).catch(error => {
  console.log(`ERROR: ${error}`);
});


/*
// Z
let z = CANVAS.CreateColorCanvas(800, 800, 'Z');

// X
let x = PRIMITIVES.CreateLine(COORDINATES.Create(0, 0), COORDINATES.Create(400, 400), 'X');

let a = CANVAS.CreateColorCanvas(800, 800, 'A');
let al1 = PRIMITIVES.CreateLine(COORDINATES.Create(0, 0), COORDINATES.Create(400, 400), 'A1');
a.Draw(al1, 0, 0);

let b = CANVAS.CreateColorCanvas(800, 800, 'B');
let bl1 = PRIMITIVES.CreateLine(COORDINATES.Create(0, 0), COORDINATES.Create(400, 400), 'B1');
let bl2 = PRIMITIVES.CreateLine(COORDINATES.Create(0, 0), COORDINATES.Create(400, 400), 'B2');
b.Draw(bl1, 0, 0);
b.Draw(bl2, 0, 0);

x.Draw(a, 0, 0);
x.Draw(b, 100, 100);


// Y
let y = CANVAS.CreateColorCanvas(800, 800, 'Y');

let c = CANVAS.CreateColorCanvas(800, 800, 'C');
let cl1 = PRIMITIVES.CreateLine(COORDINATES.Create(0, 0), COORDINATES.Create(400, 400), 'C1');
let cl2 = PRIMITIVES.CreateLine(COORDINATES.Create(400, 0), COORDINATES.Create(800, 800), 'C2');
let cl3 = PRIMITIVES.CreateLine(COORDINATES.Create(400, 0), COORDINATES.Create(800, 800), 'C3');
c.Draw(cl1, 0, 0);
c.Draw(cl2, 0, 0);
c.Draw(cl3, 0, 0);

let d = CANVAS.CreateColorCanvas(800, 800, 'D');

y.Draw(c, 0, 0);
y.Draw(d, 100, 100);

x.Draw(y, 400, 400);

z.Draw(x, 0, 0);

let analysis = OPTIMIZER.Analyze(z);
*/