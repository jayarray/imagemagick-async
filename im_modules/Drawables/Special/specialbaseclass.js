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

    this.requiresDestToRender = false;
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

  /**
   * @param {string} dest The desired output path for the render. 
   * @returns {Promise<string>} Returns a Promise that contains the output path of the newly rendered image.
   */
  Render(dest) {
    // Override
  }
}

//------------------------------
// EXPORTS

exports.SpecialBaseClass = SpecialBaseClass;