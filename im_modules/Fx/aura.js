let PATH = require('path');
let FX_BASECLASS = require(PATH.join(__dirname, 'fxbaseclass.js')).FxBaseClass;

//---------------------------------

class Aura extends FX_BASECLASS {
  constructor(src, color, opacity, blurRadius, blurSigma) {
    super();
    this.src_ = src;
    this.color_ = color;
    this.opacity_ = opacity;
    this.blurRadius_ = blurRadius;
    this.blurSigma_ = blurSigma;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    let args = ['\\(', '+clone', '-channel', 'A', '-blur', `${this.blurRadius_}x${this.blurSigma_}`];

    let adjustedOpacity = 100 - this.opacity_;

    if (adjustedOpacity >= 1)
      adjustedOpacity = Math.min(this.opacity_, 100);
    else
      adjustedOpacity = Math.max(this.opacity_, 0.1);

    args.push('-level', `0,${adjustedOpacity}%`, '+channel', '+level-colors', this.color_, '\\)', '-compose', 'DstOver', '-composite');

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
    return 'Aura';
  }

  /**
   * Create an Aura object. Applies an aura around the image.
   * @param {string} src 
   * @param {number} radius An integer value that controls how big an area the operator should look at when spreading pixels. Minimum value is 0 or at least double that of sigma.
   * @param {number} sigma A floating point value used as an approximation of how much you want the image to spread/blur in pixels. (Think of it as the size of the brush used to blur the image.) Minimum value is 0.
   * @returns {Blur} Returns a Blur object. If inputs are invalid, it returns null.
   */
  static Create(src, color, opacity, blurRadius, blurSigma) {
    if (!src || !color || isNaN(opacity) || isNaN(blurRadius) || isNaN(blurSigma))
      return null;

    return new Aura(src, color, opacity, blurRadius, blurSigma);
  }
}

//----------------------------
// EXPORTS

exports.Create = Aura.Create;
exports.Name = 'Aura';
exports.Layer = true;
exports.Consolidate = false;
exports.Dependencies = null;
exports.ComponentType = 'drawable';
exports.SingleCommand = true;