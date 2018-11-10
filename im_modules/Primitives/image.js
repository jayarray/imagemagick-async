let PATH = require('path');

let parts = __dirname.split(PATH.sep);
let index = parts.findIndex(x => x == 'im_modules');
let IM_MODULES_DIR = parts.slice(0, index + 1).join(PATH.sep);
let PRIMITIVE_BASECLASS = require(PATH.join(__dirname, 'primitivesbaseclass.js')).PrimitiveBaseClass;

//----------------------------------

class Image extends PRIMITIVE_BASECLASS {
  constructor(src, corner, width, height) {
    super();
    this.src_ = src;
    this.corner_ = corner;
    this.width_ = width;
    this.height_ = height;
  }

  /** 
   * @override
   * @returns {Array<string|number>} Returns an array of arguments needed for drawing the bezier curve.
  */
  Args() {
    return ['-draw', `image over ${this.corner_.x_},${this.corner_.y_} ${this.width_},${this.height_} ${this.src_}`];
  }

  /**
   * Create an Image object with the specified properties.
   * @param {string} src A list of points for the bezier curve to travel through.
   * @param {Coordinates} corner The top-left corner from which the image will render.
   * @param {number} width Desired width (if different from current width). Set to zero (or null) if you want preserve the original width and height.
   * @param {number} height Desired height (if different from current height). Set to zero (or null) if you want preserve the original width and height.
   * @returns {Image} Returns an Image object. If inputs are invalid, it returns null.
   */
  static Create(src, corner, width, height) {
    if (!src || !corner || isNaN(width) || isNaN(height))
      return null;

    return new Image(src, corner, width, height);
  }
}

//-----------------------------------
// EXPORTS

exports.Create = Image.Create;
exports.Name = 'Image';
exports.Layer = false;
exports.Consolidate = true;
exports.Dependencies = null;
exports.ComponentType = 'drawable';