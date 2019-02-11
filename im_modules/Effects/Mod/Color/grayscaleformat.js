let PATH = require('path');
let COLOR_BASECLASS = require(PATH.join(__dirname, 'colorbaseclass.js')).ColorBaseClass;

//------------------------------

class GrayscaleFormat extends COLOR_BASECLASS {
  constructor(src) {
    super();
    this.src_ = src;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-colorspace', 'Gray'];
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
    return 'GrayscaleFormat';
  }

  /**
   * Create a GrayscaleFormat object. Converts an image to grayscale format.
   * @param {string} src
   * @returns {GrayscaleFormat} Returns a Grayscale object. If inputs are invalid, it returns null.
   */
  static Create(src) {
    if (!src)
      return null;

    return new GrayscaleFormat(src);
  }
}

//----------------------------
// EXPORTS

exports.Create = GrayscaleFormat.Create;
exports.Name = 'GrayscaleFormat';
exports.Layer = true;
exports.Consolidate = true;
exports.Dependencies = null;
exports.ComponentType = 'drawable';