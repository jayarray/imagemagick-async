let PATH = require('path');
let FX_BASECLASS = require(PATH.join(__dirname, 'fxbaseclass.js')).FxBaseClass;

//---------------------------------

class ColoringBookSketch extends FX_BASECLASS {
  constructor(src, isHeavilyShaded) {
    super();
    this.src_ = src;
    this.isHeavilyShaded_ = isHeavilyShaded;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    let args = [];

    if (this.isHeavilyShaded_)
      args.push('-segment', '1x1', '+dither', '-colors', 2);
    args.push('-edge', 1, '-negate', '-normalize', '-colorspace', 'Gray', '-blur', '0x.5', '-contrast-stretch', '0x50%');

    return args;
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
    return 'ColoringBookSketch';
  }

  /**
   * Create a ColoringBookSketch object. Applies a coloring book sketch filter to an image.
   * @param {string} src 
   * @param {boolean} isHeavilyShaded Assign as true if the image has a lot of shading. False otherwise.
   * @returns {ColoringBookSketch} Returns a ColoringBookSketch object. If inputs are invalid, it returns null.
   */
  static Create(src, isHeavilyShaded) {
    if (!src || !isHeavilyShaded)
      return null;

    return new ColoringBookSketch(src, isHeavilyShaded);
  }
}

//--------------------------------
// EXPORTS

exports.Create = ColoringBookSketch.Create;
exports.Name = 'ColoringBookSketch';
exports.Layer = true;
exports.Consolidate = false;
exports.Dependencies = null;
exports.ComponentType = 'drawable';