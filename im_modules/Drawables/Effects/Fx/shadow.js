let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let FxBaseClass = require(Path.join(Filepath.FxDir(), 'fxbaseclass.js')).FxBaseClass;

//---------------------------------

class Shadow extends FxBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Shadow';
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
       * @param {Color} color The color of the shadow.
       */
      color(color) {
        this.args.color = color;
        return this;
      }

      /**
       * @param {number} percentOpacity Value between 0 and 100 representing how opaque the shadow will be. 
       */
      percentOpacity(n) {
        this.args.percentOpacity = n;
        return this;
      }

      /**
       * @param {number} n Represents the 'spread' of pixels.
       */
      sigma(n) {
        this.args.sigma = n;
        return this;
      }

      build() {
        return new Shadow(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    return ['-background', this.args.color.String(), '-shadow', `${this.args.percentOpacity}x${this.args.sigma}`];
  }


  /**
    * @override
    */
  Errors() {
    let params = Shadow.Parameters();
    let errors = [];
    let prefix = 'SHADOW_FX_ERROR';

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

    let colorErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Color')
      .condition(
        new Err.ObjectCondition.Builder(this.args.color)
          .typeName('Color')
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();


    let percentOpacityErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Percent opacity')
      .condition(
        new Err.NumberCondition.Builder(this.args.percentOpacity)
          .min(params.percentOpacity.min)
          .max(params.percentOpacity.max)
          .build()
      )
      .build()
      .String();

    if (percentOpacityErr)
      errors.push(percentOpacityErr);

    let sigmaErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Sigma')
      .condition(
        new Err.NumberCondition.Builder(this.args.sigma)
          .min(params.sigma.min)
          .build()
      )
      .build()
      .String();

    if (sigmaErr)
      errors.push(sigmaErr);

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
      color: {
        type: 'Color'
      },
      percentOpacity: {
        type: 'number',
        min: 0,
        max: 100
      },
      sigma: {
        type: 'number',
        min: 0
      }
    };
  }
}

//----------------------------
// EXPORTS

exports.Shadow = Shadow;