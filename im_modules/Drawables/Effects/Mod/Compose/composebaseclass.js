let Path = require('path');
let ProjectDir = Path.resolve('.');

let PathParts = ProjectDir.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let ModBaseClass = require(Path.join(Filepath.ModDir(), 'modbaseclass.js')).ModBaseClass;

//------------------------------

class ComposeBaseClass extends ModBaseClass {
  constructor(properties) {
    super({
      name: properties.name,
      args: properties.args,
      command: 'convert'
    });
  }

  /**
   * @override
   */
  IsConsolidatable() {
    return false;
  }
}

//--------------------------------
// EXPORTS

exports.ComposeBaseClass = ComposeBaseClass;
