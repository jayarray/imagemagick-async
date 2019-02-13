let Path = require('path');
let Filepath = require('./filepath.js').Filepath;
let DrawableBaseClass = require(Path.join(Filepath.DrawablesDir(), 'drawablebaseclass.js')).DrawableBaseClass;

//----------------------------------

class PrimitivesBaseClass extends DrawableBaseClass {
  constructor(properties) {
    super({
      type: 'Primitive',
      name: properties.name,
      args: properties.args
    });

    this.offset = { x: 0, y: 0 };

    if (properties.offset)
      this.offset = properties.offset;
  }

  /**
   * @returns {Array} Returns a list of arguments needed for rendering.
   */
  Args() {
    // Override
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