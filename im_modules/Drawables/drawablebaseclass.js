let Path = require('path');
let RootDir = Path.resolve('.');
let ObjectInterface = require(Path.join(RootDir, 'objectinterface.js')).ObjectInterface;

//----------------------------------

class DrawableBaseClass extends ObjectInterface {
  constructor(properties) {
    super({ category: 'drawable' });
    this.type = properties.type;
    this.name = properties.name;
    this.args = properties.args; 
  }

  /**
   * @returns {Array} Returns a list of arguments needed for rendering.
   */
  Args() {
    // Override
  }

  /**
   * @returns {boolean} Returns true if the drawable object can be rendered on it's own. False otherwise.
   */
  IsLayer() {
    // override
  }

  /**
   * @returns {boolean} Returns true if the drawable object can be consolidated with other. False otherwise.
   */
  IsConsolidatable() {
    // override
  }
}

//------------------------------
// EXPORTS

exports.DrawableBaseClass = DrawableBaseClass;