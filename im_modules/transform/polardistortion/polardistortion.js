let PATH = require('path');
let TRANSFORM_BASECLASS = require(PATH.join(__dirname, 'transformbaseclass.js')).TransformBaseClass;

//-----------------------------------

class PolarDistortion extends TRANSFORM_BASECLASS {
  constructor(src, center, radiusMin, radiusMax, startAngle, endAngle) {
    super();
    this.src_ = src;
    this.center_ = center;
    this.radiusMin_ = radiusMin;
    this.radiusMax_ = radiusMax;
    this.startAngle_ = startAngle;
    this.endAngle_ = endAngle;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    let polarStr = `${this.radiusMax_},${this.radiusMin_} ${this.center_.x_},${this.center_.y_} ${this.startAngle_},${this.endAngle_}`;
    return ['-virtual-pixel', 'background', '-background', 'none', '-distort', 'Polar', polarStr];
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
    return 'PolarDistortion';
  }

  /**
   * Create a PolarDistortion object. Distorts the image around a circle. Does not attempt to preserve aspect ratios of images.
   * @param {string} src
   * @param {Coordinates} center
   * @param {number} radiusMin
   * @param {number} radiusMax
   * @param {number} startAngle
   * @param {number} endAngle
   * @returns {PolarDistortion} Returns a PolarDistortion object. If inputs are invalid, it returns null.
   */
  static Create(src, center, radiusMin, radiusMax, startAngle, endAngle) {
    if (!src || !center || radiusMin < 0 || radiusMax < 0 || isNaN(startAngle) || isNaN(endAngle))
      return null;

    return new PolarDistortion(src, center, radiusMin, radiusMax, startAngle, endAngle);
  }
}

//--------------------------
// EXPORTS

exports.Create = PolarDistortion.Create;