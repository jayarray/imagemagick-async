let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let FxBaseClass = require(Path.join(Filepath.FxDir(), 'fxbaseclass.js')).FxBaseClass;

//---------------------------------

class Pixelate extends FxBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Pixelate';
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
       * @param {number} n 
       */
      aggressiveness(n) {
        this.args.aggressiveness = n;
        return this;
      }

      /**
       * @param {number} n 
       */
      width(n) {
        this.args.width = n;
        return this;
      }

      /**
       * @param {number} n 
       */
      height(n) {
        this.args.height = n;
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
        return new Pixelate(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    let params = Pixelate.Parameters();
    let args = ['-sample'];

    let sampleValue = null;
    if (this.args.aggressiveness > params.aggressiveness.max)
      sampleValue = 1;
    else if (this.args.aggressiveness < params.aggressiveness.min)
      sampleValue = params.aggressiveness.max;
    else
      sampleValue = (params.aggressiveness.max - this.args.aggressiveness) + 1;
    args.push(`${sampleValue}%`);

    args.push('-scale', `${this.args.width}x${this.args.height}`);

    return args;
  }

  /**
    * @override
    */
  Errors() {
    let params = Pixelate.Parameters();
    let errors = [];
    let prefix = 'PIXELATE_FX_ERROR';

    let sourceErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Source')
      .condition(
        new Err.StringCondition.Builder(this.args.source)
          .isEmpty(false)
          .isWhitespace(false)
          .build()
      )
      .build()
      .String();

    if (sourceErr)
      errors.push(sourceErr);


    let widthErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Width')
      .condition(
        new Err.NumberCondition.Builder(this.args.width)
          .isInteger(true)
          .min(params.width.min)
          .build()
      )
      .build()
      .String();

    if (widthErr)
      errors.push(widthErr);

    let heightErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Height')
      .condition(
        new Err.NumberCondition.Builder(this.args.height)
          .isInteger(true)
          .min(params.height.min)
          .build()
      )
      .build()
      .String();

    if (heightErr)
      errors.push(heightErr);


    let aggressivenessErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Aggressiveness')
      .condition(
        new Err.NumberCondition.Builder(this.args.aggressiveness)
          .isInteger(true)
          .min(params.aggressiveness.min)
          .max(params.aggressiveness.max)
          .build()
      )
      .build()
      .String();

    if (aggressivenessErr)
      errors.push(aggressivenessErr);

    return errors;
  }

  /**
   * @override
   */
  static IsConsolidatable() {
    return false;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      source: {
        type: 'string'
      },
      aggressiveness: {
        type: 'number',
        subtype: 'integer',
        min: 1,
        max: 100
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
      }
    };
  }
}

//----------------------------
// EXPORTS

exports.Pixelate = Pixelate;