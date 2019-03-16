let Path = require('path');
let ProjectDir = Path.resolve('.');

let PathParts = ProjectDir.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let InputsBaseClass = require(Path.join(Filepath.InputsDir(), 'inputsbaseclass.js')).InputsBaseClass;

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