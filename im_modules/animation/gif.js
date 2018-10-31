let PATH = require('path');
let rootDir = PATH.dirname(require.main.filename);
let VALIDATE = require(PATH.join(rootDir, 'im_modules', 'validation', 'validate.js'));
let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;

//--------------------------------------
// CONSTANTS

const MIN_FILEPATHS = 2;

//--------------------------------------
// GIF

/**
 * Create a GIF from the provided filepath list (in ther order provided) and other properties.
 * @param {Array<string>} filepaths List of filepaths
 * @param {number} loop (Optional) The number of times the GIF animation is to cycle before stopping. The default value is 0 (infinite loop). Valid loop values are from 0 to infinity.
 * @param {number} delay The delay time measured in 1/100th of a seconds at a time.
 * @param {string} dispose (Optional) Determines what the following images should do with the previous results of the GIF animation. Default is 'Undefined'.
 * @param {string} outputPath The path where the GIF will be rendered.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
function Gif(filepaths, loop, delay, dispose, outputPath) {
  let minLoopValue = 0;

  let error = VALIDATE.IsArray(filepaths);
  if (error)
    return Promise.reject(`Failed to create GIF: filepaths are ${error}`);

  if (filepaths.length < MIN_FILEPATHS)
    return Promise.reject(`Failed to draw composite image: ${MIN_FILEPATHS} or more filepaths are required`);

  if (loop) {
    error = VALIDATE.IsInteger(loop);
    if (loop != null && error)
      return Promise.reject(`Failed to create GIF: loop is ${error}`);
  }

  error = VALIDATE.IsIntegerInRange(loop, minLoopValue, null);
  if (error)
    return Promise.reject(`Failed to create GIF: loop is ${error}`);

  error = VALIDATE.IsInteger(delay);
  if (error)
    return Promise.reject(`Failed to create GIF: delay is ${error}`);

  if (dispose) {
    error = VALIDATE.IsStringInput(dispose);
    if (error)
      return Promise.reject(`Failed to create GIF: dispose is ${error}`);
  }

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
        reject(`Failed to create GIF: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to create GIF: ${error}`);
  });
}

//---------------------------------
// EXPORTS

exports.CreateGif = Gif;

exports.Func = Gif;
exports.Name = 'CreateGif';
exports.ComponentType = 'function';