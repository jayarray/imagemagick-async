let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let FxBaseClass = require(Path.join(Filepath.FxDir(), 'fxbaseclass.js')).FxBaseClass;

//---------------------------------

class ColoringBookSketch extends FxBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'ColoringBookSketch';
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
       * @param {boolean} bool Assign as true if the image has a lot of shading. False otherwise.
       */
      isHeavilyShaded(bool) {
        this.args.isHeavilyShaded = bool;
        return this;
      }

      build() {
        return new ColoringBookSketch(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    let args = [];

    if (this.args.isHeavilyShaded)
      args.push('-segment', '1x1', '+dither', '-colors', 2);
    args.push('-edge', 1, '-negate', '-normalize', '-colorspace', 'Gray', '-blur', '0x.5', '-contrast-stretch', '0x50%');

    return args;
  }

  /**
     * @override
     */
  Errors() {
    let params = ColoringBookSketch.Parameters();
    let errors = [];
    let prefix = 'COLORING_BOOK_SKETCH_FX_ERROR';

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


    let isHeavilyShadedErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Is heavily shaded flag')
      .condition(
        new Err.BooleanCondition.Builder(this.args.isHeavilyShaded)
          .build()
      )
      .build()
      .String();

    if (isHeavilyShadedErr)
      errors.push(isHeavilyShadedErr);

    return errors;
  }

  /**
   * @override
   */
  IsConsolidatable() {
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
      isHeavilyShaded: {
        type: 'boolean',
        default: false
      }
    };
  }
}

//--------------------------------
// EXPORTS

exports.ColoringBookSketch = ColoringBookSketch;