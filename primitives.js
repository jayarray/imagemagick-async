let VALIDATE = require('./validate.js');

//----------------------------------
// CONSTANTS

const DIMENSION_MIN = 1;

//-----------------------------------
// CANVAS

class Canvas {
  /**
   * @param {number} width 
   * @param {number} height 
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
   * Creates a canvas given the specified width, height, and color.
   * @param {number} width 
   * @param {number} height 
   * @param {string} color Hex string representation of the desired color starting with a '#' symbol.
   * @returns {Promise<Canvas>}
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
// EXPORTS

exports.CreateCanvas = Canvas.Create;