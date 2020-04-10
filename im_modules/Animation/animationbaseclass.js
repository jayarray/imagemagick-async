let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let ObjectInterface = require(Path.join(RootDir, './objectinterface.js')).ObjectInterface;

//--------------------------------------

class AnimationBaseClass extends ObjectInterface {
  constructor(properties) {
    super({ category: 'animation' });
    this.type = properties.type;
    this.name = properties.name;
    this.args = properties.args;
    this.command = properties.command;
    this.order = properties.order;
  }

  /**
   * @returns {Array} Returns a list of arguments needed for rendering.
   */
  Args() {
    // override
  }

  /**
   * @override
   */
  Render() {
    // Override
  }
}

//--------------------------
// EXPORTS

exports.AnimationBaseClass = AnimationBaseClass;