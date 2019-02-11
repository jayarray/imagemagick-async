let PATH = require('path');
let FX_BASECLASS = require(PATH.join(__dirname, 'fxbaseclass.js')).FxBaseClass;

//---------------------------------

class PencilSketch extends FX_BASECLASS {
  constructor(src, radius, sigma, angle) {
    super();
    this.src_ = src;
    this.radius_ = radius;
    this.sigma_ = sigma;
    this.angle_ = angle;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-colorspace', 'Gray', '-sketch', `${this.radius_}x${this.sigma_}+${this.angle_}`];
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
    return 'PencilSketch';
  }

  /**
   * Create a PencilSketch object. Applies a pencil sketch filter to an image.
   * @param {string} src 
   * @param {number} radius An integer value that controls how big an area the operator should look at when spreading pixels. Minimum value is 0 or at least double that of sigma.
   * @param {number} sigma A floating point value used as an approximation of how much you want the image to spread/blur in pixels. (Think of it as the size of the brush used to blur the image.) Minimum value is 0.
   * @param {number} angle Integer value that dteermines the angle of the pencil strokes.
   * @returns {PencilSketch} Returns a PencilSketch object. If inputs are invalid, it returns null.
   */
  static Create(src, radius, sigma, angle) {
    if (!src || radius <= 0 || sigma < 0 || isNaN(angle))
      return null;

    return new PencilSketch(src, radius, sigma, angle);
  }
}

//---------------------------
// EXPORTs

exports.Create = PencilSketch.Create;
exports.Name = 'PencilSketch';
exports.Layer = true;
exports.Consolidate = false;
exports.Dependencies = null;
exports.ComponentType = 'drawable';