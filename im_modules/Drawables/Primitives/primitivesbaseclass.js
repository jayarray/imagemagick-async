let Path = require('path');
let Filepath = require('./filepath.js').Filepath;
let DrawableBaseClass = require(Path.join(Filepath.DrawablesDir(), 'drawablebaseclass.js')).DrawableBaseClass;

//----------------------------------

class PrimitivesBaseClass extends DrawableBaseClass {
  constructor(properties) {
    super({
      type: 'Primitive',
      name: properties.name,
      args: properties.args,
      properties: properties.offset
    });
  }

  /**
   * @override
   */
  static IsLayer() {
    return false;
  }

  /**
   * @override
   */
  static IsConsolidatable() {
    return true;
  }
}

//---------------------------
// EXPORTS

exports.PrimitivesBaseClass = PrimitivesBaseClass;