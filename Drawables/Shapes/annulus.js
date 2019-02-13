let Path = require('path');
let Validate = require('./validate.js');
let Filepath = require('./filepath.js').Filepath;
let Coordinates = require(Path_.join(Filepath.InputsDir(), 'coordinates.js')).Coordinates;
let Circle = require(Path.join(Filepath.PrimitivesDir(), 'circle.js')).Circle;
let Ellipse = require(Path.join(Filepath.PrimitivesDir(), 'ellipse.js')).Ellipse;
let PrimitivesBaseClass = require(Path.join(Filepath.PrimitivesDir(), 'primitivesbaseclass.js')).PrimitivesBaseClass;

//---------------------------------

class Annulus extends PrimitivesBaseClass {
  constructor(properties) {
    super(properties);
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
       * @param {Coordinates} center 
       */
      center(center) {
        this.args.center = center;
        return this;
      }

      /**
       * @param {number} minorRadius Length of the inner radius.
       */
      minorRadius(minorRadius) {
        this.args.minorRadius = minorRadius;
        return this;
      }

      /**
       * @param {number} majorRadius Length of the outer radius.
       */
      majorRadius(majorRadius) {
        this.args.majorRadius = majorRadius;
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
       * @param {Color} strokeColor The color of the outlines making up the major and minor radii. (Optional)
       */
      strokeColor(strokeColor) {
        this.args.strokeColor = strokeColor;
        return this;
      }

      /**
       * @param {number} strokeWidth Width of the outlines making up the major and minor radii. Larger values produce thicker lines. (Optional)
       */
      strokeWidth(strokeWidth) {
        this.args.strokeWidth = strokeWidth;
        return this;
      }

      /**
       * @param {Color} fillColor The color used to fill in the empty space inside the annulus. (Optional)
       */
      fillColor(fillColor) {
        this.args.fillColor = fillColor;
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
    return Builder;
  }

  /** 
   * @override
   */
  Args() {
    let args = [];

    // Minor outline

    let minorEdge = Coordinates.Builder()
      .x(this.args.center.args.x + this.args.minorRadius)
      .y(this.center.args.y)
      .build();

    let minorCircle = Circle.Builder()
      .center(this.args.center)
      .edge(minorEdge)
      .strokeColor(this.args.strokeColor)
      .strokeWidth(this.args.strokeWidth)
      .build();

    // Major outline

    let majorEdge = Coordinates.Builder()
      .x(this.args.center.args.x + this.args.majorRadius)
      .y(this, args.center.args.y)
      .build();

    let majorCircle = Circle.Builder()
      .center(this.args.center)
      .edge(majorEdge)
      .strokeColor(this.args.strokeColor)
      .strokeWidth(this.args.strokeWidth)
      .build();

    // Fill color (background) (Same as major circle but solid colored)

    if (this.args.fillColor) {
      let fillColorCircle = Circle.Builder()
        .center(this.args.center)
        .edge(majorEdge)
        .strokeColor(this.args.strokeColor)
        .strokeWidth(this.args.strokeWidth)
        .fillColor(this.args.fillColor)
        .build();

      args = args.concat(fillColorCircle.Args());
    }

    // Donut

    let ellipse = Ellipse.Builder()
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

    // Check required args

    if (!Validate.IsDefined(this.args.center))
      errors.push('ANNULUS_SHAPE_ERROR: Center is undefined.');
    else {
      if (this.args.center.type != 'Coordinates')
        errors.push('ANNULUS_SHAPE_ERROR: Center is not a Coordinates object.');
      else {
        let errs = this.args.center.Errors();
        if (errs.length > 0)
          errors.push(`ANNULUS_SHAPE_ERROR: Center has errors: ${errs.join(' ')}`);
      }
    }

    if (!Validate.IsDefined(this.args.minorRadius))
      errors.push('ANNULUS_SHAPE_ERROR: Minor radius is undefined.');
    else {
      if (!Validate.IsInteger(this.args.minorRadius))
        errors.push('ANNULUS_SHAPE_ERROR: Minor radius is not an integer.');
      else {
        if (this.args.minorRadius < params.minorRadius.min)
          errors.push(`ANNULUS_SHAPE_ERROR: Minor radius is out of bounds. Assigned value is: ${this.args.minorRadius}. Value must be greater than or equal to ${params.minorRadius.min}.`);
      }
    }

    if (!Validate.IsDefined(this.args.majorRadius))
      errors.push('ANNULUS_SHAPE_ERROR: Major radius is undefined.');
    else {
      if (!Validate.IsInteger(this.args.majorRadius))
        errors.push('ANNULUS_SHAPE_ERROR: Major radius is not an integer.');
      else {
        if (this.args.majorRadius < params.majorRadius.min)
          errors.push(`ANNULUS_SHAPE_ERROR: Major radius is out of bounds. Assigned value is: ${this.args.majorRadius}. Value must be greater than or equal to ${params.majorRadius.min}.`);
      }
    }

    if (!Validate.IsDefined(this.args.color))
      errors.push('ANNULUS_SHAPE_ERROR: Color is not defined.');
    else {
      if (this.args.color.type != 'Color')
        errors.push('ANNULUS_SHAPE_ERROR: Color is not a Color object.');
      else {
        let errs = this.args.color.Errors();
        if (errs.length > 0)
          errors.push(`ANNULUS_SHAPE_ERROR: Color has errors: ${errs.join(' ')}`);
      }
    }

    // Check optional args

    if (this.args.strokeColor) {
      if (this.args.strokeColor.type != 'Color')
        errors.push('ANNULUS_SHAPE_ERROR: Stroke color is not a Color object.');
      else {
        let errs = this.args.strokeColor.Errors();
        if (errs.length > 0)
          errors.push(`ANNULUS_SHAPE_ERROR: Stroke color has errors: ${errs.join(' ')}`);
      }
    }

    if (this.args.strokeWidth) {
      if (!Validate.IsInteger(this.args.strokeWidth))
        errors.push('ANNULUS_SHAPE_ERROR: Stroke width is not an integer.');
      else {
        if (this.args.strokeWidth < params.strokeWidth.min)
          errors.push(`ANNULUS_SHAPE_ERROR: Stroke width is out of bounds. Assigned value is: ${this.args.strokeWidth}. Value must be greater than or equal to ${params.strokeWidth.min}.`);
      }
    }

    if (this.args.fillColor) {
      if (this.args.fillColor.type != 'Color')
        errors.push('ANNULUS_SHAPE_ERROR: Fill color is not a Color object.');
      else {
        let errs = this.args.fillColor.Errors();
        if (errs.length > 0)
          errors.push(`ANNULUS_SHAPE_ERROR: Fill color has errors: ${errs.join(' ')}`);
      }
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