let PATH = require('path');
let FX_BASECLASS = require(PATH.join(__dirname, 'fxbaseclass.js')).FxBaseClass;

//---------------------------------

/**
 * Apply blur filter to an image.
 * @param {string} src Source
 * @param {number} radius An integer value that controls how big an area the operator should look at when spreading pixels. Minimum value is 0 or at least double that of sigma.
 * @param {number} sigma A floating point value used as an approximation of how much you want the image to spread/blur in pixels. (Think of it as the size of the brush used to blur the image.) Minimum value is 0.
 * @param {boolean} hasTransparency Assign as true if the image contains transparent pixels. False otherwise.
 * @param {string} outputPath The path where the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
class Blur extends FX_BASECLASS {
  constructor(src, radius, sigma, hasTransparency) {
    super();
    this.src_ = src;
    this.radius_ = radius;
    this.sigma_ = sigma;
    this.hasTransparency_ = hasTransparency;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    let args = [];

    if (this.hasTransparency_)
      args.push('-channel', 'RGBA');
    args.push('-blur', `${this.radius_}x${this.sigma_}`);

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
    return 'Blur';
  }

  /**
   * Create a Blur object. Applies a blur filter to an image.
   * @param {string} src 
   * @param {number} radius An integer value that controls how big an area the operator should look at when spreading pixels. Minimum value is 0 or at least double that of sigma.
   * @param {number} sigma A floating point value used as an approximation of how much you want the image to spread/blur in pixels. (Think of it as the size of the brush used to blur the image.) Minimum value is 0.
   * @param {boolean} hasTransparency Assign as true if the image contains transparent pixels. False otherwise.
   * @returns {Blur} Returns a Blur object. If inputs are invalid, it returns null.
   */
  static Create(src, radius, sigma, hasTransparency) {
    if (!src || radius < 0 || sigma < 0 || hasTransparency == null || hasTransparency === undefined)
      return null;

    return new Blur(src, radius, sigma, hasTransparency);
  }
}

//----------------------------
// EXPORTS

exports.Create = Blur.Create;
exports.Name = 'Blur';
exports.Layer = true;
exports.Consolidate = true;
exports.Dependencies = null;
exports.ComponentType = 'drawable';