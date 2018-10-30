let PATH = require('path');
let COLOR_BASECLASS = require(PATH.join(__dirname, 'colorbaseclass.js')).ColorBaseClass;

//------------------------------

class Negate extends COLOR_BASECLASS {
  constructor(src) {
    super();
    this.src_ = src;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-negate'];
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
    return 'Negate';
  }

  /**
   * Create a Negate object. Negates all image colors.
   * @param {string} src
   * @returns {Negate} Returns a Negate object. If inputs are invalid, it returns null.
   */
  static Create(src) {
    if (!src)
      return null;

    return new Negate(src);
  }
}

//-----------------------------
// EXPORTS

exports.Create = Negate.Create;