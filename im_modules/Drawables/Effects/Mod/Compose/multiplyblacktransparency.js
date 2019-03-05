let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let ComposeBaseClass = require(Path.join(Filepath.ModComposeDir(), 'composebaseclass.js')).ComposeBaseClass;

//------------------------------

class MultiplyBlackTransparency extends ComposeBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'MultiplyBlackTransparency';
        this.args = {};
        this.offset = null;
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

      /**
       * @param {number} x 
       * @param {number} y 
       */
      offset(x, y) {
        this.offset = { x: x, y: y };
        return this;
      }

      build() {
        return new MultiplyBlackTransparency(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    return ['-compose', 'Screen', this.args.source1, this.args.source2, '-composite'];
  }

  /**
   * @override
   */
  Errors() {
    let params = MultiplyBlackTransparency.Parameters();
    let errors = [];
    let prefix = 'MULTIPLY_BLACK_TRANSPARENCY_COMPOSE_MOD_ERROR';

    // CONT
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

//----------------------
// EXPORTS

exports.MultiplyBlackTransparency = MultiplyBlackTransparency;