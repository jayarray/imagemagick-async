let PATH = require('path');
let TRANSFORM_BASECLASS = require(PATH.join(__dirname, 'transformbaseclass.js')).TransformBaseClass;

//-----------------------------------

class Transverse extends TRANSFORM_BASECLASS {
  constructor(src) {
    super();
    this.src_ = src;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-transverse'];
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
    return 'Transverse';
  }

  /**
   * Create a Transverse object. Create a mirror image flipped bottom-left to top-right.
   * @param {string} src
   * @returns {Transverse} Returns a Transverse object. If inputs are invalid, it returns null.
   */
  static Create(src) {
    if (!src)
      return null;

    return new Transverse(src);
  }
}

//---------------------------------
// EXPORTS

exports.Create = Transverse.Create;
exports.Name = 'Transverse';
exports.Layer = true;
exports.Consolidate = true;
exports.Dependencies = null;
exports.ComponentType = 'drawable';