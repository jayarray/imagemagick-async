let PATH = require('path');
let COLOR_BASECLASS = require(PATH.join(__dirname, 'colorbaseclass.js')).ColorBaseClass;

//------------------------------

class Brightness extends COLOR_BASECLASS {
  constructor(src, value) {
    super();
    this.src_ = src;
    this.value_ = value;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-modulate', this.value_];
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
    return 'Brightness';
  }

  /**
   * Create a Brightness object. Modifies an image's brightness.
   * @param {string} src
   * @param {number} value Brightness value between 0 and 200. A value of 100 will make no changes.
   * @returns {Brightness} Returns a Brightness object. If inputs are invalid, it returns null.
   */
  static Create(src, value) {
    if (!src || !value)
      return null;

    return new Brightness(src, value);
  }
}

//--------------------------
// EXPORTS

exports.Create = Brightness.Create;