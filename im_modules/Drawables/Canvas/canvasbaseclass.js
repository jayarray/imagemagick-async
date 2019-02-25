let Path = require('path');
let Filepath = require('./filepath.js').Filepath;
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
    this.primitives = properties.primitives ? properties.primitives : [];
  }

  /**
   * Add a Primitive to this canvas.
   * @param {Primitive} p 
   * @param {number} xOffset 
   * @param {number} yOffset 
   */
  AddPrimitive(p, offset) {
    if (offset) {
      p.offset.x = offset.x;
      p.offset.y = offset.y;
    }

    this.primitives.push(p);
  }

  /**
   * @override
   */
  static IsLayer() {
    return true;
  }

  /**
   * @override
   */
  static IsConsolidatable() {
    return false;
  }
}

//------------------------------
// EXPORTS

exports.CanvasBaseClass = CanvasBaseClass;