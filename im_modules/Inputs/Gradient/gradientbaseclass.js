let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let InputsBaseClass = require(Path.join(Filepath.InputsDir(), 'inputsbaseclass.js')).InputsBaseClass;

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