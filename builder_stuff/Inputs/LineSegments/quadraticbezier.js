let PATH = require('path');

let parts = __dirname.split(PATH.sep);
let index = parts.findIndex(x => x == 'builder_stuff');
let IM_MODULES_DIR = parts.slice(0, index + 1).join(PATH.sep);
let CHECKS = require(PATH.join(IM_MODULES_DIR, 'Checks', 'check.js'));
let ARG_DICT_BUILDER = require(PATH.join(IM_MODULES_DIR, 'Arguments', 'argdictionary.js')).Builder;
let LINE_SEGMENT_BASECLASS = require(PATH.join(__dirname, 'linesegmentbaseclass.js')).PrimitivesBaseClass;

//----------------------------------

const ARG_INFO = ARG_DICT_BUILDER()
  .add('control', { type: 'coordinates' })
  .add('endPoint', { type: 'coordinates' })
  .build();

//------------------------------------

class QuadraticBezier extends LINE_SEGMENT_BASECLASS {
  constructor(properties) {
    super(properties)
  }

  String() {
    return `Q ${this.args.control.args.x},${this.args.control.args.y} ${this.args.endPoint.args.x},${this.args.endPoint.args.y}`;
  }

  /**
   * Create a Smooth object.
   * @param {Coordinates} control
   * @param {Coordinates} endPoint
   * @returns {QuadraticBezier} Returns a QuadraticBezier object.
   */
  static Create(control, endPoint) {
    let properties = {
      name: 'QuadraticBezier',
      args: { control: control, endPoint: endPoint }
    };

    return new QuadraticBezier(properties);
  }

  /**
   * @override
   * @returns {Array<string>} Returns an array of error messages. If array is empty, there were no errors.
   */
  Errors() {
    let errors = [];

    if (!CHECKS.IsDefined(this.args.control))
      errors.push('QUADRATIC_BEZIER_LINE_SEGMENT_ERROR: Control point is undefined.');
    else {
      if (this.args.control.type != 'coordinates')
        errors.push('QUADRATIC_BEZIER_LINE_SEGMENT_ERROR: Control point is not a Coordinates objcect.');
      else {
        let errs = this.args.control.Errors();
        if (errs.length > 0)
          errors.push(`QUADRATIC_BEZIER_LINE_SEGMENT_ERROR: Control point has errors: ${errs.join(' ')}`);
      }
    }

    if (!CHECKS.IsDefined(this.args.endPoint))
      errors.push('QUADRATIC_BEZIER_LINE_SEGMENT_ERROR: End point is undefined.');
    else {
      if (this.args.endPoint.type != 'coordinates')
        errors.push('QUADRATIC_BEZIER_LINE_SEGMENT_ERROR: End point is not a Coordinates objcect.');
      else {
        let errs = this.args.endPoint.Errors();
        if (errs.length > 0)
          errors.push(`QUADRATIC_BEZIER_LINE_SEGMENT_ERROR: End point has errors: ${errs.join(' ')}`);
      }
    }

    return errors;
  }
}

//----------------------------------------
// EXPORTS

exports.ARG_INFO = ARG_INFO;
exports.Create = QuadraticBezier.Create;