let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let ReflectBaseClass = require(Path.join(Filepath.TransformReflectDir(), 'reflectbaseclass.js')).ReflectBaseClass;

//-----------------------------------

class Transverse extends ReflectBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Transverse';
        this.args = {};
        this.offset = null;
      }

      /**
       * @param {string} str
       */
      source(str) {
        this.args.source = str;
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
        return new Transverse(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    return ['-transverse'];
  }

  /**
   * @override
   */
  Args() {
    return ['-transpose'];
  }

  /**
   * @override
   */
  Errors() {
    let params = Transverse.Parameters();
    let errors = [];
    let prefix = 'TRANSVERSE_REFLECT_TRANSFORM_ERROR';

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

//---------------------------------
// EXPORTS

exports.Transverse = Transverse;