let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let ColorBaseClass = require(Path.join(Filepath.ModColorDir(), 'colorbaseclass.js')).ColorBaseClass;

//------------------------------

class Transparency extends ColorBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Transparency';
        this.args = {};
      }

      /**
       * @param {string} str The path of the image file you are modifying.
       */
      source(str) {
        this.args.source = str;
        return this;
      }

      /**
       * @param {number} n The percent of transparency. Value closer to zero is opaque and value closer to 100 is transparent.
       */
      percent(n) {
        this.args.percent = n;
        return this;
      }

      build() {
        return new Transparency(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    let opaqueValue = (100 - this.args.percent) / 100;

    return ['-alpha', 'on', '-channel', 'a', '-evaluate', 'multiply', `${opaqueValue}`, '+channel'];
  }

  /**
   * @override
   */
  Errors() {
    let params = Transparency.Parameters();
    let errors = [];
    let prefix = 'TRANSPARENCY_COLOR_MOD_ERROR';

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

    if (percentErr)
      errors.push(percentErr);

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
      percent: {
        type: 'number',
        min: 0,
        max: 100,
        required: true
      }
    };
  }
}

//--------------------------
// EXPORTS

exports.Transparency = Transparency;