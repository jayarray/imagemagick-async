let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let ComposeBaseClass = require(Path.join(Filepath.ModComposeDir(), 'composebaseclass.js')).ComposeBaseClass;

//------------------------------

class Append extends ComposeBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Append';
        this.args = {};
      }

      /**
       * @param {Array<string>} strArr List of filepaths you want to stitch together.
       */
      filepaths(strArr) {
        this.args.filepaths = strArr;
        return this;
      }

      /**
       * Set this to true if you want to stack images top-to-bottom. Set to false if you want to stack images left-to-right.
       */
      isVertical(bool) {
        this.args.isVertical = bool;
        return this;
      }

      build() {
        return new Append(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    let appendStr = this.args.isVertical ? '-append' : '+append';
    let filepaths = this.args.filepaths;
    let args = [appendStr].concat(filepaths);
    return args;
  }

  /**
   * @override
   */
  Errors() {
    let params = Append.Parameters();
    let errors = [];
    let prefix = 'APPEND_COMPOSE_MOD_ERROR';

    let filepathsErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Filepaths')
      .condition(
        new Err.ArrayCondition.Builder(this.args.filepaths)
          .minLength(params.filepaths.min)
          .build()
      )
      .build()
      .String();

    if (filepathsErr)
      errors.push(filepathsErr);


    let isVerticalErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('IS vertical flag')
      .condition(
        new Err.BooleanCondition.Builder(this.args.isVertical)
          .build()
      )
      .build()
      .String();

    if (isVerticalErr)
      errors.push(isVerticalErr);

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
        min: 2,
        required: true
      },
      isVertical: {
        type: 'boolean',
        default: false,
        required: true
      },
    };
  }
}

//-------------------------
// EXPORTS

exports.Append = Append;