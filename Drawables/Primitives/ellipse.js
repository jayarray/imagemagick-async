let Path = require('path');
let Validate = require('./validate.js');
let Filepath = require('./filepath.js').Filepath;
let Coordinates = require(Path.join(Filepath.InputsDir(), 'coordinates.js')).Coordinates;
let PrimitivesBaseClass = require(Path.join(Filepath.PrimitivesDir(), 'primitivesbaseclass.js')).PrimitivesBaseClass;

//-----------------------------------

class Ellipse extends PrimitivesBaseClass {
  constructor(properties) {
    super(properties);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Ellipse';
        this.args = {};
      }

      /**
       * @param {Coordinates} center 
       */
      center(center) {
        this.args.center = center;
        return this;
      }

      /**
       * @param {number} width Width (in pixels)
       */
      width(width) {
        this.args.width = width;
        return this;
      }

      /**
       * @param {number} height Height (in pixels)
       */
      height(height) {
        this.args.height = height;
        return this;
      }

      /**
       * @param {Color} strokeColor The color of the line making up the ellipse. (Valid color format string used in Image Magick) (Optional)
       */
      strokeColor(strokeColor) {
        this.args.strokeColor = strokeColor;
        return this;
      }

      /**
       * @param {number} strokeWidth Width of the line making up the ellipse. (Larger values produce thicker lines.) (Optional)
       */
      strokeWidth(strokeWidth) {
        this.args.strokeWidth = strokeWidth;
        return this;
      }

      /**
       * @param {Color} fillColor The color to fill the ellipse. (Valid color format string used in Image Magick) (Optional)
       */
      fillColor(fillColor) {
        this.args.fillColor = fillColor;
        return this;
      }

      /**
       * @param {number} angleStart angleStart Angle at which to start drawing the ellipse. (0-degrees starts at 3-o'clock on the screen) (Optional)
       */
      angleStart(angleStart) {
        this.angleStart = angleStart;
        return this;
      }

