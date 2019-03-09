let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let ComposeBaseClass = require(Path.join(Filepath.ModComposeDir(), 'composebaseclass.js')).ComposeBaseClass;

//------------------------------

class Add extends ComposeBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Add';
        this.args = {};
      }

      /**
       * @param {string} str The first path of the image file you are adding.
       */
      source1(str) {
        this.args.source1 = str;
        return this;
      }

      /**
       * @param {string} str The second path of the other image file you are adding.
       */
      source2(str) {
        this.args.source2 = str;
        return this;
      }

      build() {
        return new Add(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    return ['-compose', 'plus', this.args.source1, this.args.source2, '-composite'];
  }

  /**
   * @override
   */
  Errors() {
    let params = Add.Parameters();
    let errors = [];
    let prefix = 'ADD_COMPOSE_MOD_ERROR';

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
      },
    };
  }
}

//--------------------------
// EXPORTS

exports.Add = Add;