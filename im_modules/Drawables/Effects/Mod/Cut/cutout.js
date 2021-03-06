let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let CutBaseClass = require(Path.join(Filepath.ModCutDir(), 'cutbaseclass.js')).CutBaseClass;

//------------------------------------

class CutOut extends CutBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'CutOut';
        this.args = {};
      }

      /**
       * @param {string} str The path for the image you want to cut out of. (It's like removing dough with a cookie cutter.)
       */
      source1(str) {
        this.args.source1 = str;
        return this;
      }

      /**
       * @param {string} str The path for the image you want to use as a mask.
       */
      source2(str) {
        this.args.source2 = str;
        return this;
      }

      build() {
        return new CutOut(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    return [this.args.source1, this.args.source2, '-compose', 'Dst_Out', '-composite'];
  }

  /**
   * @override
   */
  Errors() {
    let params = CutOut.Parameters();
    let errors = [];
    let prefix = 'CUT_OUT_CUT_MOD_ERROR';

    let source1Err = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Source 1')
      .condition(
        new Err.StringCondition.Builder(this.args.source1)
          .isempty(false)
          .isWhitespace(false)
          .build()
      )
      .build()
      .String();

    if (source1Err)
      errors.push(source1Err);

    let source2Err = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Source 2')
      .condition(
        new Err.StringCondition.Builder(this.args.source2)
          .isempty(false)
          .isWhitespace(false)
          .build()
      )
      .build()
      .String();

    if (source2Err)
      errors.push(source2Err);

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      source1: {
        type: 'string',
        required: true
      },
      source2: {
        type: 'string',
        required: true
      }
    }
  }
}

//-------------------------
// EXPORTS

exports.CutOut = CutOut;