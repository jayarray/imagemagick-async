let Path = require('path');
let Validate = require('./validate.js');
let Filepath = require('./filepath.js').Filepath;
let CanvasBaseClass = require(Path.join(Filepath.CanvasDir(), 'canvasbaseclass.js')).CanvasBaseClass;

//-----------------------------------

class GradientCanvas extends CanvasBaseClass {
  constructor(properties) {
    super(properties);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'GradientCanvas';
        this.args = {};
        this.primitives = [];
      }

      /**
       * @param {number} width Width in pixels.
       */
      width(width) {
        this.width = width;
        return this;
      }

      /**
       * @param {number} height Height in pixels. 
       */
      height(height) {
        this.height = height;
        return this;
      }

      /**
       * @param {Gradient} gradient 
       */
      gradient(gradient) {
        this.gradient = gradient;
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
        return new GradientCanvas(this);
      }
    }
    return Builder;
  }

  /**
   * @override
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    let args = ['-size', `${this.args.width}x${this.args.height}`].concat(this.args.gradient.Args());

    if (this.primitives.length > 0)
      this.primitives.forEach(p => args = args.concat(p.Args()));

    return args;
  }

  /**
   * @override
   */
  Errors() {
    let params = GradientCanvas.Parameters();
    let errors = [];

    if (!Validate.IsDefined(this.args.width))
      errors.push('GRADIENT_CANVAS_ERROR: Width is undefined.');
    else {
      if (!Validate.IsInteger(this.args.width))
        errors.push('GRADIENT_CANVAS_ERROR: Width is not an integer.');
      else {
        if (this.args.width < params.width.min)
          errors.push(`GRADIENT_CANVAS_ERROR: Width is out of bounds. Assigned value is: ${this.args.width}. Value must be greater than or equal to ${params.width.min}.`);
      }
    }

    if (!Validate.IsDefined(this.args.height))
      errors.push('GRADIENT_CANVAS_ERROR: Height is undefined.');
    else {
      if (!Validate.IsInteger(this.args.height))
        errors.push('GRADIENT_CANVAS_ERROR: Height is not an integer.');
      else {
        if (this.args.height < params.height.min)
          errors.push(`GRADIENT_CANVAS_ERROR: Height is out of bounds. Assigned value is: ${this.args.height}. Value must be greater than or equal to ${params.height.min}.`);
      }
    }

    if (!Validate.IsDefined(this.args.gradient))
      errors.push('GRADIENT_CANVAS_ERROR: Gradient is undefined.');
    else {
      if (this.args.gradient.type != 'Gradient')
        errors.push('GRADIENT_CANVAS_ERROR: Gradient is not a Gradient object.');
      else {
        let errs = this.args.gradient.Errors();
        if (errs.length > 0)
          errors.push(`GRADIENT_CANVAS_ERROR: Gradient has errors: ${errs.join(' ')}`);
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
      gradient: {
        type: 'Gradient'
      }
    };
  }
}

//----------------------------
// EXPORTS

exports.GradientCanvas = GradientCanvas;