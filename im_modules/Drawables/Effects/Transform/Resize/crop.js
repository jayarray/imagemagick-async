let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let ResizeBaseClass = require(Path.join(Filepath.TransformResizeDir(), 'resizebaseclass.js')).ResizeBaseClass;

//-----------------------------------

class Crop extends ResizeBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Crop';
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
       * @param {Coordinates} coordinates The top left corner where the image will be cropped from.
       */
      corner(coordinates) {
        this.args.corner = coordinates;
        return this;
      }

      /**
       * @param {boolean} bool Assign as true if you wish to only keep the specified area of the crop. Assign as false if you wish to keep the dimensions of the original image while leaving the crop where it was positioned in the original image (will be surrounded by empty space). NOTE: some image formats don't make use of the virtual canvas, so the image will not appear inside the virtual canvas when previewed. However, Image Magick adds some metadata to preserve the virtual canvas size for later use by other Image Magick commands.
       */
      removeVirtualCanvas(bool) {
        this.args.removeVirtualCanvas = bool;
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
        return new Crop(this);
      }
    }
    return new Builder();
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    let args = ['-crop'];

    let cropStr = `${this.args.width}x${this.args.height}`;

    if (this.args.corner.args.x_ >= 0)
      cropStr += `+${this.args.corner.args.x_}`;
    else
      cropStr += this.args.corner.args.x.toString();

    if (this.args.corner.args.y >= 0)
      cropStr += `+${this.args.corner.args.y}`;
    else
      cropStr += this.args.corner.args.y.toString();
    args.push(cropStr)

    if (this.args.removeVirtualCanvas)
      args.push('+repage');

    return args;
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

    let cornerErr = Err.ErrorMessage.Builder
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

    let removeVirtualCanvasErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Remove virtual canvas flag')
      .condition(
        new Err.BooleanCondition.Builder(this.args.removeVirtualCanvas)
          .build()
      )
      .build()
      .String();

    if (removeVirtualCanvasErr)
      errors.push(removeVirtualCanvasErr);

    return errors;
  }

  /**
   * @override
   */
  static IsConsolidatable() {
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
      corner: {
        type: 'Coordinates'
      },
      removeVirtualCanvas: {
        type: 'boolean'
      }
    };
  }
}

//--------------------------------
// EXPORTs

exports.Crop = Crop;