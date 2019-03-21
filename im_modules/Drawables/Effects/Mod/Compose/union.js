let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let ComposeBaseClass = require(Path.join(Filepath.ModComposeDir(), 'composebaseclass.js')).ComposeBaseClass;

//------------------------------

class Union extends ComposeBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Union';
        this.args = {};
      }

      /**
       * @param {string} str
       */
      source1(str) {
        this.args.source1 = str;
        return this;
      }

      /**
       * @param {string} str
       */
      source2(str) {
        this.args.source2 = str;
        return this;
      }

      build() {
        return new Union(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    return [this.args.source1, this.args.source2, '-compose', 'Lighten', '-composite'];
  }

  /**
   * @override
   */
  Errors() {
    let params = Union.Parameters();
    let errors = [];
    let prefix = 'UNION_COMPOSE_MOD_ERROR';

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
      },
    };
  }
}

//-----------------------
// EXPORTS

exports.Union = Union;