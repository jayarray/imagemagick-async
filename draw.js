let LINUX = require('linux-commands-async');
let LOCAL_COMMAND = LINUX.Command.LOCAL;
let VALIDATE = require('./validate.js');

//----------------------------------
// CONSTANTS


//-----------------------------------
// CANVAS

/**
 * Render a canvas to the specified destination.
 * @param {Canvas} canvas Canvas object.
 * @param {string} dest Destination
 */
function Canvas(canvas, dest) {
  let error = VALIDATE.IsStringInput(dest);
  if (error)
    return Promise.reject(`Failed to draw canvas: dest is ${error}`);

  if (typeof canvas == 'Canvas')
    return Promise.reject(`Failed to draw canvas: canvas is invalid type.`);

  return new Promise((resolve, reject) => {
    LOCAL_COMMAND.Execute('convert', canvas.Args().concat(dest)).then(output => {
      console.log(`convert ${canvas.Args().concat(dest).join(' ')}`);

      if (output.stderr) {
        reject(`Failed to draw canvas: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to draw canvas: ${error}`);
  });
}

//-----------------------------------
// POINT



//-----------------------------------
// LINE



//-----------------------------------
// POLYGON



//-----------------------------------
// CIRCLE



//-----------------------------------
// ELLIPSE



//-----------------------------------
// BEZIER



//-----------------------------------
// TEXT


//-----------------------------------

let PRIMITIVES = require('./primitives.js');
let COLOR = require('./color.js');
let dest = '/home/isa/Downloads/X_CANVAS.png';

COLOR.CreateUsingRGBHexString('#ff00ff').then(color => {
  PRIMITIVES.CreateCanvas(800, 800, color.hex.string).then(canvas => {
    Canvas(canvas, dest).then(success => console.log(`Success :-)`)).catch(error => {
      console.log(`ERROR: ${error}`);
    });
  }).catch(error => {
    console.log(`ERROR: ${error}`);
  });
}).catch(error => {
  console.log(`ERROR: ${error}`);
});




//-----------------------------------
// EXPORTS

exports.Canvas = Canvas;