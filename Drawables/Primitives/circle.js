let Path = require('path');
let Validate = require('./validate.js');
let Filepath = require('./filepath.js').Filepath;
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
       * @param {Coordinates} center 
       */
      center(center) {
        this.args.center = center;
        return this.args;
      }

      /**
       * @param {Coordinates} edge 
       */
      edge(edge) {
        this.args.edge = edge;
        return this;
      }

      /**
       * @param {Color} strokeColor The color of the line making up the circle. (Valid color format string used in Image Magick) (Optional)
       */
      strokeColor(strokeColor) {
        this.args.strokeColor = strokeColor;
        return this;
      }

      /**
       * @param {number} strokeWidth Width of the line making up the circle. (Larger values produce thicker lines.) (Optional)
       */
      strokeWidth(strokeWidth) {
        this.args.strokeWidth = strokeWidth;
        return this;
      }

      /**
       * @param {Color} fillColor The color to fill the circle. (Valid color format string used in Image Magick) (Optional)
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
        return new Circle(this);
      }
    }
    return Builder;
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
    let errors = [];

    // Check required args

    if (!Validate.IsDefined(this.args.center))
      errors.push('CIRCLE_PRIMITIVE_ERROR: Center is undefined.');
    else {
      if (this.args.center.type != 'Coordinates')
        errors.push('CIRCLE_PRIMITIVE_ERROR: Center is not a Coordinates object.');
      else {
        let errs = this.args.center.Errors();
        if (errs.length > 0)
          errors.push(`CIRCLE_PRIMITIVE_ERROR: Center has errors: ${errs.join(' ')}`);
      }
    }

    if (!Validate.IsDefined(this.args.edge))
      errors.push('CIRCLE_PRIMITIVE_ERROR: Edge is undefined.');
    else {
      if (this.args.edge.type != 'Coordinates')
        errors.push('CIRCLE_PRIMITIVE_ERROR: Edge is not a Coordinates object.');
      else {
        let errs = this.args.edge.Errors();
        if (errs.length > 0)
          errors.push(`CIRCLE_PRIMITIVE_ERROR: Center has errors: ${errs.join(' ')}`);
      }
    }

    // Checks optional args

    if (this.args.strokeColor) {
      if (this.args.strokeColor.type != 'Color')
        errors.push('CIRCLE_PRIMITIVE_ERROR: Stroke color is not a Color object.');
      else {
        let errs = this.args.strokeColor.Errors();
        if (errs.length > 0)
          errors.push(`CIRCLE_PRIMITIVE_ERROR: Stroke color has some errors: ${errs.join(' ')}`);
      }
    }

    if (this.args.strokeWidth) {
      if (!Validate.IsNumber(this.args.strokeWidth))
        errors.push('CIRCLE_PRIMITIVE_ERROR: Stroke width is not a number.');
      else {
        if (this.args.strokeWidth < params.strokeWidth.min)
          errors.push(`CIRCLE_PRIMITIVE_ERROR: Stroke width is out of bounds. Assigned value is: ${this.args.strokeWidth}. Value must be greater than or equal to ${params.strokeWidth.min}.`);
      }
    }

    if (this.args.fillColor) {
      if (this.args.fillColor.type != 'Color')
        errors.push('CIRCLE_PRIMITIVE_ERROR: Fill color is not a Color object.');
      else {
        let errs = this.args.fillColor.Errors();
        if (errs.length > 0)
          errors.push(`CIRCLE_PRIMITIVE_ERROR: Fill color has some errors: ${errs.join(' ')}`);
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