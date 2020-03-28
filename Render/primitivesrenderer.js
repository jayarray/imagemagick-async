let LinuxCommands = require('linux-commands-async');
let LocalCommand = LinuxCommands.Command.LOCAL;

//--------------------------------------------------
// RENDER
//-------------------------------------------------

/**
 * @param {string} imgPath The path to the image you will be drawing to.
 * @param {Array<>} primitives A list of primitives you want to draw on the image.
 * @param {string} dest The output destination path for the rendered image.
 * @returns {Promise<string>} Returns a Promise that resolves if successful and returns the output path of the newly rendered image.
 */
function Render(imgPath, primitives, dest) {
  return new Promise((resolve, reject) => {

    let cmd = 'convert';
    let args = [imgPath];

    primitives.forEach(p => {
      args = args.concat(p.Args());
    });

    args.push(dest);

    LocalCommand.Execute(cmd, args).then(output => {
      if (output.stderr) {
        reject(output.stderr);
        return;
      }

      resolve(dest);
    }).catch(error => reject(`Failed to draw primitives: ${error}`));
  });
}

//------------------------------------
// EXPORTS

exports.Render = Render;