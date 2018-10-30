let PATH = require('path');
let COMPOSE_BASECLASS = require(PATH.join(__dirname, 'composebaseclass.js')).ComposeBaseClass;

//------------------------------

class MultiplyBlackTransparency extends COMPOSE_BASECLASS {
  constructor(src1, src2) {
    super();
    this.src1_ = src1;
    this.src2_ = src2;
  }

  /**
   * @override
   */
  NumberOfSources() {
    return 2;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-compose', 'Screen', this.src1_, this.src2_, '-composite'];
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
    return 'MultiplyBlackTransparency';
  }

  /**
   * Create a MultiplyBlackTransparency object. Overlay colors of image with black background onto the other. Overlaying colors attenuate to white. That is, this operation only lightens colors (never darkens them). NOTE: White will result in white.
   * @param {string} src1
   * @param {string} src2
   * @returns {MultiplyBlackTransparency} Returns a MultiplyBlackTransparency object. If inputs are invalid, it returns null.
   */
  static Create(src1, src2) {
    if (!src1 || !src2)
      return null;

    return new MultiplyBlackTransparency(src1, src2);
  }
}

//----------------------
// EXPORTS

exports.Create = MultiplyBlackTransparency.Create;