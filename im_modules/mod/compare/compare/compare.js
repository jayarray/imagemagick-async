let PATH = require('path');
let COMPARE_BASECLASS = require(PATH.join(__dirname, 'comparebaseclass.js')).CompareBaseClass;

//------------------------------------

class Compare extends COMPARE_BASECLASS {
  constructor(src1, src2, highlightColor, lowlightColor) {
    super();
    this.src1_ = src1;
    this.src2_ = src2;
    this.highlightColor_ = highlightColor;
    this.lowlightColor_ = lowlightColor;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    let args = ['-metric', 'AE', '-fuzz', '5%', '-highlight-color', this.highlightColor_];

    if (this.lowlightColor_)
      args.push('-lowlight-color', this.lowlightColor_);

    return args;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments used for rendering this layer.
   */
  RenderArgs() {
    return [this.src1_, this.src2_].concat(this.Args());
  }

  /**
   * @override
   */
  Name() {
    return 'Compare';
  }

  /**
   * @override
   * @returns {string} Returns a string of the command used to render the comparison.
   */
  Command() {
    return 'compare';
  }

  /**
   * Create a Compare object. Creates an image that highlights the differences between two images. Compares src2 to src1.
   * @param {string} src1
   * @param {string} src2
   * @param {string} highlightColor Highlight color. This color shows the differences between the two images.
   * @param {string} lowlightColor (Optional) Lowlight color. This color serves as a background for the highlight color. Omitting it results in the image from src1 being displayed in the background.
   * @returns {Compare} Returns a Compare object. If inputs are invalid, it returns null.
   */
  static Create(src1, src2, highlightColor, lowlightColor) {
    if (!src1 || !src2 || !highlightColor)
      return null;

    return new Compare(src1, src2, highlightColor, lowlightColor);
  }
}

//------------------------------
// EXPORTS

exports.Create = Compare.Create;