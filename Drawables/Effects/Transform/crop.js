let PATH = require('path');
let TRANSFORM_BASECLASS = require(PATH.join(__dirname, 'transformbaseclass.js')).TransformBaseClass;

//-----------------------------------

class Crop extends TRANSFORM_BASECLASS {
  constructor(src, width, height, corner, removeVirtualCanvas) {
    super();
    this.src_ = src;
    this.width_ = width;
    this.height_ = height;
    this.corner_ = corner;
    this.removeVirtualCanvas_ = removeVirtualCanvas;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    let args = ['-crop'];

    let cropStr = `${this.width_}x${this.height_}`;

    if (this.corner_.x_ >= 0)
      cropStr += `+${this.corner_.x_}`;
    else
      cropStr += this.corner_.x_.toString();

    if (this.y_ >= 0)
      cropStr += `+${this.corner_._y}`;
    else
      cropStr += this.corner_.y_.toString();
    args.push(cropStr)

    if (this.removeVirtualCanvas_)
      args.push('+repage');

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
    return 'Crop';
  }

  /**
   * Create a Crop object. Crop an image starting from (x,y) with specified width and height.
   * @param {string} src
   * @param {number} width Width (in pixels)
   * @param {number} height Height (in pixels)
   * @param {Coordinates} corner the top left corner where the image will be cropped from.
   * @param {boolean} removeVirtualCanvas Assign as true if you wish to only keep the specified area of the crop. Assign as false if you wish to keep the dimensions of the original image while leaving the crop where it was positioned in the original image (will be surrounded by empty space). NOTE: some image formats don't make use of the virtual canvas, so the image will not appear inside the virtual canvas when previewed. However, Image Magick adds some metadata to preserve the virtual canvas size for later use by other Image Magick commands.
   * @returns {Crop} Returns a Crop object. 
   */
  static Create(src, width, height, corner, removeVirtualCanvas) {
    if (!src || !width || !height || !corner || !removeVirtualCanvas)
      return null;

    return new Crop(src, width, height, corner, removeVirtualCanvas);
  }
}

//--------------------------------
// EXPORTs

exports.Create = Crop.Create;
exports.Name = 'Crop';
exports.Layer = true;
exports.Consolidate = false;
exports.Dependencies = null;
exports.ComponentType = 'drawable';