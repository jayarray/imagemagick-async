let Path_ = require('path');
let Validate = require('./validate.js');
let Filepath = require('./filepath.js').Filepath;
let Coordinates = require(Path_.join(Filepath.InputsDir(), 'coordinates.js')).Coordinates;
let PrimitivesBaseClass = require(Path_.join(Filepath.PrimitivesDir(), 'primitivesbaseclass.js')).PrimitivesBaseClass;

//-----------------------------------

class PathComposite extends PrimitivesBaseClass {
  constructor(properties) {
    super(properties);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'PathComposite';
        this.args = {};
      }

      /**
       * @param {Coordinates} start The start coordinates of your path.
       */
      start(start) {
        this.start = start;
        return this;
      }

      /**
       * @param {Array<LineSegment>} lineSegments A list of LineSegment objects to be connected in the order provided.
       */
      lineSegments(lineSegments) {
        this.lineSegments = lineSegments;
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
       * @param {Color} fillColor The color to fill the path with. (Valid color format string used in Image Magick) (Optional)
       */
      fillColor(fillColor) {
        this.fillColor = fillColor;
        return this;
      }

      /**
       * @param {boolean} isClosed Set to true if you wish to connect the last point back to the first one (if not done already) with a straight line. Else, set to false.
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
        return new PathComposite(this);
      }
    }
    return Builder;
  }

  /** 
   * Get a list of points in string form that have the X and Y offsets applied to them.
   * @returns {string} Returns a space-delimited string representing all points in the path.
   */
  LineSegmentsToString() {
    return this.args.lineSegments.map(x => x.String()).join(' ');
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

    let drawString = `path 'M ${this.args.start.String()} ${this.LineSegmentsToString()}`;

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
    let errors = [];

    // Check required args

    if (!Validate.IsDefined(this.args.start))
      errors.push('PATH_COMPOSITE_PRIMITIVE_ERROR: Start is undefined.');
    else {
      if (this.args.start.type != 'Coordinates')
        errors.push('PATH_COMPOSITE_PRIMITIVE_ERROR: Start is not a Coordinates object.');
      else {
        let errs = this.args.start.Errors();
        if (errs.length > 0)
          errors.push(`PATH_COMPOSITE_PRIMITIVE_ERROR: Start has errors: ${errs.join(' ')}`);
      }
    }

    if (!Validate.IsDefined(this.args.lineSegments))
      errors.push('PATH_COMPOSITE_PRIMITIVE_ERROR: Line segments are undefined.');
    else {
      let arrayHasInvalidTypes = Validate.ArrayHasInvalidTypes(this.args.lineSegments, 'LineSegment');
      let arrayHasErrors = Validate.ArrayHasErrors(this.args.lineSegments);

      if (arrayHasInvalidTypes)
        error.push('PATH_COMPOSITE_PRIMITIVE_ERROR: Line segments contains objects that are not LineSegment objects.');
      else {
        if (arrayHasErrors)
          errors.push('PATH_COMPOSITE_PRIMITIVE_ERROR: Line segments has LineSegment objects with errors.');
        else {
          if (this.args.lineSegments.length < params.lineSegments.min)
            errors.push(`PATH_COMPOSITE_PRIMITIVE_ERROR: Insufficient line segments provided. Number of line segmments provided: ${this.args.lineSegments.length}. Must provide ${params.lineSegments.min} or more line segments.`);
        }
      }
    }

    if (!Validate.IsDefined(this.args.isClosed))
      errors.push('PATH_COMPOSITE_PRIMITIVE_ERROR: Is closed is undefined.');
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

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      start: {
        type: 'Coordinates'
      },
      lineSegments: {
        type: 'LineSegment',
        isArray: true,
        min: 1
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

//----------------------
// EXPORTS

exports.PathComposite = PathComposite;