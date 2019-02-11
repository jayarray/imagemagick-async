let PATH = require('path');
let TRANSFORM_BASECLASS = require(PATH.join(__dirname, 'transformbaseclass.js')).TransformBaseClass;

//-----------------------------------
// Perspective distortion

class FourPointDistortion extends TRANSFORM_BASECLASS {
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

//--------------------------

// EXPORTs

exports.Create = FourPointDistortion.Create;
exports.Name = 'FourPointDistortion';
exports.Layer = true;
exports.Consolidate = false;
exports.Dependencies = null;
exports.ComponentType = 'drawable';