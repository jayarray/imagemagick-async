let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let LineSegmentBaseClass = require(Path.join(Filepath.LineSegmentsDir(), 'linesegmentbaseclass.js')).LineSegmentBaseClass;

//------------------------------------

class QuadraticBezier extends LineSegmentBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'QuadraticBezier';
        this.args = {};
      }

      /**
       * @param {Coordinates} coordinates 
       */
      control(coordinates) {
        this.args.control = coordinates;
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
        return new QuadraticBezier(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  String() {
    let cX = this.args.control.args.x + this.args.offset.args.x;
    let cY = this.args.control.args.y + this.args.offset.args.y;

    return `Q ${cX},${cY} ${this.args.endPoint.String()}`;
  }

  /**
   * @override
   */
  Errors() {
    let errors = [];
    let prefix = 'QUADRATIC_BEZIER_LINE_SEGMENT_ERROR';

    let controlErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Control point')
      .condition(
        new Err.ObjectCondition.Builder(this.args.control)
          .typeName('Coordinates')
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();

    if (controlErr)
      errors.push(controlErr);

    let endPointErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('End point')
      .condition(
        new Err.ObjectCondition.Builder(this.args.endPoint)
          .typeName('Coordinates')
          .checkForErrors(true)
          .build()
      )
      .built()
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
      control: {
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

//----------------------------------------
// EXPORTS

exports.QuadraticBezier = QuadraticBezier;