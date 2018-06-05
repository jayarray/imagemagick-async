let IDENTIFY = require('./identify.js');
let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;

//--------------------------------

/**
 * Rotate image.
 * @param {string} src 
 * @param {number} degrees 
 * @param {string} outputPath 
 * @returns {Promise<{xOffset: number, yOffset: number}>}
 */
function RotateImage(src, degrees, consolidatedEffects, outputPath) {
  return new Promise((resolve, reject) => {
    IDENTIFY.CreateImageInfo(src).then(obj => {
      // Calculate blank canvas dimensions
      let width = obj.info_.width;
      let height = obj.info_.height;
      let hypotenuse = Math.ceil(Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)));

      // Build command
      let args = ['-size', `${hypotenuse}x${this.hypotenuse}`, 'canvas:none', '-gravity', 'Center', '-draw', `image over 0,0 0,0 '${src}'`];
      consolidatedEffects.forEach(c => args.push(c.Args()));
      args = args.push('-distort', 'SRT', degrees, outputPath);

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