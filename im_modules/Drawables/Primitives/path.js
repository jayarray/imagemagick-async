let Path_ = require('path');

let PathParts = __dirname.split(Path_.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path_.sep);

let Err = require(Path_.join(RootDir, 'error.js'));
let Filepath = require(Path_.join(RootDir, 'filepath.js')).Filepath;
let Validate = require(Path_.join(RootDir, 'validate.js'));
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
       * @param {Offset} offset
       */
      offset(offset) {
        this.args.offset = offset;
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
      let x = p.args.x;
      let y = p.args.y;

      if (this.args.offset) {
        x += this.args.offset.args.x;
        y += this.args.offset.args.y
      }

      let pStr = Coordinates.Builder
        .x(x)
        .y(y)
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
    let params = Path.Parameters();
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
        type: 'Inputs.Coordinates',
        isArray: true,
        min: 2,
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
        required: false
      },
      fillColor: {
        type: 'Inputs.Color',
        required: false
      },
      isClosed: {
        type: 'boolean',
        default: false,
        required: false
      },
      offset: {
        type: 'Inputs.Offset',
        required: false
      }
    };
  }
}

//-------------------------
// EXPORTS

exports.Path = Path;