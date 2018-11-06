let PATH = require('path');

let parts = __dirname.split(PATH.sep);
let index = parts.findIndex(x => x == 'im_modules');
let IM_MODULES_DIR = parts.slice(0, index + 1).join(PATH.sep);
let LAYER_BASECLASS = require(PATH.join(IM_MODULES_DIR, 'Layer', 'layerbaseclass.js')).LayerBaseClass;

//------------------------------------

class CompareBaseClass extends LAYER_BASECLASS {
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
exports.ComponentType = 'private';