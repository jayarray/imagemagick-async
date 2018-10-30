let PATH = require('path');
let COMPOSE_BASECLASS = require(PATH.join(__dirname, 'composebaseclass.js')).ComposeBaseClass;

//------------------------------

class Exclusion extends COMPOSE_BASECLASS {
  constructor(src1, src2) {
    super();
    this.src1_ = src1;
    this.src2_ = src2;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return [this.src1_, this.src2_, '-compose', 'Minus_Src', '-composite'];
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
    return 'Exclusion';
  }

  /**
   * Create an Exclusion object. Get the exclusion (relative complement) of pixels. Results in A-B => Everything in A that is NOT in B. If the images are colored, the result is src2 overlapping src1. (Best used with black and white images/masks)
   * @param {string} src1
   * @param {string} src2
   * @returns {Exclusion} Returns a Exclusion object. If inputs are invalid, it returns null.
   */
  static Create(src1, src2) {
    if (!src1 || !src2)
      return null;

    return new Exclusion(src1, src2);
  }
}

//-------------------------
// EXPORTS

exports.Create = Exclusion.Create;