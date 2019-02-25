let Path = require('path');
let Validate = require('./validate.js');
let Filepath = require('./filepath.js').Filepath;
let CanvasBaseClass = require(Path.join(Filepath.CanvasDir(), 'canvasbaseclass.js')).CanvasBaseClass;

//-----------------------------------

class ImageCanvas extends CanvasBaseClass {
  constructor(properties) {
    super(properties);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'ImageCanvas';
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
       * @param {number} source The source path.
       */
      source(source) {
        this.args.source = source;
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
        return new ImageCanvas(this);
      }
    }
    return Builder;
  }

  /**
   * @param {number} width Width (in pixels)
   * @param {number} height Height (in pixels)
   * @param {string} src Source
   */
  constructor(width, height, src) {
    super(width, height);
    this.src_ = src;
  }

  /** 
   * @override 
   **/
  Args() {
    let args = [this.args.source];

    if (this.primitives.length > 0)
      this.primitives.forEach(p => args = args.concat(p.Args()));

    return args;
  }

  /**
   * @override
   */
  Errors() {
    let params = ImageCanvas.Parameters();
    let errors = [];

    if (!Validate.IsDefined(this.args.width))
      errors.push('IMAGE_CANVAS_ERROR: Width is undefined.');
    else {
      if (!Validate.IsInteger(this.args.width))
        errors.push('IMAGE_CANVAS_ERROR: Width is not an integer.');
      else {
        if (this.args.width < params.width.min)
          errors.push(`IMAGE_CANVAS_ERROR: Width is out of bounds. Assigned value is: ${this.args.width}. Value must be greater than or equal to ${params.width.min}.`);
      }
    }

    if (!Validate.IsDefined(this.args.height))
      errors.push('IMAGE_CANVAS_ERROR: Height is undefined.');
    else {
      if (!Validate.IsInteger(this.args.height))
        errors.push('IMAGE_CANVAS_ERROR: Height is not an integer.');
      else {
        if (this.args.width < params.height.min)
          errors.push(`IMAGE_CANVAS_ERROR: Height is out of bounds. Assigned value is: ${this.args.height}. Value must be greater than or equal to ${params.height.min}.`);
      }
    }

    if (!Validate.IsDefined(this.args.source))
      errors.push('IMAGE_CANVAS_ERROR: Source is not defined.');
    else {
      if (!Validate.IsString(this.args.source))
        errors.push('IMAGE_CANVAS_ERROR: Source is not a string.');
      else {
        if (Validate.IsEmptyString(this.args.source))
          errors.push('IMAGE_CANVAS_ERROR: Source is empty string.');
        else if (Validate.IsWhitespace(this.args.source))
          errors.push('IMAGE_CANVAS_ERROR: Source is whitespace.');
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
      source: {
        type: 'string'
      }
    };
  }
}

//-----------------------------
// EXPORTS

exports.ImageCanvas = ImageCanvas;