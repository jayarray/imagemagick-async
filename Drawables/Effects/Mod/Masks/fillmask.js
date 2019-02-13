let PATH = require('path');
let MASK_BASECLASS = require(PATH.join(__dirname, 'maskbaseclass.js')).MaskBaseClass;

//------------------------------

class FillMask extends MASK_BASECLASS {
  constructor(src, whiteReplacement, blackReplacement) {
    super();
    this.src_ = src;
    this.whiteReplacement_ = whiteReplacement;
    this.blackReplacement_ = blackReplacement;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-alpha', 'extract', '-background', this.whiteReplacement_, '-alpha', 'shape', '-background', this.blackReplacement_, '-alpha', 'remove'];
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
    return 'FillMask';
  }

  /**
   * Create a FillMask object. Takes an image, creates a mask, and replaces the white and black colors with others.
   * @param {string} src
   * @param {string} whiteReplacement Color that will replace white part of mask.
   * @param {string} blackReplacement Color that will replace black part of mask.
   * @returns {Mask} Returns a FillMask object. If inputs are invalid, it returns null.
   */
  static Create(src, whiteReplacement, blackReplacement) {
    if (!src || !whiteReplacement || !blackReplacement)
      return null;

    return new FillMask(src, whiteReplacement, blackReplacement);
  }
}

//--------------------------
// EXPORTS

exports.Create = FillMask.Create;
exports.Name = 'FillMask';
exports.Layer = true;
exports.Consolidate = true;
exports.Dependencies = null;
exports.ComponentType = 'drawable';