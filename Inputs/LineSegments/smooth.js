let Path = require('path');
let Validate = require('./validate.js');
let Filepath = require('./filepath.js').Filepath;
let LineSegmentBaseClass = require(Path.join(Filepath.LineSegmentsDir(), 'linesegmentbaseclass.js')).LineSegmentBaseClass;

//------------------------------------

class Smooth extends LineSegmentBaseClass {
  constructor(properties) {
    super(properties);
  }

  /**
   * @override
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
    return Builder;
  }

  constructor(control, endPoint, isQuadraticBezier) {
    this.control_ = control;
    this.endPoint_ = endPoint;
    this.isQuadraticBezier_ = isQuadraticBezier;
  }

  /**
   * @override
   */
  String() {
    let char = 'S';
    if (this.args.isQuadraticBezier)
      char = 'T';

    return `${char} ${this.args.control.args.x},${this.args.control.args.y} ${this.args.endPoint.args.x},${this.args.endPoint.args.y}`;
  }

  /**
   * @override
   */
  Errors() {
    let errors = [];

    // Check required args

    if (!Validate.IsDefined(this.args.control))
      errors.push('SMOOTH_LINE_SEGMENT_ERROR: Control point is undefined.');
    else {
      if (this.args.control.type != 'Coordinates')
        errors.push('SMOOTH_LINE_SEGMENT_ERROR: Control point is not a Coordinates objcect.');
      else {
        let errs = this.args.control.Errors();
        if (errs.length > 0)
          errors.push(`SMOOTH_LINE_SEGMENT_ERROR: Control point has errors: ${errs.join(' ')}`);
      }
    }

    if (!Validate.IsDefined(this.args.endPoint))
      errors.push('SMOOTH_LINE_SEGMENT_ERROR: End point is undefined.');
    else {
      if (this.args.endPoint.type != 'Coordinates')
        errors.push('SMOOTH_LINE_SEGMENT_ERROR: End point is not a Coordinates objcect.');
      else {
        let errs = this.args.endPoint.Errors();
        if (errs.length > 0)
          errors.push(`SMOOTH_LINE_SEGMENT_ERROR: End point has errors: ${errs.join(' ')}`);
      }
    }

    // Check optional args

    if (this.args.isQuadraticBezier) {
      if (!Validate.IsBoolean(this.args.isQuadraticBezier))
        errors.push('SMOOTH_LINE_SEGMENT_ERROR: Quadratic bezier flag is not a boolean.');
    }

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      control: {
        type: 'Coordinates'
      },
      endPoint: {
        type: 'Coordinates'
      },
      isQuadraticBezier: {
        type: 'boolean',
        default: false
      }
    };
  }
}

//----------------------------
// EXPORTs

exports.Smooth = Smooth;