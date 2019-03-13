let Path = require('path');
let RootDir = Path.resolve('.');
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let DrawableBaseClass = require(Path.join(Filepath.DrawablesDir(), 'drawablebaseclass.js')).DrawableBaseClass;

//----------------------------------

class EffectBaseClass extends DrawableBaseClass {
  constructor(properties) {
    super({
      type: 'Effect',
      name: properties.name,
      args: properties.args
    });

    this.subtype = properties.subtype;  // Store the type of effect (i.e. fx, mod, transform)
  }

  /**
   * @override
   */
  static IsLayer() {
    return true;
  }
}

//---------------------------
// EXPORTS

exports.EffectBaseClass = EffectBaseClass;