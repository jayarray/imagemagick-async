let PATH = require('path');
let MASK_BASECLASS = require(PATH.join(__dirname, 'maskbaseclass.js')).MaskBaseClass;

//------------------------------

class WhiteMask extends MASK_BASECLASS {
  constructor(src) {
    super();
    this.src_ = src;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-alpha', 'extract', '-alpha', 'on'];
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
    return 'WhiteMask';
  }

  /**
   * Create a WhiteMask object. Transparent color is unaffected, but everything else is turned white. The final image is a white silhouette with transparent background.
   * @param {string} src
   * @returns {Mask} Returns a WhiteMask object. If inputs are invalid, it returns null.
   */
  static Create(src) {
    if (!src)
      return null;

    return new WhiteMask(src);
  }
}

//---------------------
// EXPORTS

exports.Create = WhiteMask.Create;
exports.Name = 'WhiteMask';
exports.Layer = true;
exports.Consolidate = true;
exports.Dependencies = null;
exports.ComponentType = 'drawable';