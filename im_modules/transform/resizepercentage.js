let PATH = require('path');
let TRANSFORM_BASECLASS = require(PATH.join(__dirname, 'transformbaseclass.js')).TransformBaseClass;

//-----------------------------------

class ResizePercentage extends TRANSFORM_BASECLASS {
  constructor(src, percent) {
    super();
    this.src_ = src;
    this.percent_ = percent;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-resize', `${this.percent_}%`];
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
    return 'ResizePercentage';
  }

  /**
   * Create a ResizePercentage object. Resize image by the specified percentage.
   * @param {string} src
   * @param {number} percent Percent for increasing/decreasing the size. Minimum value is 0.
   * @returns {ResizePercentage} Returns a ResizePercentage object. 
   */
  static Create(src, percent) {
    if (!src || !percent)
      return null;

    return new ResizePercentage(src, percent);
  }
}

//----------------------------
// EXPORTs

exports.Create = ResizePercentage.Create;
exports.Name = 'ResizePercentage';
exports.Layer = true;
exports.Consolidate = true;
exports.Dependencies = null;
exports.ComponentType = 'drawable';