let PATH = require('path');
let CANVAS_BASECLASS = require(PATH.join(__dirname, 'canvasbaseclass.js')).CanvasBaseClass;

let MIN_WIDTH = 1;
let MIN_HEIGHT = 1;

//----------------------------------------
// COLOR CANVAS

class ColorCanvas extends CANVAS_BASECLASS {
  /**
   * @param {number} width Width (in pixels)
   * @param {number} height Height (in pixels)
   * @param {string} color The color of the canvas. (Valid color format string used in Image Magick)
   */
  constructor(width, height, color) {
    super(width, height);
    this.color_ = color;
  }

  /**
   * @override
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    let args = ['-size', `${this.width_}x${this.height_}`, `canvas:${this.color_}`];

    if (this.Primitives().length > 0)
      this.Primitives().forEach(p => args = args.concat(p.Args()));

    return args;
  }

  /**
   * @override
   */
  Name() {
    return 'ColorCanvas';
  }

  /**
   * Create a Colorcanvas object with the specified properties.
   * @param {number} width Width (in pixels)
   * @param {number} height Height (in pixels)
   * @param {string} color The color of the canvas. (Valid color format string used in Image Magick)
   * @returns {ColorCanvas} Returns a PlainCanvas object. If inputs are invalid, it returns null.
   */
  static Create(width, height, color) {
    if (width < MIN_WIDTH || height < MIN_HEIGHT)
      return null;

    return new ColorCanvas(width, height, color);
  }
}

//-----------------------------
// EXPORTS

exports.Create = ColorCanvas.Create;