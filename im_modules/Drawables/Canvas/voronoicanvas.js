let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let Validate = require(Path.join(RootDir, 'validate.js'));
let CanvasBaseClass = require(Path.join(Filepath.CanvasDir(), 'canvasbaseclass.js')).CanvasBaseClass;

//----------------------------------------
// COLOR CANVAS

class VoronoiCanvas extends CanvasBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'VoronoiCanvas';
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
       * @param {boolean} bool Set to true if softer blend between colors is desired. Otherwise, blend will be harsher and colors slightly deeper.
       */
      softBlend(bool) {
        this.args.softBlend = bool;
        return this;
      }

      build() {
        return new VoronoiCanvas(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    let stringArr = this.args.pointsAndColors.map(x => x.String());

    let args = ['-size', `${this.args.width}x${this.args.height}`, 'canvas:', '-colorspace', 'RGB', '-sparse-color', 'Voronoi', stringArr.join(' ')];

    if (this.softBlend_)
      args.push('-colorspace', 'sRGB');

    if (this.primitives.length > 0)
      this.primitives.forEach(p => args = args.concat(p.Args()));

    return args;
  }

  /**
    * @override
    */
  Errors() {
    let params = VoronoiCanvas.Parameters();
    let errors = [];
    let prefix = 'VORONOI_CANVAS_ERROR';

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
      softBlend: {
        type: 'boolean',
        default: false
      }
    };
  }
}

//-----------------------------
// EXPORTS

exports.VoronoiCanvas = VoronoiCanvas;