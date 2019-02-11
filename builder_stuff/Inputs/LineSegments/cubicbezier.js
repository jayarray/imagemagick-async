let PATH = require('path');

let parts = __dirname.split(PATH.sep);
let index = parts.findIndex(x => x == 'builder_stuff');
let IM_MODULES_DIR = parts.slice(0, index + 1).join(PATH.sep);
let CHECKS = require(PATH.join(IM_MODULES_DIR, 'Checks', 'check.js'));
let ARG_DICT_BUILDER = require(PATH.join(IM_MODULES_DIR, 'Arguments', 'argdictionary.js')).Builder;
let LINE_SEGMENT_BASECLASS = require(PATH.join(__dirname, 'linesegmentbaseclass.js')).PrimitivesBaseClass;

//----------------------------------

const ARG_INFO = ARG_DICT_BUILDER()
  .add('control1', { type: 'Coordinates' })
  .add('control2', { type: 'Coordinates' })
  .add('endPoint', { type: 'Coordinates' })
  .build();

//------------------------------------

class CubicBezier extends LINE_SEGMENT_BASECLASS {
  constructor(builder) {
    super(builder);
  }

  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'CubicBezier';
        this.args = {};
      }

      /**
       * @param {Coordinates} control1 
       */
      control11(control1) {
        this.args.control11 = control1;
        return this;
      }

      /**
       * @param {Coordinates} control2 
       */
      constrol2(control2) {
        this.args.constrol2 = control2;
        return this;
      }

      /**
       * @param {Coordinates} endPoint 
       */
      endPoint(endPoint) {
        this.args.endPoint = endPoint;
        return this;
      }

      build() {
        return new CubicBezier(this);
      }
    }
    return Builder;
  }

  /**
   * @returns {string} Returns a string representation of the cubic bezier line segment.
   */
  String() {
    return `C ${this.args.control1.args.x},${this.args.control1.args.y} ${this.args.control2.args.x},${this.args.control2.args.y} ${this.args.endPoint.args.x},${this.args.endPoint.args.y_}`;
  }

  /**
   * @override
   * @returns {Array<string>} Returns an array of error messages. If array is empty, there were no errors.
   */
  Errors() {
    let errors = [];

    if (!CHECKS.IsDefined(this.args.control1))
      errors.push('CUBIC_BEZIER_LINE_SEGMENT_ERROR: First control point is undefined.');
    else {
      if (this.args.control1.type != 'coordinates')
        errors.push('CUBIC_BEZIER_LINE_SEGMENT_ERROR: First control point is not a Coordinates object.');
      else {
        let errs = this.args.control1.Errors();
        if (errs.length > 0)
          errors.push(`CUBIC_BEZIER_LINE_SEGMENT_ERROR: First control point has some errors: ${errs.join(' ')}`);
      }
    }

    if (!CHECKS.IsDefined(this.args.control2))
      errors.push('CUBIC_BEZIER_LINE_SEGMENT_ERROR: Second control point is undefined.');
    else {
      if (this.args.control2.type != 'coordinates')
        errors.push('CUBIC_BEZIER_LINE_SEGMENT_ERROR: Second control point is not a Coordinates object.');
      else {
        let errs = this.args.control2.Errors();
        if (errs.length > 0)
          errors.push(`CUBIC_BEZIER_LINE_SEGMENT_ERROR: Second control point has some errors: ${errs.join(' ')}`);
      }
    }

    if (!CHECKS.IsDefined(this.args.endPoint))
      errors.push('CUBIC_BEZIER_LINE_SEGMENT_ERROR: End point is undefined.');
    else {
      if (this.args.endPoint.type != 'coordinates')
        errors.push('CUBIC_BEZIER_LINE_SEGMENT_ERROR: End point is not a Coordinates object.');
      else {
        let errs = this.args.endPoint.Errors();
        if (errs.length > 0)
          errors.push(`CUBIC_BEZIER_LINE_SEGMENT_ERROR: End point has some errors: ${errs.join(' ')}`);
      }
    }

    return errors;
  }
}

//------------------------
// EXPORTS

exports.ARG_INFO = ARG_INFO;
exports.Builder = CubicBezier.Builder;