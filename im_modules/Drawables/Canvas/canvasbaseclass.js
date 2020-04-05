let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let DrawableBaseClass = require(Path.join(Filepath.DrawablesDir(), 'drawablebaseclass.js')).DrawableBaseClass;

let LinuxCommands = require('linux-commands-async');
let LocalCommand = LinuxCommands.Command.LOCAL;

//---------------------------------

class CanvasBaseClass extends DrawableBaseClass {
  constructor(properties) {
    super({
      type: 'Canvas',
      name: properties.name,
      args: properties.args,
      offset: properties.offset
    });

    this.command = 'convert';
    this.order = ['args'];
  }

  /**
   * @override
   */
  IsLayer() {
    return true;
  }

  /**
   * @override
   */
  IsConsolidatable() {
    return false;
  }

  /**
   * @param {string} dest The output path for the render.
   * @returns {Promise<string>} Returns a Promise with the output path for the newly rendered image.
   */
  Render(dest) {
    return new Promise((resolve, reject) => {
      let cmd = this.command;
      let args = this.Args().concat(dest);

      LocalCommand.Execute(cmd, args).then(output => {
        if (output.stderr) {
          reject(output.stderr);
          return;
        }

        resolve(dest);
      }).catch(error => reject(`Failed to render '${this.name}' effect: ${error}`));
    });
  }
}

//------------------------------
// EXPORTS

exports.CanvasBaseClass = CanvasBaseClass;