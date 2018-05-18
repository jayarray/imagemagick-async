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

/**
 * Resize image while ignoring aspect ratio and distort image to the size specified.
 * @param {string} src Source
 * @param {number} width Width (in pixels)
 * @param {number} height Height (in pixels)i
 * @param {string} outputPath the path that the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error. 
 */
function ResizeIgnoreAspectRatio(src, width, height, outputPath) {
  let error = VALIDATE.IsStringInput(src);
  if (error)
    return Promise.reject(`Failed to resize image: source is ${error}`);

  error = VALIDATE.IsNumber(width);
  if (error)
    return Promise.reject(`Failed to resize image: width is ${error}`);

  error = VALIDATE.IsNumberInRange(width, 1, null);
  if (error)
    return Promise.reject(`Failed to resize image: width is ${error}`);

  error = VALIDATE.IsNumber(height);
  if (error)
    return Promise.reject(`Failed to resize image: height is ${error}`);

  error = VALIDATE.IsNumberInRange(height, 1, null);
  if (error)
    return Promise.reject(`Failed to resize image: height is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to resize image: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [src, '-resize', `${width}x${height}!`, outputPath];

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to resize image: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to resize image: ${error}`);
  });
}

/**
 * Resize image and only shrink images that are smaller than the given size.
 * @param {string} src Source
 * @param {number} width Width (in pixels)
 * @param {number} height Height (in pixels)i
 * @param {string} outputPath the path that the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error. 
 */
function ResizeOnlyShrinkLarger(src, width, height, outputPath) {
  let error = VALIDATE.IsStringInput(src);
  if (error)
    return Promise.reject(`Failed to resize image: source is ${error}`);

  error = VALIDATE.IsNumber(width);
  if (error)
    return Promise.reject(`Failed to resize image: width is ${error}`);

  error = VALIDATE.IsNumberInRange(width, 1, null);
  if (error)
    return Promise.reject(`Failed to resize image: width is ${error}`);

  error = VALIDATE.IsNumber(height);
  if (error)
    return Promise.reject(`Failed to resize image: height is ${error}`);

  error = VALIDATE.IsNumberInRange(height, 1, null);
  if (error)
    return Promise.reject(`Failed to resize image: height is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to resize image: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [src, '-resize', `${width}x${height}>`, outputPath];

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to resize image: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to resize image: ${error}`);
  });
}

/**
 * Resize image and only enlarge images that are smaller than the given size.
 * @param {string} src Source
 * @param {number} width Width (in pixels)
 * @param {number} height Height (in pixels)i
 * @param {string} outputPath the path that the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error. 
 */
function ResizeOnlyEnlargeSmaller(src, width, height, outputPath) {
  let error = VALIDATE.IsStringInput(src);
  if (error)
    return Promise.reject(`Failed to resize image: source is ${error}`);

  error = VALIDATE.IsNumber(width);
  if (error)
    return Promise.reject(`Failed to resize image: width is ${error}`);

  error = VALIDATE.IsNumberInRange(width, 1, null);
  if (error)
    return Promise.reject(`Failed to resize image: width is ${error}`);

  error = VALIDATE.IsNumber(height);
  if (error)
    return Promise.reject(`Failed to resize image: height is ${error}`);

  error = VALIDATE.IsNumberInRange(height, 1, null);
  if (error)
    return Promise.reject(`Failed to resize image: height is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to resize image: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [src, '-resize', `${width}x${height}<`, outputPath];

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to resize image: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to resize image: ${error}`);
  });
}

/**
 * Resize image based on the smallest fitting dimension. Image is resized to completely fill (and even overflow) the pixel area given.
 * @param {string} src Source
 * @param {number} width Width (in pixels)
 * @param {number} height Height (in pixels)i
 * @param {string} outputPath the path that the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error. 
 */
function ResizeFillGivenArea(src, width, height, outputPath) {
  let error = VALIDATE.IsStringInput(src);
  if (error)
    return Promise.reject(`Failed to resize image: source is ${error}`);

  error = VALIDATE.IsNumber(width);
  if (error)
    return Promise.reject(`Failed to resize image: width is ${error}`);

  error = VALIDATE.IsNumberInRange(width, 1, null);
  if (error)
    return Promise.reject(`Failed to resize image: width is ${error}`);

  error = VALIDATE.IsNumber(height);
  if (error)
    return Promise.reject(`Failed to resize image: height is ${error}`);

  error = VALIDATE.IsNumberInRange(height, 1, null);
  if (error)
    return Promise.reject(`Failed to resize image: height is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to resize image: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [src, '-resize', `${width}x${height}^`, outputPath];

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to resize image: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to resize image: ${error}`);
  });
}

/**
 * Resize image by the specified percentage.
 * @param {string} src Source
 * @param {number} percent Percent for increasing/decreasing the size. Minimum value is 0.
 * @param {string} outputPath the path that the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error. 
 */
