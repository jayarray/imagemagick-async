let Path = require('path');
let Validate = require('./validate.js');
let Filepath = require('./filepath.js').Filepath;
let Coordinates = require(Path.join(Filepath.InputsDir(), 'coordinates.js')).Coordinates;
let PrimitivesBaseClass = require(Path.join(Filepath.PrimitivesDir(), 'primitivesbaseclass.js')).PrimitivesBaseClass;

//----------------------------------

class Bezier extends PrimitivesBaseClass {
  constructor(properties) {
    super(properties);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Bezier';
        this.args = {};
      }

      /**
       * @param {Array<Coordinates>} points A list of points for the bezier curve to travel through.
       */
      points(points) {
        this.args.points = points;
        return this;
      }

      /**
       * @param {Color} strokeColor The color of the line connecting all the points. (Valid color format string used in Image Magick) (Optional)
       */
      strokeColor(strokeColor) {
        this.args.strokeColor = strokeColor;
        return this;
      }

      /**
       * @param {number} strokeWidth Width of the line connecting all the points. (Larger values produce thicker lines.) (Optional)
       */
      strokeWidth(strokeWidth) {
        this.args.strokeWidth = strokeWidth;
        return this;
      }

      /**
       * @param {Color} fillColor The color to fill the bezier. (Valid color format string used in Image Magick) (Optional)
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
        return new Bezier(this);
      }
    }
    return Builder;
  }

  /** 
   * Get a list of points in string form that have the X and Y offsets applied to them.
   * @returns {string} Returns a space-delimited string representing all points in the bezier curve.
   */
  PointsToString() {
    let pointStrings = [];

    this.args.points.forEach(p => {
      let pStr = Coordinates.Builder()
        .x(p.args.x + this.offset.x)
        .y(p.args.y + this.offset.y)
        .build()
        .String();

      pointStrings.push(pStr);
    });

    return pointStrings.join(' ');
  }

  /** 
   * @override
  */
  Args() {
    let args = [];

    if (this.args.fillColor)
      args.push('-fill', this.args.fillColor.Info().hex.string); // Applies fill color to areas where the curve is above or below the line computed between the start and end point.
    else
      args.push('-fill', 'none'); // Outputs lines only

    if (this.args.strokeColor)
      args.push('-stroke', this.args.strokeColor.Info().hex.string);

    if (this.args.strokeWidth)
      args.push('-strokewidth', this.args.strokeWidth);

    args.push('-draw', `bezier ${this.PointsToString()}`);
    return args;
  }

  /**
   * @override
   */
  Errors() {
    let params = Bezier.Parameters();
    let errors = [];

    // Check required args

    if (!Validate.IsDefined(this.args.points))
      errors.push('BEZIER_PRIMITIVE_ERROR: Points are undefined.');
    else {
      if (!Validate.IsArray(this.args.points))
        errors.push('BEZIER_PRIMITIVE_ERROR: Points is not an array.');
      else {
        let arrayHasInvalidTypes = Validate.ArrayHasInvalidTypes(this.args.points, 'Coordinates');
        let arrayHasErrors = Validate.ArrayHasErrors(this.args.points);

        if (arrayHasInvalidTypes)
          error.push('BEZIER_PRIMITIVE_ERROR: Points contains objects that are not Coordinates.');
        else {
          if (arrayHasErrors)
            errors.push('BEZIER_PRIMITIVE_ERROR: Points has Coordinates with errors.');
          else {
            if (this.args.points.length < params.points.min)
              errors.push(`BEZIER_PRIMITIVE_ERROR: Insufficient points provided. Number of points provided: ${this.args.points.length}. Must provide ${params.points.min} or more points.`);
          }
        }
      }
    }

    // Check optional args

    if (this.args.strokeColor) {
      if (this.args.strokeColor.type != 'Color')
        errors.push('BEZIER_PRIMITIVE_ERROR: Stroke color is not a Color object.');
      else {
        let errs = this.args.strokeColor.Errors();
        if (errs.length > 0)
          errors.push(`BEZIER_PRIMITIVE_ERROR: Stroke color has some errors: ${errs.join(' ')}`);
      }
    }

    if (this.args.strokeWidth) {
      if (!Validate.IsNumber(this.args.strokeWidth))
        errors.push('BEZIER_PRIMITIVE_ERROR: Stroke width is not a number.');
      else {
        if (this.args.strokeWidth < params.strokeWidth.min)
          errors.push(`BEZIER_PRIMITIVE_ERROR: Stroke width is out of bounds. Assigned value is: ${this.args.strokeWidth}. Value must be greater than or equal to ${params.strokeWidth.min}.`);
      }
    }

    if (this.args.fillColor) {
      if (this.args.fillColor.type != 'Color')
        errors.push('BEZIER_PRIMITIVE_ERROR: Fill color is not a Color object.');
      else {
        let errs = this.args.fillColor.Errors();
        if (errs.length > 0)
          errors.push(`BEZIER_PRIMITIVE_ERROR: Fill color has some errors: ${errs.join(' ')}`);
      }
    }

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      points: {
        type: 'Coordinates',
        isArray: true,
        min: 3
      },
      strokeColor: {
        type: 'Color'
      },
      strokeWidth: {
        type: 'number',
        subtype: 'integer',
        min: 1,
        default: 1
      },
      fillColor: {
        type: 'Color'
      }
    };
  }
}

//-----------------------------------
// EXPORTS

exports.Bezier = Bezier;