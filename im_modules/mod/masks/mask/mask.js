let PATH = require('path');
let MASK_BASECLASS = require(PATH.join(__dirname, 'maskbaseclass.js')).MaskBaseClass;

//------------------------------

class Mask extends MASK_BASECLASS {
  constructor(src) {
    super();
    this.src_ = src;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-alpha', 'extract'];
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
    return 'Mask';
  }

  /**
   * Create a Mask object. Transparent color is turned black and everything else is turned white. The final image is a black and white image.
   * @param {string} src
   * @returns {Mask} Returns a Mask object. If inputs are invalid, it returns null.
   */
  static Create(src) {
    if (!src)
      return null;

    return new Mask(src);
  }
}

//------------------------
// EXPORTS

exports.Create = Mask.Create;