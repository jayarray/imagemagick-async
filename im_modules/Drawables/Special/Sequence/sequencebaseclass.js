let Path = require('path');
let RootDir = Path.resolve('.');
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let SpecialBaseClass = require(Path.join(Filepath.SpecialDir(), 'specialbaseclass.js')).SpecialBaseClass;

//----------------------------------

class SequenceBaseClass extends SpecialBaseClass {
  constructor(properties) {
    super({
      name: properties.name,
      args: properties.args,
      subtype: 'sequence'
    });
  }
}

//------------------------------
// EXPORTS

exports.SequenceBaseClass = SequenceBaseClass;