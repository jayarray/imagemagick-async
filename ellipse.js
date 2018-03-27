let VALIDATE = require('./validate.js');
let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;

//---------------------------------
// CONSTANTS

const DIMENSIONS_MIN = 0;
const WIDTH_MIN = 1;

//---------------------------------
// ELLIPSE

class Ellipse {
  constructor(center, width, height, strokeColor, strokeWidth, fillColor, angleStart, angleEnd) {
    this.center_ = center; // Coordinates
    this.width_ = width;
    this.height_ = height;
    this.strokeColor_ = strokeColor;
    this.strokeWidth_ = strokeWidth;
    this.fillColor_ = fillColor;
    this.angleStart_ = angleStart; //Starts at 3 o'clock position (on screen) and goes clockwise
    this.angleEnd_ = angleEnd;
  }

  /** 
   * @returns {Array<string|number>} Returns an array of arguments.
  */
  Args() {
    return [
      '-fill', this.fillColor_,
      '-stroke', this.strokeColor_,
      '-strokewidth', this.strokeWidth_,
      '-draw', `ellipse ${this.center_.String()} ${Math.floor(this.width_ / 2)},${Math.floor(this.height_ / 2)} ${this.angleStart_},${this.angleEnd_}`
    ];
  }

  /**
   * Create an Eliipse object with the specified properties.
   * @param {Coordinates} center Coordinates for the center of the ellipse.
   * @param {number} width Width of of ellipse (in pixels).
   * @param {number} height Height of ellipse (in pixels.).
   * @param {string} strokeColor The outline color of the ellipse. (Valid color format string used in Image Magick)
   * @param {number} strokeWidth Width of the outline of the ellipse. (Larger value produces a thicker line).
   * @param {string} fillColor The color of the inside of the ellipse. (Valid color format string used in Image Magick)
   * @param {number} angleStart Angle at which to start drawing the ellipse. (0-degrees starts at 3-o'clock on the screen)
   * @param {number} angleEnd Angle at which to stop drawing the ellipse. (360-degrees stops at 3-o'clock on the screen)
   */
  static Create(center, width, height, strokeColor, strokeWidth, fillColor, angleStart, angleEnd) {
    if (center.constructor.name != 'Coordinates')
      return Promise.reject(`Failed to create circle: center is not valid type.`);

    let error = VALIDATE.IsInteger(width);
    if (error)
      return Promise.reject(`Failed to create path: width is ${error}`);

    error = VALIDATE.IsIntegerInRange(width, DIMENSIONS_MIN, null);
    if (error)
      return Promise.reject(`Failed to create path: width is ${error}`);

    error = VALIDATE.IsInteger(height);
    if (error)
      return Promise.reject(`Failed to create path: height is ${error}`);

    error = VALIDATE.IsIntegerInRange(height, DIMENSIONS_MIN, null);
    if (error)
      return Promise.reject(`Failed to create path: height is ${error}`);

    error = VALIDATE.IsStringInput(strokeColor);
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

    error = VALIDATE.IsInteger(angleStart);
    if (error)
      return Promise.reject(`Failed to create path: start angle is ${error}`);

    error = VALIDATE.IsInteger(angleEnd);
    if (error)
      return Promise.reject(`Failed to create path: end angle is ${error}`);

    return Promise.resolve(new Ellipse(center, width, height, strokeColor, strokeWidth, fillColor, angleStart, angleEnd));
  }
}

/**
 * Render an ellipse to the specified destination.
 * @param {Canvas} canvas Canvas object
 * @param {Ellipse} ellipse Ellipse object
 * @param {string} dest Destination
 */
function Draw(canvas, ellipse, dest) {
  if (canvas.constructor.name != 'Canvas')
    return Promise.reject(`Failed to draw ellipse: canvas is invalid type.`);

  if (ellipse.constructor.name != 'Ellipse')
    return Promise.reject(`Failed to draw ellipse: ellipse is invalid type.`);

  let error = VALIDATE.IsStringInput(dest);
  if (error)
    return Promise.reject(`Failed to draw ellipse: dest is ${error}`);

  return new Promise((resolve, reject) => {
    LOCAL_COMMAND.Execute('convert', canvas.Args().concat(ellipse.Args()).concat(dest)).then(output => {
      if (output.stderr) {
        reject(`Failed to draw ellipse: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to draw ellipse: ${error}`);
  });
}

//----------------------------
// EXPORTS.

exports.Create = Ellipse.Create;
exports.Draw = Draw;