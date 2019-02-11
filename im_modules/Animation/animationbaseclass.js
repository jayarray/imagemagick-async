let PATH = require('path');
let parts = __dirname.split(PATH.sep);
let index = parts.findIndex(x => x == 'im_modules');
let IM_MODULES_DIR = parts.slice(0, index + 1).join(PATH.sep);
let OBJECT_INTERFACE = require(PATH.join(__dirname, 'objectinterface.js')).ObjectInterface;
let CHECKS = require(PATH.join(IM_MODULES_DIR, 'Checks', 'check.js'));

//--------------------------------------

class AnimationBaseClass extends OBJECT_INTERFACE {
  constructor(properties) {
    super({ category: 'animation' });
  }

  /**
   * @override
   */
  Args() {
  }

  /**
   * @override
   */
  Params() {
  }

  /**
   * @override
   */
  Errors() {
  }
}

//--------------------------
// EXPORTS

exports.AnimationBaseClass = AnimationBaseClass;