function ResizePercentage(src, percent, outputPath) {
  let error = VALIDATE.IsStringInput(src);
  if (error)
    return Promise.reject(`Failed to resize image: source is ${error}`);

  error = VALIDATE.IsNumber(percent);
  if (error)
    return Promise.reject(`Failed to resize image: percent is ${error}`);

  error = VALIDATE.IsNumberInRange(percent, 0, null);
  if (error)
    return Promise.reject(`Failed to resize image: percent is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to resize image: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [src, '-resize', `${percent}%`, outputPath];

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to resize image: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to resize image: ${error}`);
  });
}

/**
 * Resize image to contain no more than a certain number of pixels.
 * @param {string} src Source
 * @param {number} pixels the number of pixels (greater than 0) that the image should have.
 * @param {string} outputPath the path that the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error. 
 */
function ResizePixelCountLimit(src, pixels, outputPath) {
  let error = VALIDATE.IsStringInput(src);
  if (error)
    return Promise.reject(`Failed to resize image: source is ${error}`);

  error = VALIDATE.IsInteger(pixels);
  if (error)
    return Promise.reject(`Failed to resize image: pixels is ${error}`);

  error = VALIDATE.IsIntegerInRange(pixels, 1, null);
  if (error)
    return Promise.reject(`Failed to resize image: pixels is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to resize image: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [src, '-resize', `${pixels}@`, outputPath];

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to resize image: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to resize image: ${error}`);
  });
}

//--------------------------------
// CROP

/**
 * Crop an image starting from (x,y) with specified width and height.
 * @param {string} src Source
 * @param {number} width Width (in pixels)
 * @param {number} height Height (in pixels)
 * @param {number} x X-coordinate of the top-left corner of the crop area.
 * @param {number} y Y-coordinate of the top-left corner of the crop area.
 * @param {boolean} removeVirtualCanvas Assign as true if you wish to only keep the specified area of the crop. Assign as false if you wish to keep the dimensions of the original image while leaving the crop where it was positioned in the original image (will be surrounded by empty space). NOTE: some image formats don't make use of the virtual canvas, so the image will not appear inside the virtual canvas when previewed. However, Image Magick adds some metadata to preserve the virtual canvas size for later use by other Image Magick commands.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error. 
 */
function Crop(src, width, height, x, y, removeVirtualCanvas, outputPath) {
  let error = VALIDATE.IsStringInput(src);
  if (error)
    return Promise.reject(`Failed to crop image: source is ${error}`);

  error = VALIDATE.IsInteger(width);
  if (error)
    return Promise.reject(`Failed to crop image: width is ${error}`);

  error = VALIDATE.IsIntegerInRange(width, 0, null);
  if (error)
    return Promise.reject(`Failed to crop image: width is ${error}`);

  error = VALIDATE.IsInteger(height);
  if (error)
    return Promise.reject(`Failed to crop image: height is ${error}`);

  error = VALIDATE.IsIntegerInRange(height, 0, null);
  if (error)
    return Promise.reject(`Failed to crop image: height is ${error}`);

  error = VALIDATE.IsInteger(x);
  if (error)
    return Promise.reject(`Failed to crop image: x is ${error}`);

  error = VALIDATE.IsInteger(y);
  if (error)
    return Promise.reject(`Failed to crop image: y is ${error}`);

  let isBoolean = removeVirtualCanvas === false || removeVirtualCanvas === true;
  if (!isBoolean)
    return Promise.reject(`Failed to crop image: removeVirtualCanvas is not a boolean value`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to crop image: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [src, '-crop'];

    let cropStr = `${width}x${height}`;

    if (x >= 0)
      cropStr += `+${x}`;
    else
      cropStr += `-${Math.abs(x)}`;

    if (y >= 0)
      cropStr += `+${y}`;
    else
      cropStr += `-${Math.abs(y)}`;
    args.push(cropStr)

    if (removeVirtualCanvas)
      args.push('+repage');
    args.push(outputPath);

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to crop image: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to crop image: ${error}`);
  });
}

//-----------------------------------
// EXPORTS

exports.Crop = Crop;
exports.MirrorHorizontal = MirrorHorizontal;
exports.MirrorVertical = MirrorVertical;
exports.Offset = Offset;
exports.ResizeFillGivenArea = ResizeFillGivenArea;
exports.ResizeIgnoreAspectRatio = ResizeIgnoreAspectRatio;
exports.ResizeOnlyEnlargeSmaller = ResizeOnlyEnlargeSmaller;
exports.ResizeOnlyShrinkLarger = ResizeOnlyShrinkLarger;
exports.ResizePercentage = ResizePercentage;
exports.ResizePixelCountLimit = ResizePixelCountLimit;
exports.RollHorizontal = RollHorizontal;
exports.RollVertical = RollVertical;
exports.RollBiDirectional = RollBiDirectional;
exports.RotateAroundCenter = RotateAroundCenter;
exports.RotateAroundPoint = RotateAroundPoint;
exports.Transpose = Transpose;
exports.Transverse = Transverse;

