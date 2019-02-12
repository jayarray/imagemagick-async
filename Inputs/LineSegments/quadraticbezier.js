let PATH = require('path');
let LineSegmentBaseClass = require(PATH.join(__dirname, 'linesegmentbaseclass.js')).LineSegmentBaseClass;
let Validate = require('./validate.js');

//------------------------------------

class QuadraticBezier extends LineSegmentBaseClass {
  constructor(properties) {
    super(properties)
  }

  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'QuadraticBezier';
        this.args = {};
      }

      /**
       * @param {Coordinates} control 
       */
      control(control) {
        this.control = control;
        return this;
      }

      /**
       * @param {Coordinates} endPoint 
       */
      endPoint(endPoint) {
        this.endPoint = endPoint;
        return this;
      }

      build() {
        return new QuadraticBezier(this);
      }
    }
    return Builder;
  }

  /**
   * @override
   */
  String() {
    return `Q ${this.args.control.args.x},${this.args.control.args.y} ${this.args.endPoint.args.x},${this.args.endPoint.args.y}`;
  }

  /**
   * @override
   */
  Errors() {
    let errors = [];

    if (!Validate.IsDefined(this.args.control))
      errors.push('QUADRATIC_BEZIER_LINE_SEGMENT_ERROR: Control point is undefined.');
    else {
      if (this.args.control.type != 'Coordinates')
        errors.push('QUADRATIC_BEZIER_LINE_SEGMENT_ERROR: Control point is not a Coordinates objcect.');
      else {
        let errs = this.args.control.Errors();
        if (errs.length > 0)
          errors.push(`QUADRATIC_BEZIER_LINE_SEGMENT_ERROR: Control point has errors: ${errs.join(' ')}`);
      }
    }

    if (!Validate.IsDefined(this.args.endPoint))
      errors.push('QUADRATIC_BEZIER_LINE_SEGMENT_ERROR: End point is undefined.');
    else {
      if (this.args.endPoint.type != 'Coordinates')
        errors.push('QUADRATIC_BEZIER_LINE_SEGMENT_ERROR: End point is not a Coordinates objcect.');
      else {
        let errs = this.args.endPoint.Errors();
        if (errs.length > 0)
          errors.push(`QUADRATIC_BEZIER_LINE_SEGMENT_ERROR: End point has errors: ${errs.join(' ')}`);
      }
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
      }
    };
  }
}

//----------------------------------------
// EXPORTS

exports.QuadraticBezier = QuadraticBezier;