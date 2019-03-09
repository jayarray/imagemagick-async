let Path = require('path');
let RootDir = Path.resolve('.');
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let EffectBaseClass = require(Path.join(Filepath.EffectsDir(), 'effectbaseclass.js')).EffectBaseClass;

//-----------------------------

class ModBaseClass extends EffectBaseClass {
  constructor(properties) {
    super({
      name: properties.name,
      args: properties.args,
      subtype: 'mod'
    });

    this.command = properties.command;
  }
}

//--------------------------------
// EXPORTS

exports.ModBaseClass = ModBaseClass;