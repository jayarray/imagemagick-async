let Path_ = require('path');
let Err = require('./error.js');
let Validate = require('./validate.js');
let Filepath = require('./filepath.js').Filepath;
let PrimitivesBaseClass = require(Path_.join(Filepath.PrimitivesDir(), 'primitivesbaseclass.js')).PrimitivesBaseClass;

//-------------------------------------

class Text extends PrimitivesBaseClass {
  constructor(properties) {
    super(properties);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Text';
        this.args = {};
      }

      /**
       * @param {string} str String containing text.
       */
      string(str) {
        this.args.string = str;
        return this;
      }

      /**
       * @param {string} name Font name (Optional)
       */
      font(name) {
        this.args.font = name;
        return this;
      }

      /**
       * @param {number} n Point size (Optional)
       */
      pointSize(n) {
        this.args.pointSize = n;
        return this;
      }

      /**
       * @param {string} str Gravity (Optional)
       */
      gravity(str) {
        this.args.gravity = str;
        return this;
      }

      /**
       * @param {Color} color The color of the outline of the text. (Optional)
       */
      strokeColor(color) {
        this.args.strokeColor = color;
        return this;
      }

      /**
       * @param {number} n The width of the outline of the text. (Optional)
       */
      strokeWidth(n) {
        this.args.strokeWidth = n;
        return this;
      }

      /**
       * @param {Color} color The color to fill the text with.  (Valid color format string used in Image Magick) (Optional)
       */
      fillColor(color) {
        this.args.fillColor = color;
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
    let prefix = 'TEXT_PRIMITIVE_ERROR';

    // Check required args

    let stringErr = new Err.ErrorMessage.Builder()
      .prefix(prefix)
      .varName('String')
      .condition(
        new Err.StringCondition.Builder(this.args.string)
          .isEmpty(false)
          .build()
      )
      .build()
      .String();

    if (stringErr)
      errors.push(stringErr);

    // Check optional args

    if (this.args.font) {
      let fontErr = new Err.ErrorMessage.Builder()
        .prefix(prefix)
        .varName('Font')
        .condition(
          new Err.StringCondition.Builder(this.args.font)
            .isEmpty(false)
            .isWhitespace(false)
            .build()
        )
        .build()
        .String();

      if (fontErr)
        erorrs.push(fontErr);
    }

    // CONT
    
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