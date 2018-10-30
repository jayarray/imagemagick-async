let PATH = require('path');
let TRANSFORM_BASECLASS = require(PATH.join(__dirname, 'transformbaseclass.js')).TransformBaseClass;

//-----------------------------------

class RotateAroundPoint extends TRANSFORM_BASECLASS {
  constructor(src, x, y, degrees) {
    super();
    this.src_ = src;
    this.x_ = x;
    this.y_ = y;
    this.degrees_ = degrees;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-distort', 'SRT', `${this.x_},${this.y_} ${this.degrees_}`];
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
    return 'RotateAroundPoint';
  }

  /**
   * Create a RotateAroundPoint object. Rotate an image around a point.
   * @param {string} src
   * @param {numbers} x X-coordinate of the point.
   * @param {numbers} y Y-ccordinate of the point.
   * @param {numbers} degrees Integer value representing the number of degrees to rotate the image. A positive value indicates clockwise rotation. A negative value indicates counter-clockwise rotation.
   * @returns {RotateAroundPoint} Returns a RotateAroundPoint object. If inputs are invalid, it returns null.
   */
  static Create(src, x, y, degrees) {
    if (!src || isNaN(x) || isNaN(y) || isNaN(degrees))
      return null;

    return new RotateAroundPoint(src, x, y, degrees);
  }
}

//-----------------------------
// EXPORTS

exports.Create = RotateAroundPoint.Create;
exports.Name = 'RotateAroundPoint';
exports.Layer = true;
exports.Consolidate = true;
exports.Dependencies = null;
exports.ComponentType = 'drawable';