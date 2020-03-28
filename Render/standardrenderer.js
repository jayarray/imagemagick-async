let LinuxCommands = require('linux-commands-async');
let LocalCommand = LinuxCommands.Command.LOCAL;

//-------------------------------------------------
//  HELPERS
//-------------------------------------------------

/**
 * @param {string} imgPath The path to the image you will be drawing to.
 * @param {object} effect The effect you want to apply to the image.
 * @param {string} dest The output destination path for the rendered image.
 * @returns {Promise<string>} Returns a Promise that resolves if successful and returns the output path of the newly rendered image.
 */
function ApplySingleEffect(imgPath, effect, dest) {
  return new Promise((resolve, reject) => {
    let cmd = effect.command;
    let args = [];

    // Check how args are ordered and add them to the list
    effect.order.forEach(str => {
      if (str == 'src')
        args.push(imgPath);
      else if (str == 'args')
        args = args.concat(effect.Args());
    });

    // Add output path
    args.push(dest);

    // Execute Image Magick commands
    LocalCommand.Execute(cmd, args).then(output => {
      if (output.stderr) {
        if (isNaN(output.stderr)) {
          reject(output.stderr);
          return;
        }
      }

      resolve(dest);
    }).catch(error => reject(`Failed to apply effect '${effect.name}': ${error}`));
  });
}


/**
 * @param {string} imgPath The path to the image you will be drawing to.
 * @param {Array<>} effects A list of effects you want to apply to the image.
 * @param {string} dest The output destination path for the rendered image.
 * @returns {Promise<string>} Returns a Promise that resolves if successful and returns the output path of the newly rendered image.
 */
function ApplyMultipleEffects(imgPath, effects, dest) {
  return new Promise((resolve, reject) => {

    let applyEffectsInSequence = (source, fxArr, outputPath) => {
      return new Promise((resolve, reject) => {
        if (!fxArr || fxArr.length == 0) {
          resolve(dest);
          return;
        }

        let currEffect = fxArr[0];
        let nextEffects = fxArr.slice(1);

        ApplySingleEffect(source, currEffect, outputPath).then(newOutputPath => {
          resolve(applyEffectsInSequence(newOutputPath, nextEffects, newOutputPath));
        }).catch(error => reject(error));
      });
    };

    applyEffectsInSequence(imgPath, effects, dest).then(outputPath => {
      resolve(outputPath);
    }).catch(error => reject(error));
  });
}

//----------------------------------------
//  RENDER
//----------------------------------------

/**
 * @param {string} imgPath The path to the image you will be drawing to.
 * @param {object} effect The effect you want to apply to the image.
 * @param {string} dest The output destination path for the rendered image.
 * @returns {Promise<string>} Returns a Promise that resolves if successful and returns the output path of the newly rendered image.
 */
function Render(imgPath, effect, dest) {
  return new Promise((resolve, reject) => {

    ApplySingleEffect(imgPath, effect, dest).then(outputPath => {
      resolve(outputPath);
    }).catch(error => reject(error));
  });
}

//------------------------------------
// EXPORTS

exports.Render = Render;