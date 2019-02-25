let ObjectInterface = require('./objectinterface.js').ObjectInterface;

//--------------------------------------

class AnimationBaseClass extends ObjectInterface {
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