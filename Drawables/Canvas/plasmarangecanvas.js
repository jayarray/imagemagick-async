let PATH = require('path');
let CANVAS_BASECLASS = require(PATH.join(__dirname, 'canvasbaseclass.js')).CanvasBaseClass;

let MIN_WIDTH = 1;
let MIN_HEIGHT = 1;

//----------------------------------------
// COLOR CANVAS

class PlasmaRangeCanvas extends CANVAS_BASECLASS {
  constructor(width, height, startColor, endColor) {
    super(width, height);
    this.startColor_ = startColor;
    this.endColor_ = endColor;
  }

  /**
   * @override
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    let plasmaStr = 'plasma:';

    if (this.startColor_) {
      if (this.endColor_)
        plasmaStr += `${this.startColor_}-${this.endColor_}`;
      else
        plasmaStr += this.startColor_;
    }

    let args = ['-size', `${this.width_}x${this.height_}`, plasmaStr];

    if (this.Primitives().length > 0)
      this.Primitives().forEach(p => args = args.concat(p.Args()));

    return args;
  }

  /**
   * @override
   */
  Name() {
    return 'PlasmaRangeCanvas';
  }

  /**
   * Create a PlasmaRangeCanvas object with the specified properties. Omiting the end color will result in a defualt gradient that begins with the start color. Omiting the start color (or both start and end colors) results in a randomly generated gradient.
   * @param {number} width Width (in pixels)
   * @param {number} height Height (in pixels)
   * @param {string} startColor Hex string
   * @param {string} endColor Hex string
   * @returns {PlasmaRangeCanvas} Returns a PlasmaRangeCanvas object. If inputs are invalid, it returns null.
   */
  static Create(width, height, startColor, endColor) {
    if (width < MIN_WIDTH || height < MIN_HEIGHT)
      return null;

    return new PlasmaRangeCanvas(width, height, startColor, endColor);
  }
}

//-----------------------------
// EXPORTS

exports.Create = PlasmaRangeCanvas.Create;
exports.Name = 'PlasmaRangeCanvas';
exports.Layer = true;
exports.Consolidate = false;
exports.Dependencies = null;
exports.ComponentType = 'drawable';