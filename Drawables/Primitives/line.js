let Path = require('path');
let Validate = require('./validate.js');
let Filepath = require('./filepath.js').Filepath;
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
       * @param {Coordinates} start 
       */
      start(start) {
        this.start = start;
        return this;
      }

      /**
       * @param {Coordinates} end 
       */
      end(end) {
        this.end = end;
        return this;
      }

      /**
       * @param {Color} color Valid color format string used in Image Magick. (Optional)
       */
      color(color) {
        this.color = color;
        return this;
      }

      /**
       * @param {number} width Width of line. Larger values produce thicker lines. (Optional)
       */
      width(width) {
        this.width = width;
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
    return Builder;
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

    let start = Coordinates.Builder()
      .x(this.args.start.args.x + this.offset.x)
      .y(this.args.start.args.y + this.offset.y)
      .build();

    let end = Coordinates.Builder()
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

    // Check required args

    if (!Validate.IsDefined(this.args.start))
      errors.push('LINE_PRIMITIVE_ERROR: Start is undefined.');
    else {
      if (this.args.start.type != 'Coordinates')
        errors.push('LINE_PRIMITIVE_ERROR: Start is not a Coordinates object.');
      else {
        let errs = this.args.start.Errors();
        if (errs.length > 0)
          errors.push(`LINE_PRIMITIVE_ERROR: Start has errors: ${errs.join(' ')}`);
      }
    }

    if (!Validate.IsDefined(this.args.end))
      errors.push('LINE_PRIMITIVE_ERROR: End is undefined.');
    else {
      if (this.args.end.type != 'Coordinates')
        errors.push('LINE_PRIMITIVE_ERROR: End is not a Coordinates object.');
      else {
        let errs = this.args.end.Errors();
        if (errs.length > 0)
          errors.push(`LINE_PRIMITIVE_ERROR: End has errors: ${errs.join(' ')}`);
      }
    }

    // Check optional args

    if (this.args.color) {
      if (this.args.color.type != 'Color')
        errors.push('LINE_PRIMITIVE_ERROR: Color is not a Color object.');
      else {
        let errs = this.args.color.Errors();
        if (errs.length > 0)
          errors.push(`LINE_PRIMITIVE_ERROR: Color has errors: ${errs.join(' ')}`);
      }
    }

    if (this.args.width) {
      if (!Validate.IsInteger(this.args.width))
        errors.push('LINE_PRIMITIVE_ERROR: Width is not an integer.');
      else {
        if (this.args.width < params.width.min)
          errors.push(`LINE_PRIMITIVE_ERROR: width is out of bounds. Assigned value is: ${this.args.width}. Value must be greater than or equal to ${params.width.min}.`);
      }
    }

    return errors;
  }

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