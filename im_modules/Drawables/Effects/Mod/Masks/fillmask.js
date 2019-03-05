let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let MaskBaseClass = require(Path.join(Filepath.ModMasksDir(), 'maskbaseclass.js')).MaskBaseClass;

//------------------------------

class FillMask extends MaskBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'FillMask';
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
       * @param {Color} color Color that will replace black part of mask.
       */
      blackReplacement(color) {
        this.args.blackReplacement = color;
        return this;
      }

      /**
       * @param {Color} color Color that will replace white part of mask.
       */
      whiteReplacement(color) {
        this.args.whiteReplacement = color;
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
        return new FillMask(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    return ['-alpha', 'extract', '-background', this.args.whiteReplacement.String(), '-alpha', 'shape', '-background', this.args.blackReplacement.String(), '-alpha', 'remove'];
  }

  /**
   * @override
   */
  Errors() {
    let params = FillMask.Parameters();
    let errors = [];
    let prefix = 'FILL_MASK_MASK_MOD_ERROR';

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
      blackReplacement: {
        type: 'Color'
      },
      whiteReplacement: {
        type: 'Color'
      }
    }
  }
}

//--------------------------
// EXPORTS

exports.FillMask = FillMask;