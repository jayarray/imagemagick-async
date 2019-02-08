let PATH = require('path');

let parts = __dirname.split(PATH.sep);
let index = parts.findIndex(x => x == 'im_modules');
let IM_MODULES_DIR = parts.slice(0, index + 1).join(PATH.sep);
let CHECKS = require(PATH.join(IM_MODULES_DIR, 'Checks', 'check.js'));
let ARG_DICT_BUILDER = require(PATH.join(IM_MODULES_DIR, 'Arguments', 'argdictionary.js')).Builder;

//----------------------------------

const ARG_INFO = ARG_DICT_BUILDER()
  .add('point', { type: 'Coordinates' })
  .add('color', { type: 'string', default: '#000000' })
  .build();

//-----------------------------

class PointAndColor {
  constructor(point, color) {
    this.name = 'PointAndColor';
    this.args = { point: point, color: color };
  }

  /** 
   * @returns {string} Returns a string representation of the point and color as 'x,y #rrggbb'. 
   */
  String() {
    return `${this.args.point.args.x},${this.point.args.y} ${this.args.color}`;
  }

  /**
   * @param {Coordinates} point
   * @param {string} color
   * @returns {PointAndColor} Returns a PointAndColor object.
   */
  static Create(point, color) {
    return new PointAndColor(point, color);
  }

  /**
   * Check for any input errors.
   * @returns {Array<string>} Returns an array of error messages. If array is empty, there were no errors.
   */
  Errors() {
    let errors = [];

    if (!CHECKS.IsDefined(this.args.point))
      errors.push('POINT_AND_COLOR_ERROR: Point is undefined.');
    else {
      if (this.args.point.name != 'Coordinates')
        errors.push(`POINT_AND_COLOR_ERROR: Point is not a Coordinates object.`);
      else {
        let errors = this.args.point.Errors();

        if (errors.length > 0)
          errors.push(`POINT_AND_COLOR_ERROR: Point has errors: ${errors.join(' ')}`);
      }
    }

    if (!CHECKS.IsDefined(this.args.color))
      errors.push('POINT_AND_COLOR_ERROR: Color is undefined.');
    else {
      if (!CHECKS.IsString(this.args.color))
        errors.push(`POINT_AND_COLOR_ERROR: Color is not a string.`);
      else {
        if (CHECKS.IsEmptyString(this.args.color))
          errors.push(`POINT_AND_COLOR_ERROR: Color is empty string.`);
        else if (CHECKS.IsWhitespace(this.args.color))
          errors.push(`POINT_AND_COLOR_ERROR: Color is whitespace.`);
      }
    }

    return errors;
  }
}

//--------------------------------
// EXPORTS

exports.ARG_INFO = ARG_INFO;
exports.Create = PointAndColor.Create;