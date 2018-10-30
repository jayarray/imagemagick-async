let PATH = require('path');
let FX_BASECLASS = require(PATH.join(__dirname, 'fxbaseclass.js')).FxBaseClass;

//---------------------------------

class CharcoalSketch extends FX_BASECLASS {
  constructor(src, charcoalValue) {
    super();
    this.src_ = src;
    this.charcoalValue_ = charcoalValue;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-charcoal', this.charcoalValue_];
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
    return 'CharcoalSketch';
  }

  /**
   * Create a CharcoalSketch object. Applies a charcoal sketch filter to an image.
   * @param {string} src 
   * @param {number} charcoalValue An integer value greater than 0 that determines the intensity of the filter. Higher values will make it look more smudged and more like a charcoal sketch.
   * @returns {CharcoalSketch} Returns a CharcoalSketch object. If inputs are invalid, it returns null.
   */
  static Create(src, charcoalValue) {
    if (!src || !charcoalValue)
      return null;

    return new CharcoalSketch(src, charcoalValue);
  }
}

//---------------------------
// EXPORTS

exports.Create = CharcoalSketch.Create;