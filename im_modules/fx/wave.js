let PATH = require('path');
let FX_BASECLASS = require(PATH.join(__dirname, 'fxbaseclass.js')).FxBaseClass;

//---------------------------------

class Wave extends FX_BASECLASS {
  constructor(src, amplitude, frequency) {
    super();
    this.src_ = src;
    this.amplitude_ = amplitude;
    this.frequency_ = frequency;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-background', 'transparent', '-wave', `${this.amplitude_}x${this.frequency_}`];
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
    return 'Wave';
  }

  /**
   * Create a Wave object. Applies a wave effect to an image. Uses formula F(x) = A * sin(Bx), where A is the amplitude and B is the frequency.
   * @param {string} src
   * @param {number} amplitude Total height of the wave in pixels.
   * @param {number} frequency The number of pixels in one cycle. Values greater than 1 result in tighter waves. Values less than 1 result in wider waves. 
   * @returns {Wave} Returns a Wave object. If inputs are invalid, it returns null.
   */
  static Create(src, amplitude, frequency) {
    if (!src || !amplitude || !frequency)
      return null;

    return new Wave(src, amplitude, frequency);
  }
}

//---------------------------
// EXPORTS

exports.Create = Wave.Create;
exports.Name = 'Wave';
exports.Layer = true;
exports.Consolidate = true;
exports.Dependencies = null;
exports.ComponentType = 'drawable';