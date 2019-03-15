let Path = require('path');
let RootDir = Path.resolve('.');
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let SpecialBaseClass = require(Path.join(Filepath.SpecialDir(), 'specialbaseclass.js')).SpecialBaseClass;

//----------------------------------

class ChainBaseClass extends SpecialBaseClass {
  constructor(properties) {
    super({
      name: properties.name,
      args: properties.args,
      subtype: 'chain'
    });
  }
}

//------------------------------
// EXPORTS

exports.ChainBaseClass = ChainBaseClass;