let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let ModBaseClass = require(Path.join(Filepath.ModDir(), 'modbaseclass.js')).ModBaseClass;

let LinuxCommands = require('linux-commands-async');
let LocalCommand = LinuxCommands.Command.LOCAL;

//------------------------------

class ComposeBaseClass extends ModBaseClass {
  constructor(properties) {
    super({
      name: properties.name,
      args: properties.args,
      command: 'convert'
    });

    this.order = ['args'];
    this.requiresDestToRender = true;
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

//--------------------------------
// EXPORTS

exports.ComposeBaseClass = ComposeBaseClass;
