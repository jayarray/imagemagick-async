let ObjectInterface = require('./objectinterface.js').ObjectInterface;

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