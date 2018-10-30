let PATH = require('path');
let COLOR_BASECLASS = require(PATH.join(__dirname, 'colorbaseclass.js')).ColorBaseClass;

//------------------------------

class Colorize extends COLOR_BASECLASS {
  constructor(src, fillColor, percent) {
    super();
    this.src_ = src;
    this.fillColor_ = fillColor;
    this.percent_ = percent;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-fill', this.fillColor_, '-colorize', `${this.percent_}%`];
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
    return 'Colorize';
  }

  /**
   * Create a Colorize object. Creates a veil of color over an image.
   * @param {string} src
   * @returns {Colorize} Returns a Colorize object. If inputs are invalid, it returns null.
   */
  static Create(src, fillColor, percent) {
    if (!src || !fillColor || !percent)
      return null;

    return new Colorize(src, fillColor, percent);
  }
}

//--------------------------
// EXPORTS

exports.Create = Colorize.Create;