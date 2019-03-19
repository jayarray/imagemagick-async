let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let FxBaseClass = require(Path.join(Filepath.FxDir(), 'fxbaseclass.js')).FxBaseClass;

//---------------------------------

class OilPainting extends FxBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'OilPainting';
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
       * @param {number} n An integer value greater than 0 that determines the intensity of the filter. Higher values will make it look more abstract and more like a painting.
       */
      paintValue(n) {
        this.args.paintValue = n;
        return this;
      }

      build() {
        return new OilPainting(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    return ['-paint', this.args.paintValue];
  }

  /**
  * @override
  */
  Errors() {
    let params = OilPainting.Parameters();
    let errors = [];
    let prefix = 'OIL_PAINTING_FX_ERROR';

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

    let paintValueErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Paint value')
      .condition(
        new Err.NumberCondition.Builder(this.args.paintValue)
          .isInteger(true)
          .min(params.paintValue.min)
          .build()
      )
      .build()
      .String();

    if (paintValueErr)
      errors.push(paintValueErr);

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
      paintValue: {
        type: 'number',
        subtype: 'integer',
        min: 1
      }
    };
  }
}

//--------------------------
// EXPORTs

exports.OilPainting = OilPainting;