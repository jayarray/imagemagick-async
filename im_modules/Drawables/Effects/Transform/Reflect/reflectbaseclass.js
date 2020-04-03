let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let TransformBaseClass = require(Path.join(Filepath.TransformDir(), 'transformbaseclass.js')).TransformBaseClass;

let LinuxCommands = require('linux-commands-async');
let LocalCommand = LinuxCommands.Command.LOCAL;

//-----------------------------

class ReflectBaseClass extends TransformBaseClass {
  constructor(properties) {
    super({
      name: properties.name,
      args: properties.args
    });

    this.order = ['src', 'args'];
    this.requiresDestToRender = true;
  }

  /**
   * @override
   */
  IsConsolidatable() {
    return true;
  }

  /**
   * @param {string} dest The output path for the render.
   * @returns {Promise<string>} Returns a Promise with the output path for the newly rendered image.
   */
  Render(dest) {
    return new Promise((resolve, reject) => {
      let cmd = this.command;
      let args = [this.args.source].concat(this.Args()).concat(dest);

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

exports.ReflectBaseClass = ReflectBaseClass;