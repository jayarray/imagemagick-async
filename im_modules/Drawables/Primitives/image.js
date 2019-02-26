let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let Validate = require(Path.join(RootDir, 'validate.js'));
let PrimitivesBaseClass = require(Path.join(Filepath.PrimitivesDir(), 'primitivesbaseclass.js')).PrimitivesBaseClass;

//----------------------------------

class Image extends PrimitivesBaseClass {
  constructor(properties) {
    super(properties);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Image';
        this.args = {};
      }

      /**
       * @param {string} str Source path
       */
      source(str) {
        this.args.source = str;
        return this;
      }

      /**
       * @param {Coordinates} coordinates The top-left corner from which the image will render.
       */
      corner(coordinates) {
        this.args.corner = coordinates;
        return this;
      }

      /**
       * @param {number} n Desired width (if different from current width). Leave undefined if you want preserve the original width and height. (Optional)
       */
      width(n) {
        this.args.width = n;
        return this;
      }

      /**
       * @param {number} n Desired height (if different from current height). Leave undefined if you want preserve the original width and height. (Optional)
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
        return new Image(this);
      }
    }
    return Builder;
  }

  /** 
   * @override
  */
  Args() {
    let width = 0;  // Default value that preserves original dimensions.
    let height = 0; // Default value that preserves original dimensions.

    if (Validate.IsDefined(this.args.width) && Validate.IsDefined(this.args.height)) {
      width = this.args.width;
      height = this.args.height;
    }

    return ['-draw', `image over ${this.corner.String()} ${width},${height} ${this.args.source}`];
  }

  /**
   * @override
   */
  Errors() {
    let params = Image.Parameters();
    let errors = [];
    let prefix = 'IMAGE_PRIMITIVE_ERROR';

    // Check required args

    let sourceErr = new Err.ErrorMessage.Builder()
      .prefix(prefix)
      .varName('Source')
      .condition(
        new Err.StringCondition.Builder(this.args.source)
          .isEmpty(false)
          .isWhitespace(false)
          .build()
      )
      .build()
      .String();

    if (sourceErr)
      errors.push(sourceErr);

    let cornerErr = new Err.ErrorMessage.Builder()
      .prefix(prefix)
      .varName('Corner')
      .condition(
        new Err.ObjectCondition.Builder(this.args.corner)
          .typeName('Coordinates')
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();

    if (cornerErr)
      errors.push(cornerErr);

    // Check optional args

    if (Validate.IsDefined(this.args.width) && Validate.IsDefined(this.args.height)) {
      let widthErr = new Err.ErrorMessage.Builder()
        .prefix(prefix)
        .varName('Width')
        .condition(
          new Err.NumberCondition.Builder(this.args.width)
            .isInteger(true)
            .min(params.width.min)
            .build()
        )
        .build()
        .String();

      if (widthErr)
        errors.push(widthErr);

      let heightErr = new Err.ErrorMessage.Builder()
        .prefix(prefix)
        .varName('Height')
        .condition(
          new Err.NumberCondition.Builder(this.args.height)
            .isInteger(true)
            .min(params.height.min)
            .build()
        )
        .build()
        .String();

      if (heightErr)
        errors.push(heightErr);
    }

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      src: {
        type: 'string'
      },
      corner: {
        type: 'Coordinates'
      },
      width: {
        type: 'number',
        subtype: 'integer',
        min: 1,
        default: 0
      },
      height: {
        type: 'number',
        subtype: 'integer',
        min: 1,
        default: 0
      }
    };
  }
}

//-----------------------------------
// EXPORTS

exports.Image = Image;