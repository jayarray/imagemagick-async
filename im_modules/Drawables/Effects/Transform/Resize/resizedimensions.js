let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let ResizeBaseClass = require(Path.join(Filepath.TransformResizeDir(), 'resizebaseclass.js')).ResizeBaseClass;

//-----------------------------------

class ResizeDimensions extends ResizeBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'ResizeDimensions';
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
      width(n) {
        this.args.width = n;
        return this;
      }

      /**
       * @param {number} n
       */
      height(n) {
        this.args.height = n;
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
        return new ResizeDimensions(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    return ['-resize', `${this.args.width}x${this.args.height}!`];
  }

  /**
   * @override
   */
  Errors() {
    let params = Crop.Parameters();
    let errors = [];
    let prefix = 'CROP_RESIZE_MOD_ERROR';

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
      width: {
        type: 'number',
        subtype: 'integer',
        min: 1
      },
      height: {
        type: 'number',
        subtype: 'integer',
        min: 1
      },
      corner: {
        type: 'Coordinates'
      },
      removeVirtualCanvas: {
        type: 'boolean'
      }
    };
  }
}

//---------------------------
// EXPORTS

exports.ResizeDimensions = ResizeDimensions;