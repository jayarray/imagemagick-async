let Path = require('path');
let Validate = require('./validate.js');
let Filepath = require('./filepath.js').Filepath;
let CanvasBaseClass = require(Path.join(Filepath.CanvasDir(), 'canvasbaseclass.js')).CanvasBaseClass;

//----------------------------------------
// COLOR CANVAS

class NoiseCanvas extends CanvasBaseClass {
  constructor(properties) {
    super(properties);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'NoiseCanvas';
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
       * @param {Array<Primitive>} primitives A list of Primitive types to draw onto the canvas (Optional)
       */
      primitives(primitives) {
        this.primitives = primitives;
        return this;
      }

      build() {
        return new NoiseCanvas(this);
      }
    }
    return Builder;
  }

  /**
   * @override
   */
  Args() {
    let args = ['-size', `${this.args.width}x${this.args.height}`, 'canvas:', '+noise', 'Random'];

    if (this.primitives.length > 0)
      this.primitives.forEach(p => args = args.concat(p.Args()));

    return args;
  }

  /**
   * @override
   */
  Errors() {
    let params = NoiseCanvas.Parameters();
    let errors = [];

    if (!Validate.IsDefined(this.args.width))
      errors.push('NOISE_CANVAS_ERROR: Width is undefined.');
    else {
      if (!Validate.IsInteger(this.args.width))
        errors.push('NOISE_CANVAS_ERROR: Width is not an integer.');
      else {
        if (this.args.width < params.width.min)
          errors.push(`NOISE_CANVAS_ERROR: Width is out of bounds. Assigned value is: ${this.args.width}. Value must be greater than or equal to ${params.width.min}.`);
      }
    }

    if (!Validate.IsDefined(this.args.height))
      errors.push('NOISE_CANVAS_ERROR: Height is undefined.');
    else {
      if (!Validate.IsInteger(this.args.height))
        errors.push('NOISE_CANVAS_ERROR: Height is not an integer.');
      else {
        if (this.args.height < params.height.min)
          errors.push(`NOISE_CANVAS_ERROR: Height is out of bounds. Assigned value is: ${this.args.height}. Value must be greater than or equal to ${params.height.min}.`);
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
      }
    };
  }
}

//-----------------------------
// EXPORTS

exports.NoiseCanvas = NoiseCanvas;