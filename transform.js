let VALIDATE = require('./validate.js');
let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;

//-----------------------------------------
// ROLL

/**
 * Roll the image horizontally.
 * @param {string} src Source
 * @param {number} pixels Number of pixels to roll horizontally. Values less than 0 will roll it to the left, and values greater than 0 will roll it to the right.
 * @param {string} outputPath The path where the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
function RollHorizontal(src, pixels, outputPath) {
  let error = VALIDATE.IsStringInput(src);
  if (error)
    return Promise.reject(`Failed to roll image horizontally: source is ${error}`);

  error = VALIDATE.IsInteger(pixels);
  if (error)
    return Promise.reject(`Failed to roll image horizontally: pixels is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to roll image horizontally: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [src, '-roll'];

    if (pixels >= 0)
      args.push(`+${pixels}+0`);
    else
      args.push(`-${Math.abs(pixels)}+0`);

    args.push(outputPath);

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to roll image horizontally: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to roll image horizontally: ${error}`);
  });
}

/**
 * Roll the image vertically.
 * @param {string} src Source
 * @param {number} pixels Number of pixels to roll vertically. Values less than 0 will roll it down, and values greater than 0 will roll it up.
 * @param {string} outputPath The path where the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
function RollVertical(src, pixels, dest) {
  let error = VALIDATE.IsStringInput(src);
  if (error)
    return Promise.reject(`Failed to roll image vertically: source is ${error}`);

  error = VALIDATE.IsInteger(pixels);
  if (error)
    return Promise.reject(`Failed to roll image vertically: pixels is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to roll image vertically: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [src, '-roll'];

    if (pixels > 0)
      args.push(`+0-${pixels}`);
    else
      args.push(`+0+${Math.abs(pixels)}`);

    args.push(outputPath);

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to roll image vertically: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to roll image vertically: ${error}`);
  });
}

/**
 * Roll the image vertically.
 * @param {string} src Source
 * @param {number} horizontalPixels Number of pixels to roll horizontally. Values less than 0 will roll it to the left, and values greater than 0 will roll it to the right.
 * @param {number} verticalPixels Number of pixels to roll vertically. Values less than 0 will roll it down, and values greater than 0 will roll it up.
 * @param {string} outputPath The path where the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
function RollBiDirectional(src, horizontalPixels, verticalPixels, outputPath) {
  let error = VALIDATE.IsStringInput(src);
  if (error)
    return Promise.reject(`Failed to roll image bi-directionally: source is ${error}`);

  error = VALIDATE.IsInteger(horizontalPixels);
  if (error)
    return Promise.reject(`Failed to roll image bi-directionally: horizontal pixels is ${error}`);

  error = VALIDATE.IsInteger(verticalPixels);
  if (error)
    return Promise.reject(`Failed to roll image bi-directionally: vertical pixels is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to roll image bi-directionally: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [src, '-roll'];

    let rollStr = '';

    if (horizontalPixels >= 0)
      rollStr += `+${horizontalPixels}`;
    else
      rollStr += `+${Math.abs(horizontalPixels)}`;

    if (verticalPixels > 0)
      rollStr += `-${verticalPixels}`;
    else
      rollStr += `+${Math.abs(verticalPixels)}`;

    args.push(rollStr, outputPath);

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to roll image bi-directionally: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to roll image bi-directionally: ${error}`);
  });
}

//-----------------------------------------
// MIRROR

/**
 * Create a mirror image flipped horizontally.
 * @param {string} src Source
 * @param {string} outputPath The path where the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
function MirrorHorizontal(src, outputPath) {
  let error = VALIDATE.IsStringInput(src);
  if (error)
    return Promise.reject(`Failed to mirror image horizontally: source is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to mirror image horizontally: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [src, '-flop', outputPath];

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to mirror image horizontally: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to mirror image horizontally: ${error}`);
  });
}

/**
 * Create a mirror image flipped vertically.
 * @param {string} src Source
 * @param {string} outputPath The path where the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
function MirrorVertical(src, dest) {
  let error = VALIDATE.IsStringInput(src);
  if (error)
    return Promise.reject(`Failed to mirror image vertically: source is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to mirror image vertically: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [src, '-flip', outputPath];

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to mirror image vertically: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to mirror image vertically: ${error}`);
  });
}

/**
 * Create a mirror image flipped top-left to bottom-right.
 * @param {string} src Source
 * @param {string} outputPath The path where the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
function Transpose(src, dest) {
  let error = VALIDATE.IsStringInput(src);
  if (error)
    return Promise.reject(`Failed to transpose image: source is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to transpose image: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [src, '-transpose', outputPath];

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to transpose image: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to transpose image: ${error}`);
  });
}

/**
 * Create a mirror image flipped bottom-left to top-right.
 * @param {string} src Source
 * @param {string} outputPath The path where the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
function Transverse(src, dest) {
  let error = VALIDATE.IsStringInput(src);
  if (error)
    return Promise.reject(`Failed to transverse image: source is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to transverse image: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [src, '-transverse', outputPath];

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to transverse image: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to transverse image: ${error}`);
  });
}

//-------------------------------
//  OFFSET

/**
 * Shift an image relative to the start and end coordinates. Shift is computed as: Xshift = x1 - x0 and Yshift = y1 - y0.
 * @param {string} src Source
 * @param {number} x0 Start X-coordinate
 * @param {number} y0 Start Y-coordinate
 * @param {number} x1 End X-coordinate
 * @param {number} y1 End Y-coordinate
 * @param {string} outputPath The path where the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
function Offset(src, x0, y0, x1, y1, outputPath) {
  let error = VALIDATE.IsStringInput(src);
  if (error)
    return Promise.reject(`Failed to offset image: source is ${error}`);

  error = VALIDATE.IsInteger(x0);
  if (error)
    return Promise.reject(`Failed to offset image: x0 is ${error}`);

  error = VALIDATE.IsInteger(y0);
  if (error)
    return Promise.reject(`Failed to offset image: y0 is ${error}`);

  error = VALIDATE.IsInteger(x1);
  if (error)
    return Promise.reject(`Failed to offset image: x1 is ${error}`);

  error = VALIDATE.IsInteger(y1);
  if (error)
    return Promise.reject(`Failed to offset image: y1 is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to offset image: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [
      src,
      '-virtual-pixel', 'transparent',
      '-distort', 'Affine', `${x0},${y0} ${x1},${y1}`,  // If this fails, split into two strings
      outputPath
    ];

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to offset image: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to offset image: ${error}`);
  });
}

//-----------------------------
// ROTATE

/**
 * Rotate an image around the center.
 * @param {string} src Source
 * @param {numbers} degrees Integer value representing the number of degrees to rotate the image. A positive value indicates clockwise rotation. A negative value indicates counter-clockwise rotation.
 * @param {string} outputPath The path where the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error. 
 */
