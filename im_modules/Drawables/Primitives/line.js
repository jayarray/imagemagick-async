let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let Coordinates = require(Path.join(Filepath.InputsDir(), 'coordinates.js')).Coordinates;
let PrimitivesBaseClass = require(Path.join(Filepath.PrimitivesDir(), 'primitivesbaseclass.js')).PrimitivesBaseClass;

//-----------------------------------

class Line extends PrimitivesBaseClass {
  constructor(builder) {
    super(builder);
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
       * @param {Offset} offset
       */
      offset(offset) {
        this.args.offset = offset;
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
    let params = Line.Parameters();
    let args = [];

    if (this.args.color)
      args.push('-stroke', this.args.color.String());
    else
      args.push('-stroke', params.color.default);

    if (this.args.width)
      args.push('-strokewidth', this.args.width);

    let sx = this.args.start.args.x;
    let sy = this.args.start.args.y;

    if (this.args.offset) {
      sx += this.args.offset.args.x;
      sy += this.args.offset.args.y;
    }

    let start = Coordinates.Builder
      .x(sx)
      .y(sy)
      .build();


    let ex = this.args.end.args.x;
    let ey = this.args.end.args.y;

    if (this.args.offset) {
      ex += this.args.offset.args.x;
      ey += this.args.offset.args.y;
    }

    let end = Coordinates.Builder
      .x(ex)
      .y(ey)
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
        type: 'Inputs.Coordinates',
        required: true
      },
      end: {
        type: 'Inputs.Coordinates',
        required: true
      },
      color: {
        type: 'Inputs.Color',
        default: 'black',
        required: false
      },
      width: {
        type: 'number',
        subtype: 'integer',
        min: 1,
        required: false
      },
      offset: {
        type: 'Inputs.Offset',
        required: false
      }
    };
  }
}

//--------------------------
// EXPORTS

exports.Line = Line;