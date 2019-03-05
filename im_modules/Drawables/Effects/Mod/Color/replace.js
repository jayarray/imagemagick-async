let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let ColorBaseClass = require(Path.join(Filepath.ModColorDir(), 'colorbaseclass.js')).ColorBaseClass;

//------------------------------

class Replace extends ColorBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Replace';
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
       * @param {Color} color The color you want to change.
       */
      targetColor(color) {
        this.args.targetColor = color;
        return this;
      }

      /**
       * @param {Color} color The color that will replace the target color.
       */
      desiredColor(color) {
        this.args.desiredColor = color;
        return this;
      }

      /**
       * @param {number} n A value between 0 and 100 that determines which other colors similar to the target color will be removed. The higher the value, the more colors will disappear. (Optional) 
       */
      fuzz(n) {
        this.args.fuzz = n;
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
        return new Replace(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    let args = ['-alpha', 'on', '-channel', 'rgba'];

    if (this.args.fuzz)
      args.push('-fuzz', `${this.args.fuzz}%`);
    args.push('-fill', this.args.desiredColor.String(), '-opaque', this.args.targetColor.String());

    return args;
  }

  /**
   * @override
   */
  Errors() {
    let params = Replace.Parameters();
    let errors = [];
    let prefix = 'REPLACE_COLOR_MOD_ERROR';

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
      targetColor: {
        type: 'Color'
      },
      desiredColor: {
        type: 'Color'
      },
      fuzz: {
        type: 'number',
        min: 0,
        max: 100
      }
    };
  }
}

//-----------------------------
// EXPORTS

exports.Replace = Replace;