function RotateAroundCenter(src, degrees, outputPath) {
  let error = VALIDATE.IsStringInput(src);
  if (error)
    return Promise.reject(`Failed to rotate image around center: source is ${error}`);

  error = VALIDATE.IsInteger(degrees);
  if (error)
    return Promise.reject(`Failed to rotate image around center: degrees is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to rotate image around center: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = ['-distort', 'SRT', degrees, src, outputPath];

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to rotate image around center: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to rotate image around center: ${error}`);
  });
}

/**
 * Rotate an image around a point.
 * @param {string} src Source
 * @param {numbers} x X-coordinate of the point.
 * @param {numbers} y Y-ccordinate of the point.
 * @param {numbers} degrees Integer value representing the number of degrees to rotate the image. A positive value indicates clockwise rotation. A negative value indicates counter-clockwise rotation.
 * @param {string} outputPath The path where the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error. 
 */
function RotateAroundPoint(src, x, y, degrees, outputPath) {
  let error = VALIDATE.IsStringInput(src);
  if (error)
    return Promise.reject(`Failed to rotate image around point: source is ${error}`);

  error = VALIDATE.IsInteger(x);
  if (error)
    return Promise.reject(`Failed to rotate image around point: x is ${error}`);

  error = VALIDATE.IsInteger(y);
  if (error)
    return Promise.reject(`Failed to rotate image around point: y is ${error}`);

  error = VALIDATE.IsInteger(degrees);
  if (error)
    return Promise.reject(`Failed to rotate image around point: degrees is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to rotate image around point: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = ['-distort', 'SRT', `${x},${y} ${degrees}`, src, outputPath];

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to rotate image around point: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to rotate image around point: ${error}`);
  });
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
 * @param {boolean} removeVirtualCanvas Assign as true if you wish to only keep the specified area of the crop. Assign as false if you wish to keep the dimensions of the original image while leaving the crop where it was positioned in the original image (will be surrounded by empty space).
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

    if (xOffset >= 0)
      cropStr += `+${xOffset}`;
    else
      cropStr += `-${Math.abs(xOffset)}`;

    if (yOffset >= 0)
      cropStr += `+${yOffset}`;
    else
      cropStr += `-${Math.abs(yOffset)}`;
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

