let PATH = require('path');
let FX_BASECLASS = require(PATH.join(__dirname, 'fxbaseclass.js')).FxBaseClass;

//---------------------------------

class RadialBlur extends FX_BASECLASS {
  constructor(src, degrees) {
    super();
    this.src_ = src;
    this.degrees_ = degrees;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-channel', 'RGBA', '-radial-blur', this.degrees_];
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
    return 'RadialBlur';
  }

  /**
   * Create a RadialBlur object. Applies a radial blur filter to an image.
   * @param {string} src Source
   * @param {number} degrees 
   * @returns {RadialBlur} Returns a RadialBlur object. If inputs are invalid, it returns null.
   */
  static Create(src, degrees) {
    if (!src || isNaN(degrees))
      return null;

    return new RadialBlur(src, degrees);
  }
}

//----------------------------
// EXPORTS

exports.Create = RadialBlur.Create;
exports.Name = 'RadialBlur';
exports.Layer = true;
exports.Consolidate = true;
exports.Dependencies = null;
exports.ComponentType = 'drawable';