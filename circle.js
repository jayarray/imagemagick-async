let VALIDATE = require('./validate.js');
let COLOR = require('./color.js');
let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;

//---------------------------------
// CONSTANTS

const WIDTH_MIN = 1;

//---------------------------------

class Circle {
  /**
   * @param {Coordinates} center Coordinates for center of circle.
   * @param {Coordinates} edge  Coordinates for point on edge of circle. (Used for computing the radius.)
   * @param {string} strokeColor The color of the line that makes up the circle. (Valid color format string used in Image Magick)
   * @param {number} strokeWidth The width of the line that makes up the circle. (Larger value produces a thicker line.)
   * @param {string} fillColor The color to fill the circle with. (Valid color format string used in Image Magick)
   */
  constructor(center, edge, strokeColor, strokeWidth, fillColor) {
    this.center_ = center;
    this.edge_ = edge;
    this.strokeColor_ = strokeColor;
    this.strokeWidth_ = strokeWidth;
    this.fillColor_ = fillColor;
  }

  /** 
   * @returns {Array<string|number>} Returns an array of arguments.
  */
  Args() {
    return ['-fill', this.fillColor_, '-stroke', this.strokeColor_, '-strokewidth', this.strokeWidth_,
      '-draw', `circle ${this.center_.String()} ${this.edge_.String()}`];
  }

  /**
   * Create a Circle object using the specified properties.
   * @param {Coordinates} center Coordinates for center of circle.
   * @param {Coordinates} edge  Coordinates for point on edge of circle. (Used for computing the radius.)
   * @param {string} strokeColor The color of the line that makes up the circle. (Valid color format string used in Image Magick)
   * @param {number} strokeWidth The width of the line that makes up the circle. (Larger value produces a thicker line.)
   * @param {string} fillColor The color to fill the circle with. (Valid color format string used in Image Magick)
   */
  static Create(center, edge, strokeColor, strokeWidth, fillColor) {
    if (center.constructor.name != 'Coordinates')
      return Promise.reject(`Failed to create circle: center is not valid type.`);

    if (edge.constructor.name != 'Coordinates')
      return Promise.reject(`Failed to create circle: edge is not valid type.`);

    let error = VALIDATE.IsStringInput(strokeColor);
    if (error)
      return Promise.reject(`Failed to create circle: stroke color is ${error}`);

    error = VALIDATE.IsInteger(strokeWidth);
    if (error)
      return Promise.reject(`Failed to create path: stroke width is ${error}`);

    error = VALIDATE.IsIntegerInRange(strokeWidth, WIDTH_MIN, null);
    if (error)
      return Promise.reject(`Failed to create path: stroke width is ${error}`);

    error = VALIDATE.IsStringInput(fillColor);
    if (error)
      return Promise.reject(`Failed to create path: fill color is ${error}`);

    return Promise.resolve(new Circle(center, edge, strokeColor, strokeWidth, fillColor));
  }
}

/**
 * Render a circle to the specified destination.
 * @param {Canvas} canvas Canvas object
 * @param {Circle} circle Circle object
 * @param {string} dest Destination
 */
function Draw(canvas, circle, dest) {
  if (canvas.constructor.name != 'Canvas')
    return Promise.reject(`Failed to draw circle: canvas is invalid type.`);

  if (circle.constructor.name != 'Circle')
    return Promise.reject(`Failed to draw circle: circle is invalid type.`);

  let error = VALIDATE.IsStringInput(dest);
  if (error)
    return Promise.reject(`Failed to draw circle: dest is ${error}`);

  return new Promise((resolve, reject) => {
    LOCAL_COMMAND.Execute('convert', canvas.Args().concat(circle.Args()).concat(dest)).then(output => {
      if (output.stderr) {
        reject(`Failed to draw circle: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to draw circle: ${error}`);
  });
}

//---------------------------------

let COORDINATES = require('./coordinates.js');
let CANVAS = require('./canvas.js');

CANVAS.Create(800, 800, '#ffffff').then(canvas => {
  COORDINATES.Create(400, 400).then(center => {
    COORDINATES.Create(400, 600).then(edge => {
      let strokeColor = '#f0f0f0';
      let strokeWidth = 5;
      let fillColor = '#000000';
      let dest = '/home/isa/Downloads/DRAW_CIRCLE.png';

      Circle.Create(center, edge, strokeColor, strokeWidth, fillColor).then(circle => {
        Draw(canvas, circle, dest).then(success => {
          console.log(`Success :-)`);
        }).catch(error => {
          console.log(`ERROR: ${error}`);
        });
      }).catch(error => {
        console.log(`ERROR: ${error}`);
      });
    }).catch(error => {
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

exports.Create = Circle.Create;
exports.Draw = Draw;