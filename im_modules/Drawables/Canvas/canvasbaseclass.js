let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

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