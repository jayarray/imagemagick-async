let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let Coordinates = require(Path.join(Filepath.InputsDir(), 'coordinates.js')).Coordinates;
let PrimitivesBaseClass = require(Path.join(Filepath.PrimitivesDir(), 'primitivesbaseclass.js')).PrimitivesBaseClass;

//------------------------------------

class Circle extends PrimitivesBaseClass {
  constructor(properties) {
    super(properties);
  }

  /**
   * @override
   */
  static get Builder() {
    class builder {
      constructor() {
        this.name = 'Circle';
        this.args = {};
      }

      /**
       * @param {Coordinates} coordinates 
       */
      center(coordinates) {
        this.args.center = coordinates;
        return this.args;
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
       * @param {number} x 
       * @param {number} y 
       */
      offset(x, y) {
        this.offset = { x: x, y: y };
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
    let args = [];

    if (this.args.fillColor)
      args.push('-fill', this.args.fillColor.Info().hex.string);
    else
      args.push('-fill', 'none'); // Prevents default black fill color

    if (this.args.strokeColor)
      args.push('-stroke', this.args.strokeColor.Info().hex.string);

    if (this.args.strokeWidth)
      args.push('-strokewidth', this.args.strokeWidth);

    let center = Coordinates.Builder()
      .x(this.args.center.args.x + this.offset.x)
      .y(this.args.center.args.y + this.offset.y)
      .build();

    let edge = Coordinates.Builder()
      .x(this.args.edge.args.x + this.offset.x)
      .y(this.args.edge.args.y + this.offset.y)
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
        type: 'Coordinates'
      },
      edge: {
        type: 'Coordinates'
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

//------------------------------
// EXPORTS

exports.Circle = Circle;