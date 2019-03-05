let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let ColorBaseClass = require(Path.join(Filepath.ModColorDir(), 'colorbaseclass.js')).ColorBaseClass;

//------------------------------

class Colorize extends ColorBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Colorize';
        this.args = {};
        this.offset = null;
      }

      /**
       * @param {string} str The path of the image file you are modifying.
       */
      source(str) {
        this.args.source = str;
        return this;
      }

      /**
       * @param {Color} color The desired color for the veil of color to to put over the image.
       */
      fillColor(color) {
        this.args.fillColor = color;
        return this;
      }

      /**
       * @param {number} n The percent of opaqueness.
       */
      percent(n) {
        this.args.percent = n;
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
        return new Colorize(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    return ['-fill', this.args.fillColor.String(), '-colorize', `${this.args.percent}%`];
  }

  /**
   * @override
   */
  Errors() {
    let params = Colorize.Parameters();
    let errors = [];
    let prefix = 'COLORIZE_COLOR_MOD_ERROR';

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

    let percentErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Percent')
      .condition(
        new Err.NumberCondition.Builder(this.args.percent)
          .min(params.percent.min)
          .max(params.percent.max)
          .build()
      )
      .build()
      .String();

    if (fillColorErr)
      errors.push(fillColorErr);

    return errors;
  }

  /**
   * @override
   */
  static IsConsolidatable() {
    return true;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      source: {
        type: 'string'
      },
      fillColor: {
        type: 'Color'
      },
      percent: {
        type: 'number',
        min: 0,
        max: 100
      }
    };
  }
}

//--------------------------
// EXPORTS

exports.Colorize = Colorize;