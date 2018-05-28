let LayerBaseClass = require('./layerbaseclass.js').LayerBaseClass;

//------------------------------------
// COMPARISON (base class)

class CompareBaseClass extends LayerBaseClass {
  constructor() {
    super();
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments needed for drawing the primitive.
   */
  Args() {
    // Override
  }

  /**
   * @override
   * @returns {string} Returns a string of the type name.
   */
  Type() {
    return 'mod';
  }
}

//------------------------------
// EXPORTS

exports.CompareBaseClass = CompareBaseClass;