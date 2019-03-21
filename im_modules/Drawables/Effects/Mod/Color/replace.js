let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let ColorBaseClass = require(Path.join(Filepath.ModColorDir(), 'colorbaseclass.js')).ColorBaseClass;

//------------------------------

class Replace extends ColorBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Replace';
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
       * @param {Color} color The color you want to change.
       */
      targetColor(color) {
        this.args.targetColor = color;
        return this;
      }

      /**
       * @param {Color} color The color that will replace the target color.
       */
      desiredColor(color) {
        this.args.desiredColor = color;
        return this;
      }

      /**
       * @param {number} n A value between 0 and 100 that determines which other colors similar to the target color will be removed. The higher the value, the more colors will disappear. (Optional) 
       */
      fuzz(n) {
        this.args.fuzz = n;
        return this;
      }

      build() {
        return new Replace(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    let args = ['-alpha', 'on', '-channel', 'rgba'];

    if (this.args.fuzz)
      args.push('-fuzz', `${this.args.fuzz}%`);
    args.push('-fill', this.args.desiredColor.String(), '-opaque', this.args.targetColor.String());

    return args;
  }

  /**
   * @override
   */
  Errors() {
    let params = Replace.Parameters();
    let errors = [];
    let prefix = 'REPLACE_COLOR_MOD_ERROR';

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

    let targetColorErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Target color')
      .condition(
        new Err.ObjectCondition.Builder(this.args.targetColor)
          .typeName('Color')
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();

    if (targetColorErr)
      errors.push(targetColorErr);

    let desiredColorErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Desired color')
      .condition(
        new Err.ObjectCondition.Builder(this.args.desiredColor)
          .typeName('Color')
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();

    if (desiredColorErr)
      errors.push(desiredColorErr);

    let fuzzErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Fuzz')
      .condition(
        new Err.NumberCondition.Builder(this.args.fuzz)
          .min(params.fuzz.min)
          .max(params.fuzz.max)
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
    return true;
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
      targetColor: {
        type: 'Inputs.Color',
        required: true
      },
      desiredColor: {
        type: 'Inputs.Color',
        required: true
      },
      fuzz: {
        type: 'number',
        min: 0,
        max: 100,
        required: true
      }
    };
  }
}

//-----------------------------
// EXPORTS

exports.Replace = Replace;