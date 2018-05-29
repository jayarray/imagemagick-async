let LayerBaseClass = require('./layerbaseclass.js').LayerBaseClass;

//------------------------------

class ComposeBaseClass extends LayerBaseClass {
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
   * @returns {number} Returns the number of source inputs.
   */
  NumberOfSources() {
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

exports.ComposeBaseClass = ComposeBaseClass;