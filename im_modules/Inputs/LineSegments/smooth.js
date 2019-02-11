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
  .add('isQuadraticBezier', { type: 'boolean', default: false })
  .build();

//------------------------------------

class Smooth extends LINE_SEGMENT_BASECLASS {
  constructor(properties) {
    super(properties);
  }

  /**
   * Create a Smooth object. (Used with CubizBezier or QuadraticBezier)
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Smooth';
        this.args = {};
      }

      /**
       * @param {Coordinates} control 
       */
      control(control) {
        this.args.control = control;
        return this;
      }

      /**
       * @param {Coordinates} endPoint 
       */
      endPoint(endPoint) {
        this.args.endPoint = endPoint;
        return this;
      }

      /**
       * @param {boolean} isQuadraticBezier (Optional)
       */
      isQuadraticBezier(isQuadraticBezier) {
        this.args.isQuadraticBezier = isQuadraticBezier;
        return this;
      }

      build() {
        let properties = {
          name: this.name,
          args: this.args
        };

        return new Smooth(properties);
      }
    }
  }

  constructor(control, endPoint, isQuadraticBezier) {
    this.control_ = control;
    this.endPoint_ = endPoint;
    this.isQuadraticBezier_ = isQuadraticBezier;
  }

  String() {
    let char = 'S';
    if (this.args.isQuadraticBezier)
      char = 'T';

    return `${char} ${this.args.control.args.x},${this.args.control.args.y} ${this.args.endPoint.args.x},${this.args.endPoint.args.y}`;
  }

  /**
   * @override
   * @returns {Array<string>} Returns an array of error messages. If array is empty, there were no errors.
   */
  Errors() {
    let errors = [];

    // Check required args

    if (!CHECKS.IsDefined(this.args.control))
      errors.push('SMOOTH_LINE_SEGMENT_ERROR: Control point is undefined.');
    else {
      if (this.args.control.type != 'coordinates')
        errors.push('SMOOTH_LINE_SEGMENT_ERROR: Control point is not a Coordinates objcect.');
      else {
        let errs = this.args.control.Errors();
        if (errs.length > 0)
          errors.push(`SMOOTH_LINE_SEGMENT_ERROR: Control point has errors: ${errs.join(' ')}`);
      }
    }

    if (!CHECKS.IsDefined(this.args.endPoint))
      errors.push('SMOOTH_LINE_SEGMENT_ERROR: End point is undefined.');
    else {
      if (this.args.endPoint.type != 'coordinates')
        errors.push('SMOOTH_LINE_SEGMENT_ERROR: End point is not a Coordinates objcect.');
      else {
        let errs = this.args.endPoint.Errors();
        if (errs.length > 0)
          errors.push(`SMOOTH_LINE_SEGMENT_ERROR: End point has errors: ${errs.join(' ')}`);
      }
    }

    // Check optional args

    if (this.args.isQuadraticBezier) {
      if (!CHECKS.IsBoolean(this.args.isQuadraticBezier))
        errors.push('SMOOTH_LINE_SEGMENT_ERROR: Quadratic bezier flag is not a boolean.');
    }

    return errors;
  }
}

//----------------------------
// EXPORTs

exports.ARG_INFO = ARG_INFO;
exports.Create = Smooth.Create;