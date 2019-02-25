let Path = require('path');
let Validate = require('./validate.js');
let Filepath = require('./filepath.js').Filepath;
let CanvasBaseClass = require(Path.join(Filepath.CanvasDir(), 'canvasbaseclass.js')).CanvasBaseClass;

//----------------------------------------
// COLOR CANVAS

class ColorCanvas extends CanvasBaseClass {
  constructor(properties) {
    super(properties);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'ColorCanvas';
        this.args = {};
        this.primitives = [];
      }

      /**
       * @param {number} width Width in pixels.
       */
      width(width) {
        this.args.width = width;
        return this;
      }

      /**
       * @param {number} height Height in pixels.
       */
      height(height) {
        this.args.height = height;
        return this;
      }

      /**
       * @param {Color} color 
       */
      color(color) {
        this.args.color = color;
        return this;
      }

      /**
       * @param {Array<Primitive>} primitives A list of Primitive types to draw onto the canvas (Optional)
       */
      primitives(primitives) {
        this.primitives = primitives;
        return this;
      }

      build() {
        return new ColorCanvas(this);
      }
    }
    return Builder;
  }

  /**
   * @override
   */
  Args() {
    let args = ['-size', `${this.args.width}x${this.args.height}`, `canvas:${this.args.color.HexString()}`];

    if (this.primitives.length > 0)
      this.primitives.forEach(p => args = args.concat(p.Args()));

    return args;
  }

  /**
   * @override
   */
  Errors() {
    let params = ColorCanvas.Parameters();
    let errors = [];

    // Check required args

    if (!Validate.IsDefined(this.args.width))
      errors.push('COLOR_CANVAS_ERROR: Width is undefined.');
    else {
      if (!Validate.IsInteger(this.args.width))
        errors.push('COLOR_CANVAS_ERROR: Width is not an integer.');
      else {
        if (this.args.width < params.width.min)
          errors.push(`COLOR_CANVAS_ERROR: Width is out of bounds. Assigned value is: ${this.args.width}. Value must be greater than or equal to: ${params.width.min}.`);
      }
    }

    if (!Validate.IsDefined(this.args.height))
      errors.push('COLOR_CANVAS_ERROR: Height is undefined.');
    else {
      if (!Validate.IsInteger(this.args.height))
        errors.push('COLOR_CANVAS_ERROR: Height is not an integer.');
      else {
        if (this.args.height < params.height.min)
          errors.push(`COLOR_CANVAS_ERROR: Height is out of bounds. Assigned value is: ${this.args.height}. Value must be greater than or equal to: ${params.height.min}.`);
      }
    }

    if (!Validate.IsDefined(this.args.color))
      errors.push('COLOR_CANVAS_ERROR: Color is undefined.');
    else {
      if (this.args.color.type != 'Color')
        errors.push('COLOR_CANVAS_ERROR: Color is not a Color object.');
      else {
        let errs = this.args.color.Errors();
        if (errs.length > 0)
          errors.push(`COLOR_CANVAS_ERROR: Color has errors: ${errs.join(' ')}`);
      }
    }

    // Check optional args

    if (this.primitives) {
      if (!Validate.IsArray(this.primitives))
        errors.push('COLOR_CANVAS_ERROR: Primtiives is not an array.');
      else {
        if (this.primitives.length > 0) {
          let arrayHasInvalidTypes = Validate.ArrayHasInvalidTypes(this.primitives, 'Primitive');
          let arrayHasErrors = Validate.ArrayHasErrors(this.primitives);

          if (arrayHasInvalidTypes)
            error.push('COLOR_CANVAS_ERROR: Primitives contains objects that are not Primitive types.');
          else {
            if (arrayHasErrors)
              errors.push('COLOR_CANVAS_ERROR: Primitives has Primitive objects with errors.');
          }
        }
      }
    }

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      width: {
        type: 'number',
        subtype: 'integer',
        min: 1
      },
      height: {
        type: 'number',
        subtype: 'integer',
        min: 1
      },
      color: {
        type: 'Color'
      },
      primitives: {
        type: 'Primitive',
        isArray: true
      }
    };
  }
}

//-----------------------------
// EXPORTS

exports.ColorCanvas = ColorCanvas;