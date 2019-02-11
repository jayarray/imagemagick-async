let PATH = require('path');
let MASK_BASECLASS = require(PATH.join(__dirname, 'maskbaseclass.js')).MaskBaseClass;

//------------------------------

class BlackMask extends MASK_BASECLASS {
  constructor(src) {
    super();
    this.src_ = src;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-alpha', 'extract', '-alpha', 'on', '-negate'];
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
    return 'BlackMask';
  }

  /**
   * Create a BlackMask object. Transparent color is unaffected, but everything else is turned black. The final image is a black silhouette with transparent background.
   * @param {string} src
   * @returns {Mask} Returns a BlackMask object. If inputs are invalid, it returns null.
   */
  static Create(src) {
    if (!src)
      return null;

    return new BlackMask(src);
  }
}

//---------------------------------
// EXPORTS

exports.Create = BlackMask.Create;
exports.Name = 'BlackMask';
exports.Layer = true;
exports.Consolidate = true;
exports.Dependencies = null;
exports.ComponentType = 'drawable';