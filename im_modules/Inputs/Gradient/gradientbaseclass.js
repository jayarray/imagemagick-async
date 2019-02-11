let PATH = require('path');

let parts = __dirname.split(PATH.sep);
let index = parts.findIndex(x => x == 'builder_stuff');
let IM_MODULES_DIR = parts.slice(0, index + 1).join(PATH.sep);
let INPUTS_BASECLASS = require(PATH.join(__dirname, 'inputsbaseclass.js')).InputsBaseClass;

//-----------------------------

class GradientBaseClass extends INPUTS_BASECLASS {
  constructor(properties) {
    super(properties)
    this.type = 'gradient';
  }

  /** 
   * @override
   */
  Args() {
    // Override
  }
}

//--------------------------------
// EXPORTS

exports.GradientBaseClass = GradientBaseClass;