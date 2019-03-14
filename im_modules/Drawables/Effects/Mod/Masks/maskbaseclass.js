let Path = require('path');
let RootDir = Path.resolve('.');
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let ModBaseClass = require(Path.join(Filepath.ModDir(), 'modbaseclass.js')).ModBaseClass;

//------------------------------

class MaskBaseClass extends ModBaseClass {
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
    return true;
  }
}

//--------------------------------
// EXPORTS

exports.MaskBaseClass = MaskBaseClass;