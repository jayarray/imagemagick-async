let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
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

      /**
       * @param {Offset} offset
       */
      offset(offset) {
        this.args.offset = offset;
        return this;
      }

      build() {
        return new CubicBezier(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  String() {
    let c1X = this.args.control1.args.x + this.args.offset.args.x;
    let c1Y = this.args.control1.args.y + this.args.offset.args.y;
    let c2X = this.args.control2.args.x + this.args.offset.args.x;
    let c2Y = this.args.control2.args.y + this.args.offset.args.y;

    return `C ${c1X},${c1Y} ${c2X},${c2Y} ${this.args.endPoint.String()}`;
  }

  /**
   * @override
   */
  Errors() {
    let errors = [];
    let prefix = 'CUBIC_BEZIER_LINE_SEGMENT_ERROR';

    let control1Err = Err.ErrorMessage.Builder
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

    let control2Err = Err.ErrorMessage.Builder
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

    let endPointErr = Err.ErrorMessage.Builder
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
        type: 'Inputs.Coordinates',
        required: true
      },
      control2: {
        type: 'Inputs.Coordinates',
        required: true
      },
      endPoint: {
        type: 'Inputs.Coordinates',
        required: true
      },
      offset: {
        type: 'Inputs.Offset',
        required: false
      }
    };
  }
}

//------------------------
// EXPORTS

exports.CubicBezier = CubicBezier