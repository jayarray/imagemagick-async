let PATH = require('path');

let parts = __dirname.split(PATH.sep);
let index = parts.findIndex(x => x == 'im_modules');
let IM_MODULES_DIR = parts.slice(0, index + 1).join(PATH.sep);
let IDENTIFY = require(PATH.join(IM_MODULES_DIR, 'Query', 'identify.js'));
let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;

//--------------------------------
// ROTATE IMAGE

/**
 * Rotate image.
 * @param {string} src 
 * @param {number} degrees 
 * @param {string} outputPath 
 * @returns {Promise<{xOffset: number, yOffset: number}>}
 */
function RotateImage(src, degrees, consolidatedEffects, outputPath) {
  return new Promise((resolve, reject) => {
    IDENTIFY.ImageInfo(src).then(obj => {
      // Calculate blank canvas dimensions
      let width = obj.info_.width;
      let height = obj.info_.height;
      let hypotenuse = Math.ceil(Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)));

      // Build command
      let args = ['-size', `${hypotenuse}x${hypotenuse}`, 'canvas:none', '-gravity', 'Center', '-draw', `image over 0,0 0,0 '${src}'`];
      consolidatedEffects.forEach(c => args = args.concat(c.Args()));
      args = args.concat(['-distort', 'SRT', degrees, outputPath]); // Rotate around center

      // Render image
      LOCAL_COMMAND.Execute('convert', args).then(output => {
        if (output.stderr) {
          reject(output.stderr);
          return;
        }

        resolve({
          xOffset: Math.floor((hypotenuse - width) / 2),
          yOffset: Math.floor((hypotenuse - height) / 2)
        });
      }).catch(error => reject(error));
    }).catch(error => reject(error));
  });
}

//-----------------------------------
// EXPORTS

exports.RotateImage = RotateImage;
exports.ComponentType = 'private';