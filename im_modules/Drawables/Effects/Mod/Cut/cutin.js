let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let CutBaseClass = require(Path.join(Filepath.ModCutDir(), 'cutbaseclass.js')).CutBaseClass;

//------------------------------------

class CutIn extends CutBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'CutIn';
        this.args = {};
        this.offset = null;
      }

      /**
       * @param {string} str The path for the image you want to cut into. (It's like removing all the dough around the cookie cutter.)
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

      /**
       * @param {number} x 
       * @param {number} y 
       */
      offset(x, y) {
        this.offset = { x: x, y: y };
        return this;
      }

      build() {
        return new CutIn(this);
      }
    }
    return new Builder();
  }


  /**
   * @override
   */
  Args() {
    return [this.args.source1, this.args.source2, '-compose', 'Dst_In', '-composite'];
  }

  /**
   * @override
   */
  Errors() {
    let params = CutIn.Parameters();
    let errors = [];
    let prefix = 'CUT_IN_CUT_MOD_ERROR';

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
        type: 'string'
      },
      source2: {
        type: 'string'
      }
    }
  }
}

//-----------------------------
// EXPORTS

exports.CutIn = CutIn;