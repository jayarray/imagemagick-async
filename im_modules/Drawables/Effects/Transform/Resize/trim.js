let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let ResizeBaseClass = require(Path.join(Filepath.TransformResizeDir(), 'resizebaseclass.js')).ResizeBaseClass;

//-----------------------------------

class Trim extends ResizeBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Trim';
        this.args = {};
      }

      /**
       * @param {string} str
       */
      source(str) {
        this.args.source = str;
        return this;
      }

      /**
       * @param {Color} color Declare the color to trim. (Optional)
       */
      borderColor(color) {
        this.args.borderColor = color;
        return this;
      }

      /**
       * @param {number} n Declare this value after declaring border color. (Optional)
       */
      fuzz(n) {
        this.args.fuzz = n;
        return this;
      }

      build() {
        return new Trim(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    let args = [];

    if (this.args.borderColor)
      args.push('-bordercolor', this.args.borderColor.String());

    if (Validate.IsDefined(this.args.fuzz) && this.args.fuzz > 0)
      args.push('-fuzz', this.args.fuzz);

    args.push('-trim', '+repage');

    return args;
  }

  /**
   * @override
   */
  Errors() {
    let params = Trim.Parameters();
    let errors = [];
    let prefix = 'TRIM_RESIZE_TRANSFORM_ERROR';

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

    let borderColorErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Border color')
      .condition(
        new Err.ObjectCondition.Builder(this.args.borderColor)
          .typeName('Color')
          .checkForError(true)
          .build()
      )
      .build()
      .String();

    if (borderColorErr)
      errors.push(borderColorErr);

    let fuzzErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Fuzz')
      .condition(
        new Err.NumberCondition.Builder(this.args.fuzz)
          .min(params.fuzz.min)
          .build()
      )
      .build()
      .String();

    if (fuzzErr)
      errors.push(fuzzErr);

    return errors;
  }

  /**
   * @override
   */
  IsConsolidatable() {
    return false;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      source: {
        type: 'string',
        required: true
      },
      borderColor: {
        type: 'Inputs.Color',
        required: true
      },
      fuzz: {
        type: 'number',
        min: 0,
        required: true
      }
    };
  }
}

//---------------------------
// EXPORTS

exports.Trim = Trim;