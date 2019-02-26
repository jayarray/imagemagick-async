let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let LineSegmentBaseClass = require(Path.join(Filepath.LineSegmentsDir(), 'linesegmentbaseclass.js')).LineSegmentBaseClass;

//------------------------------------

class QuadraticBezier extends LineSegmentBaseClass {
  constructor(properties) {
    super(properties);
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
        this.control = coordinates;
        return this;
      }

      /**
       * @param {Coordinates} coordinates 
       */
      endPoint(coordinates) {
        this.endPoint = coordinates;
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
    return `Q ${this.args.control.args.x},${this.args.control.args.y} ${this.args.endPoint.args.x},${this.args.endPoint.args.y}`;
  }

  /**
   * @override
   */
  Errors() {
    let errors = [];
    let prefix = 'QUADRATIC_BEZIER_LINE_SEGMENT_ERROR';

    let controlErr = new Err.ErrorMessage.Builder()
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

    let endPointErr = new Err.ErrorMessage.Builder()
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