let VALIDATE = require('./validate.js');
let COLOR = require('./color.js');
let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;

//-----------------------------------
// POINT

class Point {
  /**
   * @param {number} x X-coordinate
   * @param {number} y Y-coordinate
   * @param {number} color Valid color format string used in Image Magick.
   */
  constructor(x, y, color) {
    this.x_ = x;
    this.y_ = y;
    this.color_ = color;
  }

  /** 
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    return ['-fill', color, '-draw', `point ${this.x_},${this.y_}`];
  }

  /**
   * Creates a Point object given the specified x and y coordinates.
   * @param {number} x X-ccordinate
   * @param {number} y Y-coordinate
   * @returns {Promise<Point>} Returns a promise. If it resolves, it returns a Point object. Otherwise, it returns an error.
   */
  Create(x, y) {
    let error = VALIDATE.IsInteger(x);
    if (error)
      return Promise.reject(`Failed to create point: x is ${error}`);

    error = VALIDATE.IsInteger(y);
    if (error)
      return Promise.reject(`Failed to create point: y is ${error}`);

    return new Promise.resolve(new Point(x, y));
  }
}

/**
 * Render a canvas to the specified destination.
 * @param {Canvas} canvas Canvas object
 * @param {Point} point Point object
 * @param {string} dest Destination
 */
function Draw(canvas, point, dest) {
  if (typeof canvas == 'Canvas')
    return Promise.reject(`Failed to draw point: canvas is invalid type.`);

  if (typeof point == 'Point')
    return Promise.reject(`Failed to draw point: point is invalid type.`);

  let error = VALIDATE.IsStringInput(dest);
  if (error)
    return Promise.reject(`Failed to draw point: dest is ${error}`);

  return new Promise((resolve, reject) => {
    LOCAL_COMMAND.Execute('convert', canvas.Args().concat(point.Args()).concat(dest)).then(output => {
      console.log(`convert ${canvas.Args().concat(point.Args()).concat(dest).join(' ')}`);

      if (output.stderr) {
        reject(`Failed to draw point: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to draw point: ${error}`);
  });
}

//------------------------------
// EXPORTS

exports.Create = Point.Create;
exports.Draw = Draw;