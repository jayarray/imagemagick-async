let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let ResizeBaseClass = require(Path.join(Filepath.TransformResizeDir(), 'resizebaseclass.js')).ResizeBaseClass;

//-----------------------------------

class ResizePercentage extends ResizeBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'ResizePercentage';
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
       * @param {number} n
       */
      percent(n) {
        this.args.percent = n;
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
        return new ResizePercentage(this);
      }
    }
    return new Builder();
  }


  /**
   * @override
   */
  Args() {
    return ['-resize', `${this.args.percent}%`];
  }

  /**
   * @override
   */
  Errors() {
    let params = ResizePercentage.Parameters();
    let errors = [];
    let prefix = 'RESIZE_PERCENTAGE_RESIZE_MOD_ERROR';

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
  static IsConsolidatable() {
    return true;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      source: {
        type: 'string'
      },
      percent: {
        type: 'number',
        min: 0
      }
    };
  }
}

//----------------------------
// EXPORTS

exports.ResizePercentage = ResizePercentage;