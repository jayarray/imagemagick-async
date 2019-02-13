let PATH = require('path');
let TRANSFORM_BASECLASS = require(PATH.join(__dirname, 'transformbaseclass.js')).TransformBaseClass;

//-----------------------------------

class Trim extends TRANSFORM_BASECLASS {
  constructor(src, borderColor, fuzz) {
    super();
    this.src_ = src;
    this.borderColor_ = borderColor;
    this.fuzz_ = fuzz;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    let args = [];

    if (this.borderColor_)
      args.push('-bordercolor', this.borderColor_);

    if (this.fuzz_ && this.fuzz_ > 0)
      args.push('-fuzz', this.fuzz_);

    args.push('-trim', '+repage');

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
    return 'Trim';
  }

  /**
   * Create a Trim object. Trim surrounding transparent pixels from an image.
   * @param {string} src
   * @param {string} borderColor
   * @param {number} fuzz
   * @returns {Trim} Returns a Trim object.
   */
  static Create(src, borderColor, fuzz) {
    if (!src)
      return null;

    return new Trim(src, borderColor, fuzz);
  }
}

//---------------------------
// EXPORTS

exports.Create = Trim.Create;
exports.Name = 'Trim';
exports.Layer = true;
exports.Consolidate = false;
exports.Dependencies = null;
exports.ComponentType = 'drawable';