let PATH = require('path');
let FX_BASECLASS = require(PATH.join(__dirname, 'fxbaseclass.js')).FxBaseClass;

//---------------------------------

class Pixelate extends FX_BASECLASS {
  constructor(src, aggressiveness, width, height) {
    super();
    this.src_ = src;
    this.aggressiveness_ = aggressiveness;
    this.width_ = width;
    this.height_ = height;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    let args = ['-sample'];
    let maxAggressiveness = 100;

    let sampleValue = null;
    if (this.aggressiveness_ > maxAggressiveness)
      sampleValue = 1;
    else if (this.aggressiveness_ < 1)
      sampleValue = maxAggressiveness;
    else
      sampleValue = (100 - this.aggressiveness_) + 1;
    args.push(`${sampleValue}%`);

    args.push('-scale', `${this.width_}x${this.height_}`);

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
    return 'Pixelate';
  }

  /**
   * Create a Pixelate object. Applies a pixelated effect to an image.
   * @param {string} src 
   * @param {number} aggressiveness A value between 0 and 100. The greater the value, the more aggressive the pixelated effect will be.
   * @param {number} width Width of source image
   * @param {number} height Height of source image
   */
  static Create(src, aggressiveness, width, height) {
    if (!src || !aggressiveness || !width || !height)
      return null;

    return new Pixelate(src, aggressiveness, width, height);
  }
}

//----------------------------
// EXPORTS

exports.Create = Pixelate.Create;
exports.Name = 'Pixelate';
exports.Layer = true;
exports.Consolidate = false;
exports.Dependencies = null;
exports.ComponentType = 'drawable';