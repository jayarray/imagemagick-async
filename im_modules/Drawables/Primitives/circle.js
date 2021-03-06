let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let Coordinates = require(Path.join(Filepath.InputsDir(), 'coordinates.js')).Coordinates;
let PrimitivesBaseClass = require(Path.join(Filepath.PrimitivesDir(), 'primitivesbaseclass.js')).PrimitivesBaseClass;

//------------------------------------

class Circle extends PrimitivesBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Circle';
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
       * @param {Coordinates} coordinates 
       */
      edge(coordinates) {
        this.args.edge = coordinates;
        return this;
      }

      /**
       * @param {Color} color The color of the line making up the circle. (Valid color format string used in Image Magick) (Optional)
       */
      strokeColor(color) {
        this.args.strokeColor = color;
        return this;
      }

      /**
       * @param {number} n Width of the line making up the circle. (Larger values produce thicker lines.) (Optional)
       */
      strokeWidth(n) {
        this.args.strokeWidth = n;
        return this;
      }

      /**
       * @param {Color} color The color to fill the circle. (Valid color format string used in Image Magick) (Optional)
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
        return new Circle(this);
      }
    }
    return new Builder();
  }

  /** 
   * @override
  */
  Args() {
    let params = Circle.Parameters();
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


    let cx = this.args.center.args.x;
    let cy = this.args.center.args.y;

    if (this.args.offset) {
      cx += this.args.offset.args.x;
      cy += this.args.offset.args.y;
    }

    let center = Coordinates.Builder
      .x(cx)
      .y(cy)
      .build();


    let ex = this.args.edge.args.x;
    let ey = this.args.edge.args.y;

    if (this.args.offset) {
      ex += this.args.offset.args.x;
      ey += this.args.offset.args.y;
    }

    let edge = Coordinates.Builder
      .x(ex)
      .y(ey)
      .build();

    args.push('-draw', `circle ${center.String()} ${edge.String()}`);

    return args;
  }

  /**
   * @override
   */
  Errors() {
    let params = Circle.Parameters();
    let errors = [];
    let prefix = 'CIRCLE_PRIMITIVE_ERROR';

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

    let edgeErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Edge')
      .condition(
        new Err.ObjectCondition.Builder(this.args.edge)
          .typeName('Coordinates')
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();

    if (edgeErr)
      errors.push(edgeErr);

    // Checks optional args

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

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      center: {
        type: 'Inputs.Coordinates',
        required: true
      },
      edge: {
        type: 'Inputs.Coordinates',
        required: true
      },
      strokeColor: {
        type: 'Color',
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

//------------------------------
// EXPORTS

exports.Circle = Circle;