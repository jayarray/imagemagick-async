let PATH = require('path');
let COLOR_BASECLASS = require(PATH.join(__dirname, 'colorbaseclass.js')).ColorBaseClass;

//------------------------------

class RgbFormat extends COLOR_BASECLASS {
  constructor(src) {
    super();
    this.src_ = src;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-colorspace', 'RGB'];
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
    return 'RgbFormat';
  }

  /**
   * Create a RgbFormat object. Converts an image to grayscale format.
   * @param {string} src
   * @returns {RgbFormat} Returns a RgbFormat object. If inputs are invalid, it returns null.
   */
  static Create(src) {
    if (!src)
      return null;

    return new RgbFormat(src);
  }
}

//-----------------------
// EXPORTS

exports.Create = RgbFormat.Create;
exports.Name = 'RgbFormat';
exports.Layer = true;
exports.Consolidate = true;
exports.Dependencies = null;
exports.ComponentType = 'drawable';