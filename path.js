let VALIDATE = require('./validate.js');
let COLOR = require('./color.js');
let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;

//---------------------------------
// CONSTANTS

const WIDTH_MIN = 1;

//--------------------------------
// PATH

class Path {
  /** 
  * @param {Array<Coordinates>} points A list of coordinates to be connected by a line in the order provided.
  * @param {string} strokeColor The color of the line connecting all the points. (Valid color format string used in Image Magick)
  * @param {number} strokeWidth Width of the line connecting all the points. (Larger values produce thicker lines.)
  * @param {string} fillColor The color to fill the path with. (Valid color format string used in Image Magick) 
  * @param {boolean} isClosed Set to true if you wish to connect the last point back to the first one (if not done already). Else, set to false.
  */
  constructor(points, strokeColor, strokeWidth, fillColor, isClosed) {
    this.points_ = points;
    this.strokeColor_ = strokeColor;
    this.strokeWidth_ = strokeWidth;
    this.fillColor_ = fillColor;
    this.isClosed_ = isClosed;
  }

  /** 
   * @returns {string} Returns a space-delimited string representing all points in the polygon.
   */
  PointsToString() {
    return this.points_.map(p => p.String()).join(' ');
  }

  /** 
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    let pointsStr = `M ${this.PointsToString()}`;
    if (this.isClosed_)
      pointsStr += ' Z';
    return ['-fill', this.fillColor_, '-stroke', this.strokeColor_, '-strokewidth', this.strokeWidth_, '-draw', `path '${pointsStr}'`];
  }

  /** 
   * Create a Path object with the specified properties.
   * @param {Array<Coordinates>} points A list of coordinates to be connected by a line in the order provided.
   * @param {string} strokeColor The color of the line connecting all the points. (Valid color format string used in Image Magick)
   * @param {string} strokeWidth Width of the line connecting all the points. (Larger values produce thicker lines.)
   * @param {string} fillColor The color to fill the path with. (Valid color format string used in Image Magick) 
   * @param {boolean} isClosed Set to true if you wish to connect the last point back to the first one (if not done already). Else, set to false.
   */
  static Create(points, strokeColor, strokeWidth, fillColor, isClosed) {
    let error = VALIDATE.IsArray(points);
    if (error)
      return Promise.reject(`Failed to create path: points is ${error}`);

    error = VALIDATE.IsStringInput(strokeColor);
    if (error)
      return Promise.reject(`Failed to create path: stroke color is ${error}`);

    error = VALIDATE.IsInteger(strokeWidth);
    if (error)
      return Promise.reject(`Failed to create path: stroke width is ${error}`);

    error = VALIDATE.IsIntegerInRange(strokeWidth, WIDTH_MIN, null);
    if (error)
      return Promise.reject(`Failed to create path: stroke width is ${error}`);

    error = VALIDATE.IsStringInput(fillColor);
    if (error)
      return Promise.reject(`Failed to create path: fill color is ${error}`);

    let isBoolean = isClosed === true || isClosed === false;
    if (!isBoolean)
      return Promise.reject(`Failed to create path: isClosed is not a boolean`);

    return Promise.resolve(new Path(points, strokeColor, strokeWidth, fillColor, isClosed));
  }
}

/**
 * Render a path to the specified destination.
 * @param {Canvas} canvas Canvas object
 * @param {Path} path Path object
 * @param {string} dest Destination
 * @returns {Promise} Returns a promise that resolves if successful, and fails otherwise.
 */
function Draw(canvas, path, dest) {
  if (canvas.constructor.name != 'Canvas')
    return Promise.reject(`Failed to draw path: canvas is invalid type.`);

  if (path.constructor.name != 'Path')
    return Promise.reject(`Failed to draw path: path is invalid type.`);

  let error = VALIDATE.IsStringInput(dest);
  if (error)
    return Promise.reject(`Failed to draw path: dest is ${error}`);

  return new Promise((resolve, reject) => {
    LOCAL_COMMAND.Execute('convert', canvas.Args().concat(path.Args()).concat(dest)).then(output => {
      if (output.stderr) {
        reject(`Failed to draw path: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to draw path: ${error}`);
  });
}

//-----------------------------------
// EXPORTS

exports.Create = Path.Create;
exports.Draw = Draw;