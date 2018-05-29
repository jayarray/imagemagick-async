let LayerBaseClass = require('./layerbaseclass.js').LayerBaseClass;

//------------------------------

class ColorBaseClass extends LayerBaseClass {
  constructor() {
    super();
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    // Override
  }

  /**
   * @override
   * @returns {string} Returns a string of the command used to render the mod.
   */
  Command() {
    return 'convert';
  }

  /**
   * @override
   * @returns {string} Returns a string of the type name.
   */
  Type() {
    return 'mod';
  }

  /**
   * @returns {number} Returns the number of source inputs.
   */
  NumberOfSources() {
    return 1;
  }

  /**
   * @returns {string} Returns the name of the layer.
   */
  Name() {
    // Override
  }
}

//-------------------------------
// EXPORTS

exports.ColorBaseClass = ColorBaseClass;