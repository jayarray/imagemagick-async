let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let DisplaceBaseClass = require(Path.join(Filepath.TransformDisplaceDir(), 'displacebaseclass.js')).DisplaceBaseClass;

//-----------------------------------

class RotateAroundPoint extends DisplaceBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'RotateAroundPoint';
        this.args = {};
        this.offset = null;
      }

      /**
       * @param {string} str
       */
      source(str) {
        this.args.source = str;
        return this;
      }

      /**
       * @param {Coordinates} coordinates
       */
      point(coordinates) {
        this.args.point = coordinates;
        return this;
      }

      /**
       * @param {number} n
       */
      degrees(n) {
        this.args.degrees = n;
        return this;
      }

      /**
       * @param {number} x 
       * @param {number} y 
       */
      offset(x, y) {
        this.offset = { x: x, y: y };
        return this;
      }

      build() {
        return new RotateAroundPoint(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    return ['-distort', 'SRT', `${this.point.String()} ${this.args.degrees}`];
  }

  /**
   * @override
   */
  Errors() {
    let params = RotateAroundPoint.Parameters();
    let errors = [];
    let prefix = 'ROTATE_AROUND_POINT_TRANSFORM_MOD_ERROR';

    let sourceErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Source')
      .condition(
        new Err.StringCondition.Builder(this.args.source)
          .isempty(false)
          .isWhitespace(false)
          .build()
      )
      .build()
      .String();

    if (sourceErr)
      errors.push(sourceErr);

    let pointErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Point')
      .condition(
        new Err.ObjectCondition.Builder(this.args.point)
          .typeName('Coordinates')
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();

    if (pointErr)
      errors.push(pointErr);

    let degreesErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Degrees')
      .condition(
        new Err.NumberCondition.Builder(this.args.degrees)
          .build()
      )
      .build()
      .String();

    if (degreesErr)
      errors.push(degreesErr);

    return errors;
  }

  /**
   * @override
   */
  static IsConsolidatable() {
    return true;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      source: {
        type: 'string'
      },
      point: {
        type: 'Coordinates'
      },
      degrees: {
        type: 'number'
      }
    };
  }
}

//-----------------------------
// EXPORTS

exports.RotateAroundPoint = RotateAroundPoint;