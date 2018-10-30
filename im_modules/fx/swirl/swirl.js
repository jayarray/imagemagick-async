let PATH = require('path');
let FX_BASECLASS = require(PATH.join(__dirname, 'fxbaseclass.js')).FxBaseClass;

//---------------------------------

class Swirl extends FX_BASECLASS {
  constructor(src, degrees) {
    super();
    this.src_ = src;
    this.degrees_ = degrees;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-swirl', this.degrees_];
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
    return 'Swirl';
  }

  /**
   * Create a Swirl object. Applies a swirl effect to an image.
   * @param {string} src
   * @param {number} degrees Number of degrees to swirl. Positive values mean clockwise swirl. Negative values mean counter-clockwise swirl.
   * @returns {Swirl} Returns a Swirl object. If inputs are invalid, it returns null.
   */
  static Create(src, degrees) {
    if (!src || isNaN(degrees))
      return null;

    return new Swirl(src, degrees);
  }
}

//-----------------------
// EXPORTs

exports.Create = Swirl.Create;