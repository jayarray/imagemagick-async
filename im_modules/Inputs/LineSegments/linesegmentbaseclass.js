let PATH = require('path');
let parts = __dirname.split(PATH.sep);
let index = parts.findIndex(x => x == 'Inputs');
let INPUTS_DIR = parts.slice(0, index + 1).join(PATH.sep);
let InputsBaseClass = require(PATH.join(INPUTS_DIR, 'inputsbaseclass.js')).InputsBaseClass;

//------------------------------

class LineSegmentBaseClass extends InputsBaseClass {
  constructor(properties) {
    super(properties);
    this.type = 'LineSegment';
  }

  /**
   * @returns {string} A string representation of the line segment.
   */
  String() {
    // override
  }
}

//--------------------------------
// EXPORTS

exports.LineSegmentBaseClass = LineSegmentBaseClass;