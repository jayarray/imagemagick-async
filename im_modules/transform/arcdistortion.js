let PATH = require('path');
let TRANSFORM_BASECLASS = require(PATH.join(__dirname, 'transformbaseclass.js')).TransformBaseClass;

//-----------------------------------

class ArcDistortion extends TRANSFORM_BASECLASS {
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


//--------------------------------
// EXPORTS

exports.Create = ArcDistortion.Create;
exports.Name = 'ArcDistortion';
exports.Layer = true;
exports.Consolidate = false;
exports.Dependencies = null;
exports.ComponentType = 'drawable';