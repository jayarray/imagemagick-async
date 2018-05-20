let VALIDATE = require('./validate.js');
let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;

let Layer = require('./layerbase.js').Layer;

//-----------------------------------
// TRANSFORM (base class)

class Transform extends Layer {
  constructor() {
    super();
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    // Override
  }

  /**
   * @override
   * @returns {string} Returns a string of the command used to render the mod.
   */
  Command() {
    return 'convert';
  }

  /**
   * @override
   * @returns {string} Returns a string of the type name.
   */
  Type() {
    return 'mod';
  }
}

//-----------------------------------------
// ROLL

class Roll extends Transform {
  constructor(horizontal, vertical) {
    super();
    this.horizontal_ = horizontal;
    this.vertical_ = vertical;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    let args = [this.src_, '-roll'];

    let rollStr = '';

    if (this.horizontal_ >= 0)
      rollStr += `+${this.horizontal_}`;
    else
      rollStr += this.horizontal_;

    if (this.vertical_ > 0)
      rollStr += `-${this.vertical_}`;
    else
      rollStr += `+${Math.abs(this.vertical_)}`;

    args.push(rollStr);

    return args;
  }

  /**
   * Create a Roll object. Rolls the image according to the given horizontal and vertical pixel values.
   * @param {string} src
   * @param {number} horizontal Number of pixels to roll in this direction.
   * @param {number} vertical Number of pixels to roll in this direction.
   * @returns {Roll} Returns a Roll object. If inputs are invalid, it returns null.
   */
  static Create(horizontal, vertical) {
    if (!horizontal || !vertical)
      return null;

    return new Roll(horizontal, vertical);
  }
}

//-----------------------------------------
// MIRROR

class MirrorHorizontal extends Transform {
  constructor(src) {
    super();
    this.src_ = src;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    return [src, '-flop'];
  }

  /**
   * Create a MirrorHorizontal object. Creates a mirror image flipped horizontally.
   * @param {string} src
   * @returns {MirrorHorizontal} Returns a MirrorHorizontal object. If inputs are invalid, it returns null.
   */
  static Create(src) {
    if (!src)
      return null;

    return new MirrorHorizontal(src);
  }
}

class MirrorVertical extends Transform {
  constructor(src) {
    super();
    this.src_ = src;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    return [src, '-flip'];
  }

  /**
   * Create a MirrorVertical object. Creates a mirror image flipped vertically.
   * @param {string} src
   * @returns {MirrorVertical} Returns a MirrorVertical object. If inputs are invalid, it returns null.
   */
  static Create(src) {
    if (!src)
      return null;

    return new MirrorVertical(src);
  }
}

class Transpose extends Transform {
  constructor(src) {
    super();
    this.src_ = src;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    return [src, '-transpose'];
  }

  /**
   * Create a Transpose object. Create a mirror image flipped top-left to bottom-right.
   * @param {string} src
   * @returns {Transpose} Returns a Transpose object. If inputs are invalid, it returns null.
   */
  static Create(src) {
    if (!src)
      return null;

    return new Transpose(src);
  }
}

