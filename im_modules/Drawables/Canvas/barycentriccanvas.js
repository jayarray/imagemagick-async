let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let Validate = require(Path.join(RootDir, 'validate.js'));
let CanvasBaseClass = require(Path.join(Filepath.CanvasDir(), 'canvasbaseclass.js')).CanvasBaseClass;

//----------------------------------------
// COLOR CANVAS

class BarycentricCanvas extends CanvasBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'BarycentricCanvas';
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

      /**
       * @param {Array<Primitive>} primitivesArr A list of Primitive types to draw onto the canvas (Optional)
       */
      primitives(primitivesArr) {
        this.primitives = primitivesArr;
        return this;
      }

      build() {
        return new BarycentricCanvas(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    let stringArr = this.args.pointsAndColors.map(x => x.String());

    let args = ['-size', `${this.args.width}x${this.args.height}`, 'canvas:', '-colorspace', 'RGB', '-sparse-color', 'Barycentric', stringArr.join(' ')];

    if (this.args.softBlend)
      args.push('-colorspace', 'sRGB');

    if (this.primitives.length > 0)
      this.primitives.forEach(p => args = args.concat(p.Args()));

    return args;
  }

  /**
    * @override
    */
  Errors() {
    let params = BarycentricCanvas.Parameters();
    let errors = [];
    let prefix = 'BARYCENTRIC_CANVAS_ERROR';

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
          .hasLength(params.pointsAndColors.length)
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

    if (this.primitives) {
      let primitivesErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Primitives')
        .condition(
          new Err.ArrayCondition.Builder(this.primitives)
            .validType('Primitive')
            .checkForErrors(true)
            .build()
        )
        .build()
        .String();

      if (primitivesErr)
        errors.push(primitivesErr);
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
        length: 3
      },
      softBlend: {
        type: 'boolean',
        default: false
      },
      primitives: {
        type: 'Primitive',
        isArray: true
      }
    };
  }
}

//-----------------------------
// EXPORTS

exports.BarycentricCanvas = BarycentricCanvas;