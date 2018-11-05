let PATH = require('path');
let TRANSFORM_BASECLASS = require(PATH.join(__dirname, 'transformbaseclass.js')).TransformBaseClass;

//-----------------------------------

class Offset extends TRANSFORM_BASECLASS {
  constructor(src, start, end) {
    super();
    this.src_ = src;
    this.start_ = start;
    this.end_ = end;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-virtual-pixel', 'transparent', '-distort', 'Affine', `${this.start_.x_},${this.start_.y_} ${this.end_.x_},${this.end_.y_}`];
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
   * @param {Coordinates} start Relative start position.
   * @param {Coordinates} end Relative end position.
   * @returns {Offset} Returns an Offset object. If inputs are invalid, it returns null.
   */
  static Create(src, start, end) {
    if (!src || !start || !end)
      return null;

    return new Offset(src, start, end);
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