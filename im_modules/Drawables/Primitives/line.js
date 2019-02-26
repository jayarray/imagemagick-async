let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let Coordinates = require(Path.join(Filepath.InputsDir(), 'coordinates.js')).Coordinates;
let PrimitivesBaseClass = require(Path.join(Filepath.PrimitivesDir(), 'primitivesbaseclass.js')).PrimitivesBaseClass;

//-----------------------------------

class Line extends PrimitivesBaseClass {
  constructor(properties) {
    super(properties);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Line';
        this.args = {};
      }

      /**
       * @param {Coordinates} coordinates 
       */
      start(coordinates) {
        this.args.start = coordinates;
        return this;
      }

      /**
       * @param {Coordinates} coordinates 
       */
      end(coordinates) {
        this.args.end = coordinates;
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
       * @param {number} n Width of line. Larger values produce thicker lines. (Optional)
       */
      width(n) {
        this.args.width = n;
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
        return new Line(this);
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
      args.push('-stroke', this.args.color.Info().hex.string);

    if (this.args.width)
      args.push('-strokewidth', this.args.width.Info().hex.string);

    let start = Coordinates.Builder
      .x(this.args.start.args.x + this.offset.x)
      .y(this.args.start.args.y + this.offset.y)
      .build();

    let end = Coordinates.Builder
      .x(this.args.end.args.x + this.offset.x)
      .y(this.args.end.args.y + this.offset.y)
      .build();

    args.push('-draw', `line ${start.String()} ${end.String()}`);

    return args;
  }

  /**
   * @override
   */
  Errors() {
    let params = Line.Parameters();
    let errors = [];
    let prefix = 'LINE_PRIMITIVE_ERROR';

    // Check required args

    let startErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Start')
      .condition(
        new Err.ObjecCondition.Builder(this.args.start)
          .typeName('Coordinates')
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();

    if (startErr)
      errors.push(startErr);

    let endErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('End')
      .condition(
        new Err.ObjecCondition.Builder(this.args.end)
          .typeName('Coordinates')
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();

    if (endErr)
      errors.push(endErr);

    // Check optional args

    if (this.args.color) {
      let colorErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Color')
        .condition(
          new Err.ObjecCondition.Builder(this.args.color)
            .typeName('Color')
            .checkForErrors(true)
            .build()
        )
        .build()
        .String();

      if (colorErr)
        errors.push(colorErr);
    }

    if (this.args.width) {
      let widthErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Width')
        .condition(
          new Err.NumberCondition.Builder(this.args.width)
            .isInteger(true)
            .min(params.width.min)
            .build()
        )
        .build()
        .String();

      if (widthErr)
        errors.push(widthErr);
    }

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      start: {
        type: 'Coordinates'
      },
      end: {
        type: 'Coordinates'
      },
      color: {
        type: 'Color'
      },
      width: {
        type: 'number',
        subtype: 'integer',
        min: 1
      }
    };
  }
}

//--------------------------
// EXPORTS

exports.Line = Line;