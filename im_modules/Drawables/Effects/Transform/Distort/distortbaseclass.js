let Path = require('path');
let RootDir = Path.resolve('.');
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let TransformBaseClass = require(Path.join(Filepath.TransformDir(), 'transformbaseclass.js')).TransformBaseClass;

//-----------------------------

class DistortBaseClass extends TransformBaseClass {
  constructor(properties) {
    super({
      name: properties.name,
      args: properties.args,
      offset: properties.offset,
    });
  }

  /**
   * @override
   */
  static IsConsolidatable() {
    return false;
  }
}

//--------------------------------
// EXPORTS

exports.DistortBaseClass = DistortBaseClass;