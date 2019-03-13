let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let Validate = require(Path.join(RootDir, 'validate.js'));
let Coordinates = require(Path.join(Filepath.InputsDir(), 'coordinates.js')).Coordinates;
let PrimitivesBaseClass = require(Path.join(Filepath.PrimitivesDir(), 'primitivesbaseclass.js')).PrimitivesBaseClass;

//-----------------------------------

class PathComposite extends PrimitivesBaseClass {
  constructor(builder) {
    super(builder);
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
       * @param {Coordinates} coordinates The start coordinates of your path.
       */
      start(coordinates) {
        this.args.start = coordinates;
        return this;
      }

      /**
       * @param {Array<LineSegment>} lineSegments A list of LineSegment objects to be connected in the order provided.
       */
      lineSegments(lineSegments) {
        this.args.lineSegments = lineSegments;
        return this;
      }

      /**
       * @param {Color} color The color of the line connecting all the points. (Optional)
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
       * @param {Color} color The color to fill the path with. (Optional)
       */
      fillColor(color) {
        this.args.fillColor = color;
        return this;
      }

      /**
       * @param {boolean} isClosed Set to true if you wish to connect the last point back to the first one (if not done already) with a straight line. Else, set to false.
       */
      isClosed(isClosed) {
        this.args.isClosed = isClosed;
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
        return new PathComposite(this);
      }
    }
    return new Builder();
  }

  /** 
   * Get a list of points in string form that have the X and Y offsets applied to them.
   * @returns {string} Returns a space-delimited string representing all points in the path.
   */
  LineSegmentsToString() {
    // Apply offset to all line segments
    this.args.lineSegments.forEach(l => {
      l.args.offset = this.args.offset;
    });

    return this.args.lineSegments.map(x => x.String()).join(' ');
  }

  /** 
   * @override
   */
  Args() {
    let params = PathComposite.Parameters();
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
    let prefix = 'PATH_COMPOSITE_PRIMITIVE_ERROR';

    // Check required args

    let startErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Start')
      .condition(
        new Err.ObjectCondition.Builder(this.args.start)
          .typeName('Coordinates')
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();

    if (startErr)
      errors.push(startErr);

    let lineSegmentsErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Line segments')
      .condition(
        new Err.ArrayCondition.Builder(this.args.lineSegments)
          .validType('LineSegment')
          .minLength(params.lineSegments.min)
          .build()
      )
      .build()
      .String();

    if (lineSegmentsErr)
      errors.push(lineSegmentsErr);

    let arrayHasErrors = Validate.ArrayHasErrors(this.args.lineSegments);
    if (arrayHasErrors)
      errors.push(`${prefix}: Line segmenets contains a LineSegment object with errors.`);

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

    if (!Validate.IsDefined(this.args.isClosed)) {
      let isClosedErr = Err.ErrorMEssage.Builder
        .prefix(prefix)
        .varName('Is closed flag')
        .condition(
          new Err.BooleanCondition.Builder(this.args.isClosed)
            .build()
        )
        .build()
        .String();

      if (isClosedErr)
        errors.push(isClosedErr);
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
      isClosed: {
        type: 'boolean',
        default: false
      },
      offset: {
        type: 'Offset'
      }
    };
  }
}

//----------------------
// EXPORTS

exports.PathComposite = PathComposite;