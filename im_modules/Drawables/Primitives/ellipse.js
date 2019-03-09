let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let Coordinates = require(Path.join(Filepath.InputsDir(), 'coordinates.js')).Coordinates;
let PrimitivesBaseClass = require(Path.join(Filepath.PrimitivesDir(), 'primitivesbaseclass.js')).PrimitivesBaseClass;

//-----------------------------------

class Ellipse extends PrimitivesBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Ellipse';
        this.args = {};
      }

      /**
       * @param {Coordinates} coordinates 
       */
      center(coordinates) {
        this.args.center = coordinates;
        return this;
      }

      /**
       * @param {number} n Width (in pixels)
       */
      width(n) {
        this.args.width = n;
        return this;
      }

      /**
       * @param {number} n Height (in pixels)
       */
      height(n) {
        this.args.height = n;
        return this;
      }

      /**
       * @param {Color} color The color of the line making up the ellipse. (Valid color format string used in Image Magick) (Optional)
       */
      strokeColor(color) {
        this.args.strokeColor = color;
        return this;
      }

      /**
       * @param {number} n Width of the line making up the ellipse. (Larger values produce thicker lines.) (Optional)
       */
      strokeWidth(n) {
        this.args.strokeWidth = n;
        return this;
      }

      /**
       * @param {Color} color The color to fill the ellipse. (Valid color format string used in Image Magick) (Optional)
       */
      fillColor(color) {
        this.args.fillColor = color;
        return this;
      }

      /**
       * @param {number} n angleStart Angle at which to start drawing the ellipse. (0-degrees starts at 3-o'clock on the screen) (Optional)
       */
      angleStart(n) {
        this.args.angleStart = n;
        return this;
      }

      /**
       * @param {number} n Angle at which to stop drawing the ellipse. (360-degrees stops at 3-o'clock on the screen) (Optional)
       */
      angleEnd(n) {
        this.args.angleEnd = n;
        return this;
      }

      /**
       * @param {Offset} offset
       */
      offset(offset) {
        this.args.offset = offset;
        return this;
      }

      build() {
        return new Ellipse(this);
      }
    }
    return new Builder();
  }

  /** 
   * @override
  */
  Args() {
    let params = Ellipse.Parameters();
    let args = [];

    if (this.args.fillColor)
      args.push('-fill', this.args.fillColor.String());
    else
      args.push('-fill', 'none'); // Prevents default black fill color

    if (this.args.strokeColor)
      args.push('-stroke', this.args.strokeColor.String());
    else
      args.push('-stroke', params.strokeColor.default);

    if (this.args.strokeWidth)
      args.push('-strokewidth', this.args.strokeWidth);

    let center = Coordinates.Builder()
      .x(this.args.center.args.x + this.args.offset.args.x)
      .y(this.args.center.args.y + this.args.offset.args.y)
      .build();

    let angleStart = this.args.angleStart || params.angleStart.default;
    let angleEnd = this.args.angleEnd || params.angleEnd.default;

    args.push('-draw', `ellipse ${center.String()} ${Math.floor(this.args.width / 2)},${Math.floor(this.args.height / 2)} ${angleStart},${angleEnd}`);
    return args;
  }

  /**
   * @override
   */
  Errors() {
    let params = Ellipse.Parameters();
    let errors = [];
    let prefix = 'ELLIPSE_PRIMITIVE_ERROR';

    // Check required args

    let centerErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Center')
      .condition(
        new Err.ObjectCondition.Builder(this.args.center)
          .typeName('Coordinates')
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();

    if (centerErr)
      errors.push(centerErr);

    let widthErr = Err.ErrorMessage.Builder()
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
          .min(params.width.min)
          .build()
      )
      .build()
      .String();

    if (heightErr)
      errors.push(heightErr);

    // Check optional args

    if (this.args.strokeColor) {
      let strokeColorErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Stroke color')
        .condition(
          new Err.ObjectCondition.Builder(this.args.strokeColor)
            .typeName('Color')
            .checkForErrors(true)
            .build()
        )
        .build()
        .String();

      if (strokeColorErr)
        errors.push(strokeColorErr);
    }

    if (this.args.strokeWidth) {
      let strokeWidthErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Stroke width')
        .condition(
          new Err.NumberCondition.Builder(this.args.strokeWidth)
            .isInteger(true)
            .min(params.strokeWidth.min)
            .build()
        )
        .build()
        .String();

      if (strokeWidthErr)
        errors.push(strokeWidthErr);
    }

    if (this.args.fillColor) {
      let fillColorErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Fill color')
        .condition(
          new Err.ObjectCondition.Builder(this.args.fillColor)
            .typeName('Color')
            .checkForErrors(true)
            .build()
        )
        .build()
        .String();

      if (fillColorErr)
        errors.push(fillColorErr);
    }

    if (this.args.angleStart) {
      let angleStartErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Angle start')
        .condition(
          new Err.NumberCondition.Builder(this.args.angleStart)
            .build()
        )
        .build()
        .String();

      if (angleStartErr)
        errors.push(angleStartErr);
    }


    if (this.args.angleEnd) {
      let angleEndErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Angle end')
        .condition(
          new Err.NumberCondition.Builder(this.args.angleEnd)
            .build()
        )
        .build()
        .String();

      if (angleEndErr)
        errors.push(angleEndErr);
    }

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      center: {
        type: 'Coordinates'
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
      strokeColor: {
        type: 'Color',
        default: 'black'
      },
      strokeWidth: {
        type: 'number',
        subtype: 'integer',
        min: 1
      },
      fillColor: {
        type: 'Color'
      },
      angleStart: {
        type: 'number',
        default: 0
      },
      angleEnd: {
        type: 'number',
        default: 360
      },
      offset: {
        type: 'Offset'
      }
    };
  }
}

//---------------------------------
// EXPORTS

exports.Ellipse = Ellipse;