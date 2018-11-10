let PATH = require('path');
let COLOR_BASECLASS = require(PATH.join(__dirname, 'colorbaseclass.js')).ColorBaseClass;

//------------------------------

class Tint extends COLOR_BASECLASS {
  constructor(src, color, percent) {
    super();
    this.src_ = src;
    this.color_ = color;
    this.percent_ = percent;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-fill', this.color_, '-tint', `${this.percent_}%`];
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
    return 'Tint';
  }

  /**
   * Create a Tint object. Adds tint of color to mid-range colors. Pure colors such as black, red, yellow, white will not be affected.
   * @param {string} src
   * @param {number} color The desired tint color.
   * @returns {Tint} Returns a Tint object. If inputs are invalid, it returns null.
   */
  static Create(src, color, percent) {
    if (!src || !color || isNaN(percent))
      return null;

    return new Tint(src, color, percent);
  }
}

//---------------------------
// EXPORTS

exports.Create = Tint.Create;
exports.Name = 'Tint';
exports.Layer = true;
exports.Consolidate = true;
exports.Dependencies = null;
exports.ComponentType = 'drawable';