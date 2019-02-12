let PATH = require('path');
let LineSegmentBaseClass = require(PATH.join(__dirname, 'linesegmentbaseclass.js')).LineSegmentBaseClass;
let Validate = require('./validate.js');

//------------------------------------

class CubicBezier extends LineSegmentBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
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
   * @override
   */
  String() {
    return `C ${this.args.control1.args.x},${this.args.control1.args.y} ${this.args.control2.args.x},${this.args.control2.args.y} ${this.args.endPoint.args.x},${this.args.endPoint.args.y_}`;
  }

  /**
   * @override
   */
  Errors() {
    let errors = [];

    if (!Validate.IsDefined(this.args.control1))
      errors.push('CUBIC_BEZIER_LINE_SEGMENT_ERROR: First control point is undefined.');
    else {
      if (this.args.control1.type != 'Coordinates')
        errors.push('CUBIC_BEZIER_LINE_SEGMENT_ERROR: First control point is not a Coordinates object.');
      else {
        let errs = this.args.control1.Errors();
        if (errs.length > 0)
          errors.push(`CUBIC_BEZIER_LINE_SEGMENT_ERROR: First control point has some errors: ${errs.join(' ')}`);
      }
    }

    if (!Validate.IsDefined(this.args.control2))
      errors.push('CUBIC_BEZIER_LINE_SEGMENT_ERROR: Second control point is undefined.');
    else {
      if (this.args.control2.type != 'Coordinates')
        errors.push('CUBIC_BEZIER_LINE_SEGMENT_ERROR: Second control point is not a Coordinates object.');
      else {
        let errs = this.args.control2.Errors();
        if (errs.length > 0)
          errors.push(`CUBIC_BEZIER_LINE_SEGMENT_ERROR: Second control point has some errors: ${errs.join(' ')}`);
      }
    }

    if (!Validate.IsDefined(this.args.endPoint))
      errors.push('CUBIC_BEZIER_LINE_SEGMENT_ERROR: End point is undefined.');
    else {
      if (this.args.endPoint.type != 'Coordinates')
        errors.push('CUBIC_BEZIER_LINE_SEGMENT_ERROR: End point is not a Coordinates object.');
      else {
        let errs = this.args.endPoint.Errors();
        if (errs.length > 0)
          errors.push(`CUBIC_BEZIER_LINE_SEGMENT_ERROR: End point has some errors: ${errs.join(' ')}`);
      }
    }

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      control1: {
        type: 'Coordinates'
      },
      control2: {
        type: 'Coordinates'
      },
      endPoint: {
        type: 'Coordinates'
      }
    };
  }
}

//------------------------
// EXPORTS

exports.CubicBezier = CubicBezier