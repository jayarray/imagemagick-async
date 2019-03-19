let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let Validate = require(Path.join(RootDir, 'validate.js'));
let CanvasBaseClass = require(Path.join(Filepath.CanvasDir(), 'canvasbaseclass.js')).CanvasBaseClass;

//----------------------------------------
// COLOR CANVAS

class ShepardsPowerCanvas extends CanvasBaseClass {
  constructor(builder) {
    super(builder);
  }

  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'ShepardsPowerCanvas';
        this.args = {};
        this.primitives = [];
      }

      /**
       * @param {number} n Width in pixels.
       */
      width(n) {
        this.args.width = n;
        return this;
      }

      /**
       * @param {number} n Height in pixels.
       */
      height(n) {
        this.args.height = n;
        return this;
      }

      /**
       * @param {Array<PointAndColor>} pointAndColorArr 
       */
      pointsAndColors(pointAndColorArr) {
        this.args.pointsAndColors = pointAndColorArr;
        return this;
      }

      /**
       * @param {number} n Value greater than or equal to zero that determines the intensity and spread of the colors.
       */
      power(n) {
        this.args.power = n;
        return this;
      }

      /**
       * @param {boolean} bool Set to true if softer blend between colors is desired. Otherwise, blend will be harsher and colors slightly deeper.
       */
      softBlend(bool) {
        this.args.softBlend = bool;
        return this;
      }

      build() {
        return new ShepardsPowerCanvas(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    let stringArr = this.args.pointsAndColors.map(x => x.String());

    let args = ['-size', `${this.args.width}x${this.args.height}`, 'canvas:', '-colorspace', 'RGB', '-define', `shepards:power=${this.args.power}`, '-sparse-color', 'Shepards', stringArr.join(' ')];

    if (this.args.softBlend)
      args.push('-colorspace', 'sRGB');

    return args;
  }

  /**
   * @override
   */
  Errors() {
    let params = ShepardsPowerCanvas.Parameters();
    let errors = [];
    let prefix = 'SHEPARDS_POWER_CANVAS_ERROR';

    // Check required args

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

    let pointsColorsArrErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Point and colors array')
      .condition(
        new Err.ArrayCondition.Builder(this.args.pointsAndColors)
          .validType('PointAndColor')
          .minLength(params.pointsAndColors.min)
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();

    if (pointsColorsArrErr)
      errors.push(pointsColorsArrErr);

    let powerErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Power')
      .condition(
        new Err.NumberCondition.Builder(this.args.power)
          .min(params.power.min)
          .build()
      )
      .build()
      .String();

    if (powerErr)
      errors.push(powerErr);

    // Check optional args

    if (Validate.IsDefined(this.args.softBlend)) {
      let softBlendErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Soft blend flag')
        .condition(
          new Err.BooleanCondition.Builder(this.args.softBlend)
            .build()
        )
        .build()
        .String();

      if (softBlendErr)
        errors.push(softBlendErr);
    }

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
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
      pointsAndColors: {
        type: 'PointAndColor',
        isArray: true,
        min: 1
      },
      power: {
        type: 'number',
        min: 0
      },
      softBlend: {
        type: 'boolean',
        default: false
      }
    };
  }
}

//-----------------------------
// EXPORTS

exports.ShepardsPowerCanvas = ShepardsPowerCanvas;