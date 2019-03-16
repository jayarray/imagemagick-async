let Path = require('path');
let ProjectDir = Path.resolve('.');

let PathParts = ProjectDir.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let FxBaseClass = require(Path.join(Filepath.FxDir(), 'fxbaseclass.js')).FxBaseClass;

//---------------------------------

class Implode extends FxBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Implode';
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
       * @param {number} n Implosions have values between 0 and 1 (and anything greater than 1 sucks pixels into oblivion). Explosions have values between 0 and -1 (and anything less than -1 distorts pixels outward).  
       */
      factor(n) {
        this.args.factor = n;
        return this;
      }

      build() {
        return new Implode(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    return ['-implode', this.args.factor];
  }

  /**
     * @override
     */
  Errors() {
    let params = Implode.Parameters();
    let errors = [];
    let prefix = 'IMPLODE_FX_ERROR';

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

    let factorErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Factor')
      .condition(
        new Err.NumberCondition.Builder(this.args.factor)
          .min(params.factor.min)
          .max(params.factor.max)
          .build()
      )
      .build()
      .String();

    if (factorErr)
      errors.push(factorErr);

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
      factor: {
        type: 'number',
        min: -1,
        max: 1
      }
    };
  }
}

//---------------------------
// EXPORTS

exports.Implode = Implode;