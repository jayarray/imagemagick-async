let PATH = require('path');

let parts = __dirname.split(PATH.sep);
let index = parts.findIndex(x => x == 'builder_stuff');
let IM_MODULES_DIR = parts.slice(0, index + 1).join(PATH.sep);
let INPUTS_BASECLASS = require(PATH.join(__dirname, 'inputsbaseclass.js')).InputsBaseClass;

//------------------------------

class LineSegmentBaseClass extends INPUTS_BASECLASS {
  constructor(properties) {
    this.type = 'linesegment';
  }
}

//--------------------------------
// EXPORTS

exports.LineSegmentBaseClass = LineSegmentBaseClass;