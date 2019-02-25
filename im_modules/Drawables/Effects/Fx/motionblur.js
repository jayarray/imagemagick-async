let PATH = require('path');
let FX_BASECLASS = require(PATH.join(__dirname, 'fxbaseclass.js')).FxBaseClass;

//---------------------------------

class MotionBlur extends FX_BASECLASS {
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
    return ['-channel', 'RGBA', '-motion-blur', `${this.radius_}x${this.sigma_}+${this.angle_}`];
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
    return 'MotionBlur';
  }

  /**
   * Create a MotionBlur object. Applies a motion blur filter to an image.
   * @param {string} src Source
   * @param {number} radius How big of an area the operator should look at when spreading pixels.
   * @param {number} sigma The amount of 'spread' (or blur) in pixels.
   * @param {number} angle The angle in which the blur should occur.
   * @returns {MotionBlur} Returns a RadialBlur object. If inputs are invalid, it returns null.
   */
  static Create(src, radius, sigma, angle) {
    if (!src || isNaN(radius) || isNaN(sigma) || isNaN(angle))
      return null;

    return new MotionBlur(src, radius, sigma, angle);
  }
}

//----------------------------
// EXPORTS

exports.Create = MotionBlur.Create;
exports.Name = 'MotionBlur';
exports.Layer = true;
exports.Consolidate = true;
exports.Dependencies = null;
exports.ComponentType = 'drawable';