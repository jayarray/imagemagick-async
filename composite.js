let VALIDATE = require('./validate.js');
let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;

//------------------------------------------
// CONSTANTS

const MIN_FILEPATHS = 2;

//-------------------------------------------
// DRAW

/**
 * Render a composite image made up of the provided lists of filepaths. NOTE: Images are layered from bottom to top.
 * @param {Array<string>} filepaths A list of image filepaths.
 * @param {string} gravity (Optional) Gravity
 * @param {string} outputPath The path where the image will be rendered to.
 * @returns {Promise} Returns a promise that resolves if successful. Otherwise, it returns an error.
 */
function Draw(filepaths, gravity, outputPath) {
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
    args.push(outputPath);

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

//---------------------------------------
// EXPORTS

exports.Draw = Draw;