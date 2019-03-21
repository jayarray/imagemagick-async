let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let Validate = require(Path.join(RootDir, 'validate.js'));
let PrimitivesBaseClass = require(Path.join(Filepath.PrimitivesDir(), 'primitivesbaseclass.js')).PrimitivesBaseClass;
let GravityValues = require(Path.join(Filepath.ConstantsDir(), 'gravity.json')).values;

//-------------------------------------

class Text extends PrimitivesBaseClass {
  constructor(builder) {
    super(builder);
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
       * @param {Offset} offset
       */
      offset(offset) {
        this.args.offset = offset;
        return this;
      }

      build() {
        return new Text(this);
      }
    }
    return new Builder();
  }

  /** 
   * @override
   */
  Args() {
    let params = Text.Parameters();
    let args = [];

    if (this.args.fillColor)
      args.push('-fill', this.args.fillColor.String()); // Default color is black

    if (this.args.strokeColor)
      args.push('-stroke', this.args.strokeColor.String());
    else
      args.push('-stroke', params.strokeColor.default);

    if (this.args.strokeWidth)
      args.push('-strokewidth', this.args.strokeWidth);

    if (this.args.font)
      args.push('-font', this.args.font);

    if (this.args.pointSize)
      args.push('-pointsize', this.args.pointSize);

    if (this.args.gravity)
      args.push('-gravity', this.args.gravity);

    args.push('-draw', `text ${this.args.offset.args.x},${this.args.offset.args.y} '${this.args.string}'`);
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

    let stringErr = Err.ErrorMessage.Builder
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
      let fontErr = Err.ErrorMessage.Builder
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
      let pointSizeErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Gravity')
        .condition(
          new Err.NumberCondition.Builder(this.args.pointSize)
            .min(params.pointSize.min)
            .build()
        )
        .build()
        .String();

      if (pointSizeErr)
        errors.push(pointSizeErr);
    }

    if (this.args.gravity) {
      let gravityErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Gravity')
        .condition(
          new Err.StringCondition.Builder(this.args.gravity)
            .isEmpty(false)
            .isWhitespace(false)
            .include(params.gravity.options)
            .build()
        )
        .build()
        .String();

      if (gravityErr)
        errors.push(gravityErr);
    }

    if (this.args.strokeColor) {
      let strokeColorErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Stroke color')
        .condition(
          new Err.ObjectCondition.Builder(this.args.strokeColor)
            .typeName('Color')
            .checkForErrors(true)
            .build()
        )
        .build()
        .String();

      if (strokeColorErr)
        errors.push(strokeColorErr);
    }

    if (this.args.strokeWidth) {
      let strokeWidthErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Stroke width')
        .condition(
          new Err.NumberCondition.Builder(this.args.strokeWidth)
            .isInteger(true)
            .min(params.strokeWidth.min)
            .build()
        )
        .build()
        .String();

      if (strokeWidthErr)
        errors.push(strokeWidthErr);
    }

    if (this.args.fillColor) {
      let fillColorErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Fill color')
        .condition(
          new Err.ObjectCondition.Builder(this.args.fillColor)
            .typeName('Color')
            .checkForErrors(true)
            .build()
        )
        .build()
        .String();

      if (fillColorErr)
        errors.push(fillColorErr);
    }

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      string: {
        type: 'string',
        required: true
      },
      font: {
        type: 'string',
        required: false
      },
      pointSize: {
        type: 'number',
        min: 1,
        required: false
      },
      gravity: {
        type: 'string',
        options: GravityValues,
        required: false
      },
      strokeColor: {
        type: 'Inputs.Color',
        default: 'black',
        required: false
      },
      strokeWidth: {
        type: 'number',
        subtype: 'integer',
        min: 1,
        required: false
      },
      fillColor: {
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
// EXPORTS

exports.Text = Text;