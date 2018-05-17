let VALIDATE = require('./validate.js');
let Layer = require('./layerbase.js').Layer;

//------------------------------------
// COMPARISON (base class)

class Comparison extends Layer {
  constructor() {
    super();
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments needed for drawing the primitive.
   */
  Args() {
    // Override
  }

  /**
   * @override
   * @returns {string} Returns a string of the type name.
   */
  Type() {
    return 'mod';
  }
}

//-------------------------------------
// COMPARE

class Compare extends Comparison {
  constructor(src1, src2, highlightColor, lowlightColor) {
    super();
    this.src1_ = src;
    this.src2_ = src2;
    this.highlightColor_ = highlightColor;
    this.lowlightColor_ = lowlightColor;
  }

  /** 
   * @override
   * @returns {Array<string|number>} Returns an array of arguments.
  */
  Args() {
    let args = [this.src1_, this.src2_, '-metric', 'AE', '-fuzz', '5%', '-highlight-color', this.highlightColor_];

    if (this.lowlightColor_)
      args.push('-lowlight-color', this.lowlightColor_);

    return args;
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

//------------------------------------
// DIFFERENCE

/**
 * Render an image that shows the differences between two images by utilizing brightness to correlate how major the changes are. The brighter the color, the more major the difference is. (Compares src2 to src1)
 * @param {string} src1 Source 1
 * @param {string} src2 Source 2
 * @param {string} outputPath The path where the resulting image will be rendered.
 * @returns {Promise} Returns a promise that resolves if successful. Otherwise, it returns an error.
 */
class Difference extends Comparison {
  constructor(src1, src2) {
    super();
    this.src1_ = src1;
    this.src2_ = src2;
  }

  /** 
   * @override
   * @returns {Array<string|number>} Returns an array of arguments.
  */
  Args() {
    let args = [src1, src2, '-compose', 'difference'];
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

//----------------------------------
// EXPORTS

exports.CreateCompareMod = Compare.Create;
exports.CreateDifferenceMod = Difference.Create;