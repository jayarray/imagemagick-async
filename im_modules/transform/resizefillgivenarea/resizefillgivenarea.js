let PATH = require('path');
let TRANSFORM_BASECLASS = require(PATH.join(__dirname, 'transformbaseclass.js')).TransformBaseClass;

//-----------------------------------

class ResizeFillGivenArea extends TRANSFORM_BASECLASS {
  constructor(src, width, height) {
    super(src, width, height);
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-resize', `${this.width_}x${this.height_}^`];
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
    return 'ResizeFillGivenArea';
  }

  /**
   * Create a ResizeFillGivenArea object. Resize image based on the smallest fitting dimension. Image is resized to completely fill (and even overflow) the pixel area given.
   * @param {string} src
   * @param {number} width
   * @param {number} height
   * @returns {ResizeFillGivenArea} Returns a ResizeFillGivenArea object. 
   */
  static Create(src, width, height) {
    if (!src || !width || !height)
      return null;

    return new ResizeFillGivenArea(src, width, height);
  }
}
//---------------------------
// EXPORTS

exports.Create = ResizeFillGivenArea.Create;