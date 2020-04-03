let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let ObjectInterface = require(Path.join(RootDir, './objectinterface.js')).ObjectInterface;

//--------------------------------------

class AnimationBaseClass extends ObjectInterface {
  constructor(properties) {
    super({ category: 'animation' });
    this.type = properties.type;
    this.name = properties.name;
    this.args = properties.args;
    this.command = properties.command;
    this.order = properties.order;
  }

  /**
   * @returns {Array} Returns a list of arguments needed for rendering.
   */
  Args() {
    // override
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

//--------------------------
// EXPORTS

exports.AnimationBaseClass = AnimationBaseClass;