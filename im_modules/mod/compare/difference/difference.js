let PATH = require('path');
let COMPARE_BASECLASS = require(PATH.join(__dirname, 'comparebaseclass.js')).CompareBaseClass;

//------------------------------------

class Difference extends CompareBaseClass {
  constructor(src1, src2) {
    super();
    this.src1_ = src1;
    this.src2_ = src2;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-compose', 'difference'];
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
    return 'Difference';
  }

  /**
   * @override
   * @returns {string} Returns a string of the command used to render the comparison.
   */
  Command() {
    return 'composite';
  }

  /**
   * Create a Difference object. Renders an image that shows the differences between two images by utilizing brightness to correlate how major the changes are. The brighter the color, the more major the difference is. Compares src2 to src1.
   * @param {string} src1
   * @param {string} src2
   * @returns {Difference} Returns a Difference object. If inputs are invalid, it returns null.
   */
  static Create(src1, src2) {
    if (!src1 || !src2)
      return null;

    return new Difference(src1, src2);
  }
}

//------------------------
// EXPORTS

exports.Create = Difference.Create;