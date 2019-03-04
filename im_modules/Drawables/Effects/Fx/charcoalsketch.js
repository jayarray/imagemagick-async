let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let FxBaseClass = require(Path.join(Filepath.FxDir(), 'fxbaseclass.js')).FxBaseClass;

//---------------------------------

class CharcoalSketch extends FxBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'CharcoalSketch';
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
       * @param {number} n An integer value greater than 0 that determines the intensity of the filter. Higher values will make it look more smudged and more like a charcoal sketch.
       */
      charcoalValue(n) {
        this.args.charcoalValue = n;
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
        return new CharcoalSketch(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    return ['-charcoal', this.args.charcoalValue];
  }

  /**
     * @override
     */
  Errors() {
    let params = CharcoalSketch.Parameters();
    let errors = [];
    let prefix = 'CHARCOAL_SKETCH_FX_ERROR';

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

    let charcoalValueErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Charcoal value')
      .condition(
        new Err.NumberCondition.Builder(this.args.charcoalValue)
          .isInteger(true)
          .min(params.charcoalValue.min)
          .build()
      )
      .build()
      .String();

    if (charcoalValueErr)
      errors.push(charcoalValueErr);

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
      radius: {
        type: 'number',
        subtype: 'integer',
        min: 0
      },
      charcoalValue: {
        type: 'number',
        subtype: 'integer',
        min: 1
      }
    };
  }
}

//---------------------------
// EXPORTS

exports.CharcoalSketch = CharcoalSketch;