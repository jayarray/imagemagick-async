let PATH = require('path');
let TRANSFORM_BASECLASS = require(PATH.join(__dirname, 'transformbaseclass.js')).TransformBaseClass;

//-----------------------------------

class ThreePointDistortion extends TRANSFORM_BASECLASS {
  constructor(src, centerVector, xAxisVector, yAxisVector) {
    super();
    this.src_ = src;
    this.centerVector_ = centerVector;
    this.xAxisVector_ = xAxisVector;
    this.yAxisVector_ = yAxisVector;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    let cVectStr = `${this.centerVector_.start_.x_},${this.centerVector_.start_.y_} ${this.centerVector_.end_.x_},${this.centerVector_.end_.y_}`;
    let xVectStr = `${this.xAxisVector_.start_.x_},${this.xAxisVector_.start_.y_} ${this.xAxisVector_.end_.x_},${this.xAxisVector_.end_.y_}`;
    let yVectStr = `${this.yAxisVector_.start_.x_},${this.yAxisVector_.start_.y_} ${this.yAxisVector_.end_.x_},${this.yAxisVector_.end_.y_}`;
    return ['-virtual-pixel', 'background', '-background', 'none', '-distort', 'Affine', `${cVectStr} ${xVectStr} ${yVectStr}`];
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
    return 'ThreePointDistortion';
  }

  /**
   * Create a ThreePointDistortion object. Distorts the image according to 3 vectors: center, x-axis, and y-axis.
   * @param {string} src
   * @param {Vector} centerVector
   * @param {Vector} xAxisVector
   * @param {string} yAxisVector
   * @returns {ThreePointDistortion} Returns a ThreePointDistortion object. If inputs are invalid, it returns null.
   */
  static Create(src, centerVector, xAxisVector, yAxisVector) {
    if (!src || !centerVector || !xAxisVector || !yAxisVector)
      return null;

    return new ThreePointDistortion(src, centerVector, xAxisVector, yAxisVector);
  }
}

//-----------------------------
// EXPORTS

exports.Create = ThreePointDistortion.Create;
exports.Name = 'ThreePointDistortion';
exports.Layer = true;
exports.Consolidate = false;
exports.Dependencies = null;
exports.ComponentType = 'drawable';