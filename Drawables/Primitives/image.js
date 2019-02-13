let Path = require('path');
let Validate = require('./validate.js');
let Filepath = require('./filepath.js').Filepath;
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
       * @param {string} src Source path
       */
      src(src) {
        this.args.src = src;
        return this;
      }

      /**
       * @param {Coordinates} corner The top-left corner from which the image will render.
       */
      corner(corner) {
        this.args.corner = corner;
        return this;
      }

      /**
       * @param {number} width Desired width (if different from current width). Leave undefined if you want preserve the original width and height. (Optional)
       */
      width(width) {
        this.args.width = width;
        return this;
      }

      /**
       * @param {number} height Desired height (if different from current height). Leave undefined if you want preserve the original width and height. (Optional)
       */
      height(height) {
        this.args.height = height;
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
    let params = Image.Parameters();
    let width = params.height.default;
    let height = params.height.default;

    let widthIsValid = Validate.IsDefined(this.args.width) && Validate.IsInteger(this.args.width) && this.args.width >= params.width.min;
    let heightIsValid = Validate.IsDefined(this.args.height) && Validate.IsInteger(this.ars.height) && this.args.height >= params.height.min;

    if (widthIsValid && heightIsValid) {
      width = this.args.width;
      height = this.args.height;
    }

    return ['-draw', `image over ${this.corner.String()} ${width},${height} ${this.args.src}`];
  }

  /**
   * @override
   */
  Errors() {
    let params = Image.Parameters();
    let errors = [];

    // Check required args

    if (!Validate.IsDefined(this.args.src))
      errors.push('IMAGE_PRIMITIVE_ERROR: Source is undefined.');
    else {
      if (!Validate.IsString(this.args.src))
        errors.push('IMAGE_PRIMITIVE_ERROR: Source is not a string.');
      else {
        if (Validate.IsEmptyString(this.args.src))
          errors.push('IMAGE_PRIMITIVE_ERROR: Source is empty string.');
        else if (Validate.IsWhitespace(this.args.src))
          errors.push('IMAGE_PRIMITIVE_ERROR: Source is whitespace.');
      }
    }

    if (!Validate.IsDefined(this.corner))
      errors.push('IMAGE_PRIMITIVE_ERROR: Corner is undefined.');
    else {
      if (this.args.corner.type == 'Coordinates')
        errors.push('IMAGE_PRIMITIVE_ERROR: Corner is not a Coordinates object.');
      else {
        let errs = this.args.corner.Errors();
        if (errs.length > 0)
          errors.push(`IMAGE_PRIMITIVE_ERROR: Corner has errors: ${errs.join(' ')}`);
      }
    }

    // Check optional args

    let widthErrors = [];
    let heightErrors = [];

    let widthIsDefined = Validate.IsDefined(this.args.width);
    let heightIsDefined = Validate.IsDefined(this.args.height);

    if (widthIsDefined && heightIsDefined) {
      let widthIsInteger = Validate.IsInteger(this.args.width);
      let heightIsInteger = Validate.IsInteger(this.args.height);

      if (widthIsInteger && heightIsInteger) {
        if (this.args.width < params.width.min)
          widthErrors.push(`IMAGE_PRIMITIVE_ERROR: Width is out of bounds. Assigned value is ${this.args.width}. Value must be greater than or equal to ${params.width.min}.`);

        if (this.args.height < params.height.min)
          heightErrors.push(`IMAGE_PRIMITIVE_ERROR: Height is out of bounds. Assigned value is ${this.args.height}. Value must be greater than or equal to ${params.height.min}.`);
      }
      else {
        if (!widthIsInteger)
          widthErrors.push('IMAGE_PRIMITIVE_ERROR: Width is not an integer.');

        if (!heightIsInteger)
          heightErrors.push('IMAGE_PRIMITIVE_ERROR: Height is not an integer.');
      }

      errors = errors.concat(widthErrors).concat(heightErrors);
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