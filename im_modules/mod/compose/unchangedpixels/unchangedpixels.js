let PATH = require('path');
let COMPOSE_BASECLASS = require(PATH.join(__dirname, 'composebaseclass.js')).ComposeBaseClass;

//------------------------------

class UnchangedPixels extends COMPOSE_BASECLASS {
  constructor(src1, src2, fuzz) {
    super();
    this.src1_ = src1;
    this.src2_ = src2;
    this.fuzz_ = fuzz;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    let args = [this.src1_, this.src2_];

    if (this.fuzz_)
      args.push('-fuzz', `${this.fuzz_}%`);
    args.push('-compose', 'ChangeMask', '-composite', '-channel', 'A', '-negate');

    return args;
  }

  /**
   * @override
   */
  NumberOfSources() {
    return 2;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments used for rendering this layer.
   */
  RenderArgs() {
    return this.Args();
  }

  /**
   * Replace current source with new source.
   */
  UpdateSources(newSources) {
    for (let i = 0; i < this.NumberOfSources(); ++i) {
      let currNewSrc = newSources[i];
      if (currNewSrc) {
        let variableName = `src${i + 1}_`;
        this[variableName] = currNewSrc;
      }
    }
  }

  /**
   * @override
   */
  Name() {
    return 'UnchangedPixels';
  }

  /**
   * Create an UnchangedPixels object. Get an image showing the similarities between two images.
   * @param {string} src1
   * @param {string} src2
   * @param {number} fuzz (Optional) Value between 1 and 100 that helps group similar colors together. (Small values help with slight color variations)
   * @returns {UnchangedPixels} Returns a UnchangedPixels object. If inputs are invalid, it returns null.
   */
  static Create(src1, src2, fuzz) {
    if (!src1 || !src2)
      return null;

    return new UnchangedPixels(src1, src2, fuzz);
  }
}

//-------------------------
// EXPORTS

exports.Create = UnchangedPixels.Create;