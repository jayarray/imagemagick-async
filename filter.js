let VALIDATE = require('./validate.js');
let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;

//----------------------------------
// BLUR

/**
 * Apply blur filter to an image.
 * @param {string} src Source
 * @param {number} radius An integer value that controls how big an area the operator should look at when spreading pixels. Minimum value is 0 or at least double that of sigma.
 * @param {number} sigma A floating point value used as an approximation of how much you want the image to spread/blur in pixels. (Think of it as the size of the brush used to blur the image.) Minimum value is 0.
 * @param {boolean} hasTransparency Assign as true if the image contains transparent pixels. False otherwise.
 * @param {string} outputPath The path where the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
function Blur(src, radius, sigma, hasTransparency, outputPath) {
  let error = VALIDATE.IsStringInput(src);
  if (error)
    return Promise.reject(`Failed to apply blur filter: source is ${error}`);

  error = VALIDATE.IsInteger(radius);
  if (error)
    return Promise.reject(`Failed to apply blur filter: radius is ${error}`);

  error = VALIDATE.IsIntegerInRange(radius, 0, null);
  if (error)
    return Promise.reject(`Failed to apply blur filter: radius is ${error}`);

  error = VALIDATE.IsNumber(sigma);
  if (error)
    return Promise.reject(`Failed to apply blur filter: sigma is ${error}`);

  error = VALIDATE.IsNumberInRange(sigma, 0, null);
  if (error)
    return Promise.reject(`Failed to apply blur filter: sigma is ${error}`);

  let isBoolean = hasTransparency === false || hasTransparency === true;
  if (!isBoolean)
    return Promise.reject(`Failed to apply blur filter: hasTransparency is not a boolean value`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to apply blur filter: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [src];

    if (hasTransparency)
      args.push('-channel', 'RGBA');
    args.push('-blur', `${radius}x${sigma}`, outputPath);

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to apply blur filter: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to apply blur filter: ${error}`);
  });
}

//----------------------------------------------
// PAINT

/**
 * Apply oil painting filter to an image.
 * @param {string} src Source
 * @param {number} paintValue An integer value greater than 0 that determines the intensity of the filter. Higher values will make it look more abstract and more like a painting.
 * @param {string} outputPath The path where the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
function OilPainting(src, paintValue, outputPath) {
  let error = VALIDATE.IsStringInput(src);
  if (error)
    return Promise.reject(`Failed to apply oil painting filter: source is ${error}`);

  error = VALIDATE.IsInteger(paintValue);
  if (error)
    return Promise.reject(`Failed to apply oil painting filter: paint value is ${error}`);

  error = VALIDATE.IsIntegerInRange(paintValue, 1, null);
  if (error)
    return Promise.reject(`Failed to apply oil painting filter: paint value is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to apply oil painting filter: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [src, '-paint', paintValue, outputPath];

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to apply oil painting filter: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to apply oil painting filter: ${error}`);
  });
}

//-------------------------------------
// CHARCOAL SKETCH

/**
 * Apply oil painting filter to an image.
 * @param {string} src Source
 * @param {number} charcoalValue An integer value greater than 0 that determines the intensity of the filter. Higher values will make it look more smudged and more like a charcoal sketch.
 * @param {string} outputPath The path where the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
function CharcoalSketch(src, charcoalValue, outputPath) {
  let error = VALIDATE.IsStringInput(src);
  if (error)
    return Promise.reject(`Failed to apply charcoal sketch filter: source is ${error}`);

  error = VALIDATE.IsInteger(charcoalValue);
  if (error)
    return Promise.reject(`Failed to apply charcoal sketch filter: charcoal value is ${error}`);

  error = VALIDATE.IsIntegerInRange(charcoalValue, 1, null);
  if (error)
    return Promise.reject(`Failed to apply charcoal sketch filter: charcoal value is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to apply charcoal sketch filter: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [src, '-charcoal', charcoalValue, outputPath];

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to apply charcoal sketch filter: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to apply charcoal sketch filter: ${error}`);
  });
}

//-------------------------------------
// COLORING BOOK SKETCH

/**
 * Apply coloring book sketch filter to an image.
 * @param {string} src Source
 * @param {boolean} isHeavilyShaded Assign as true if the image has a lot of shading. False otherwise.
 * @param {string} outputPath The path where the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
function ColoringBookSketch(src, isHeavilyShaded, outputPath) {
  let error = VALIDATE.IsStringInput(src);
  if (error)
    return Promise.reject(`Failed to apply coloring book sketch filter: source is ${error}`);

  let isBoolean = isHeavilyShaded === true || isHeavilyShaded === false;
  if (!isBoolean)
    return Promise.reject(`Failed to apply coloring book sketch filter: isHeavilyshaded is not a boolean`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to apply coloring book sketch filter: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [src];

    if (isHeavilyShaded)
      args.push('-segment', '1x1', '+dither', '-colors', 2);
    args.push('-edge', 1, '-negate', '-normalize', '-colorspace', 'Gray', '-blur', '0x.5', '-contrast-stretch', '0x50%', outputPath);

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to apply coloring book sketch filter: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to apply coloring book sketch filter: ${error}`);
  });
}

//-----------------------------------------
// PENCIL SKETCH

/**
 * Apply pencil sketch filter to an image.
 * @param {string} src Source
 * @param {number} radius An integer value that controls how big an area the operator should look at when spreading pixels. Minimum value is 0 or at least double that of sigma.
 * @param {number} sigma A floating point value used as an approximation of how much you want the image to spread/blur in pixels. (Think of it as the size of the brush used to blur the image.) Minimum value is 0.
 * @param {number} angle Integer value that dteermines the angle of the pencil strokes.
 * @param {string} outputPath The path where the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
function PencilSketch(src, radius, sigma, angle, outputPath) {
  let error = VALIDATE.IsStringInput(src);
  if (error)
    return Promise.reject(`Failed to apply pencil sketch filter: source is ${error}`);

  error = VALIDATE.IsInteger(radius);
  if (error)
    return Promise.reject(`Failed to apply pencil sketch filter: radius is ${error}`);

  error = VALIDATE.IsIntegerInRange(radius, 0, null);
  if (error)
    return Promise.reject(`Failed to apply pencil sketch filter: radius is ${error}`);

  error = VALIDATE.IsNumber(sigma);
  if (error)
    return Promise.reject(`Failed to apply pencil sketch filter: sigma is ${error}`);

  error = VALIDATE.IsNumberInRange(sigma, 0, null);
  if (error)
    return Promise.reject(`Failed to apply pencil sketch filter: sigma is ${error}`);

  error = VALIDATE.IsInteger(angle);
  if (error)
    return Promise.reject(`Failed to apply pencil sketch filter: angle is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to apply pencil sketch filter: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [
      src,
      '-colorspace', 'Gray',
      '-sketch', `${radius}x${sigma}+${angle}`,
      outputPath
    ];

    /*
    if (hasTransparency)
      args.push('-channel', 'RGBA'); */
    args.push('-blur', `${radius}x${sigma}`, outputPath);

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to apply pencil sketch filter: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to apply pencil sketch filter: ${error}`);
  });
}

//-----------------------------------
// EXPORTS

exports.Blur = Blur;
exports.CharcoalSketch = CharcoalSketch;
exports.ColoringBookSketch = ColoringBookSketch;
exports.OilPainting = OilPainting;
exports.PencilSketch = PencilSketch;