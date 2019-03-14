let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let FxBaseClass = require(Path.join(Filepath.FxDir(), 'fxbaseclass.js')).FxBaseClass;

//---------------------------------

class Swirl extends FxBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Swirl';
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
       * @param {number} n Number of degrees to swirl. Positive values mean clockwise swirl. Negative values mean counter-clockwise swirl.
       */
      degrees(n) {
        this.args.degrees = n;
        return this;
      }
      
      build() {
        return new Swirl(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    return ['-swirl', this.args.degrees];
  }

  /**
    * @override
    */
  Errors() {
    let params = Swirl.Parameters();
    let errors = [];
    let prefix = 'SWIRL_FX_ERROR';

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
  IsConsolidatable() {
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

//-----------------------
// EXPORTs

exports.Swirl = Swirl;