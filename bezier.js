let VALIDATE = require('./validate.js');
let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;

//---------------------------------
// CONSTANTS

const WIDTH_MIN = 1;

//---------------------------------
// ELLIPSE

class Bezier {
  constructor(points, strokeColor, strokeWidth, fillColor) {
    this.points_ = points;
    this.strokeColor_ = strokeColor;
    this.strokeWidth_ = strokeWidth;
    this.fillColor_ = fillColor;
  }

  /** 
   * @returns {string} Returns a space-delimited string representing all points in the bezier curve.
   */
  PointsToString() {
    return this.points_.map(p => p.String()).join(' ');
  }

  /** 
   * @returns {Array<string|number>} Returns an array of arguments.
  */
  Args() {
    return [
      '-fill', this.fillColor_,
      '-stroke', this.strokeColor_,
      '-strokewidth', this.strokeWidth_,
      '-draw', `bezier ${this.PointsToString()}`
    ];
  }

  /**
   * Create a Bezier object with the specified properties.
   * @param {Array<Coordinates>} points A list of points for the bezier curve to travel through.
   * @param {string} strokeColor The color of the line connecting all the points. (Valid color format string used in Image Magick)
   * @param {number} strokeWidth Width of the line connecting all the points. (Larger values produce thicker lines.)
   * @param {string} fillColor The color to fill the bezier. (Valid color format string used in Image Magick)
   * @returns {Promise<Bezier>} Returns a promise. If it resolves, it returns a Bezier object. Otherwise, it returns an error.
   */
  static Create(points, strokeColor, strokeWidth, fillColor) {
    let error = VALIDATE.IsArray(points);
    if (error)
      return Promise.reject(`Failed to create bezier curve: points is ${error}`);

    error = VALIDATE.IsStringInput(strokeColor);
    if (error)
      return Promise.reject(`Failed to create bezier curve: stroke color is ${error}`);

    error = VALIDATE.IsInteger(strokeWidth);
    if (error)
      return Promise.reject(`Failed to create bezier curve: stroke width is ${error}`);

    error = VALIDATE.IsIntegerInRange(strokeWidth, WIDTH_MIN, null);
    if (error)
      return Promise.reject(`Failed to create bezier curve: stroke width is ${error}`);

    error = VALIDATE.IsStringInput(fillColor);
    if (error)
      return Promise.reject(`Failed to create bezier curve: fill color is ${error}`);

    return Promise.resolve(new Bezier(points, strokeColor, strokeWidth, fillColor));
  }
}

/**
 * Render a bezier curve to the specified destination.
 * @param {Canvas} canvas Canvas object
 * @param {Bezier} bezier Ellipse object
 * @param {string} dest Destination
 * @returns {Promise} Returns a promise that resolves if successful, and fails otherwise.
 */
function Draw(canvas, bezier, dest) {
  if (canvas.constructor.name != 'Canvas')
    return Promise.reject(`Failed to draw bezier curve: canvas is invalid type.`);

  if (bezier.constructor.name != 'Bezier')
    return Promise.reject(`Failed to draw bezier curve: bezier is invalid type.`);

  let error = VALIDATE.IsStringInput(dest);
  if (error)
    return Promise.reject(`Failed to draw bezier curve: dest is ${error}`);

  return new Promise((resolve, reject) => {
    LOCAL_COMMAND.Execute('convert', canvas.Args().concat(bezier.Args()).concat(dest)).then(output => {
      if (output.stderr) {
        reject(`Failed to draw bezier curve: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to draw bezier curve: ${error}`);
  });
}

//----------------------------
// EXPORTS

exports.Create = Ellipse.Create;
exports.Draw = Draw;