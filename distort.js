let COORDINATES = require('./coordinates.js').Create;
let VECTOR = require('./gradient.js').CreateVector;
let TransformBaseClass = require('./transformbaseclass.js').TransformBaseClass;

//-----------------------------------------
// ARC DISTORTION

class ArcDistortion extends TransformBaseClass {
  constructor(src, degrees) {
    super();
    this.src_ = src;
    this.degrees_ = degrees;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-virtual-pixel', 'background', '-background', 'none', '-distort', 'Arc', this.degrees_];
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
    return 'ArcDistortion';
  }

  /**
   * Create an ArcDistortion object. Curves the given image.
   * @param {string} src
   * @param {number} degrees 
   * @returns {ArcDistortion} Returns an ArcDistortion object. If inputs are invalid, it returns null.
   */
  static Create(src, degrees) {
    if (!src || isNaN(degrees))
      return null;

    return new ArcDistortion(src, degrees);
  }
}

//-----------------------------------------
// POLAR DISTORTION

class PolarDefaultDistortion extends TransformBaseClass {
  constructor(src) {
    super();
    this.src_ = src;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    let args = ['-virtual-pixel', 'background', '-background', 'none', '-distort', 'Polar', 0];
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
    return 'PolarDefaultDistortion';
  }

  /**
   * Create a PolarDefaultDistortion object. Distorts the image into a circle. the top edge becomes the center, and the bottom edge wraps around the outside. The left and right edges will might above the center at angles -180 to +180.
   * @param {string} src
   * @returns {PolarDefaultDistortion} Returns a PolarDefaultDistortion object. If inputs are invalid, it returns null.
   */
  static Create(src) {
    if (!src)
      return null;

    return new PolarDefaultDistortion(src);
  }
}

class PolarDistortion extends TransformBaseClass {
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

//-----------------------------------------
// THREE POINT DISTORTION

class ThreePointDistortion extends TransformBaseClass {
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

//-----------------------------------------
// FOUR POINT DISTORTION (Perspective distortion)

class FourPointDistortion extends TransformBaseClass {
  constructor(src, controlSet1, controlSet2) {
    super();
    this.src_ = src;
    this.controlSet1_ = controlSet1;
    this.controlSet2_ = controlSet2;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    let strArr = [];

    for (let i = 0; i < this.controlSet1_.length; ++i) {
      let c1 = this.controlSet1_[i];
      let c2 = this.controlSet2_[i];
      let s = `${c1.x_},${c1.y_} ${c2.x_},${c2.y_}`;
      strArr.push(s);
    }

    return ['-virtual-pixel', 'background', '-background', 'none', '-distort', 'Perspective', strArr.join(' ')];
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
    return 'FourPointDistortion';
  }

  /**
   * Create a FourPointDistortion object. Distorts the image using 2 control sets of points with at least 4 points each.
   * @param {string} src
   * @param {Array<Coordinates>} controlSet1 A set of at least 4 coordinates where the distortion begins.
   * @param {Array<Coordinates>} controlSet2 A set of at least 4 coordinates where the distortion ends.
   * @returns {FourPointDistortion} Returns a FourPointDistortion object. If inputs are invalid, it returns null.
   */
  static Create(src, controlSet1, controlSet2) {
    if (!src || !controlSet1 || controlSet1.length < 4 || !controlSet2 || controlSet2.length < 4 || controlSet1.length != controlSet2.length)
      return null;

    return new FourPointDistortion(src, src, controlSet1, controlSet2);
  }
}

//----------------------------------
// EXPORTS

exports.CreateArcDistortionMod = ArcDistortion.Create;
exports.CreatePolarDistortionMod = PolarDistortion.Create;
exports.CreatePolarDefaultDistortionMod = PolarDefaultDistortion.Create;
exports.CreateThreePointDistortionMod = ThreePointDistortion.Create;
exports.CreateFourPointDistortionMod = FourPointDistortion.Create;
