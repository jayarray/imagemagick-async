let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let ReflectBaseClass = require(Path.join(Filepath.TransformReflectDir(), 'reflectbaseclass.js')).ReflectBaseClass;

//-----------------------------------

class Flop extends ReflectBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Flop';
        this.args = {};
      }

      /**
       * @param {string} str
       */
      source(str) {
        this.args.source = str;
        return this;
      }

      build() {
        return new Flop(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    return ['-flop'];
  }

  /**
   * @override
   */
  Errors() {
    let params = Flop.Parameters();
    let errors = [];
    let prefix = 'FLOP_REFLECT_TRANSFORM_ERROR';

    let sourceErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Source')
      .condition(
        new Err.StringCondition.Builder(this.args.source)
          .isempty(false)
          .isWhitespace(false)
          .build()
      )
      .build()
      .String();

    if (sourceErr)
      errors.push(sourceErr);

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      source: {
        type: 'string'
      }
    };
  }
}

//-------------------------------
// EXPORTS

exports.Flop = Flop;