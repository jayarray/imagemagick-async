let PATH = require('path');
let FX_BASECLASS = require(PATH.join(__dirname, 'fxbaseclass.js')).FxBaseClass;

//---------------------------------

class OilPainting extends FX_BASECLASS {
  constructor(src, paintValue) {
    super();
    this.src_ = src;
    this.paintValue_ = paintValue;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-paint', this.paintValue_];
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
    return 'OilPainting';
  }

  /**
   * Create a OilPainting object. Applies an oil painting filter to an image.
   * @param {string} src 
   * @param {number} paintValue An integer value greater than 0 that determines the intensity of the filter. Higher values will make it look more abstract and more like a painting.
   * @returns {OilPainting} Returns an OilPainting object. If inputs are invalid, it returns null.
   */
  static Create(src, paintValue) {
    if (!src || !paintValue)
      return null;

    return new OilPainting(src, paintValue);
  }
}

//--------------------------
// EXPORTs

exports.Create = OilPainting.Create;
exports.Name = 'OilPainting';
exports.Layer = true;
exports.Consolidate = true;
exports.Dependencies = null;
exports.ComponentType = 'drawable';