let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let DisplaceBaseClass = require(Path.join(Filepath.TransformDisplaceDir(), 'displacebaseclass.js')).DisplaceBaseClass;

//-----------------------------------

class RotateImage extends DisplaceBaseClass {
  constructor(builder) {
    super(builder);

    this.hypotenuse = builder.hypotenuse;
    this.offset = builder.offset;
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'RotateImage';
        this.args = {};
        this.offset = null;     // {x: number, y: number}
        this.hypotenuse = null; // number
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
       * @param {number} n
       */
      degrees(n) {
        this.args.degrees = n;
        return this;
      }

      build() {
        /**
         *  Calculate dimensions for blank canvas. 
         * 
         *  NOTES: 
         *        1) This will rotate the image around the center.
         *        2) This will produce an image that is slightly larger than the original.
         *        3) This prevents cropping when pixels are rotated passed the image's original dimensions. 
         *        4) Image Magick's built-in rotate feature DOES NOT prevent cropping passed the image's dimensions.
         */

        let aSquared = Math.pow(this.args.width, 2);
        let bSquared = Math.pow(this.args.height, 2);
        let sumSquareRoot = Math.sqrt(aSquared + bSquared);
        this.hypotenuse = Math.ceil(sumSquareRoot);

        /**
         *  Adjust the offsets.
         * 
         *  NOTES: 
         *        1) The slightly larger rendered image will throw off any offsets.
         *        2) This will prevent any miscalculations when rendering the image elsewhere or displacing it.
         */

        let xOffset = Math.floor((hypotenuse - this.args.width) / 2);
        let yOffset = Math.floor((hypotenuse - this.args.height) / 2);
        this.offset = { x: -xOffset, y: -yOffset };

        return new RotateImage(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    return ['-size', `${this.hypotenuse}x${this.hypotenuse}`, 'canvas:none', '-gravity', 'Center', '-draw', `image over 0,0 0,0 '${this.args.source}'`, '-distort', 'SRT', this.args.degrees];
  }

  /**
   * @override
   */
  Errors() {
    let params = RotateImage.Parameters();
    let errors = [];
    let prefix = 'ROTATE_IMAGE_DISPLACE_TRANSFORM_ERROR';

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

    let widthErr = Err.ErrorMessage.Builder
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

    let heightErr = Err.ErrorMessage.Builder
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

    let degreesErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Degrees')
      .condition(
        new Err.NumberCondition.Builder(this.args.degrees)
          .build()
      )
      .build()
      .String();

    if (degreesErr)
      errors.push(degreesErr);

    return errors;
  }

  /**
   * @override
   */
  IsConsolidatable() {
    return false;
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
      degrees: {
        type: 'number'
      }
    };
  }
}

//-----------------------------
// EXPORTS

exports.RotateImage = RotateImage;