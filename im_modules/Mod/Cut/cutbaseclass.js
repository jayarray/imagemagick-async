let PATH = require('path');
let rootDir = PATH.dirname(require.main.filename);
let LAYER_BASECLASS = require(PATH.join(rootDir, 'im_modules', 'Layer', 'layerbaseclass.js')).LayerBaseClass;

//------------------------------------

class CutBaseClass extends LAYER_BASECLASS {
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
    return 2;
  }

  /**
   * Replace current source with new source.
   */
  UpdateSources(newSources) {
    for (let i = 0; i < this.NumberOfSources(); ++i) {
      let currNewSrc = newSources[i];
      if (currNewSrc) {
        let variableName = `src${i + 1}_`;
        this[variableName] = currNewSrc;
      }
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

//-----------------------------
// EXPORTS

exports.CutBaseClass = CutBaseClass;
exports.ComponentType = 'private';