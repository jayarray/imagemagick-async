let PATH = require('path');
let FX_BASECLASS = require(PATH.join(__dirname, 'fxbaseclass.js')).FxBaseClass;

//---------------------------------

class Shadow extends FX_BASECLASS {
  constructor(src, color, percentOpacity, sigma) {
    super();
    this.src_ = src;
    this.color_ = color;
    this.percentOpacity_ = percentOpacity;
    this.sigma_ = sigma;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-background', this.color_, '-shadow', `${this.percentOpacity_}x${this.sigma_}`];
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
    return 'Shadow';
  }

  /**
   * Create a Shadow object. Creates a shadow of the original image.
   * @param {string} src 
   * @param {string} color 
   * @param {number} percentOpacity Value between 0 and 100 representing how opaque the shadow will be. 
   * @param {number} sigma Represents the 'spread' of pixels.
   * @returns {Shadow} Returns a Shadow object. If inputs are invalid, it returns null.
   */
  static Create(src, color, percentOpacity, sigma) {
    if (!src || !color || isNaN(percentOpacity) || isNaN(sigma))
      return null;

    return new Shadow(src, color, percentOpacity, sigma);
  }
}

//----------------------------
// EXPORTS

exports.Create = Shadow.Create;
exports.Name = 'Shadow';
exports.Layer = true;
exports.Consolidate = true;
exports.Dependencies = null;
exports.ComponentType = 'drawable';