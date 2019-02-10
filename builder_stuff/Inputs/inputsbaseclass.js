class InputsBaseClass {
  constructor(properties) {
    this.category = 'inputs';
    this.type = properties.type;  // all lowercase, no spaces
    this.name = properties.name;  // Capitalize first letter -OR- camel case if multiple words
    this.args = properties.args;
  }

  /**
   * @override
   */
  Errors() {
    // override
  }
}

//--------------------------
// EXPORTS

exports.InputsBaseClass = InputsBaseClass;