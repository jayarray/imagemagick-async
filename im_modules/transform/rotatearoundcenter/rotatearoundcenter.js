let PATH = require('path');
let TRANSFORM_BASECLASS = require(PATH.join(__dirname, 'transformbaseclass.js')).TransformBaseClass;

//-----------------------------------

class RotateAroundCenter extends TRANSFORM_BASECLASS {
  constructor(src, degrees) {
    super();
    this.src_ = src;
    this.degrees_ = degrees;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-distort', 'SRT', this.degrees_];
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
    return 'RotateAroundCenter';
  }

  /**
   * Create a RotateAroundCenter object. Rotate an image around the center.
   * @param {string} src
   * @param {numbers} degrees Integer value representing the number of degrees to rotate the image. A positive value indicates clockwise rotation. A negative value indicates counter-clockwise rotation.
   * @returns {RotateAroundCenter} Returns a RotateAroundCenter object. If inputs are invalid, it returns null.
   */
  static Create(src, degrees) {
    if (!src || isNaN(degrees))
      return null;

    return new RotateAroundCenter(src, degrees);
  }
}

//----------------------------
// EXPORTS

exports.Create = RotateAroundCenter.Create;