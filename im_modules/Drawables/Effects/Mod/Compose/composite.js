let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let GravityValues = require(Path.join(Filepath.ConstantsDir(), 'gravity.json')).values;
let ComposeBaseClass = require(Path.join(Filepath.ModComposeDir(), 'composebaseclass.js')).ComposeBaseClass;


//------------------------------

class Composite extends ComposeBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Composite';
        this.args = {};
      }

      /**
       * @param {Array<string>} strArr List of paths. The first path is the bottom-most layer, and the last path is the top-most layer.
       */
      filepaths(strArr) {
        this.args.filepaths = strArr;
        return this;
      }

      /**
       * @param {string} str Method of how all images will overlap.
       */
      gravity(str) {
        this.args.gravity = str;
        return this;
      }
      
      build() {
        return new Composite(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    let args = [];

    if (this.args.gravity)
      args.push('-gravity', this.args.gravity);

    // Add first 2 paths
    args.push(this.args.filepaths[0], this.args.filepaths[1]);

    // Add other parts accordingly
    for (let i = 2; i < this.args.filepaths.length; ++i) {
      args.push('-composite', this.args.filepaths[i]);
    }

    args.push('-composite');

    return args;
  }

  /**
   * @override
   */
  Errors() {
    let params = Composite.Parameters();
    let errors = [];
    let prefix = 'COMPOSITE_COMPOSE_MOD_ERROR';

    let filepathsErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Source')
      .condition(
        new Err.ArrayCondition.Builder(this.args.filepaths)
          .minLength(params.filepaths.min)
          .build()
      )
      .build()
      .String();

    if (filepathsErr)
      errors.push(filepathsErr);

    for (let i = 0; i < this.args.filepaths.length; ++i) {
      let currFilepath = this.args.filepaths[i];

      let err = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Filepath')
        .condition(
          new Err.StringCondition.Builer(currFilepath)
            .isEmpty(false)
            .isWhitespace(false)
            .build()
        )
        .build()
        .String();

      if (err) {
        errors.push(`${prefix}: Filepaths contains an invalid string.`);
        break;
      }
    }

    let gravityErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Gravity')
      .condition(
        new Err.StringCondition.Builder(this.args.gravity)
          .isEmpty(false)
          .isWhitespace(false)
          .include(params.gravity.options)
          .build()
      )
      .build()
      .String();

    if (gravityErr)
      errors.push(gravityErr);

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      filepaths: {
        type: 'string',
        isArray: true,
        min: 2
      },
      gravity: {
        type: 'string',
        options: GravityValues
      }
    };
  }
}

//--------------------------
// EXPORTS

exports.Composite = Composite;