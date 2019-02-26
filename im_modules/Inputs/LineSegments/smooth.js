let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let LineSegmentBaseClass = require(Path.join(Filepath.LineSegmentsDir(), 'linesegmentbaseclass.js')).LineSegmentBaseClass;

//------------------------------------

class Smooth extends LineSegmentBaseClass {
  constructor(properties) {
    super(properties);
  }

  /**
   * @override
   * (Used with CubizBezier or QuadraticBezier)
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Smooth';
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
       * @param {boolean} bool (Optional)
       */
      isQuadraticBezier(bool) {
        this.args.isQuadraticBezier = bool;
        return this;
      }

      build() {
        return new Smooth(properties);
      }
    }
    return Builder;
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
    let prefix = 'SMOOTH_LINE_SEGMENT_ERROR';

    // Check required args

    let controlErr = new Err.ErrorMessage.Builder()
      .prefix(prefix)
      .varName('Control')
      .condition(
        new Err.ObjectCondition.Build(this.args.control)
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
      .build()
      .String();

    if (endPointErr)
      errors.push(endPointErr);

    // Check optional args


    if (this.args.isQuadraticBezier) {
      let isQuadraticBezierErr = new Err.ErrorMessage.Builder()
        .prefix(prefix)
        .varName('Quadratic bezier flag')
        .condition(
          new Err.BooleanCondition(this.args.isQuadraticBezier)
            .build()
        )
        .build()
        .String();

      if (isQuadraticBezierErr)
        errors.push(isQuadraticBezierErr);
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