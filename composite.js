let VALIDATE = require('./validate.js');
let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;

//------------------------------------------

/**
 * Render a composite image made up of the provided lists of filepaths. NOTE: Images are layered from bottom to top.
 * @param {Array<string>} filepaths A list of image filepaths.
 * @param {string} gravity Gravity
 * @param {string} outputPath The path where the image will be rendered to.
 */
function Draw(filepaths, gravity, outputPath) {
  let error = VALIDATE.IsArray(filepaths);
  if (error)
    return Promise.reject(`Failed to draw composite image: filepaths are ${error}`);

  error = VALIDATE.IsStringInput(gravity);
  if (error)
    return Promise.reject(`Failed to draw composite image: gravity is ${error}`);

  error = VALIDATE.IsStringInput(outputPath);
  if (error)
    return Promise.reject(`Failed to draw composite image: output path is ${error}`);

  return new Promise((resolve, reject) => {
    let args
  });

  let cmd = ' convert -gravity ' + gravity + ' ' + filepaths[0] + ' ' + filepaths[1];
  if (filepaths.length > 2) {
    for (let i = 2; i < filepaths.length; ++i) {
      cmd += ' -composite ' + filepaths[i];
    }
  }
  cmd += ' -composite ' + dest;
  return execute(cmd);
}

//---------------------------------------
// EXPORTS

exports.Draw = Draw;