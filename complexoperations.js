let API = require('./api.js');
let GUID = require('./guid.js');
let PATH = require('path');
let LINUX_COMMANDS = require('linux-commands-async');

//--------------------------------

/**
 * Rotate image.
 * @param {string} src 
 * @param {number} degrees 
 * @param {string} outputPath 
 */
function RotateImage(src, degrees, outputPath) {
  return new Promise((resolve, reject) => {
    API.Identify(src).then(obj => {
      // Compute new dimensions for blank canvas
      let width = obj.info_.width;
      let height = obj.info_.height;
      let hypotenuse = Math.ceil(Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)));

      let tempPaths = [];

      // Render blank canvas
      let outputDir = LINUX_COMMANDS.Path.ParentDir(outputPath);
      let format = LINUX_COMMANDS.Path.Extension(outputPath).replace('.', '');
      let tempCanvasPath = PATH.join(outputDir, GUID.Filename(GUID.DEFAULT_LENGTH, format));
      let blankCanvas = API.ColorCanvas(hypotenuse, hypotenuse, 'none');

      blankCanvas.Render(tempCanvasPath).then(success => {
        tempPaths.push(tempCanvasPath);

        // Place image in center of blank canvas
        let tempCompPath = PATH.join(outputDir, GUID.Filename(GUID.DEFAULT_LENGTH, format));
        let gravity = 'Center';
        let composite = API.Composite([tempCanvasPath, src], gravity);

        // Render composite
        composite.Render(tempCompPath).then(success => {
          tempPaths.push(tempCompPath);

          // Rotate pixels
          let rotate = API.RotateAroundCenter(tempCompPath, degrees);

          // Render rotated image
          rotate.Render(outputPath).then(success => {  // ERROR: Happens in RenderTempFile_:: No src path is being provided when using Args().
            // Remove all temp files
            LINUX_COMMANDS.Remove.Files(tempPaths, LINUX_COMMANDS.Command.LOCAL).then(success => {
              resolve();
            }).catch(error => reject(error));
          }).catch(error => reject(error));
        }).catch(error => reject(error));
      }).catch(error => reject(error));
    }).catch(error => reject(error));
  });
}

//-----------------------------------
// EXPORTS

exports.RotateImage = RotateImage;