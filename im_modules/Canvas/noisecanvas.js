let PATH = require('path');
let CANVAS_BASECLASS = require(PATH.join(__dirname, 'canvasbaseclass.js')).CanvasBaseClass;

let MIN_WIDTH = 1;
let MIN_HEIGHT = 1;

//----------------------------------------
// COLOR CANVAS

class NoiseCanvas extends CANVAS_BASECLASS {
  constructor(width, height) {
    super(width, height);
  }

  /**
   * @override
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    let args = ['-size', `${this.width_}x${this.height_}`, 'canvas:', '+noise', 'Random'];

    if (this.Primitives().length > 0)
      this.Primitives().forEach(p => args = args.concat(p.Args()));

    return args;
  }

  /**
   * @override
   */
  Name() {
    return 'NoiseCanvas';
  }

  /**
   * Create a NoiseCanvas object with the specified properties.
   * @param {number} width Width (in pixels)
   * @param {number} height Height (in pixels)
   * @returns {NoiseCanvas} Returns a NoiseCanvas object. If inputs are invalid, it returns null.
   */
  static Create(width, height) {
    if (width < MIN_WIDTH || height < MIN_HEIGHT)
      return null;

    return new NoiseCanvas(width, height);
  }
}

//-----------------------------
// EXPORTS

exports.Create = NoiseCanvas.Create;
exports.Name = 'NoiseCanvas';
exports.Layer = true;
exports.Consolidate = false;
exports.Dependencies = null;
exports.ComponentType = 'drawable';