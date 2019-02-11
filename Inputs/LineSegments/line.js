let PATH = require('path');

let parts = __dirname.split(PATH.sep);
let index = parts.findIndex(x => x == 'builder_stuff');
let IM_MODULES_DIR = parts.slice(0, index + 1).join(PATH.sep);
let CHECKS = require(PATH.join(IM_MODULES_DIR, 'Checks', 'check.js'));
let ARG_DICT_BUILDER = require(PATH.join(IM_MODULES_DIR, 'Arguments', 'argdictionary.js')).Builder;
let LINE_SEGMENT_BASECLASS = require(PATH.join(__dirname, 'linesegmentbaseclass.js')).PrimitivesBaseClass;

//----------------------------------

const ARG_INFO = ARG_DICT_BUILDER()
  .add('x', { type: 'number', subtype: 'integer' })
  .add('y', { type: 'number', subtype: 'integer' })
  .build();

//------------------------------------

class Line extends LINE_SEGMENT_BASECLASS {
  constructor(properties) {
    super(properties);
  }

  /**
   * @returns {string} A string representation of this line segment.
   */
  String() {
    return `L ${this.args.x},${this.args.y}`;
  }

  /**
   * Create a Line object.
   * @param {number} x 
   * @param {number} y 
   * @returns {Line} Returns a Line object.
   */
  static Create(x, y) {
    let properties = {
      name: 'Line',
      args: { x: x, y: y }
    }

    return new Line(properties);
  }

  /**
   * @override
   * @returns {Array<string>} Returns an array of error messages. If array is empty, there were no errors.
   */
  Errors() {
    let errors = [];

    if (!CHECKS.IsDefined(this.args.x))
      errors.push('LINE_LINE_SEGMENT_ERROR: X coordinate is undefined.');
    else {
      if (!CHECKS.IsNumber(this.args.x))
        errors.push('LINE_LINE_SEGMENT_ERROR: X coordinate is not a number.');
    }

    if (!CHECKS.IsDefined(this.args.y))
      errors.push('LINE_LINE_SEGMENT_ERROR: Y coordinate is undefined.');
    else {
      if (!CHECKS.IsNumber(this.args.y))
        errors.push('LINE_LINE_SEGMENT_ERROR: Y coordinate is not a number.');
    }

    return errors;
  }
}

//----------------------------
// EXPORTS

exports.ARG_INFO = ARG_INFO;
exports.Create = Line.Create;