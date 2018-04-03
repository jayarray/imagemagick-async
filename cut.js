

let VALIDATE = require('./validate.js');
let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;


//--------------------------------------
// OUT

/**
 * Cut an image out from the other. (It's like removing dough with a cookie cutter.)
 * @param {string} baseImagePath The path for the image you want to cut out of.
 * @param {string} cutoutImagePath The path for the image you want to use as a mask.
 * @param {string} outputPath The path where the resulting image will render to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
function Out(baseImagePath, cutoutImagePath, outputPath) {
  let error = VALIDATE.IsStringInput(baseImagePath);
  if (error)
    return Promise.reject(`Failed to cut out image: base image path is ${error}`);

  error = VALIDATE.IsStringInput(cutoutImagePath);
  if (error)
    return Promise.reject(`Failed to cut out image: cutout image path is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to cut out image: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [
      baseImagePath, cutoutImagePath,
      '-compose', 'Dst_Out',
      '-composite', outputPath
    ];

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to cut out image: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to cut out image: ${error}`);
  });
}

//--------------------------------------
// IN

/**
 * Cut into an image. (It's like removing all the dough around the cookie cutter.)
 * @param {string} baseImagePath The path for the image you want to cut out of.
 * @param {string} cutoutImagePath The path for the image you want to use as a mask.
 * @param {string} outputPath The path where the resulting image will render to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
function In(baseImagePath, cutoutImagePath, outputPath) {
  let error = VALIDATE.IsStringInput(baseImagePath);
  if (error)
    return Promise.reject(`Failed to cut into image: base image path is ${error}`);

  error = VALIDATE.IsStringInput(cutoutImagePath);
  if (error)
    return Promise.reject(`Failed to cut into image: cutout image path is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to cut into image: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [
      baseImagePath, cutoutImagePath,
      '-compose', 'Dst_In',
      '-composite', outputPath
    ];

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to cut into image: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to cut into image: ${error}`);
  });
}

//-------------------------------------
// XOR

/**
 * Cut one image out from the other.
 * @param {string} baseImagePath The path for the image you want to cut out of.
 * @param {string} cutoutImagePath The path for the image you want to use as a mask.
 * @param {string} outputPath The path where the resulting image will render to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
function Xor(baseImagePath, cutoutImagePath, outputPath) {
  let error = VALIDATE.IsStringInput(baseImagePath);
  if (error)
    return Promise.reject(`Failed to cut out image: base image path is ${error}`);

  error = VALIDATE.IsStringInput(cutoutImagePath);
  if (error)
    return Promise.reject(`Failed to cut out image: cutout image path is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to cut out image: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [
      baseImagePath, cutoutImagePath,
      '-compose', 'Xor',
      '-composite', outputPath
    ];

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to cut out image: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to cut out image: ${error}`);
  });
}

//------------------------------------
// EXPORTS

exports.In = In;
exports.Out = Out;
exports.Xor = Xor;