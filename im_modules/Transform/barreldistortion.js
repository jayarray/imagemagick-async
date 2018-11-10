let PATH = require('path');
let TRANSFORM_BASECLASS = require(PATH.join(__dirname, 'transformbaseclass.js')).TransformBaseClass;

//-----------------------------------
// Perspective distortion

class BarrelDistortion extends TRANSFORM_BASECLASS {
  constructor(src, a, b, c, d, center) {
    super();
    this.src_ = src;
    this.a_ = a;
    this.b_ = b;
    this.c_ = c;
    this.d_ = d;
    this.center_ = center;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    let args = ['-virtual-pixel', 'background', '-background', 'none', '-distort', 'Barrel'];

    let barrelStr = `${this.a_} ${this.b_} ${this.c_}`;
    if (this.d_)
      barrelStr += ` ${this.d_}`;
    if (this.center_)
      barrelStr += ` ${this.center_.String()}`;
    args.push(barrelStr);

    return args;
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
    return 'BarrelDistortion';
  }

  /**
   * Create a BarrelDistortion object. Distorts the image using 2 control sets of points with at least 4 points each.
   * @param {string} src
   * @param {Array<Coordinates>} controlSet1 A set of at least 4 coordinates where the distortion begins.
   * @param {Array<Coordinates>} controlSet2 A set of at least 4 coordinates where the distortion ends.
   * @returns {BarrelDistortion} Returns a BarrelDistortion object. If inputs are invalid, it returns null.
   */
  static Create(src, controlSet1, controlSet2) {
    if (!src || !controlSet1 || controlSet1.length < 4 || !controlSet2 || controlSet2.length < 4 || controlSet1.length != controlSet2.length)
      return null;

    return new BarrelDistortion(src, src, controlSet1, controlSet2);
  }
}

//--------------------------

// EXPORTs

exports.Create = BarrelDistortion.Create;
exports.Name = 'BarrelDistortion';
exports.Layer = true;
exports.Consolidate = false;
exports.Dependencies = null;
exports.ComponentType = 'drawable';