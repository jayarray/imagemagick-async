let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let Validate = require(Path.join(RootDir, 'validate.js'));
let Coordinates = require(Path.join(Filepath.InputsDir(), 'coordinates.js')).Coordinates;
let PrimitivesBaseClass = require(Path.join(Filepath.PrimitivesDir(), 'primitivesbaseclass.js')).PrimitivesBaseClass;

//----------------------------------

class Bezier extends PrimitivesBaseClass {
  constructor(builder) {
    super(builder);
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
       * @param {Array<Coordinates>} coordinatesArr A list of points for the bezier curve to travel through.
       */
      points(coordinatesArr) {
        this.args.points = coordinatesArr;
        return this;
      }

      /**
       * @param {Color} color The color of the line connecting all the points. (Valid color format string used in Image Magick) (Optional)
       */
      strokeColor(color) {
        this.args.strokeColor = color;
        return this;
      }

      /**
       * @param {number} n Width of the line connecting all the points. (Larger values produce thicker lines.) (Optional)
       */
      strokeWidth(n) {
        this.args.strokeWidth = n;
        return this;
      }

      /**
       * @param {Color} color The color to fill the bezier. (Valid color format string used in Image Magick) (Optional)
       */
      fillColor(color) {
        this.args.fillColor = color;
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
        return new Bezier(this);
      }
    }
    return new Builder();
  }

  /** 
   * Get a list of points in string form that have the X and Y offsets applied to them.
   * @returns {string} Returns a space-delimited string representing all points in the bezier curve.
   */
  PointsToString() {
    let pointStrings = [];

    this.args.points.forEach(p => {
      let pStr = Coordinates.Builder
        .x(p.args.x + this.args.offset.args.x)
        .y(p.args.y + this.args.offset.args.y)
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
    let params = Bezier.Parameters();
    let args = [];

    if (this.args.fillColor)
      args.push('-fill', this.args.fillColor.String()); // Applies fill color to areas where the curve is above or below the line computed between the start and end point.
    else
      args.push('-fill', 'none'); // Outputs lines only

    if (this.args.strokeColor)
      args.push('-stroke', this.args.strokeColor.String());
    else
      args.push('-stroke', params.strokeColor.default);

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
    let prefix = 'BEZIER_PRIMITIVE_ERROR';

    // Check required args

    let pointsErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Points')
      .condition(
        new Err.ArrayCondition.Builder(this.args.points)
          .validType('Coordinates')
          .minLength(params.points.min)
          .build()
      )
      .build()
      .String();

    if (pointsErr)
      errors.push(pointsErr);

    let arrayHasErrors = Validate.ArrayHasErrors(this.args.points);
    if (arrayHasErrors)
      errors.push(`${prefix}: Points contains a Coordinates object with errors.`);

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

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      points: {
        type: 'Inputs.Coordinates',
        isArray: true,
        min: 3,
        required: true
      },
      strokeColor: {
        type: 'Inputs.Color',
        default: 'black',
        required: false
      },
      strokeWidth: {
        type: 'number',
        subtype: 'integer',
        min: 1,
        default: 1,
        required: false
      },
      fillColor: {
        type: 'Inputs.Color',
        required: false
      },
      offset: {
        type: 'Inputs.Offset',
        required: false
      }
    };
  }
}

//-----------------------------------
// EXPORTS

exports.Bezier = Bezier;