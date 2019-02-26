let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let PrimitivesBaseClass = require(Path_.join(Filepath.PrimitivesDir(), 'primitivesbaseclass.js')).PrimitivesBaseClass;

//-----------------------------------

class Point extends PrimitivesBaseClass {
  constructor(properties) {
    super(properties);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Point';
        this.args = {};
      }

      /**
       * @param {number} x X-coordinate
       */
      x(x) {
        this.args.x = x;
        return this;
      }

      /**
       * @param {number} y Y-coordinate
       */
      y(y) {
        this.args.y = y;
        return this;
      }

      /**
       * @param {Color} color Valid color format string used in Image Magick. (Optional)
       */
      color(color) {
        this.args.color = color;
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
        return new Point(this);
      }
    }
    return new Builder();
  }

  /** 
   * @override
   */
  Args() {
    let args = [];

    if (this.args.color)
      args.push('-fill', this.args.color.String()); // Default color is black

    args.push('-draw', `point ${this.args.x + this.offset.x},${this.args.y + this.offset.y}`);
    return args;
  }

  /**
   * @override
   */
  Errors() {
    let errors = [];
    let prefix = 'POINT_PRIMITIVE_ERROR';

    // Check required args

    let xErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('X')
      .condition(
        new Err.NumberCondition.Builder(this.args.x)
          .isInteger(true)
          .build()
      )
      .build()
      .String();

    if (xErr)
      errors.push(xErr);

    let yErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Y')
      .condition(
        new Err.NumberCondition.Builder(this.args.y)
          .isInteger(true)
          .build()
      )
      .build()
      .String();

    if (yErr)
      errors.push(yErr);

    // Check optional args

    if (this.args.color) {
      let colorErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Color')
        .condition(
          new Err.ObjectCondition.Builder(this.args.color)
            .typeName('Color')
            .checkForErrors(true)
            .build()
        )
        .build()
        .String();

      if (colorErr)
        errors.push(colorErr);
    }

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      x: {
        type: 'number',
        subtype: 'integer'
      },
      y: {
        type: 'number',
        subtype: 'integer'
      },
      color: {
        type: 'Color'
      }
    };
  }
}

//----------------------------
// EXPORTs

exports.Point = Point;