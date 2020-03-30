let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let ModBaseClass = require(Path.join(Filepath.ModDir(), 'modbaseclass.js')).ModBaseClass;

//------------------------------

class CompareBaseClass extends ModBaseClass {
  constructor(properties) {
    super({
      name: properties.name,
      args: properties.args,
      command: properties.command
    });

    this.order = ['args'];
  }

  /**
   * @override
   */
  IsConsolidatable() {
    return false;
  }
}

//-------------------------------
// EXPORTS

exports.CompareBaseClass = CompareBaseClass;