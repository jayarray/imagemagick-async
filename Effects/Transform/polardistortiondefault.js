let PATH = require('path');
let TRANSFORM_BASECLASS = require(PATH.join(__dirname, 'transformbaseclass.js')).TransformBaseClass;

//-----------------------------------

class PolarDistortionDefault extends TRANSFORM_BASECLASS {
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

//---------------------
// EXPORTS

exports.Create = PolarDistortionDefault.Create;
exports.Name = 'PolarDistortionDefault';
exports.Layer = true;
exports.Consolidate = false;
exports.Dependencies = null;
exports.ComponentType = 'drawable';