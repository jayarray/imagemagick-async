let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let FxBaseClass = require(Path.join(Filepath.FxDir(), 'fxbaseclass.js')).FxBaseClass;

//---------------------------------

class RadialBlur extends FxBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'RadialBlur';
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
      degrees(n) {
        this.args.degrees = n;
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
        return new RadialBlur(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    return ['-channel', 'RGBA', '-radial-blur', this.args.degrees];
  }

  /**
    * @override
    */
  Errors() {
    let params = RadialBlur.Parameters();
    let errors = [];
    let prefix = 'RADIAL_BLUR_FX_ERROR';

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


    let degreesErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Degrees')
      .condition(
        new Err.NumberCondition.Builder(this.args.degrees)
          .build()
      )
      .build()
      .String();

    if (degreesErr)
      errors.push(degreesErr);

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
      degrees: {
        type: 'number'
      }
    };
  }
}

//----------------------------
// EXPORTS

exports.RadialBlur = RadialBlur;