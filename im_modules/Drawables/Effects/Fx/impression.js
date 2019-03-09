let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let FxBaseClass = require(Path.join(Filepath.FxDir(), 'fxbaseclass.js')).FxBaseClass;

//---------------------------------

class Impression extends FxBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Impression';
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
       * @param {number} n Value determines the direction of the light source. A value of zero degrees starts east of the screen. A positive value indicates clockwise direction and a negative value indicates counter clockwisem direction.
       */
      direction(n) {
        this.args.direction = n;
        return this;
      }

      /**
       * @param {number} n Value determines the elevation of the light source. A Value of zero degrees indicates the light source is parallel to the image, and a value of 90 degrees indicates the light source is right above the image.
       */
      elevation(n) {
        this.args.elevation = n;
        return this;
      }

      build() {
        return new Impression(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    return ['-shade', `${this.args.direction}x${this.args.elevation}`];
  }

  /**
      * @override
      */
  Errors() {
    let params = Impression.Parameters();
    let errors = [];
    let prefix = 'IMPRESSION_FX_ERROR';

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

    let directionErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Direction')
      .condition(
        new Err.NumberCondition.Builder(this.args.direction)
          .build()
      )
      .build()
      .String();

    if (directionErr)
      errors.push(directionErr);


    let elevationErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Elevation')
      .condition(
        new Err.NumberCondition.Builder(this.args.elevation)
          .build()
      )
      .build()
      .String();

    if (elevationErr)
      errors.push(elevationErr);

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
      direction: {
        type: 'number',
      },
      elevation: {
        type: 'number',
      }
    };
  }
}

//----------------------------
// EXPORTS

exports.Impression = Impression;