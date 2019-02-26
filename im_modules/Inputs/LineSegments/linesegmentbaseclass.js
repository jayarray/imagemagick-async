let Path = require('path');
let RootDir = Path.resolve('.');
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let InputsBaseClass = require(PATH.join(Filepath.InputsDir(), 'inputsbaseclass.js')).InputsBaseClass;

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