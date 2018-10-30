let PATH = require('path');
let COMPOSE_BASECLASS = require(PATH.join(__dirname, 'composebaseclass.js')).ComposeBaseClass;

//------------------------------

class MultiplyWhiteTransparency extends COMPOSE_BASECLASS {
  constructor(src1, src2) {
    super();
    this.src1_ = src1;
    this.src2_ = src2;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-compose', 'Multiply', this.src1_, this.src2_, '-composite'];
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
    return 'MultiplyWhiteTransparency';
  }

  /**
   * Create a MultiplyWhiteTransparency object.  Overlay colors of image with white background onto the other. Overlaying colors attenuate to black. That is, this operation only darkens colors (never lightens them). NOTE: Black will result in black.
   * @param {string} src1
   * @param {string} src2
   * @returns {MultiplyWhiteTransparency} Returns a MultiplyWhiteTransparency object. If inputs are invalid, it returns null.
   */
  static Create(src1, src2) {
    if (!src1 || !src2)
      return null;

    return new MultiplyWhiteTransparency(src1, src2);
  }
}

//----------------------------
// EXPORTs

exports.Create = MultiplyWhiteTransparency.Create;