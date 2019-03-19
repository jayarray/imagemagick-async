let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let ObjectInterface = require(Path.join(RootDir, 'objectinterface.js')).ObjectInterface;

//----------------------------------

class SpecialBaseClass extends ObjectInterface {
  constructor(properties) {
    super({
      category: 'drawable',
      type: 'Special',
      name: properties.name,
      args: properties.args
    });

    this.subtype = properties.subtype;
  }

  /**
   * @returns {string} Returns the exact command needed for rendering. (Does not include output path).
   */
  Command() {
    // override
  }

  /**
   * @returns {boolean} Always returns false. (None of the special drawables can be combined with other things).
   */
  IsConsolidatable() {
    return false;
  }

  /**
   * @returns {boolean} Always returns true. (All special drawables are their own layer).
   */
  IsLayer() {
    return true;
  }
}

//------------------------------
// EXPORTS

exports.SpecialBaseClass = SpecialBaseClass;