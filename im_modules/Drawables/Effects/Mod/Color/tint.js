let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let ColorBaseClass = require(Path.join(Filepath.ModColorDir(), 'colorbaseclass.js')).ColorBaseClass;

//------------------------------

class Tint extends ColorBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Tint';
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
       * @param {Color} color The desired tint color. Adds tint of color to mid-range colors. Pure colors such as black, red, yellow, white will not be affected.
       */
      color(color) {
        this.args.color = color;
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
        return new Tint(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    return ['-fill', this.args.color.String(), '-tint', `${this.args.percent}%`];
  }

  /**
   * @override
   */
  Errors() {
    let params = Tint.Parameters();
    let errors = [];
    let prefix = 'TINT_COLOR_MOD_ERROR';

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
      color: {
        type: 'Color'
      },
      percent: {
        type: 'number',
        min: 0,
        max: 100
      }
    };
  }
}

//---------------------------
// EXPORTS

exports.Tint = Tint;