      /**
       * @param {number} angleEnd Angle at which to stop drawing the ellipse. (360-degrees stops at 3-o'clock on the screen) (Optional)
       */
      angleEnd(angleEnd) {
        this.angleEnd = angleEnd;
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
        return new Ellipse(this);
      }
    }
    return Builder;
  }

  /** 
   * @override
  */
  Args() {
    let params = Ellipse.Parameters();
    let args = [];

    if (this.args.fillColor)
      args.push('-fill', this.args.fillColor.Info().hex.string);
    else
      args.push('-fill', 'none'); // Prevents default black fill color

    if (this.args.strokeColor)
      args.push('-stroke', this.args.strokeColor.Info().hex.string);

    if (this.args.strokeWidth)
      args.push('-strokewidth', this.args.strokeWidth);

    let center = Coordinates.Builder()
      .x(this.args.center.args.x + this.offset.x)
      .y(this.args.center.args.y + this.offset.y)
      .build();

    let angleStart = this.args.angleStart || params.angleStart.default;
    let angleEnd = this.args.angleEnd || params.angleEnd.default;

    args.push('-draw', `ellipse ${center.String()} ${Math.floor(this.args.width / 2)},${Math.floor(this.args.height / 2)} ${angleStart},${angleEnd}`);
    return args;
  }

  /**
   * @override
   */
  Errors() {
    let params = Ellipse.Parameters();
    let errors = [];

    // Check required args

    if (!Validate.IsDefined(this.args.center))
      errors.push('ELLIPSE_PRIMITIVE_ERROR: Center is undefined.');
    else {
      if (this.args.center.type != 'Coordinates')
        errors.push('ELLIPSE_PRIMITIVE_ERROR: Center is not a Coordinates object.');
      else {
        let errs = this.args.center.Errors();
        if (errs.length > 0)
          errors.push(`ELLIPSE_PRIMITIVE_ERROR: Center has errors: ${errs.join(' ')}`);
      }
    }

    if (!Validate.IsDefined(this.args.width))
      errors.push('ELLIPSE_PRIMITIVE_ERROR: Width is undefined.');
    else {
      if (!Validate.IsNumber(this.args.width))
        errors.push('ELLIPSE_PRIMTIVE_ERROR: Width is not a number.');
      else {
        if (!Validate.IsInteger(this.args.width))
          errors.push('ELLIPSE_PRIMITIVE_ERROR: Width is not an integer.');
        else {
          if (this.args.width < params.width.min)
            errors.push(`ELLIPSE_PRIMITIVE_ERROR: Width is out of bounds. Assigned value is: ${this.args.width}. Value must be greater than or equal to ${params.width.min}.`);
        }
      }
    }

    if (!Validate.IsDefined(this.args.height))
      errors.push('ELLIPSE_PRIMITIVE_ERROR: Height is undefined.');
    else {
      if (!Validate.IsNumber(this.args.height))
        errors.push('ELLIPSE_PRIMTIVE_ERROR: Height is not a number.');
      else {
        if (!Validate.IsInteger(this.args.height))
          errors.push('ELLIPSE_PRIMITIVE_ERROR: Height is not an integer.');
        else {
          if (this.args.height < params.height.min)
            errors.push(`ELLIPSE_PRIMITIVE_ERROR: Height is out of bounds. Assigned value is: ${this.args.height}. Value must be greater than or equal to ${params.height.min}.`);
        }
      }
    }

    // Check optional args

    if (this.args.strokeColor) {
      if (this.args.strokeColor.type != 'Color')
        errors.push('ELLIPSE_PRIMITIVE_ERROR: Stroke color is not a Color object.');
      else {
        let errs = this.args.strokeColor.Errors();
        if (errs.length > 0)
          errors.push(`ELLIPSE_PRIMITIVE_ERROR: Stroke color has errors: ${errs.join(' ')}`);
      }
    }

    if (this.args.strokeWidth) {
      if (!Validate.IsNumber(this.args.strokeWidth))
        errors.push('ELLIPSE_PRIMTIVE_ERROR: Stroke width is not a number.');
      else {
        if (!Validate.IsInteger(this.args.strokeWidth))
          errors.push('ELLIPSE_PRIMITIVE_ERROR: Stroke width is not an integer.');
        else {
          if (this.args.strokeWidth < params.strokeWidth.min)
            errors.push(`ELLIPSE_PRIMITIVE_ERROR: Stroke width is out of bounds. Assigned value is: ${this.args.strokeWidth}. Value must be greater than or equal to ${this.args.strokeWidth}.`);
        }
      }
    }

    if (this.args.fillColor) {
      if (this.args.fillColor.type != 'Color')
        errors.push('ELLIPSE_PRIMITIVE_ERROR: Fill color is not a Color object.');
      else {
        let errs = this.args.fillColor.Errors();
        if (errs.length > 0)
          errors.push(`ELLIPSE_PRIMITIVE_ERROR: Fill color has errors: ${errs.join(' ')}`);
      }
    }

    if (this.args.angleStart) {
      if (!Validate.IsNumber(this.args.angleStart))
        errors.push('ELLIPSE_PRIMTIVE_ERROR: Angle start is not a number.');
      else {
        if (!Validate.IsInteger(this.args.angleStart))
          errors.push('ELLIPSE_PRIMITIVE_ERROR: Angle start is not an integer.');
      }
    }

    if (this.args.angleEnd) {
      if (!Validate.IsNumber(this.args.angleEnd))
        errors.push('ELLIPSE_PRIMTIVE_ERROR: Angle end is not a number.');
      else {
        if (!Validate.IsInteger(this.args.angleEnd))
          errors.push('ELLIPSE_PRIMITIVE_ERROR: Angle end is not an integer.');
      }
    }

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      center: {
        type: 'Coordinates'
      },
      width: {
        type: 'number',
        subtype: 'integer',
        min: 1
      },
      height: {
        type: 'number',
        subtype: 'integer',
        min: 1
      },
      strokeColor: {
        type: 'Color'
      },
      strokeWidth: {
        type: 'number',
        subtype: 'integer',
        min: 1
      },
      fillColor: {
        type: 'Color'
      },
      angleStart: {
        type: 'number',
        default: 0
      },
      angleEnd: {
        type: 'number',
        default: 360
      }
    };
  }
}

//---------------------------------
// EXPORTS

exports.Ellipse = Ellipse;