let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let ColorBaseClass = require(Path.join(Filepath.ModColorDir(), 'colorbaseclass.js')).ColorBaseClass;

//------------------------------

class Sepia extends ColorBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Sepia';
        this.args = {};
        this.offset = null;
      }

      /**
       * @param {string} str The path of the image file you are modifying.
       */
      source(str) {
        this.args.source = str;
        return this;
      }

      /**
       * @param {number} n The closer the value is to zero, the higher the contrast will be and the sepia color will become more golden. The higher the value, the lower the contrast will be and the sepia tone will be deeper and become more brown.
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
        return new Sepia(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    return ['-sepia-tone', `${this.args.percent}%`];
  }

  /**
   * @override
   */
  Errors() {
    let params = Sepia.Parameters();
    let errors = [];
    let prefix = 'SEPIA_COLOR_MOD_ERROR';

    // CONT
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

//-----------------------------
// EXPORTS

exports.Sepia = Sepia;