let PATH = require('path');
let COLOR_BASECLASS = require(PATH.join(__dirname, 'colorbaseclass.js')).ColorBaseClass;

//------------------------------

class Transparency extends COLOR_BASECLASS {
  constructor(src, percent) {
    super();
    this.src_ = src;
    this.percent_ = percent;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    let adjustedTransPercent = 0;
    if (this.percent_ > 100)
      adjustedTransPercent = 100;
    else if (this.percent_ < 0)
      adjustedTransPercent = 0;
    else
      adjustedTransPercent = this.percent_;

    let opaqueValue = (100 - adjustedTransPercent) / 100;

    return ['-alpha', 'on', '-channel', 'a', '-evaluate', 'multiply', `${opaqueValue}`, '+channel'];
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
    return 'Transparency';
  }

  /**
   * Create a Transparency object. Makes an image transparent.
   * @param {string} src
   * @param {number} percent
   * @returns {Replace} Returns a Transparency object. If inputs are invalid, it returns null.
   */
  static Create(src, percent) {
    if (!src || !percent)
      return null;

    return new Transparency(src, percent);
  }
}

//--------------------------
// EXPORTS

exports.Create = Transparency.Create;