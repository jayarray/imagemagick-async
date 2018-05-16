let VALIDATE = require('./validate.js');
let CONSTANTS = require('./constants.js');
let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;
let LINUX_COMMANDS = require('linux-commands-async');
let PATH = require('path');

let Layer = require('./layerbase.js').Layer;

//-----------------------------------
// CANVAS (Interface)

class Canvas extends Layer {
  constructor() {
    super();
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  GetArgs_() {
    return []; // Override
  }

  /**
   * @param {string} outputPath The location where the image will be rendered.
   * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
   */
  Render(outputPath) {
    let error = VALIDATE.IsStringInput(outputPath);
    if (error)
      return Promise.reject(`Failed to draw canvas: output path is ${error}`);

    return new Promise((resolve, reject) => {
      // Add canvas args
      let args = this.GetArgs_().concat(outputPath);

      LOCAL_COMMAND.Execute('convert', args).then(output => {
        if (output.stderr) {
          reject(`Failed to draw canvas: ${output.stderr}`);
          return;
        }
        resolve();
      }).catch(error => `Failed to draw canvas: ${error}`);
    });
  }

  /**
   * @override
   * @returns {string} Returns a string of the type name.
   */
  Type() {
    return 'canvas';
  }
}

//----------------------------------------
// COLOR CANVAS

class ColorCanvas extends Canvas {
  /**
   * @param {number} width Width (in pixels)
   * @param {number} height Height (in pixels)
   * @param {string} color The color of the canvas. (Valid color format string used in Image Magick)
   */
  constructor(width, height, color) {
    super();
    this.width_ = width;
    this.height_ = height;
    this.color_ = color;
  }

  /**
   * @override
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  GetArgs_() {
    return ['-size', `${this.width_}x${this.height_}`, `canvas:${this.color_}`];
  }

  /**
   * Create a Colorcanvas object with the specified properties.
   * @param {number} width Width (in pixels)
   * @param {number} height Height (in pixels)
   * @param {string} color The color of the canvas. (Valid color format string used in Image Magick)
   * @returns {ColorCanvas} Returns a PlainCanvas object. If inputs are invalid, it returns null.
   */
  static Create(width, height, color) {
    if (width < CONSTANTS.MIN_WIDTH || height < CONSTANTS.MIN_HEIGHT)
      return null;

    return new ColorCanvas(width, height, color);
  }
}

//----------------------------------------
// GRADIENT CANVAS

class GradientCanvas extends Canvas {
  /**
   * @param {number} width in pixels
   * @param {number} height in pixels
   * @param {LinearGradient|RadialGradient} gradient
   */
  constructor(width, height, gradient) {
    super();
    this.width_ = width;
    this.height_ = height;
    this.gradient_ = gradient;
  }

  /**
   * @override
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  GetArgs_() {
    return ['-size', `${this.width_}x${this.height_}`].concat(this.gradient_.Args());
  }

  /**
   * Create a GradientCanvas object with the specified gradient.
   * @param {number} width Width (in pixels)
   * @param {number} height Height (in pixels)
   * @param {Gradient} gradient
   * @returns {GradientCanvas} Returns a GradientCanvas object. If inputs are invalid, it returns null.
   */
  static Create(width, height, gradient) {
    if (width < CONSTANTS.MIN_WIDTH || height < CONSTANTS.MIN_HEIGHT || !gradient)
      return null;

    return new GradientCanvas(width, height, gradient);
  }
}

//------------------------------------
// IMAGE CANVAS

class ImageCanvas extends Canvas {
  /**
   * @param {string} src Source
   */
  constructor(src) {
    super();
    this.src_ = src;
  }

  /** @override */
  GetArgs_() {
    return [this.src_];
  }

  /**
   * @override
   * @returns {string} Returns a string of the type name.
   */
  Type() {
    return 'file';
  }

  /**
   * Create an ImageCanvas object. If inputs are invalid it returns null.
   * @param {string} src Source
   */
  static Create(src) {
    if (VALIDATE.IsStringInput(src))
      return null;

    return new ImageCanvas(src);
  }
}

//--------------------------------
// EXPORTS

exports.CreateColorCanvas = ColorCanvas.Create;
exports.CreateGradientCanvas = GradientCanvas.Create;
exports.CreateImageCanvas = ImageCanvas.Create;