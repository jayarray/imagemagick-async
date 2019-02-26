let Path = require('path');
let RootDir = Path.resolve('.');
let ObjectInterface = require(Path.join(RootDir, 'objectinterface.js')).ObjectInterface;

//--------------------------------------

class InputsBaseClass extends ObjectInterface {
  constructor(properties) {
    super({ category: 'input' });
    this.type = properties.type;
    this.name = properties.name;
    this.args = properties.args;
  }
}

//--------------------------
// EXPORTS

exports.InputsBaseClass = InputsBaseClass;