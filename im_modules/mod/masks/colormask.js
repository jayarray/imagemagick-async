let PATH = require('path');
let MASK_BASECLASS = require(PATH.join(__dirname, 'maskbaseclass.js')).MaskBaseClass;

//------------------------------

class ColorMask extends MASK_BASECLASS {
  constructor(src, color) {
    super();
    this.src_ = src;
    this.color_ = color;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-alpha', 'extract', '-background', this.color_, '-alpha', 'shape'];
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
    return 'ColorMask';
  }

  /**
   * Create a ColorMask object. Creates a mask and fills it the specified color.
   * @param {string} src
   * @param {string} color
   * @returns {Mask} Returns a ColorMask object. If inputs are invalid, it returns null.
   */
  static Create(src, color) {
    if (!src || !color)
      return null;

    return new ColorMask(src, color);
  }
}

//----------------------
// EXPORTS

exports.Create = ColorMask.Create;
exports.Name = 'ColorMask';
exports.Layer = true;
exports.Consolidate = true;
exports.Dependencies = null;
exports.ComponentType = 'drawable';