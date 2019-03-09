let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let ColorBaseClass = require(Path.join(Filepath.ModColorDir(), 'colorbaseclass.js')).ColorBaseClass;

//------------------------------

class Saturation extends ColorBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Saturation';
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
       * @param {number} n Hue value between 0 and 200. A value of 100 will make no changes.
       */
      value(n) {
        this.args.value = n;
        return this;
      }

      build() {
        return new Saturation(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    return ['-modulate', `100,${this.args.value}`];
  }

  /**
   * @override
   */
  Errors() {
    let params = Saturation.Parameters();
    let errors = [];
    let prefix = 'SATURATION_COLOR_MOD_ERROR';

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

    let valueErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Value')
      .condition(
        new Err.NumberCondition.Builder(this.args.value)
          .isInteger(true)
          .min(params.value.min)
          .max(params.value.max)
          .build()
      )
      .build()
      .String();

    if (sourceErr)
      errors.push(sourceErr);

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
      value: {
        type: 'number',
        min: 0,
        max: 200
      }
    };
  }
}

//------------------------------
// EXPORTS

exports.Saturation = Saturation;