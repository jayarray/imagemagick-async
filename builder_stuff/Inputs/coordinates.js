let PATH = require('path');

let parts = __dirname.split(PATH.sep);
let index = parts.findIndex(x => x == 'builder_stuff');
let IM_MODULES_DIR = parts.slice(0, index + 1).join(PATH.sep);
let CHECKS = require(PATH.join(IM_MODULES_DIR, 'Checks', 'check.js'));
let ARG_DICT_BUILDER = require(PATH.join(IM_MODULES_DIR, 'Arguments', 'argdictionary.js')).Builder;

//-----------------------------

const ARG_INFO = ARG_DICT_BUILDER()
  .add('x', { type: 'number', default: 0 })
  .add('y', { type: 'number', default: 0 })
  .build();

//-----------------------------

class Coordinates {
  constructor(x, y) {
    this.name = 'Coordinates';
    this.args = { x: x, y: y };
  }

  /** 
   * @returns {string} Returns a string representation of the coordinates as 'x,y'. 
   */
  String() {
    return `${this.args.x},${this.args.y}`;
  }

  /**
   * @param {number} x X-coordinate
   * @param {number} y Y-coordinate
   * @returns {Coordinates} Returns a Coordinates object.
   */
  static Create(x, y) {
    return new Coordinates(x, y);
  }

  /**
   * Check for any input errors.
   * @returns {Array<string>} Returns an array of error messages. If array is empty, there were no errors.
   */
  Errors() {
    let errors = [];

    if (!CHECKS.IsDefined(this.args.x))
      errors.push('COORDINATES_ERROR: X-coordinate is undefined.');
    else {
      if (!CHECKS.IsNumber(this.args.x))
        errors.push(`COORDINATES_ERROR: X-coordinate is not a number.`);
    }

    if (!CHECKS.IsDefined(this.args.y))
      errors.push('COORDINATES_ERROR: Y-coordinate is undefined.');
    else {
      if (!CHECKS.IsNumber(this.args.y))
        errors.push(`COORDINATES_ERROR: Y-coordinate is not a number.`);
    }

    return errors;
  }
}

//--------------------------------
// EXPORTS

exports.ARG_INFO = ARG_INFO;
exports.Create = Coordinates.Create;
