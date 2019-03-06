let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let Coordinates = require(Path.join(Filepath.InputsDir(), 'coordinates.js')).Coordinates;
let Circle = require(Path.join(Filepath.PrimitivesDir(), 'circle.js')).Circle;
let Ellipse = require(Path.join(Filepath.PrimitivesDir(), 'ellipse.js')).Ellipse;
let PrimitivesBaseClass = require(Path.join(Filepath.PrimitivesDir(), 'primitivesbaseclass.js')).PrimitivesBaseClass;

//---------------------------------

class Annulus extends PrimitivesBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Annulus';
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
       * @param {number} n Length of the inner radius.
       */
      minorRadius(n) {
        this.args.minorRadius = n;
        return this;
      }

      /**
       * @param {number} n Length of the outer radius.
       */
      majorRadius(n) {
        this.args.majorRadius = n;
        return this;
      }

      /**
       * @param {Color} color The color of the annulus.
       */
      color(color) {
        this.color = color;
        return this
      }

      /**
       * @param {Color} color The color of the outlines making up the major and minor radii. (Optional)
       */
      strokeColor(color) {
        this.args.strokeColor = color;
        return this;
      }

      /**
       * @param {number} n Width of the outlines making up the major and minor radii. Larger values produce thicker lines. (Optional)
       */
      strokeWidth(n) {
        this.args.strokeWidth = n;
        return this;
      }

      /**
       * @param {Color} color The color used to fill in the empty space inside the annulus. (Optional)
       */
      fillColor(color) {
        this.args.fillColor = color;
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
        return new Annulus(this);
      }
    }
    return new Builder();
  }

  /** 
   * @override
   */
  Args() {
    let args = [];

    // Minor outline

    let minorEdge = Coordinates.Builder
      .x(this.args.center.args.x + this.args.minorRadius)
      .y(this.center.args.y)
      .build();

    let minorCircle = Circle.Builder
      .center(this.args.center)
      .edge(minorEdge)
      .strokeColor(this.args.strokeColor)
      .strokeWidth(this.args.strokeWidth)
      .build();

    // Major outline

    let majorEdge = Coordinates.Builder
      .x(this.args.center.args.x + this.args.majorRadius)
      .y(this, args.center.args.y)
      .build();

    let majorCircle = Circle.Builder
      .center(this.args.center)
      .edge(majorEdge)
      .strokeColor(this.args.strokeColor)
      .strokeWidth(this.args.strokeWidth)
      .build();

    // Fill color (background) (Same as major circle but solid colored)

    if (this.args.fillColor) {
      let fillColorCircle = Circle.Builder
        .center(this.args.center)
        .edge(majorEdge)
        .strokeColor(this.args.strokeColor)
        .strokeWidth(this.args.strokeWidth)
        .fillColor(this.args.fillColor)
        .build();

      args = args.concat(fillColorCircle.Args());
    }

    // Donut

    let ellipse = Ellipse.Builder
      .center(this.args.center)
      .width(this.args.majorRadius + this.args.minorRadius)
      .height(this.args.majorRadius + this.args.minorRadius)
      .strokeColor(this.args.color)
      .strokeWidth(this.args.majorRadius - this.args.minorRadius)
      .angleStart(0)
      .angleEnd(360)
      .build();

    args = args.concat(ellipse.Args()).concat(majorCircle.Args()).concat(minorCircle.Args());

    return args;
  }

  /**
   * @override
   */
  Errors() {
    let params = Annulus.Parameters();
    let errors = [];
    let prefix = 'ANNULUS_SHAPE_ERROR';

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

    let minorRadiusErr = Err.ErrorMessage.Build
      .prefix(prefix)
      .varName('Minor radius')
      .condition(
        new Err.NumberCondition.Builder(this.args.minorRadius)
          .isInteger(true)
          .min(params.minorRadius.min)
          .build()
      )
      .build()
      .String();

    if (minorRadiusErr)
      errors.push(minorRadiusErr);

    let majorRadiusErr = Err.ErrorMessage.Build
      .prefix(prefix)
      .varName('Major radius')
      .condition(
        new Err.NumberCondition.Builder(this.args.majorRadius)
          .isInteger(true)
          .min(params.majorRadius.min)
          .build()
      )
      .build()
      .String();

    if (majorRadiusErr)
      errors.push(majorRadiusErr);

    let colorErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Color')
      .condition(
        new Err.ObjectCondition.Builder(this.args.color)
          .typeName('Color')
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();

    if (colorErr)
      errors.push(colorErr);

    // Check optional args

    if (this.args.strokeColor) {
      let strokeColorErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Stroke color')
        .condition(
          new Err.ObjectCondition.Builder(this.args.color)
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
      let strokeWidthErr = Err.ErrorMessage.Build
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
          new Err.ObjectCondition.Builder(this.args.color)
            .typeName('Color')
            .checkForErrors(true)
            .build()
        )
        .build()
        .String();

      if (fillColorErr)
        errors.push(fillColorErr);
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
      minorRadius: {
        type: 'number',
        subtype: 'integer',
        min: 1
      },
      majorRadius: {
        type: 'number',
        subtype: 'integer',
        min: 1
      },
      color: {
        type: 'Color'
      },
      strokeColor: {
        type: 'Color'
      },
      strokeWidth: {
        type: 'number',
        subtype: 'integer',
        min: 1
      },
      fillColor: {
        type: 'Color'
      }
    };
  }
}

//-----------------------------
// EXPORTS

exports.Annulus = Annulus;