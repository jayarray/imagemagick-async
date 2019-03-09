let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let ColorBaseClass = require(Path.join(Filepath.ModColorDir(), 'colorbaseclass.js')).ColorBaseClass;

//------------------------------

class Brightness extends ColorBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Brightness';
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
       * @param {number} n Brightness value between 0 and 200. A value of 100 will make no changes.
       */
      value(n) {
        this.args.value = n;
        return this;
      }

      build() {
        return new Brightness(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    return ['-modulate', this.args.value];
  }

  /**
   * @override
   */
  Errors() {
    let params = Brightness.Parameters();
    let errors = [];
    let prefix = 'BRIGHTNESS_COLOR_MOD_ERROR';

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

    if (valueErr)
      errors.push(valueErr);

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
        subtype: 'integer',
        min: 0,
        max: 200
      }
    };
  }
}

//--------------------------
// EXPORTS

exports.Brightness = Brightness;