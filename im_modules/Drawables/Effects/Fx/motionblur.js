let Path = require('path');
let ProjectDir = Path.resolve('.');

let PathParts = ProjectDir.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let FxBaseClass = require(Path.join(Filepath.FxDir(), 'fxbaseclass.js')).FxBaseClass;

//---------------------------------

class MotionBlur extends FxBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'MotionBlur';
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
       * @param {number} n How big of an area the operator should look at when spreading pixels.
       */
      radius(n) {
        this.args.radius = n;
        return this;
      }

      /**
       * @param {number} n The amount of 'spread' (or blur) in pixels.
       */
      sigma(n) {
        this.args.sigma = n;
        return this;
      }

      /**
       * @param {number} n The angle in which the blur should occur.
       */
      angle(n) {
        this.args.angle = n;
        return this;
      }

      build() {
        return new MotionBlur(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    return ['-channel', 'RGBA', '-motion-blur', `${this.args.radius}x${this.args.sigma}+${this.args.angle}`];
  }

  /**
  * @override
  */
  Errors() {
    let params = MotionBlur.Parameters();
    let errors = [];
    let prefix = 'MOTION_BLUR_FX_ERROR';

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


    let angleErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Angle')
      .condition(
        new Err.NumberCondition.Builder(this.args.angle)
          .build()
      )
      .build()
      .String();

    if (angleErr)
      errors.push(angleErr);

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
      radius: {
        type: 'number',
        subtype: 'integer',
        min: 0
      },
      sigma: {
        type: 'number',
        subtype: 'integer',
        min: 0
      },
      angle: {
        type: 'number'
      }
    };
  }
}

//----------------------------
// EXPORTS

exports.MotionBlur = MotionBlur;