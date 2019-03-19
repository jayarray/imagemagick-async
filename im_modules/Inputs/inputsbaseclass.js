let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

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