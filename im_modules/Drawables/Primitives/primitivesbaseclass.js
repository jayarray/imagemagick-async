let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

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