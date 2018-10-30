let PATH = require('path');
let TRANSFORM_BASECLASS = require(PATH.join(__dirname, 'transformbaseclass.js')).TransformBaseClass;

//-----------------------------------

class Flip extends TRANSFORM_BASECLASS {
  constructor(src) {
    super();
    this.src_ = src;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-flip'];
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
    return 'Flip';
  }

  /**
   * Create a Flip object. Flips an image vertically.
   * @param {string} src
   * @returns {MirrorVertical} Returns a Flip object. If inputs are invalid, it returns null.
   */
  static Create(src) {
    if (!src)
      return null;

    return new Flip(src);
  }
}

//-----------------------------
// EXPORTS

exports.Create = Flip.Create;