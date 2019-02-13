let ObjectInterface = require('./objectinterface.js').ObjectInterface;

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
  static IsLayer() {
    // override
  }

  /**
   * @returns {boolean} Returns true if the drawable object can be consolidated with other. False otherwise.
   */
  static IsConsolidatable() {
    // override
  }
}

//------------------------------
// EXPORTS

exports.DrawableBaseClass = DrawableBaseClass;