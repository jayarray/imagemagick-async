let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let ComposeBaseClass = require(Path.join(Filepath.ModComposeDir(), 'composebaseclass.js')).ComposeBaseClass;

//------------------------------

class Difference extends ComposeBaseClass {
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
      }

      /**
       * @param {string} str The first path of the image file you are diffing.
       */
      source1(str) {
        this.args.source1 = str;
        return this;
      }

      /**
       * @param {string} str The second path of the other image file you are diffing.
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
        return new Difference(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    return [this.args.source1, this.args.source2, '-compose', 'Difference', '-composite'];
  }

  /**
   * @override
   */
  Errors() {
    let params = Difference.Parameters();
    let errors = [];
    let prefix = 'DIFFERENCE_COMPOSE_MOD_ERROR';

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

exports.Create = Difference.Create;
exports.Name = 'Difference';
exports.Layer = true;
exports.Consolidate = false;
exports.Dependencies = null;
exports.ComponentType = 'drawable';