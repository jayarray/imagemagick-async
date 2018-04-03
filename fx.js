let VALIDATE = require('./validate.js');
let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;

//---------------------------------
// SWIRL

/**
 * Apply swirl effect to an image.
 * @param {string} src Source
 * @param {number} degrees Number of degrees to swirl. Positive values mean clockwise swirl. Negative values mean counter-clockwise swirl.
 * @param {string} outputPath The path where the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
function Swirl(src, degrees, outputPath) {
  let error = VALIDATE.IsStringInput(src);
  if (error)
    return Promise.reject(`Failed to apply swirl fx: source is ${error}`);

  error = VALIDATE.IsInteger(degrees);
  if (error)
    return Promise.reject(`Failed to apply swirl fx: degrees is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to apply swirl fx: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [src, '-swirl', degrees, outputPath];

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to apply swirl fx: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to apply swirl fx: ${error}`);
  });
}

//---------------------------------
// IMPLODE

/**
 * Apply implode effect to an image.
 * @param {string} src Source
 * @param {number} factor Value between 0 (non-inclusive) and 1 (non-inclusive) that affects how much implosion is effect is applied. Values larger than or equal to 1 result in all pixels being "sucked into oblivion".
 * @param {string} outputPath The path where the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
function Implode(src, factor, outputPath) // implosion: 0 < factor < 1,  explosion:  0 > factor > -1
{
  let error = VALIDATE.IsStringInput(src);
  if (error)
    return Promise.reject(`Failed to apply implode fx: source is ${error}`);

  error = VALIDATE.IsNumber(factor);
  if (error)
    return Promise.reject(`Failed to apply implode fx: factor is ${error}`);

  error = VALIDATE.IsNumberInRange(factor, 0, null);
  if (error)
    return Promise.reject(`Failed to apply implode fx: factor is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to apply implode fx: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [src, '-implode', factor, outputPath];

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to apply implode fx: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to apply implode fx: ${error}`);
  });
}

//---------------------------------
// WAVE

/**
 * Apply wave effect to an image. Uses formula F(x) = A * sin(Bx), where A is the amplitude and B is the frequency.
 * @param {string} src Source
 * @param {number} amplitude Total height of the wave in pixels.
 * @param {number} frequency The number of pixels in one cycle. Values greater than 1 result in tighter waves. Values less than 1 result in wider waves.
 * @param {string} outputPath The path where the resulting image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
function Wave(src, amplitude, frequency, dest) {
  let error = VALIDATE.IsStringInput(src);
  if (error)
    return Promise.reject(`Failed to apply implode fx: source is ${error}`);

  error = VALIDATE.IsNumber(factor);
  if (error)
    return Promise.reject(`Failed to apply implode fx: factor is ${error}`);

  error = VALIDATE.IsNumberInRange(factor, 0, null);
  if (error)
    return Promise.reject(`Failed to apply implode fx: factor is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to apply implode fx: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [src, '-background', 'transparent', '-wave', `${amplitude}x${frequency}`, outputPath];

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to apply implode fx: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to apply implode fx: ${error}`);
  });
}

//---------------------------------
// EXPORTS

exports.Swirl = Swirl;
exports.Implode = Implode;
exports.Wave = Wave;