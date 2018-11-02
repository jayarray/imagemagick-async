let PATH = require('path');
let rootDir = PATH.dirname(require.main.filename);
let LAYER_BASECLASS = require(PATH.join(rootDir, 'im_modules', 'Layer', 'layerbaseclass.js')).LayerBaseClass;

//-----------------------------

class MaskBaseClass extends LAYER_BASECLASS {
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
    return 1;
  }

  /**
   * Replace current source with new source.
   */
  UpdateSource(newSrc) {
    this.src_ = newSrc;
  }

  /**
   * @override
   * @returns {string} Returns a string of the type name.
   */
  Type() {
    return 'mod';
  }
}

//--------------------------------
// EXPORTS

exports.MaskBaseClass = MaskBaseClass;
exports.ComponentType = 'private';