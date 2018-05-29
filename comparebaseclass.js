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
   * @returns {number} Returns the number of source inputs.
   */
  NumberOfSources() {
    return 2;
  }

  /**
   * Replace current source with new source.
   */
  UpdateSources(newSources) {
    for (let i = 0; i < this.NumberOfSources(); ++i) {
      let variableName = `src${i + 1}_`;
      this[variableName] = newSources[i];
    }
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