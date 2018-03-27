let VALIDATE = require('./validate.js');
let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;

//----------------------------------
// CONSTANTS

const DIMENSION_MIN = 1;

//-----------------------------------
// CANVAS

class Canvas {
  /**
   * @param {number} width Width in pixels.
   * @param {number} height Height in pixels.
   * @param {string} color Valid color format string used in Image Magick.
   */
  constructor(width, height, color) {
    this.width_ = width;
    this.height_ = height;
    this.color_ = color;
  }

  /** 
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    let args = ['-size', `${this.width_}x${this.height_}`];

    if (this.color_ == 'none')
      args.push('canvas:none');
    else
      args.push(`canvas:${this.color_}`);
    return args;
  }

  /**
   * Creates a Canvas object given the specified width, height, and color.
   * @param {number} width Width in pixels.
   * @param {number} height Height in pixels.
   * @param {string} color Valid color format string used in Image Magick.
   * @returns {Promise<Canvas>} Returns a promise. If it resolves, it returns a Canvas object. Otherwise, it returns an error.
   */
  static Create(width, height, color) {
    // Check width
    let error = VALIDATE.IsNumber(width);
    if (error)
      return Promise.reject(`Failed to create canvas: width is ${error}`);

    if (width < 0)
      return Promise.reject(`Failed to create canvas: width must be greater than 0.`);

    // Check height
    error = VALIDATE.IsNumber(height);
    if (error)
      return Promise.reject(`Failed to create canvas: height is ${error}`);

    if (height < 0)
      return Promise.reject(`Failed to create canvas: height must be greater than 0.`);

    // Check height
    error = VALIDATE.IsStringInput(color);
    if (error)
      return Promise.reject(`Failed to create canvas: color is ${error}`);

    // Create canvas
    return Promise.resolve(new Canvas(width, height, color));
  }
}

/**
 * Render a canvas to the specified destination.
 * @param {Canvas} canvas Canvas object
 * @param {string} dest Destination
 */
function Draw(canvas, dest) {
  let error = VALIDATE.IsStringInput(dest);
  if (error)
    return Promise.reject(`Failed to draw canvas: dest is ${error}`);

  if (canvas.constructor.name != 'Canvas')
    return Promise.reject(`Failed to draw canvas: canvas is invalid type.`);

  return new Promise((resolve, reject) => {
    LOCAL_COMMAND.Execute('convert', canvas.Args().concat(dest)).then(output => {
      if (output.stderr) {
        reject(`Failed to draw canvas: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to draw canvas: ${error}`);
  });
}

//--------------------------------
// EXPORTS

exports.Create = Canvas.Create;
exports.Draw = Draw;