let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let FxBaseClass = require(Path.join(Filepath.FxDir(), 'fxbaseclass.js')).FxBaseClass;

//---------------------------------

class Blur extends FxBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Blur';
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
       * @param {number} n Controls how big an area the operator should look at when spreading pixels. Minimum value is 0 or at least double that of sigma.
       */
      radius(n) {
        this.args.radius = n;
        return this;
      }

      /**
       * @param {number} n A floating point value used as an approximation of how much you want the image to spread/blur in pixels. (Think of it as the size of the brush used to blur the image.) Minimum value is 0.
       */
      sigma(n) {
        this.args.sigma = n;
        return this;
      }

      /**
       * @param {boolean} bool Assign as true if the image contains transparent pixels. False otherwise.
       */
      hasTransparency(bool) {
        this.args.hasTransparency = bool;
        return this;
      }

      build() {
        return new Blur(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    let args = [];

    if (this.args.hasTransparency)
      args.push('-channel', 'RGBA');
    args.push('-blur', `${this.args.radius}x${this.args.sigma}`);

    return args;
  }

  /**
   * @override
   */
  Errors() {
    let params = Blur.Parameters();
    let errors = [];
    let prefix = 'BLUR_FX_ERROR';

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


    let radiusErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Radius')
      .condition(
        new Err.NumberCondition.Builder(this.args.radius)
          .isInteger(true)
          .min(params.radius.min)
          .build()
      )
      .build()
      .String();

    if (radiusErr)
      errors.push(radiusErr);

    let sigmaErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Sigma')
      .condition(
        new Err.NumberCondition.Builder(this.args.sigma)
          .isInteger(true)
          .min(params.sigma.min)
          .build()
      )
      .build()
      .String();

    if (sigmaErr)
      errors.push(sigmaErr);

    let hasTransparencyErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Has transparency flag')
      .condition(
        new Err.BooleanCondition.Builder(this.args.hasTransparency)
          .build()
      )
      .build()
      .String();

    if (hasTransparencyErr)
      errors.push(hasTransparencyErr);

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
      radius: {
        type: 'number',
        subtype: 'integer',
        min: 0,
        required: true
      },
      sigma: {
        type: 'number',
        subtype: 'integer',
        min: 0,
        required: true
      },
      hasTransparency: {
        type: 'boolean',
        default: false,
        required: true
      }
    };
  }
}

//----------------------------
// EXPORTS

exports.Blur = Blur;