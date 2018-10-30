let PATH = require('path');
let COLOR_BASECLASS = require(PATH.join(__dirname, 'colorbaseclass.js')).ColorBaseClass;

//------------------------------

class Replace extends COLOR_BASECLASS {
  constructor(src, targetColor, desiredColor, fuzz) {
    super();
    this.src_ = src;
    this.targetColor_ = targetColor;
    this.desiredColor_ = desiredColor;
    this.fuzz_ = fuzz;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    let args = ['-alpha', 'on', '-channel', 'rgba'];

    if (this.fuzz_ && this.fuzz_ > 0)
      args.push('-fuzz', `${this.fuzz_}%`);
    args.push('-fill', this.desiredColor_, '-opaque', this.targetColor_);

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
    return 'Replace';
  }

  /**
   * Create a Replace object. Replaces one color with another.
   * @param {string} src
   * @param {string} targetColor The color you want to change. (Valid color format string used in Image Magick)
   * @param {string} desiredColor The color that will replace the target color. (Valid color format string used in Image Magick)
   * @param {number} fuzz (Optional) A value between 0 and 100 that determines which other colors similar to the target color will be removed. (The higher the value, the more colors will disappear)
   * @returns {Replace} Returns a Replace object. If inputs are invalid, it returns null.
   */
  static Create(src, targetColor, desiredColor, fuzz) {
    if (!src || !targetColor || !desiredColor)
      return null;

    return new Replace(src, targetColor, desiredColor, fuzz);
  }
}

//-----------------------------
// EXPORTS

exports.Create = Replace.Create;