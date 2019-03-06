let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let Validate = require(Path.join(RootDir, 'validate.js'));
let Coordinates = require(Path_.join(Filepath.InputsDir(), 'coordinates.js')).Coordinates;
let PrimitivesBaseClass = require(Path_.join(Filepath.PrimitivesDir(), 'primitivesbaseclass.js')).PrimitivesBaseClass;

//-----------------------------------

class Path extends PrimitivesBaseClass {
  constructor(builder) {
    super(builder);
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
       * @param {Array<Coordinates>} coordinatesArr A list of coordinates to be connected by a line in the order provided.
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
       * 
       * @param {Color} color The color to fill the path with. (Valid color format string used in Image Magick) (Optional)
       */
      fillColor(color) {
        this.args.fillColor = color;
        return this;
      }

      /**
       * @param {boolean} bool Set to true if you wish to connect the last point back to the first one (if not done already). Else, set to false.
       */
      isClosed(bool) {
        this.args.isClosed = bool;
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
    return new Builder();
  }

  /** 
   * Get a list of points in string form that have the X and Y offsets applied to them.
   * @returns {string} Returns a space-delimited string representing all points in the path.
   */
  PointsToStringArray() {
    let strArray = [];

    this.args.points.forEach(p => {
      let pStr = Coordinates.Builder
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
      args.push('-fill', this.args.fillColor.String());
    else
      args.push('-fill', 'none'); // Prevents default black fill color

    if (this.args.strokeColor)
      args.push('-stroke', this.args.strokeColor.String());

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
    let prefix = 'PATH_PRIMITIVE_ERROR';

    // Check required args

    let pointsErr = Err.ErrorMEssage.Builder
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
      errors.push(`${prefix}: Points contains Coordinate objects with errors.`);

    // Check optional args

    if (this.args.strokeColor) {
      let strokeColorErr = Err.ErrorMEssage.Builder
        .prefix(prefix)
        .varName('Stroke color')
        .condition(
          new Err.ObjectCondition.Builder(this.args.strokeColor)
            .typeName('Color')
            .checkForErrors(true)
            .build()
        )
        .build()
        .string();

      if (strokeColorErr)
        errors.push(strokeColorErr);
    }

    if (this.args.strokeWidth) {
      let widthErr = Err.ErrorMEssage.Builder
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

      if (widthErr)
        errors.push(widthErr);
    }

    if (this.args.fillColor) {
      let fillColorErr = Err.ErrorMEssage.Builder
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

    if (this.args.isClosed) {
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