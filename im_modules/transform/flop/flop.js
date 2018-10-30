let PATH = require('path');
let TRANSFORM_BASECLASS = require(PATH.join(__dirname, 'transformbaseclass.js')).TransformBaseClass;

//-----------------------------------

class Flop extends TRANSFORM_BASECLASS {
  constructor(src) {
    super();
    this.src_ = src;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-flop'];
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
    return 'Flop';
  }

  /**
   * Create a Flop object. Reflects an image horizontally.
   * @param {string} src
   * @returns {MirrorHorizontal} Returns a Flop object. If inputs are invalid, it returns null.
   */
  static Create(src) {
    if (!src)
      return null;

    return new Flop(src);
  }
}

//-------------------------------
// EXPORTS

exports.Create = Flop.Create;