let LinuxCommands = require('linux-commands-async');
let LocalCommand = LinuxCommands.Command.LOCAL;

//-------------------------------------------------
//  HELPERS
//-------------------------------------------------

/**
 * @param {object} canvas Canvas object
 * @returns {boolean} Returns true if canvas object is an image canvas.
 */
function IsImageCanvas(canvas) {
  let order = canvas.order;

  if (order.length == 1 && order[0] == 'src')
    return true;
  return false;
}

/**
 * @param {string} source 
 * @param {string} dest 
 * @returns {Promise<string>} Returns a Promise that resolves and returns the output path of the newly created file.
 */
function MakeCopy(source, dest) {
  return new Promise((resolve, reject) => {
    LinuxCommands.Copy.File(source, dest, LocalCommand).then(success => {
      resolve(dest);
    }).catch(error => reject(error));
  });
}

//-------------------------------------
// RENDER
//-------------------------------------

/**
 * @param {object} canvas Canvas object.
 * @param {string} dest The output destination path for the rendered image.
 * @returns {Promise<string>} Returns a Promise that resolves if successful and returns the output path of the newly rendered image.
 */
function Render(canvas, dest) {
  return new Promise((resolve, reject) => {
    let canvasArgs = canvas.Args();

    if (IsImageCanvas(canvas)) {
      let source = canvasArgs[0];

      MakeCopy(source, dest).then(outputPath => {
        resolve(outputPath);
      }).catch(error => reject(error));
    }
    else {
      let cmd = canvas.command;
      let args = canvas.Args().concat(dest);

      LocalCommand.Execute(cmd, args).then(output => {
        if (output.stderr) {
          if (isNaN(output.stderr)) {
            reject(output.stderr);
            return;
          }
        }

        resolve(dest);
      }).catch(error => reject(`Failed to render canvas '${canvas.name}': ${error}`));
    }
  });
}

//------------------------------------
// EXPORTS

exports.Render = Render;