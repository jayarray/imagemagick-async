let PATH = require('path');
let TRANSFORM_BASECLASS = require(PATH.join(__dirname, 'transformbaseclass.js')).TransformBaseClass;

//-----------------------------------

class RotateAroundPoint extends TRANSFORM_BASECLASS {
  constructor(src, point, degrees) {
    super();
    this.src_ = src;
    this.point_ = point;
    this.degrees_ = degrees;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-distort', 'SRT', `${this.point_.x_},${this.point_.y_} ${this.degrees_}`];
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
   * @param {Coordinates} point Point to rotate about.
   * @param {numbers} degrees Integer value representing the number of degrees to rotate the image. A positive value indicates clockwise rotation. A negative value indicates counter-clockwise rotation.
   * @returns {RotateAroundPoint} Returns a RotateAroundPoint object. If inputs are invalid, it returns null.
   */
  static Create(src, point, degrees) {
    if (!src || !point || isNaN(degrees))
      return null;

    return new RotateAroundPoint(src, point, degrees);
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