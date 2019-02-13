let Path_ = require('path');
let Validate = require('./validate.js');
let Filepath = require('./filepath.js').Filepath;
let Coordinates = require(Path_.join(Filepath.InputsDir(), 'coordinates.js')).Coordinates;
let PrimitivesBaseClass = require(Path_.join(Filepath.PrimitivesDir(), 'primitivesbaseclass.js')).PrimitivesBaseClass;

//-----------------------------------

class Path extends PrimitivesBaseClass {
  constructor(properties) {
    super(properties);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Path';
        this.args = {};
      }

      /**
       * @param {Array<Coordinates>} points A list of coordinates to be connected by a line in the order provided.
       */
      points(points) {
        this.points = points;
        return this;
      }

      /**
       * @param {Color} strokeColor The color of the line connecting all the points. (Valid color format string used in Image Magick) (Optional)
       */
      strokeColor(strokeColor) {
        this.strokeColor = strokeColor;
        return this;
      }

      /**
       * @param {number} strokeWidth Width of the line connecting all the points. (Larger values produce thicker lines.) (Optional)
       */
      strokeWidth(strokeWidth) {
        this.strokeWidth = strokeWidth;
        return this;
      }

      /**
       * 
       * @param {Color} fillColor The color to fill the path with. (Valid color format string used in Image Magick) (Optional)
       */
      fillColor(fillColor) {
        this.fillColor = fillColor;
        return this;
      }

      /**
       * @param {boolean} isClosed Set to true if you wish to connect the last point back to the first one (if not done already). Else, set to false.
       */
      isClosed(isClosed) {
        this.isClosed = isClosed;
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
        return new Path(this);
      }
    }
    return Builder;
  }

  /** 
   * Get a list of points in string form that have the X and Y offsets applied to them.
   * @returns {string} Returns a space-delimited string representing all points in the path.
   */
  PointsToStringArray() {
    let strArray = [];

    this.args.points.forEach(p => {
      let pStr = Coordinates.Builder()
        .x(p.args.x + this.offset.x)
        .y(p.args.y + this.offset.y)
        .build()
        .String();

      strArray.push(pStr);
    });

    return strArray;
  }

  /** 
   * @override
   */
  Args() {
    let args = [];

    if (this.args.fillColor)
      args.push('-fill', this.args.fillColor.Info().hex.string);
    else
      args.push('-fill', 'none'); // Prevents default black fill color

    if (this.args.strokeColor)
      args.push('-stroke', this.args.strokeColor.Info().hex.string);

    if (this.args.strokeWidth)
      args.push('-strokewidth', this.args.strokeWidth);

    let pointStringArr = this.PointsToStringArray();

    let drawString = `path 'M ${pointStringArr[0]} L ${pointStringArr[1]}`;
    if (pointStringArr.length > 2)
      drawString += ` ${pointStringArr.slice(2).join(' ')}`;

    if (this.args.isClosed)
      drawString += ' Z';
    drawString += `'`;

    args.push('-draw', drawString);
    return args;
  }

  /**
   * @override
   */
  Errors() {
    let params = Path.Parameters();
    let errors = [];

    // Check required args

    if (!Validate.IsDefined(this.args.points))
      errors.push('PATH_PRIMITIVE_ERROR: Points are undefined.');
    else {
      if (!Validate.IsArray(this.args.points))
        errors.push('PATH_PRIMITIVE_ERROR: Points is not an array.');
      else {
        let arrayHasInvalidTypes = Validate.ArrayHasInvalidTypes(this.args.points, 'Coordinates');
        let arrayHasErrors = Validate.ArrayHasErrors(this.args.points);

        if (arrayHasInvalidTypes)
          error.push('PATH_PRIMITIVE_ERROR: Points contains objects that are not Coordinates.');
        else {
          if (arrayHasErrors)
            errors.push('PATH_PRIMITIVE_ERROR: Points has Coordinates with errors.');
          else {
            if (this.args.points.length < params.points.min)
              errors.push(`PATH_PRIMITIVE_ERROR: Insufficient points provided. Number of points provided: ${this.args.points.length}. Must provide ${params.points.min} or more points.`);
          }
        }
      }
    }

    if (!Validate.IsDefined(this.args.isClosed))
      errors.push('PATH_PRIMITIVE_ERROR: Is closed is undefined.');
    else {
      if (!Validate.IsBoolean(this.args.isClosed))
        errors.push('PATH_PRIMITIVE_ERROR: Is closed is not a boolean.');
    }

    // Check optional args

    if (this.args.strokeColor) {
      if (this.args.strokeColor.type == 'Color')
        errors.push('PATH_PRIMITIVE_ERROR: Stroke color is not a Color object.');
      else {
        let errs = this.args.strokeColor.Errors();
        if (errs.length > 0)
          errors.push(`PATH_PRIMITIVE_ERROR: Stroke color has errors: ${errs.join(' ')}`);
      }
    }

    if (this.args.strokeWidth) {
      if (!Validate.IsInteger(this.args.strokeWidth))
        errors.push('PATH_PRIMITIVE_ERROR: Stroke width is not an integer.');
      else {
        if (this.args.strokeWidth < params.strokeWidth.min)
          errors.push(`PATH_PRIMITIVE_ERROR: Stroke width is out of bounds. Assigned value is: ${this.args.strokeWidth}. Value must be greater than or equal to ${params.strokeWidth.min}.`);
      }
    }

    if (this.args.fillColor) {
      if (this.args.fillColor.type == 'Color')
        errors.push('PATH_PRIMITIVE_ERROR: Fill color is not a Color object.');
      else {
        let errs = this.args.fillColor.Errors();
        if (errs.length > 0)
          errors.push(`PATH_PRIMITIVE_ERROR: Fill color has errors: ${errs.join(' ')}`);
      }
    }

    if (this.args.isClosed) {
      if (!Validate.IsBoolean(this.args.isClosed))
        errors.push('PATH_PRIMITIVE_ERROR: Is closed is not a boolean.');
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
        min: 2
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
      },
      isClosed: {
        type: 'boolean',
        default: false
      }
    };
  }
}

//-------------------------
// EXPORTS

exports.Path = Path;