class Transverse extends Transform {
  constructor(src) {
    super();
    this.src_ = src;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    return [src, '-transverse'];
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

//-------------------------------
//  OFFSET

class Offset extends Transform {
  constructor(src, x0, y0, x1, y1) {
    super();
    this.src_ = src;
    this.x0_ = x0;
    this.y0_ = y0;
    this.x1_ = x1;
    this.y1_ = y1;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    return [this.src_, '-virtual-pixel', 'transparent', '-distort', 'Affine', `${this.x0_},${this.y0_} ${this.x1_},${this.y1_}`];
  }

  /**
   * Create an Offset object.Shift an image relative to the start and end coordinates. Shift is computed as: Xshift = x1 - x0 and Yshift = y1 - y0.
   * @param {string} src
   * @param {number} x0 Start X-coordinate
   * @param {number} y0 Start Y-coordinate
   * @param {number} x1 End X-coordinate
   * @param {number} y1 End Y-coordinate
   * @returns {Offset} Returns an Offset object. If inputs are invalid, it returns null.
   */
  static Create(src, x0, y0, x1, y1) {
    if (!src || !x0 || !y0 || !x1 || !y1)
      return null;

    return new Offset(src, x0, y0, x1, y1);
  }
}

//-----------------------------
// ROTATE

class RotateAroundCenter extends Transform {
  constructor(src, degrees) {
    super();
    this.src_ = src;
    this.degrees_ = degrees;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    return ['-distort', 'SRT', this.degrees_, this.src_];
  }

  /**
   * Create a RotateAroundCenter object. Rotate an image around the center.
   * @param {string} src
   * @param {numbers} degrees Integer value representing the number of degrees to rotate the image. A positive value indicates clockwise rotation. A negative value indicates counter-clockwise rotation.
   * @returns {RotateAroundCenter} Returns a RotateAroundCenter object. If inputs are invalid, it returns null.
   */
  static Create(src, degrees) {
    if (!src || !degrees)
      return null;

    return new RotateAroundCenter(src, degrees);
  }
}

class RotateAroundPoint extends Transform {
  constructor(src, x, y, degrees) {
    super();
    this.src_ = src;
    this.x_ = x;
    this.y_ = y;
    this.degrees_ = degrees;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    return ['-distort', 'SRT', `${this.x_},${this.y_} ${this.degrees_}`, this.src_];
  }

  /**
   * Create a RotateAroundPoint object. Rotate an image around a point.
   * @param {string} src
   * @param {numbers} x X-coordinate of the point.
   * @param {numbers} y Y-ccordinate of the point.
   * @param {numbers} degrees Integer value representing the number of degrees to rotate the image. A positive value indicates clockwise rotation. A negative value indicates counter-clockwise rotation.
   * @returns {RotateAroundPoint} Returns a RotateAroundPoint object. If inputs are invalid, it returns null.
   */
  static Create(src, x, y, degrees) {
    if (!src || !x || !y || !degrees)
      return null;

    return new RotateAroundPoint(src, x, y, degrees);
  }
}

//--------------------------------------
// RESIZE 

class Resize extends Transform {
  constructor(src, width, height) {
    this.src_ = src;
    this.width_ = width;
    this.height_ = height;
  }

  Args_(resizeOp) {
    return [this.src_, '-resize', `${this.width_}x${this.height_}${resizeOp}`];
  }
}

class ResizeIgnoreAspectRatio extends Resize {
  constructor(src, width, height) {
    super(src, width, height);
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    return this.Args_('!');
  }

  /**
   * Create a ResizeIgnoreAspectRatio object. Resize image while ignoring aspect ratio and distort image to the size specified.
   * @param {string} src
   * @param {number} width
   * @param {number} height
   * @returns {ResizeIgnoreAspectRatio} Returns a ResizeIgnoreAspectRatio object. 
   */
  static Create(src, width, height) {
    if (!src || !width || !height)
      return null;

    return new ResizeIgnoreAspectRatio(src, width, height);
  }
}

class ResizeOnlyShrinkLarger extends Resize {
  constructor(src, width, height) {
    super(src, width, height);
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    return this.Args_('>');
  }

  /**
   * Create a ResizeOnlyShrinkLarger object.Resize image and only shrink images that are smaller than the given size.
   * @param {string} src
   * @param {number} width
   * @param {number} height
   * @returns {ResizeOnlyShrinkLarger} Returns a ResizeOnlyShrinkLarger object. 
   */
  static Create(src, width, height) {
    if (!src || !width || !height)
      return null;

    return new ResizeOnlyShrinkLarger(src, width, height);
  }
}

class ResizeOnlyEnlargeSmaller extends Resize {
  constructor(src, width, height) {
    super(src, width, height);
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    return this.Args_('<');
  }

  /**
   * Create a ResizeOnlyEnlargeSmaller object. Resize image and only enlarge images that are smaller than the given size.
   * @param {string} src
   * @param {number} width
   * @param {number} height
   * @returns {ResizeOnlyEnlargeSmaller} Returns a ResizeOnlyEnlargeSmaller object. 
   */
  static Create(src, width, height) {
    if (!src || !width || !height)
      return null;

    return new ResizeOnlyEnlargeSmaller(src, width, height);
  }
}

class ResizeFillGivenArea extends Resize {
  constructor(src, width, height) {
    super(src, width, height);
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    return this.Args_('^');
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

class ResizePercentage extends Transform {
  constructor(src, percent) {
    this.src_ = src;
    this.percent_ = percent;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    return [this.src_, '-resize', `${this.percent_}%`];
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

class ResizePixelCountLimit extends Transform {
  constructor(src, pixels) {
    this.src_ = src;
    this.pixels_ = pixels;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    return [this.src_, '-resize', `${this.pixels_}@`];
  }

  /**
   * Create a ResizePixelCountLimit object. Resize image to contain no more than a certain number of pixels.
   * @param {string} src
   * @param {number} pixels the number of pixels (greater than 0) that the image should have.
   * @returns {ResizePixelCountLimit} Returns a ResizePixelCountLimit object. 
   */
  static Create(src, pixels) {
    if (!src || !pixels)
      return null;

    return new ResizePixelCountLimit(src, pixels);
  }
}

//--------------------------------
// CROP

class Crop extends Transform {
  constructor(src, width, height, x, y, removeVirtualCanvas) {
    this.src_ = src;
    this.width_ = width;
    this.height_ = height;
    this.x_ = x;
    this.y_ = y;
    this.removeVirtualCanvas = removeVirtualCanvas;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    let args = [this.src_, '-crop'];

    let cropStr = `${this.width_}x${this.height_}`;

    if (this.x_ >= 0)
      cropStr += `+${this.x_}`;
    else
      cropStr += this.x_.toString();

    if (this.y_ >= 0)
      cropStr += `+${this._y}`;
    else
      cropStr += this.y_.toString();
    args.push(cropStr)

    if (this.removeVirtualCanvas_)
      args.push('+repage');

    return args;
  }

  /**
   * Create a Crop object. Crop an image starting from (x,y) with specified width and height.
   * @param {number} width Width (in pixels)
   * @param {number} height Height (in pixels)
   * @param {number} x X-coordinate of the top-left corner of the crop area.
   * @param {number} y Y-coordinate of the top-left corner of the crop area.
   * @param {boolean} removeVirtualCanvas Assign as true if you wish to only keep the specified area of the crop. Assign as false if you wish to keep the dimensions of the original image while leaving the crop where it was positioned in the original image (will be surrounded by empty space). NOTE: some image formats don't make use of the virtual canvas, so the image will not appear inside the virtual canvas when previewed. However, Image Magick adds some metadata to preserve the virtual canvas size for later use by other Image Magick commands.
   * @returns {Crop} Returns a Crop object. 
   */
  static Create(src, pixels) {
    if (!src || !width || !height || !x || !y || !removeVirtualCanvas)
      return null;

    return new Crop(src, width, height, x, y, removeVirtualCanvas);
  }
}

//-----------------------------------
// EXPORTS

exports.CreateRollMod = Roll.Create;
exports.CreateMirrorHorizontalMod = MirrorHorizontal.Create;
exports.CreateMirrorVerticalMod = MirrorVertical.Create;
exports.CreateTransposeMod = Transpose.Create;
exports.CreateTransverseMod = Transverse.Create;
exports.CreateOffsetMod = Offset.Create;
exports.CreateRotateAroundCenterMod = RotateAroundCenter.Create;
exports.CreateRotateAroundPointMod = RotateAroundPoint.Create;
exports.CreateResizeIgnoreAspectRatioMod = ResizeIgnoreAspectRatio.Create;
exports.CreateResizeOnlyShrinkLargerMod = ResizeOnlyShrinkLarger.Create;
exports.CreateResizeOnlyEnlargeSmallerMod = ResizeOnlyEnlargeSmaller.Create;
exports.CreateResizeFillGivenAreaMod = ResizeFillGivenArea.Create;
exports.CreateResizePercentageMod = ResizePercentage.Create;
exports.CreateResizePixelCountLimitMod = ResizePixelCountLimit.Create;
exports.CreateCropMod = Crop.Create;

