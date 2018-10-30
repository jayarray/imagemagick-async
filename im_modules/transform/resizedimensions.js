let PATH = require('path');
let TRANSFORM_BASECLASS = require(PATH.join(__dirname, 'transformbaseclass.js')).TransformBaseClass;

//-----------------------------------

class ResizeDimensions extends TRANSFORM_BASECLASS {
  constructor(src, width, height) {
    this.src_ = src;
    this.width_ = width;
    this.height_ = height;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-resize', `${this.width_}x${this.height_}!`];

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
    return 'ResizeDimensions';
  }

  /**
   * Create a ResizeDimensions object. Resize image while ignoring aspect ratio and distort image to the size specified.
   * @param {string} src
   * @param {number} width
   * @param {number} height
   * @returns {ResizeDimensions} Returns a ResizeDimensions object. 
   */
  static Create(src, width, height) {
    if (!src || !width || !height)
      return null;

    return new ResizeDimensions(src, width, height);
  }
}

//---------------------------
// EXPORTS

exports.Create = ResizeDimensions.Create;
exports.Name = 'ResizeDimensions';
exports.Layer = true;
exports.Consolidate = true;
exports.Dependencies = null;
exports.ComponentType = 'drawable';