let TransformBaseClass = require('./transformbaseclass.js').TransformBaseClass;

//-----------------------------------------
// ROLL

class Roll extends TransformBaseClass {
  constructor(src, horizontal, vertical) {
    super();
    this.src_ = src;
    this.horizontal_ = horizontal;
    this.vertical_ = vertical;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    let args = ['-roll'];

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
   * @returns {Array<string|number>} Returns an array of arguments used for rendering this layer.
   */
  RenderArgs() {
    return [this.src_].concat(this.Args());
  }

  /**
   * @override
   */
  Name() {
    return 'Roll';
  }

  /**
   * Create a Roll object. Rolls the image according to the given horizontal and vertical pixel values.
   * @param {string} src
   * @param {number} horizontal Number of pixels to roll in this direction.
   * @param {number} vertical Number of pixels to roll in this direction.
   * @returns {Roll} Returns a Roll object. If inputs are invalid, it returns null.
   */
  static Create(src, horizontal, vertical) {
    if (!src || isNaN(horizontal) || isNaN(vertical))
      return null;

    return new Roll(src, horizontal, vertical);
  }
}

//-----------------------------------------
// MIRROR

class MirrorHorizontal extends TransformBaseClass {
  constructor(src) {
    super();
    this.src_ = src;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-flop'];
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
    return 'MirrorHorizontal';
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

class MirrorVertical extends TransformBaseClass {
  constructor(src) {
    super();
    this.src_ = src;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-flip'];
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
    return 'MirrorVertical';
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

class Transpose extends TransformBaseClass {
  constructor(src) {
    super();
    this.src_ = src;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-transpose'];
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
    return 'Transpose';
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

class Transverse extends TransformBaseClass {
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

//-----------------------------
// REFLECT

class Reflect extends TransformBaseClass {
  constructor(src, x0, y0, x1, y1) {
    super();
    this.src_ = src;
    this.x0_ = x0;
    this.y0_ = y0;
    this.x1_ = x1;
    this.y1_ = y1;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return [];
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments used for rendering this layer.
   */
  RenderArgs() {
    return [];
  }

  /**
   * @override
   */
  Name() {
    return 'Reflect';
  }

  /**
   * Create a Reflect object. Reflect an image over the line created by two points.
   * @param {string} src
   * @param {numbers} x0 X-coordinate of first point.
   * @param {numbers} y0 Y-coordinate of first point.
   * @param {numbers} x1 X-coordinate of second point.
   * @param {numbers} y1 Y-coordinate of second point.
   * @returns {Reflect} Returns a RotateAroundCenter object. If inputs are invalid, it returns null.
   */
  static Create(src, x0, y0, x1, y1) {
    if (!src || isNaN(x0) || isNaN(y0) || isNaN(x1) || isNaN(y1))
      return null;

    return new Reflect(src, x0, y0, x1, y1);
  }
}


//-------------------------------
//  OFFSET

class Offset extends TransformBaseClass {
  constructor(src, x0, y0, x1, y1) {
    super();
    this.src_ = src;
    this.x0_ = x0;
    this.y0_ = y0;
    this.x1_ = x1;
    this.y1_ = y1;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-virtual-pixel', 'transparent', '-distort', 'Affine', `${this.x0_},${this.y0_} ${this.x1_},${this.y1_}`];
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
    return 'Offset';
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
    if (!src || isNaN(x0) || isNaN(y0) || isNaN(x1) || isNaN(y1))
      return null;

    return new Offset(src, x0, y0, x1, y1);
  }
}

//-----------------------------
// ROTATE

class RotateAroundCenter extends TransformBaseClass {
  constructor(src, degrees) {
    super();
    this.src_ = src;
    this.degrees_ = degrees;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-distort', 'SRT', this.degrees_];
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
    return 'RotateAroundCenter';
  }

  /**
   * Create a RotateAroundCenter object. Rotate an image around the center.
   * @param {string} src
   * @param {numbers} degrees Integer value representing the number of degrees to rotate the image. A positive value indicates clockwise rotation. A negative value indicates counter-clockwise rotation.
   * @returns {RotateAroundCenter} Returns a RotateAroundCenter object. If inputs are invalid, it returns null.
   */
  static Create(src, degrees) {
    if (!src || isNaN(degrees))
      return null;

    return new RotateAroundCenter(src, degrees);
  }
}

class RotateAroundPoint extends TransformBaseClass {
  constructor(src, x, y, degrees) {
    super();
    this.src_ = src;
    this.x_ = x;
    this.y_ = y;
    this.degrees_ = degrees;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-distort', 'SRT', `${this.x_},${this.y_} ${this.degrees_}`];
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
    return 'RotateAroundPoint';
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
    if (!src || isNaN(x) || isNaN(y) || isNaN(degrees))
      return null;

    return new RotateAroundPoint(src, x, y, degrees);
  }
}

class RotateImage extends TransformBaseClass {
  constructor(src, degrees) {
    super();
    this.src_ = src;
    this.degrees_ = degrees;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return [];
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments used for rendering this layer.
   */
  RenderArgs() {
    return [];
  }

  /**
   * @override
   */
  Name() {
    return 'RotateImage';
  }

  /**
   * Create a RotateAroundCenter object. Rotate an image around the center.
   * @param {string} src
   * @param {numbers} degrees Integer value representing the number of degrees to rotate the image. A positive value indicates clockwise rotation. A negative value indicates counter-clockwise rotation.
   * @returns {RotateAroundCenter} Returns a RotateAroundCenter object. If inputs are invalid, it returns null.
   */
  static Create(src, degrees) {
    if (!src || isNaN(degrees))
      return null;

    return new RotateImage(src, degrees);
  }
}

//--------------------------------------
// RESIZE 

class Resize extends TransformBaseClass {
  constructor(src, width, height) {
    this.src_ = src;
    this.width_ = width;
    this.height_ = height;
  }

  Args_(resizeOp) {
    return ['-resize', `${this.width_}x${this.height_}${resizeOp}`];
  }
}

class ResizeIgnoreAspectRatio extends Resize {
  constructor(src, width, height) {
    super(src, width, height);
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return this.Args_('!');
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
    return 'ResizeIgnoreAspectRatio';
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
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return this.Args_('>');
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
    return 'ResizeOnlyShrinkLarger';
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
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return this.Args_('<');
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
    return 'ResizeOnlyEnlargeSmaller';
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
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return this.Args_('^');
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

class ResizePercentage extends TransformBaseClass {
  constructor(src, percent) {
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

class ResizePixelCountLimit extends TransformBaseClass {
  constructor(src, pixels) {
    this.src_ = src;
    this.pixels_ = pixels;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-resize', `${this.pixels_}@`];
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
    return 'ResizePixelCountLimit';
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

class Crop extends TransformBaseClass {
  constructor(src, width, height, x, y, removeVirtualCanvas) {
    this.src_ = src;
    this.width_ = width;
    this.height_ = height;
    this.x_ = x;
    this.y_ = y;
    this.removeVirtualCanvas_ = removeVirtualCanvas;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    let args = ['-crop'];

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
   * @param {number} x X-coordinate of the top-left corner of the crop area.
   * @param {number} y Y-coordinate of the top-left corner of the crop area.
   * @param {boolean} removeVirtualCanvas Assign as true if you wish to only keep the specified area of the crop. Assign as false if you wish to keep the dimensions of the original image while leaving the crop where it was positioned in the original image (will be surrounded by empty space). NOTE: some image formats don't make use of the virtual canvas, so the image will not appear inside the virtual canvas when previewed. However, Image Magick adds some metadata to preserve the virtual canvas size for later use by other Image Magick commands.
   * @returns {Crop} Returns a Crop object. 
   */
  static Create(src, width, height, x, y, removeVirtualCanvas) {
    if (!src || !width || !height || isNaN(x) || isNaN(y) || !removeVirtualCanvas)
      return null;

    return new Crop(src, width, height, x, y, removeVirtualCanvas);
  }
}

//------------------------------------
// TRIM

class Trim extends TransformBaseClass {
  constructor(src, borderColor, fuzz) {
    super();
    this.src_ = src;
    this.borderColor_ = borderColor;
    this.fuzz_ = fuzz;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    let args = [];

    if (this.borderColor_)
      args.push('-bordercolor', this.borderColor_);

    if (this.fuzz_ && this.fuzz_ > 0)
      args.push('-fuzz', this.fuzz_);

    args.push('-trim', '+repage');

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
    return 'Trim';
  }

  /**
   * Create a Trim object. Trim surrounding transparent pixels from an image.
   * @param {string} src
   * @param {string} borderColor
   * @param {number} fuzz
   * @returns {Trim} Returns a Trim object.
   */
  static Create(src, borderColor, fuzz) {
    if (!src)
      return null;

    return new Trim(src, borderColor, fuzz);
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
exports.CreateReflectMod = Reflect.Create;
exports.CreateRotateAroundCenterMod = RotateAroundCenter.Create;
exports.CreateRotateAroundPointMod = RotateAroundPoint.Create;
exports.CreateResizeIgnoreAspectRatioMod = ResizeIgnoreAspectRatio.Create;
exports.CreateResizeOnlyShrinkLargerMod = ResizeOnlyShrinkLarger.Create;
exports.CreateResizeOnlyEnlargeSmallerMod = ResizeOnlyEnlargeSmaller.Create;
exports.CreateResizeFillGivenAreaMod = ResizeFillGivenArea.Create;
exports.CreateResizePercentageMod = ResizePercentage.Create;
exports.CreateResizePixelCountLimitMod = ResizePixelCountLimit.Create;
exports.CreateCropMod = Crop.Create;
exports.CreateRotateImageMod = RotateImage.Create;
exports.CreateTrimMod = Trim.Create;
