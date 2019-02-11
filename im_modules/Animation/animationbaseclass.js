let PATH = require('path');
let parts = __dirname.split(PATH.sep);
let index = parts.findIndex(x => x == 'im_modules');
let IM_MODULES_DIR = parts.slice(0, index + 1).join(PATH.sep);
let OBJECT_INTERFACE = require(PATH.join(__dirname, 'objectinterface.js')).ObjectInterface;

//--------------------------------------

class AnimationBaseClass extends OBJECT_INTERFACE {
  constructor(properties) {
    super({ category: 'animation' });
    this.type = properties.type;
    this.name = properties.name;
    this.args = properties.args;
    this.command = properties.command;
  }

  /**
   * @returns {Array} Returns a list of arguments needed for rendering.
   */
  Args() {
    // override
  }
}

//--------------------------
// EXPORTS

exports.AnimationBaseClass = AnimationBaseClass;