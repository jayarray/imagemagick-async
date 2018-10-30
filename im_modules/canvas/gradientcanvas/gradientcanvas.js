let PATH = require('path');
let CANVAS_BASECLASS = require(PATH.join(__dirname, 'canvasbaseclass.js')).CanvasBaseClass;

let MIN_WIDTH = 1;
let MIN_HEIGHT = 1;

//-----------------------------------

class GradientCanvas extends CANVAS_BASECLASS {
  /**
   * @param {number} width in pixels
   * @param {number} height in pixels
   * @param {LinearGradient|RadialGradient} gradient
   */
  constructor(width, height, gradient) {
    super(width, height);
    this.gradient_ = gradient;
  }

  /**
   * @override
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    let args = ['-size', `${this.width_}x${this.height_}`].concat(this.gradient_.Args());

    if (this.Primitives().length > 0)
      this.Primitives().forEach(p => args = args.concat(p.Args()));

    return args;
  }

  /**
   * @override
   */
  Name() {
    return 'GradientCanvas';
  }

  /**
   * Create a GradientCanvas object with the specified gradient.
   * @param {number} width Width (in pixels)
   * @param {number} height Height (in pixels)
   * @param {Gradient} gradient
   * @returns {GradientCanvas} Returns a GradientCanvas object. If inputs are invalid, it returns null.
   */
  static Create(width, height, gradient) {
    if (width < MIN_WIDTH || height < MIN_HEIGHT || !gradient)
      return null;

    return new GradientCanvas(width, height, gradient);
  }
}

//----------------------------
// EXPORTS

exports.Create = GradientCanvas.Create;