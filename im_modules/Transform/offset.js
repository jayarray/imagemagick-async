let PATH = require('path');
let TRANSFORM_BASECLASS = require(PATH.join(__dirname, 'transformbaseclass.js')).TransformBaseClass;

//-----------------------------------

class Offset extends TRANSFORM_BASECLASS {
  constructor(src, x0, y0, x1, y1) {
    super();
    this.src_ = src;
    this.x0_ = x0;
    this.y0_ = y0;
    this.x1_ = x1;
    this.y1_ = y1;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-virtual-pixel', 'transparent', '-distort', 'Affine', `${this.x0_},${this.y0_} ${this.x1_},${this.y1_}`];
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments used for rendering this layer.
   */
  RenderArgs() {
    return [this.src_].concat(this.Args());
  }

  /**
  * @override
  */
  Name() {
    return 'Offset';
  }

  /**
   * Create an Offset object.Shift an image relative to the start and end coordinates. Shift is computed as: Xshift = x1 - x0 and Yshift = y1 - y0.
   * @param {string} src
   * @param {number} x0 Start X-coordinate
   * @param {number} y0 Start Y-coordinate
   * @param {number} x1 End X-coordinate
   * @param {number} y1 End Y-coordinate
   * @returns {Offset} Returns an Offset object. If inputs are invalid, it returns null.
   */
  static Create(src, x0, y0, x1, y1) {
    if (!src || isNaN(x0) || isNaN(y0) || isNaN(x1) || isNaN(y1))
      return null;

    return new Offset(src, x0, y0, x1, y1);
  }
}

//----------------------------
// EXDPORTS

exports.Create = Offset.Create;
exports.Name = 'Offset';
exports.Layer = true;
exports.Consolidate = true;
exports.Dependencies = null;
exports.ComponentType = 'drawable';