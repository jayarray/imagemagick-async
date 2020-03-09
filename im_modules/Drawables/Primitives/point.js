let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let PrimitivesBaseClass = require(Path.join(Filepath.PrimitivesDir(), 'primitivesbaseclass.js')).PrimitivesBaseClass;

//-----------------------------------

class Point extends PrimitivesBaseClass {
  constructor(builder) {
    super(builder);
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
       * @param {Offset} offset
       */
      offset(offset) {
        this.args.offset = offset;
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

    let x = this.args.x;
    let y = this.args.y;

    if (this.args.offset) {
      x += this.args.offset.args.x;
      y += this.args.offset.args.y;
    }

    args.push('-draw', `point ${x},${y}`);
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
        subtype: 'integer',
        required: true
      },
      y: {
        type: 'number',
        subtype: 'integer',
        required: true
      },
      color: {
        type: 'Inputs.Color',
        required: false
      },
      offset: {
        type: 'Inputs.Offset',
        required: false
      }
    };
  }
}

//----------------------------
// EXPORTs

exports.Point = Point;