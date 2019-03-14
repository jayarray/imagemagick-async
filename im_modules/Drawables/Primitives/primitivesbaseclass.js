let Path = require('path');
let RootDir = Path.resolve('.');
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let DrawableBaseClass = require(Path.join(Filepath.DrawablesDir(), 'drawablebaseclass.js')).DrawableBaseClass;

//----------------------------------

class PrimitivesBaseClass extends DrawableBaseClass {
  constructor(properties) {
    super({
      type: 'Primitive',
      name: properties.name,
      args: properties.args
    });
  }

  /**
   * @override
   */
  IsLayer() {
    return false;
  }

  /**
   * @override
   */
  IsConsolidatable() {
    return true;
  }
}

//---------------------------
// EXPORTS

exports.PrimitivesBaseClass = PrimitivesBaseClass;