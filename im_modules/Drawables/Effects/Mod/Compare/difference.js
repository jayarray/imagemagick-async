let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let CompareBaseClass = require(Path.join(Filepath.ModCompareDir(), 'comparebaseclass.js')).CompareBaseClass;

//------------------------------------

class Difference extends CompareBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Difference';
        this.args = {};
        this.offset = null;
        this.command = 'composite';
      }

      /**
       * @param {string} str The path of the image file used as a base for comparison.
       */
      source1(str) {
        this.args.source1 = str;
        return this;
      }

      /**
       * @param {string} str The path of the image file being compared to source1.
       */
      source2(str) {
        this.args.source2 = str;
        return this;
      }

      build() {
        return new Difference(this);
      }
    }
    return new Builder();
  }


  /**
   * @verride
   */
  Args() {
    return [this.args.source1, this.args.source2, '-compose', 'difference'];
  }

  /**
   * @override
   */
  Errors() {
    let params = Difference.Parameters();
    let errors = [];
    let prefix = 'DIFFERENCE_COMPARE_MOD_ERROR';

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
    };
  }
}

//------------------------
// EXPORTS

exports.Difference = Difference;