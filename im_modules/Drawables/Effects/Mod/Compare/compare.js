let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let CompareBaseClass = require(Path.join(Filepath.ModCompareDir(), 'comparebaseclass.js')).CompareBaseClass;

//------------------------------------

class Compare extends CompareBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Compare';
        this.args = {};
        this.offset = null;
        this.command = 'compare';
      }

      /**
       * @param {string} str The path of the image file used as a base for comparison.
       */
      source1(str) {
        this.args.source1 = str;
        return this;
      }

      /**
       * @param {string} str The path of the image file being compared to source1.
       */
      source2(str) {
        this.args.source2 = str;
        return this;
      }

      /**
       * @param {Color} color This color shows the differences between the two images.
       */
      highlightColor(color) {
        this.args.highlightColor = color;
        return this;
      }

      /**
       * @param {Color} color This color serves as a background for the highlight color. Omitting it results in the image from source1 being displayed in the background. (Optional)
       */
      lowlightColor(color) {
        this.args.highlightColor = color;
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
        return new Compare(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    let args = [this.args.source1, this.args.source2, '-metric', 'AE', '-fuzz', '5%', '-highlight-color', this.args.highlightColor.String()];

    if (this.args.lowlightColor)
      args.push('-lowlight-color', this.args.lowlightColor.String());

    return args;
  }

  /**
   * @override
   */
  Errors() {
    let params = Compare.Parameters();
    let errors = [];
    let prefix = 'COMPARE_COMPARE_MOD_ERROR';

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
      highlightColor: {
        type: 'Color'
      },
      lowlightColor: {
        type: 'Color'
      }
    };
  }
}

//------------------------------
// EXPORTS

exports.Compare = Compare;