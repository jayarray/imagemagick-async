let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let ComposeBaseClass = require(Path.join(Filepath.ModComposeDir(), 'composebaseclass.js')).ComposeBaseClass;

//------------------------------

class Exclusion extends ComposeBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Exclusion';
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
        return new Exclusion(this);
      }
    }
    return new Builder();
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return [this.args.source1, this.args.source2, '-compose', 'Minus_Src', '-composite'];
  }

  /**
   * @override
   */
  Errors() {
    let params = Exclusion.Parameters();
    let errors = [];
    let prefix = 'EXCLUSION_COMPOSE_MOD_ERROR';

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

//-------------------------
// EXPORTS

exports.Exclusion = Exclusion;