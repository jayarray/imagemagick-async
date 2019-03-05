let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let MaskBaseClass = require(Path.join(Filepath.ModMasksDir(), 'maskbaseclass.js')).MaskBaseClass;

//------------------------------

class ColorMask extends MaskBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'ColorMask';
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
       * @param {Color} color
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
        return new ColorMask(this);
      }
    }
    return new Builder();
  }


  /**
   * @override
   */
  Args() {
    return ['-alpha', 'extract', '-background', this.args.color.String(), '-alpha', 'shape'];
  }

  /**
   * @override
   */
  Errors() {
    let params = ColorMask.Parameters();
    let errors = [];
    let prefix = 'COLOR_MASK_MASK_MOD_ERROR';

    // CONT
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
      }
    }
  }
}

//----------------------
// EXPORTS

exports.ColorMask = ColorMask;