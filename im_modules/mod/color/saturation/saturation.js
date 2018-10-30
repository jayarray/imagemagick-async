let PATH = require('path');
let COLOR_BASECLASS = require(PATH.join(__dirname, 'colorbaseclass.js')).ColorBaseClass;

//------------------------------

class Saturation extends COLOR_BASECLASS {
  constructor(src, value) {
    super();
    this.src_ = src;
    this.value_ = value;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-modulate', `100,${this.value_}`];
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
    return 'Saturation';
  }

  /**
   * Create a Saturation object. Modifies an image's saturation levels.
   * @param {string} src
   * @param {number} value Saturation value between 0 and 200. A value of 100 will make no changes.
   * @returns {Brightness} Returns a Brightness object. If inputs are invalid, it returns null.
   */
  static Create(src, value) {
    if (!src || !value)
      return null;

    return new Saturation(src, value);
  }
}

//------------------------------
// EXPORTS

exports.Create = Saturation.Create;