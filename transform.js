let VALIDATE = require('./validate.js');
let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;

//-----------------------------------------
// ROLL HORIZONTAL

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

//-----------------------------------------
// ROLL VERTICAL

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

//-----------------------------------------
// ROLL BI-DIRECTIONAL

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


function MirrorHorizontal(src, outputPath) {
  let args = [src, '-flop', outputPath];
  LOCAL_COMMAND.Execute('convert', args).then().catch();
}

function MirrorVertical(src, dest) {
  let args = [src, '-flip', outputPath]; i
  LOCAL_COMMAND.Execute('convert', args).then().catch();
}

function MirrorTranspose(src, dest)  // Top-Left To Bottom-Right
{
  let args = [src, '-transpose', outputPath];
  LOCAL_COMMAND.Execute('convert', args).then().catch();
}

function MirrorTransverse(src, dest)  // Bottom-Left To Top-Right
{
  let args = [src, '-transverse', outputPath];
  LOCAL_COMMAND.Execute('convert', args).then().catch();
}

//-------------------------------
//  OFFSET

function Offset(src, x0, y0, x1, y1, outputPath) {
  let args = [
    src,
    '-virtual-pixel', 'transparent',
    '-distort', 'Affine', `${x0},${y0} ${x1},${y1}`,  // If this fails, split into two strings
    outputPath
  ];

  LOCAL_COMMAND.Execute('convert', args).then().catch();
}

//-----------------------------
// ROTATE AROUND CENTER

function rotateAroundCenter(src, degrees, outputPath) {
  let args = ['-distort', 'SRT', degrees, src, outputPath];
  LOCAL_COMMAND.Execute('convert', args).then().catch();
}

//-----------------------------
// ROTATE AROUND POINT

function rotateAroundPoint(src, x, y, degrees, outputPath) {
  let args = ['-distort', 'SRT', `${x},${y} ${degrees}`, src, outputPath];
  LOCAL_COMMAND.Execute('convert', args).then().catch();
}

//--------------------------------------
// RESIZE

// Ignore aspect ratio and distort image to the size specified.  \!
function ResizeIgnoreAspectRatio(src, width, height, outputPath) {
  let args = [src, '-resize', `${width}x${height}!`, outputPath];
  LOCAL_COMMAND.Execute('convert', args).then().catch();
}

// Apply to images greater than the size given.  \>
function ResizeOnlyShrinkLarger(src, width, height, outputPath) {
  let args = [src, '-resize', `${width}x${height}>`, outputPath];
  LOCAL_COMMAND.Execute('convert', args).then().catch();
}

// Only enlarges images that are smaller than the given size.  \<
function ResizeOnlyEnlargeSmaller(src, width, height, outputPath) {
  let args = [src, '-resize', `${width}x${height}<`, outputPath];
  LOCAL_COMMAND.Execute('convert', args).then().catch();
}

// Resize image based on the smallest fitting dimension. Image is resized to completely fill (and even overflow) the pixel area given.  ^
function ResizeFillGivenArea(src, width, height, outputPath) {
  let args = [src, '-resize', `${width}x${height}^`, outputPath];
  LOCAL_COMMAND.Execute('convert', args).then().catch();
}

// Scale image by amount specified.  %
function ResizePercentage(src, percent, outputPath) {
  let args = [src, '-resize', `${percent}%`, outputPath];
  LOCAL_COMMAND.Execute('convert', args).then().catch();
}

// Resize image to contain no more than a certain number of pixels.  @
function ResizePixelCountLimit(src, pixels, outputPath) {
  let args = [src, '-resize', `${pixels}@`, outputPath];
  LOCAL_COMMAND.Execute('convert', args).then().catch();
}

//--------------------------------
// CROP

function Crop(src, width, height, xOffset, yOffset, keepVirtualCanvas, outputPath) {
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

  if (!keepVirtualCanvas)
    args.push('+repage');
  args.push(outputPath);

  LOCAL_COMMAND.Execute('convert', args).then().catch();
}

//-----------------------------------
// EXPORTS

exports.RollHorizontal = RollHorizontal;
exports.RollVertical = RollVertical;
exports.RollBiDirectional = RollBiDirectional;
