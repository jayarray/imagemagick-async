let PATH = require('path');
let FX_BASECLASS = require(PATH.join(__dirname, 'fxbaseclass.js')).FxBaseClass;

//---------------------------------

class Implode extends FX_BASECLASS {
  constructor(src, factor) {
    super();
    this.src_ = src;
    this.factor_ = factor;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-implode', this.factor_];
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
    return 'Implode';
  }

  /**
   * Create an Implode object. Applies an implode effect to an image.
   * @param {string} src
   * @param {number} factor Implosions have values between 0 and 1 (and anything greater than 1 sucks pixels into oblivion). Explosions have values between 0 and -1 (and anything less than -1 distorts pixels outward). 
   * @returns {Implode} Returns an Implode object. If inputs are invalid, it returns null.
   */
  static Create(src, factor) {
    if (!src || !factor)
      return null;

    return new Implode(src, factor);
  }
}

//---------------------------
// EXPORTS

exports.Create = Implode.Create;