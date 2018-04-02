let VALIDATE = require('./validate.js');
let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;

//------------------------------------

/**
 * Render an image that highlights the differences between two images. (Compares src2 to src1)
 * @param {string} src1 Source 1
 * @param {string} src2 Source 2
 * @param {string} highlightColor Highlight color. This color will represent the differences between the two images.
 * @param {string} lowlightColor (Optional) Lowlight color. This color serves as a background for the highlight color. Omitting it results in the image from src1 being displayed in the background.
 * @param {string} outputPath The path where the resulting image will be rendered.
 * @returns {Promise} Returns a promise that resolves if successful. Otherwise, it returns an error.
 */
function Compare(src1, src2, highlightColor, lowlightColor, outputPath) {
  let error = VALIDATE.IsStringInput(src1);
  if (error)
    return Promise.reject(`Failed to compare images: source 1 is ${error}`);

  error = VALIDATE.IsStringInput(src2);
  if (error)
    return Promise.reject(`Failed to compare images: source 2 is ${error}`);

  error = VALIDATE.IsStringInput(highlightColor);
  if (error)
    return Promise.reject(`Failed to compare images: highlight color is ${error}`);

  error = VALIDATE.IsStringInput(lowlightColor);
  if (lowlightColor != null && error)
    return Promise.reject(`Failed to compare images: lowlight color is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to compare images: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [
      '-metric', 'AE',
      '-fuzz', '5%',
      src1, src2,
      '-highlight-color', highlightColor,
      '-lowlight-color', lowlightColor,
      outputPath
    ];

    LOCAL_COMMAND.Execute('compare', args).then(output => {
      if (output.stderr) {
        reject(`Failed to compare images: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to compare images: ${error}`);
  });
}


/**
 * Render an image that shows the differences between two images by utilizing brightness to correlate how major the changes are. The brighter the color, the more major the difference is. (Compares src2 to src1)
 * @param {string} src1 Source 1
 * @param {string} src2 Source 2
 * @param {string} outputPath The path where the resulting image will be rendered.
 * @returns {Promise} Returns a promise that resolves if successful. Otherwise, it returns an error.
 */
function Difference(src1, src2, outputPath) {
  let error = VALIDATE.IsStringInput(src1);
  if (error)
    return Promise.reject(`Failed to compare image: source 1 is ${error}`);

  error = VALIDATE.IsStringInput(src2);
  if (error)
    return Promise.reject(`Failed to compare images: source 2 is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to compare images: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [
      src1, src2,
      '-compose', 'difference',
      outputPath
    ];

    LOCAL_COMMAND.Execute('composite', args).then(output => {
      if (output.stderr) {
        reject(`Failed to compare images: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to compare images: ${error}`);
  });
}


/**
 * Render an image whose colors are normalized (brightened). Makes really dark compare/difference images easier to analyze.
 * @param {string} src Source
 * @param {string} outputPath The path where the resulting image will be rendered.
 * @returns {Promise} Returns a promise that resolves if successful. Otherwise, it returns an error.
 */
function AutoLevel(src, outputPath) {
  let error = VALIDATE.IsStringInput(src);
  if (error)
    return Promise.reject(`Failed to normalize image: source is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to normalize image: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args = [src, '-auto-level', outputPath];

    LOCAL_COMMAND.Execute('convert', args).then(output => {
      if (output.stderr) {
        reject(`Failed to compare images: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to compare images: ${error}`);
  });
}

//----------------------------------
// EXPORTS

exports.Compare = Compare;
exports.Difference = Difference;