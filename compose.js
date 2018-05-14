let VALIDATE = require('./validate.js');
let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;

//------------------------------------------
// CONSTANTS

const MIN_FILEPATHS = 2;

//-------------------------------------------
// COMPOSITE

/**
 * Render a composite image made up of the provided lists of filepaths. NOTE: Images are layered from bottom to top.
 * @param {Array<string>} filepaths A list of image filepaths.
 * @param {string} gravity (Optional) Gravity
 * @param {string} outputPath The path where the image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
function Composite(filepaths, gravity, outputPath) {
  let error = VALIDATE.IsArray(filepaths);
  if (error)
    return Promise.reject(`Failed to draw composite image: filepaths are ${error}`);

  if (filepaths.length < MIN_FILEPATHS)
    return Promise.reject(`Failed to draw composite image: ${MIN_FILEPATHS} or more filepaths are required`);

  error = VALIDATE.IsStringInput(gravity);
  if (gravity != null && error)
    return Promise.reject(`Failed to draw composite image: gravity is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to draw composite image: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [];

    // Add gravity
    if (gravity)
      args.push('-gravity', gravity);

    // Add first 2 paths
    args.push(filepaths[0], filepaths[1]);

    // Add other parts accordingly
    for (let i = 2; i < filepaths.length; ++i) {
      args.push('-composite', filepaths[i]);
    }

    // Add output path
    args.push('-composite', outputPath);

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to draw composite image: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to draw composite image: ${error}`);
  });
}

//--------------------------------------
// GIF

/**
 * Create a GIF from the provided filepath list (in ther order provided) and other properties.
 * @param {Canvas} canvas Canvas object
 * @param {Array<string>} filepaths List of filepaths
 * @param {number} loop (Optional) The number of times the GIF animation is to cycle before stopping. The default value is 0 (infinite loop). Valid loop values are from 0 to infinity.
 * @param {number} delay The delay time measured in 1/100th of a seconds at a time.
 * @param {string} dispose (Optional) Determines what the following images should do with the previous results of the GIF animation. Default is 'Undefined'.
 * @param {string} outputPath The path where the GIF will be rendered.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
function Gif(canvas, filepaths, loop, delay, dispose, outputPath) {
  let minLoopValue = 0;

  let parentClass = Object.getPrototypeOf(o.constructor).name;
  if (parentClass != 'Canvas')
    return Promise.reject(`Failed to create GIF: canvas is an invalid type`);

  let error = VALIDATE.IsArray(filepaths);
  if (error)
    return Promise.reject(`Failed to create GIF: filepaths are ${error}`);

  if (filepaths.length < MIN_FILEPATHS)
    return Promise.reject(`Failed to draw composite image: ${MIN_FILEPATHS} or more filepaths are required`);

  error = VALIDATE.IsInteger(loop);
  if (loop != null && error)
    return Promise.reject(`Failed to create GIF: loop is ${error}`);

  error = VALIDATE.IsIntegerInRange(loop, minLoopValue, null);
  if (error)
    return Promise.reject(`Failed to create GIF: loop is ${error}`);

  error = VALIDATE.IsInteger(delay);
  if (error)
    return Promise.reject(`Failed to create GIF: delay is ${error}`);

  error = VALIDATE.IsStringInput(dispose);
  if (error)
    return Promise.reject(`Failed to create GIF: dispose is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to create GIF: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = ['-delay', delay];

    // Add dispose
    args.push('-dispose');
    if (dispose)
      args.push(dispose);
    else
      args.push('Undefined');

    // Add loop (if applicable)
    args.push('-loop');
    if (loop)
      args.push(loop);
    else
      args.push(minLoopValue);

    // Add filepaths
    args = args.concat(filepaths).concat(outputPath);

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to creaqte GIF: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to create GIF: ${error}`);
  });
}

//--------------------------------------
// MULTIPLY

/**
 * Overlay colors of image with white background onto the other. Overlaying colors attenuate to black. That is, this operation only darkens colors (never lightens them). NOTE: Black will result in black.
 * @param {string} src1 Source 1
 * @param {string} src2 Source 2
 * @param {string} outputPath The path where the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
function MultiplyMakeWhiteTransparent(src1, src2, outputPath) {
  let error = VALIDATE.IsStringInput(src1);
  if (error)
    return Promise.reject(`Failed to multiply images: source 1 is ${error}`);

  error = VALIDATE.IsStringInput(src2);
  if (error)
    return Promise.reject(`Failed to multiply images: source 2 is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to multiply images: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = ['-compose', 'Multiply', src1, src2, '-composite', outputPath];

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to multiply images: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to multiply images: ${error}`);
  });
}

/**
 * Overlay colors of image with black background onto the other. Overlaying colors attenuate to white. That is, this operation only lightens colors (never darkens them). NOTE: White will result in white.
 * @param {string} src1 Source 1
 * @param {string} src2 Source 2
 * @param {string} outputPath The path where the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
function MultiplyMakeBlackTransparent(src1, src2, outputPath) {
  let error = VALIDATE.IsStringInput(src1);
  if (error)
    return Promise.reject(`Failed to multiply images: source 1 is ${error}`);

  error = VALIDATE.IsStringInput(src2);
  if (error)
    return Promise.reject(`Failed to multiply images: source 2 is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to multiply images: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = ['-compose', 'Screen', src1, src2, '-composite', outputPath];

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to multiply images: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to multiply images: ${error}`);
  });
}

//--------------------------------------
// ADD

/**
 * Blend the images equally. All overlapping pixel colors are added together. 
 * @param {string} src1 Source 1
 * @param {string} src2 Source 2
 * @param {string} outputPath The path where the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
function Add(src1, src2, outputPath) {
  let error = VALIDATE.IsStringInput(src1);
  if (error)
    return Promise.reject(`Failed to add images: source 1 is ${error}`);

  error = VALIDATE.IsStringInput(src2);
  if (error)
    return Promise.reject(`Failed to add images: source 2 is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to add images: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = ['-compose', 'plus', src1, src2, '-composite', outputPath];

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to add images: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to add images: ${error}`);
  });
}

//--------------------------------------
// SUBTRACT

/**
 * Subtract one image from the other: src1 - src2. Overlapping pixel colors are subtracted.
 * @param {string} src1 Source 1 (minuend)
 * @param {string} src2 Source 2 (subtrahend)
 * @param {string} outputPath The path where the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
function Subtract(src1, src2, outputPath) {
  let error = VALIDATE.IsStringInput(src1);
  if (error)
    return Promise.reject(`Failed to subtract images: source 1 is ${error}`);

  error = VALIDATE.IsStringInput(src2);
  if (error)
    return Promise.reject(`Failed to subtract images: source 2 is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to subtract images: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = ['-compose', 'minus', src1, src2, '-composite', outputPath];

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to subtract images: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to subtract images: ${error}`);
  });
}

//--------------------------------------
// SET THEORY

/**
 * Get the union of pixels. If images are colored, intersecting pixel colors are added. (Best used with black and white images/masks)
 * @param {string} src1 Source 1
 * @param {string} src2 Source 2
 * @param {string} outputPath The path where the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
function Union(src1, src2, outputPath) {
  let error = VALIDATE.IsStringInput(src1);
  if (error)
    return Promise.reject(`Failed to get the union of images: source 1 is ${error}`);

  error = VALIDATE.IsStringInput(src2);
  if (error)
    return Promise.reject(`Failed to get the union of images: source 2 is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to get the union of images: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [src1, src2, '-compose', 'Lighten', '-composite', outputPath];

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to get the union of images: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to get the union of images: ${error}`);
  });
}

/**
 * Get the intersection of pixels. If images are colored, the intersecting pixels are blacked out. (Best used with black and white images/masks)
 * @param {string} src1 Source 1
 * @param {string} src2 Source 2
 * @param {string} outputPath The path where the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
function Intersection(src1, src2, outputPath) {
  let error = VALIDATE.IsStringInput(src1);
  if (error)
    return Promise.reject(`Failed to get the intersection of images: source 1 is ${error}`);

  error = VALIDATE.IsStringInput(src2);
  if (error)
    return Promise.reject(`Failed to get the intersection of images: source 2 is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to get the intersection of images: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [src1, src2, '-compose', 'Darken', '-composite', outputPath];

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to get the intersection of images: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to get the intersection of images: ${error}`);
  });
}

/**
 * Get the difference (XOR) of pixels. If images are colored, it produces same result as the Union operator. (Best used with black and white images/masks)
 * @param {string} src1 Source 1
 * @param {string} src2 Source 2
 * @param {string} outputPath The path where the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
function Difference(src1, src2, outputPath) {
  let error = VALIDATE.IsStringInput(src1);
  if (error)
    return Promise.reject(`Failed to get the difference of images: source 1 is ${error}`);

  error = VALIDATE.IsStringInput(src2);
  if (error)
    return Promise.reject(`Failed to get the difference of images: source 2 is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to get the difference of images: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [src1, src2, '-compose', 'Difference', '-composite', outputPath];

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to get the difference of images: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to get the difference of images: ${error}`);
  });
}

/**
 * Get the exclusion (relative complement) of pixels. Results in A-B => Everything in A that is NOT in B. If the images are colored, the result is src2 overlapping src1. (Best used with black and white images/masks)
 * @param {string} src1 Source 1
 * @param {string} src2 Source 2
 * @param {string} outputPath The path where the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
function Exclusion(src1, src2, outputPath) {
  let error = VALIDATE.IsStringInput(src1);
  if (error)
    return Promise.reject(`Failed to get the exclusion of images: source 1 is ${error}`);

  error = VALIDATE.IsStringInput(src2);
  if (error)
    return Promise.reject(`Failed to get the exclusion of images: source 2 is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to get the exclusion of images: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [src1, src2, '-compose', 'Minus_Src', '-composite', outputPath];

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to get the exclusion of images: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to get the exclusion of images: ${error}`);
  });
}

//--------------------------------------
// MASKS

/**
 * Make specific pixels fully transparent. That is, the pixels in src2 that match those in src1 will become transparent.
 * @param {string} src1 Source 1
 * @param {string} src2 Source 2
 * @param {number} fuzz (Optional) Value between 1 and 100 that helps group similar colors together. (Small values help with slight color variations)
 * @param {string} outputPath The path where the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
function ChangeMask(src1, src2, fuzz, outputPath) {
  let error = VALIDATE.IsStringInput(src1);
  if (error)
    return Promise.reject(`Failed to change mask: source 1 is ${error}`);

  error = VALIDATE.IsStringInput(src2);
  if (error)
    return Promise.reject(`Failed to change mask: source 2 is ${error}`);

  if (fuzz) {
    error = VALIDATE.IsNumber(fuzz);
    if (error)
      return Promise.reject(`Failed to change mask: fuzz is ${error}`);

    error = VALIDATE.IsNumberInRange(fuzz, 1, 100);
    if (error)
      return Promise.reject(`Failed to change mask: fuzz is ${error}`);
  }

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to change mask: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [src1, src2];

    if (fuzz)
      args.push('-fuzz', `${fuzz}%`);
    args.push('-compose', 'ChangeMask', '-composite', outputPath);

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to change mask: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to change mask: ${error}`);
  });
}

/**
 * Get an image showing the similarities between two images.
 * @param {string} src1 Source 1
 * @param {string} src2 Source 2
 * @param {number} fuzz (Optional) Value between 1 and 100 that helps group similar colors together. (Small values help with slight color variations)
 * @param {string} outputPath The path where the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
function UnchangedPixels(src1, src2, fuzz, outputPath) {
  let error = VALIDATE.IsStringInput(src1);
  if (error)
    return Promise.reject(`Failed to get unchanged pixels: source 1 is ${error}`);

  error = VALIDATE.IsStringInput(src2);
  if (error)
    return Promise.reject(`Failed to get unchanged pixels: source 2 is ${error}`);

  if (fuzz) {
    error = VALIDATE.IsNumber(fuzz);
    if (error)
      return Promise.reject(`Failed to get unchanged pixels: fuzz is ${error}`);

    error = VALIDATE.IsNumberInRange(fuzz, 1, 100);
    if (error)
      return Promise.reject(`Failed to get unchanged pixels: fuzz is ${error}`);
  }

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to get unchanged pixels: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [src1, src2];

    if (fuzz)
      args.push('-fuzz', `${fuzz}%`);
    args.push('-compose', 'ChangeMask', '-composite', '-channel', 'A', '-negate', outputPath);

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to get unchanged pixels: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to get unchanged pixels: ${error}`);
  });
}

//---------------------------------------
// EXPORTS

exports.Add = Add;
exports.ChangeMask = ChangeMask;
exports.Composite = Composite;
exports.Difference = Difference;
exports.Exclusion = Exclusion;
exports.Gif = Gif;
exports.Intersection = Intersection;
exports.MultiplyMakeBlackTransparent = MultiplyMakeBlackTransparent;
exports.MultiplyMakeWhiteTransparent = MultiplyMakeWhiteTransparent;
exports.Subtract = Subtract;
exports.Union = Union;
exports.UnchangedPixels = UnchangedPixels;