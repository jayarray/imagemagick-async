let Path_ = require('path');
let Validate = require('./validate.js');
let Filepath = require('./filepath.js').Filepath;
let PrimitivesBaseClass = require(Path_.join(Filepath.PrimitivesDir(), 'primitivesbaseclass.js')).PrimitivesBaseClass;

//-------------------------------------

class Text extends PrimitivesBaseClass {
  constructor(properties) {
    super(properties);
  }

  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Text';
        this.args = {};
      }

      /**
       * @param {string} string String containing text.
       */
      string(string) {
        this.string = string;
        return this;
      }

      /**
       * @param {string} font Font name (Optional)
       */
      font(font) {
        this.font = font;
        return this;
      }

      /**
       * @param {number} pointSize Point size (Optional)
       */
      pointSize(pointSize) {
        this.pointSize = pointSize;
        return this;
      }

      /**
       * @param {string} gravity Gravity (Optional)
       */
      gravity(gravity) {
        this.gravity = gravity;
        return this;
      }

      /**
       * @param {Color} strokeColor The color of the outline of the text. (Optional)
       */
      strokeColor(strokeColor) {
        this.strokeColor = strokeColor;
        return this;
      }

      /**
       * @param {number} strokeWidth The width of the outline of the text. (Optional)
       */
      strokeWidth(strokeWidth) {
        this.strokeWidth = strokeWidth;
        return this;
      }

      /**
       * @param {Color} fillColor The color to fill the text with.  (Valid color format string used in Image Magick) (Optional)
       */
      fillColor(fillColor) {
        this.fillColor = fillColor;
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
        return new Path(this);
      }
    }
    return Builder;
  }

  /** 
   * @override
   */
  Args() {
    let args = [];

    if (this.args.fillColor)
      args.push('-fill', this.args.fillColor.Info().hex.string); // Default color is black

    if (this.args.strokeColor)
      args.push('-stroke', this.args.strokeColor.Info().hex.string);

    if (this.args.strokeWidth)
      args.push('-strokewidth', this.args.strokeWidth);

    if (this.args.font)
      args.push('-font', this.args.font);

    if (this.args.pointSize)
      args.push('-pointsize', this.args.pointSize);

    if (this.args.gravity)
      args.push('-gravity', this.args.gravity);

    args.push('-draw', `text ${this.offset.x},${this.offset.y} '${this.args.string}'`);
    return args;
  }

  /**
   * @override
   */
  Errors() {
    let params = Text.Parameters();
    let errors = [];

    // Check required args

    if (!Validate.IsDefined(this.args.string))
      errors.push('TEXT_PRIMITIVE_ERROR: String is undefined.');
    else {
      if (!Validate.IsString(this.args.string))
        errors.push('TEXT_PRIMITIVE_ERROR: String is not a string.');
      else {
        if (Validate.IsEmptyString(this.args.string))
          errors.push('TEXT_PRIMITIVE_ERROR: String is empty string.');
      }
    }

    // Check optional args

    if (this.args.font) {
      if (!Validate.IsString(this.args.font))
        errors.push('TEXT_PRIMITIVE_ERROR: Font is not a string.');
      else {
        if (Validate.IsEmptyString(this.args.font))
          errors.push('TEXT_PRIMITIVE_ERROR: Font is empty string.');
        else if (Validate.IsWhitespace(this.args.font))
          errors.push('TEXT_PRIMITIVE_ERROR: Font is whitespace.');
      }
    }

    if (this.args.pointSize) {
      if (!Validate.IsNumber(this.args.pointSize))
        errors.push('TEXT_PRIMITIVE_ERROR: Point size is not a number.');
      else {
        if (this.args.pointSize < params.pointSize.min)
          errors.push(`TEXT_PRIMITIVE_ERROR: Point size is out of bounds. Assigned value is: ${this.args.pointSize}. Value must be greater than or equal to ${params.pointSize.min}.`);
      }
    }

    if (this.args.gravity) {
      if (!Validate.IsString(this.args.gravity))
        errors.push('TEXT_PRIMITIVE_ERROR: Gravity is not a string.');
      else {
        if (Validate.IsEmptyString(this.args.gravity))
          errors.push('TEXT_PRIMITIVE_ERROR: Gravity is empty string.');
        else if (Validate.IsWhitespace(this.args.gravity))
          errors.push('TEXT_PRIMITIVE_ERROR: Gravity is whitespace.');
        else {
          if (!params.gravity.options.includes(this.args.gravity))
            errors.push(`TEXT_PRIMITIVE_ERROR: Gravity is invalid. Assigned value is: ${this.args.gravity}. Must be assigned one of the following values: ${params.gravity.options.join(', ')}.`);
        }
      }
    }

    if (this.args.strokeColor) {
      if (this.args.strokeColor.type != 'Color')
        errors.push('TEXT_PRIMITIVE_ERROR: Stroke color is not a Color object.');
      else {
        let errs = this.args.strokeColor.Errors();
        if (errs.length > 0)
          errors.push(`TEXT_PRIMITIVE_ERROR: Stroke color has errors: ${errs.join(' ')}`);
      }
    }

    if (this.args.strokeWidth) {
      if (!Validate.IsNumber(this.args.strokeWidth))
        errors.push('TEXT_PRIMITIVE_ERROR: Stroke width is not a number.');
      else {
        if (this.args.strokeWidth < params.strokeWidth.min)
          errors.push(`TEXT_PRIMITIVE_ERROR: Stroke width is out of bounds. Assigned value is: ${this.args.strokeWidth}. Value must be greater than or equal to ${params.strokeWidth.min}.`);
      }
    }

    if (this.args.fillColor) {
      if (this.args.fillColor.type != 'Color')
        errors.push('TEXT_PRIMITIVE_ERROR: Fill color is not a Color object.');
      else {
        let errs = this.args.fillColor.Errors();
        if (errs.length > 0)
          errors.push(`TEXT_PRIMITIVE_ERROR: Fill color has errors: ${errs.join(' ')}`);
      }
    }

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      string: {
        type: 'string'
      },
      font: {
        type: 'string'
      },
      pointSize: {
        type: 'number',
        min: 1
      },
      gravity: {
        type: 'string',
        options: [
          'Center',
          'East',
          'North',
          'NorthEast',
          'NorthWest',
          'South',
          'SouthEast',
          'SouthWest',
          'West'
        ]
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
      }
    };
  }
}

//----------------------------
// EXPORTS

exports.Text = Text;