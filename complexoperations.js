let IDENTIFY = require('./identify.js');
let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;
let PRIMITIVES = require('./primitives.js');

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

//------------------------------------
// REFLECT

/**
 * Reflect image over a line.
 * @param {string} src 
 * @param {number} degrees 
 * @param {string} outputPath 
 * @returns {Promise<{xOffset: number, yOffset: number}>}
 */
function ReflectImage(src, x0, y0, x1, y1, consolidatedEffects, outputPath) {
  return new Promise((resolve, reject) => {
    IDENTIFY.ImageInfo(src).then(obj => {
      // Get pixel info
      obj.PixelRangeInfo(0, obj.info_.width, 0, obj.info_.height).then(pixels => {
        // Get all non-transparent pixel infos
        let pixelObjs = pixels.filter(p => !p.isTransparent).map(p => new PRIMITIVES.CreatePoint(p.x, p.y, p.color));

        // Compute line slope
        let dy = y1 - y0;
        let dx = x1 - x0;
        let m = dy / dx;

        // Change pixel coordinates to reflected coordinates
        for (let i = 0; i < pixelObjs.length; ++i) {
          let currPixel = pixelObjs[i];

          // Compute new coordinates (Matrix algebra)
          let topLeft = 1 - Math.pow(m, 2);
          let topRight = (2 * m) / (Math.pow(m, 2) + 1);
          let slopeMatrix = [[topLeft, topRight], [topRight, -topLeft]];
          let pointMatrix = [currPixel.x_, currPixel.y_];

          let reflectedX = (slopeMatrix[0][0] * pointMatrix[0]) + (slopeMatrix[0][1] * pointMatrix[1]);
          let reflectedY = (slopeMatrix[1][0] * pointMatrix[0]) + (slopeMatrix[1][1] * pointMatrix[1]);

          // Update pixel coordinates
          currPixel.x_ = reflectedX;
          currPixel.y_ = reflectedY;
        }

        // Build command
        let args = [src];
        pixelObjs.forEach(p => args = args.concat(p.Args()));
        consolidatedEffects.forEach(c => args = args.concat(c.Args()));
        args.push(outputPath);

        // Render
        LOCAL_COMMAND.Execute('convert', args).then(output => {
          if (output.stderr) {
            reject(output.stderr);
            return;
          }

          resolve();
        }).catch(error => reject(error));
      }).catch(error => reject(error));
    }).catch(error => reject(error));
  });
}

//-----------------------------------
// EXPORTS

exports.RotateImage = RotateImage;
exports.ReflectImage = ReflectImage;