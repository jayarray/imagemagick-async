let Path = require('path');
let Err = require('./error.js');
let Filepath = require('./filepath.js').Filepath;
let LineSegmentBaseClass = require(Path.join(Filepath.LineSegmentsDir(), 'linesegmentbaseclass.js')).LineSegmentBaseClass;

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
       * @param {Coordinates} coordinates 
       */
      control1(coordinates) {
        this.args.control1 = coordinates;
        return this;
      }

      /**
       * @param {Coordinates} coordinates 
       */
      control2(coordinates) {
        this.args.control2 = coordinates;
        return this;
      }

      /**
       * @param {Coordinates} coordinates 
       */
      endPoint(coordinates) {
        this.args.endPoint = coordinates;
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
    let prefix = 'CUBIC_BEZIER_LINE_SEGMENT_ERROR';

    let control1Err = new Err.ErrorMessage.Builder()
      .prefix(prefix)
      .varName('First control point')
      .condition(
        new Err.ObjectCondition.Builder(this.args.control1)
          .typeName('Coordinates')
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();

    if (control1Err)
      errors.push(control1Err);

    let control2Err = new Err.ErrorMessage.Builder()
      .prefix(prefix)
      .varName('Second control point')
      .condition(
        new Err.ObjectCondition.Builder(this.args.control2)
          .typeName('Coordinates')
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();

    if (control2Err)
      errors.push(control2Err);

    let endPointErr = new Err.ErrorMessage.Builder()
      .prefix(prefix)
      .varName('End point')
      .condition(
        new Err.ObjectCondition.Builder(this.args.endPoint)
          .typeName('Coordinates')
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();

    if (endPointErr)
      errors.push(endPointErr);

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