let PATH = require('path');
let parts = __dirname.split(PATH.sep);
let index = parts.findIndex(x => x == 'inputs');
let INPUTS_DIR = parts.slice(0, index + 1).join(PATH.sep);
let InputsBaseClass = require(PATH.join(INPUTS_DIR, 'inputsbaseclass.js')).InputsBaseClass;

//-----------------------------

class GradientBaseClass extends InputsBaseClass {
  constructor(properties) {
    super(properties)
    this.type = 'Gradient';
  }

  /** 
   * @returns {Array} Returns a list of arguments needed for rendering.
   */
  Args() {
    // Override
  }
}

//--------------------------------
// EXPORTS

exports.GradientBaseClass = GradientBaseClass;