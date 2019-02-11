class ObjectInterface {
  constructor(properties) {
    this.category = properties.category;  // Matches parent folder (all lowercase)
    this.type = properties.type;          // if in a subfolder, assign to subfolder name. Else, assign to class name.
    this.name = properties.name;          // Class name
    this.args = properties.args;          // Object with args
  }

  /**
   * @override
   * @returns {object} Returns an object containing parameter properties.
   */
  static Parameters() {
  }

  /**
   * @override
   * @returns {Array<string>} Returns a list of errors produced by invalid arguments. (Is empty if no errors were found).
   */
  Errors() {
  }
}

//---------------------------
// EXPORTS

exports.ObjectInterface = ObjectInterface;