let Path = require('path');
let RootDir = Path.resolve('.');
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let DrawableBaseClass = require(Path.join(Filepath.DrawablesDir(), 'drawablebaseclass.js')).DrawableBaseClass;

//---------------------------------

class CanvasBaseClass extends DrawableBaseClass {
  constructor(properties) {
    super({
      type: 'Canvas',
      name: properties.name,
      args: properties.args,
      offset: properties.offset
    });

    this.command = 'convert';
  }

  /**
   * @override
   */
  IsLayer() {
    return true;
  }

  /**
   * @override
   */
  IsConsolidatable() {
    return false;
  }
}

//------------------------------
// EXPORTS

exports.CanvasBaseClass = CanvasBaseClass;