let LayerBaseClass = require('./layerbaseclass.js').LayerBaseClass;

//---------------------------------
// PRIMITIVE (Base class)

class PrimitiveBaseClass extends LayerBaseClass {
  constructor() {
    super();
  }

  /**
   * @param {number} xOffset
   * @param {number} yOffset
   * @returns {Array<string|number>} Returns an array of arguments needed for drawing the primitive.
   */
  Args(xOffset, yOffset) {
    // Override
  }

  /**
   * @override
   * @returns {string} Returns a string of the type name.
   */
  Type() {
    return 'primitive';
  }

  /**
   * @override
   * @returns {string} Returns a string of the command used to render the primitive.
   */
  Command() {
    return null;
  }
}

//---------------------------
// EXPORTS

exports.PrimitiveBaseClass = PrimitiveBaseClass;