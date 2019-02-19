let Path = require('path');
let Validate = require('./validate.js');
let Filepath = require('./filepath.js').Filepath;
let CanvasBaseClass = require(Path.join(Filepath.CanvasDir(), 'canvasbaseclass.js')).CanvasBaseClass;

//---------------------------

class LabelCanvas extends CanvasBaseClass {
  constructor(properties) {
    super(properties);
  }

  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'LabelCanvas';
        this.args = {};
        this.primitives = [];
      }

      /**
       * @param {number} width Width in pixels. (Optional) 
       */
      width(width) {
        this.width = width;
        return this;
      }

      /**
       * @param {number} height Height in pixels. (Optional) 
       */
      height(height) {
        this.height = height;
        return this;
      }

      /**
       * @param {string} text The text that makes up the label.
       */
      text(text) {
        this.text = text;
        return this;
      }

      /**
       * @param {string} font Font name (Optional) 
       */
      font(font) {
        this.font = font;
        return this;
      }

      /**
       * @param {number} fontSize Font size (Optional)
       */
      fontSize(fontSize) {
        this.fontSize = fontSize;
        return this;
      }

      /**
       * @param {number} kerning Spacing between glyphs/symbols. (Optional)
       */
      kerning(kerning) {
        this.kerning = kerning;
        return this;
      }

      /**
       * @param {number} strokeWidth Thickness of the text outline. (Optional) 
       */
      strokeWidth(strokeWidth) {
        this.strokeWidth = strokeWidth;
        return this;
      }

      /**
       * @param {Color} strokeColor The color of the text outline. (Optional) 
       */
      strokeColor(strokeColor) {
        this.strokeColor = strokeColor;
        return this;
      }

      /**
       * @param {Color} fillColor The color inside of the text outline. (Optional) 
       */
      fillColor(fillColor) {
        this.fillColor = fillColor;
        return this;
      }

      /**
       * @param {Color} underColor The color under the text. (Different than background color). (Optional) 
       */
      underColor(underColor) {
        this.underColor = underColor;
        return this;
      }

      /**
       * @param {Color} backgroundColor The background color for the entire label. (Optional) 
       */
      backgroundColor(backgroundColor) {
        this.backgroundColor = backgroundColor;
        return this;
      }

      /**
       * @param {string} gravity Gravity of the text. (Optional)
       */
      gravity(gravity) {
        this.gravity = gravity;
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
   * @override
   */
  Args() {
    let args = [];

    if (this.args.width && this.args.height)
      args.push('-size', `${this.args.width}x${this.args.height}`);

    args.push('-background');
    if (this.args.backgroundColor)
      args.push(this.args.backgroundColor);
    else
      args.push('none');

    args.push('-fill');
    if (this.args.fillColor)
      args.push(this.args.fillColor);
    else
      args.push('none');

    if (this.args.font)
      args.push('-font', this.args.font);

    if (this.args.strokeWidth)
      args.push('-strokewidth', this.args.strokeWidth);

    if (this.args.strokeColor)
      args.push('-stroke', this.args.strokeColor);

    if (this.args.underColor)
      args.push('-undercolor', this.args.underColor);

    if (this.args.gravity)
      args.push('-gravity', this.args.gravity);

    if (this.args.kerning)
      args.push('-kerning', this.args.kerning);

    if (this.args.fontSize)
      args.push('-pointsize', this.args.fontSize);

    args.push(`label:${this.args.text}`);

    if (this.primitives.length > 0)
      this.primitives.forEach(p => args = args.concat(p.Args()));

    return args;
  }

  /**
   * @override
   */
  Errors() {
    let params = LabelCanvas.Parameters();
    let errors = [];

    // Check required args

    if (!Validate.IsDefined(this.args.text))
      errors.push('LABEL_CANVAS_ERROR: Text is undefined');
    else {
      if (!Validate.IsString(this.args.text))
        errors.push('LABEL_CANVAS_ERROR: Text is not a string.');
      else {
        if (Validate.IsEmptyString(this.args.text))
          errors.push('LABEL_CANVAS_ERROR: Text is empty string.');
        else if (Validate.IsWhitespace(this.args.text))
          errors.push('LABEL_CANVAS_ERRROR: Text is whitespace.');
      }
    }

    // Check optional args

    if (this.args.width) {
      if (!Validate.IsInteger(this.args.width))
        errors.push('LABEL_CANVAS_ERROR: Width is not an integer.');
      else {
        if (this.args.width < params.width.min)
          errors.push(`LABEL_CANVAS_ERROR: Width is out of bounds. Assigned value is: ${this.args.width}. Value must be greater than or equal to ${params.width.min}.`);
      }
    }

    if (this.args.height) {
      if (!Validate.IsInteger(this.args.height))
        errors.push('LABEL_CANVAS_ERROR: Height is not an integer.');
      else {
        if (this.args.height < params.height.min)
          errors.push(`LABEL_CANVAS_ERROR: Height is out of bounds. Assigned value is: ${this.args.height}. Value must be greater than or equal to ${params.height.min}.`);
      }
    }

    if (this.args.text) {
      if (!Validate.IsString(this.args.text))
        errors.push('LABEL_CANVAS_ERROR: Text is not a string.');
      else {
        if (Validate.IsEmptyString(this.args.text))
          errors.push('LABEL_CANVAS_ERROR: Text is empty string.');
      }
    }

    if (this.args.font) {
      if (!Validate.IsString(this.args.font))
        errors.push('LABEL_CANVAS_ERROR: Font is not a string.');
      else {
        if (Validate.IsEmptyString(this.args.font))
          errors.push('LABEL_CANVAS_ERROR: Font is empty string.');
        else if (Validate.IsWhitespace(this.args.text))
          error.spush('LABEL_CANVAS_ERROR: Font is whitespace.');
      }
    }

    if (this.args.fontSize) {
      if (!Validate.IsNumber(this.args.fontSize))
        errors.push('LABEL_CANVAS_ERROR: Font size is not a number.');
      else {
        if (this.args.fontSize < params.fontSize.min)
          errors.push(`LABEL_CANVAS_ERROR: Font size is out of bounds. Assigned value is: ${this.args.fontSize}. Value must be greater than or equal to ${params.fontSize.min}.`);
      }
    }

    if (this.args.kerning) {
      if (!Validate.IsNumber(this.args.kerning))
        errors.push('LABEL_CANVAS_ERROR: Kerning is not a number.');
      else {
        if (this.args.kerning < params.kerning.min)
          errors.push(`LABEL_CANVAS_ERROR: Kerning is out of bounds. Assigned value is: ${this.args.kerning}. Value must be greater than or equal to ${params.kerning.min}.`);
      }
    }

    if (this.args.strokeWidth) {
      if (!Validate.IsInteger(this.args.strokeWidth))
        errors.push('LABEL_CANVAS_ERROR: Stroke width is not an integer.');
      else {
        if (this.args.strokeWidth < params.strokeWidth.min)
          errors.push(`LABEL_CANVAS_ERROR: Stroke width is out of bounds. Assigned value is: ${this.args.strokeWidth}. Value must be greater than or equal to ${params.strokeWidth.min}.`);
      }
    }

    if (this.args.strokeColor) {
      if (this.args.strokeColor.type != 'Color')
        error.push('LABEL_CANVAS_ERROR: Stroke color is not a Color type.');
      else {
        let errs = this.args.strokeColor.Errors();
        if (errs.length > 0)
          errors.push(`LABEL_CANVAS_ERROR: Stroke color has errors: ${errs.join(' ')}`);
      }
    }

    if (this.args.fillColor) {
      if (this.args.fillColor.type != 'Color')
        error.push('LABEL_CANVAS_ERROR: Fill color is not a Color type.');
      else {
        let errs = this.args.fillColor.Errors();
        if (errs.length > 0)
          errors.push(`LABEL_CANVAS_ERROR: Fill color has errors: ${errs.join(' ')}`);
      }
    }

    if (this.args.underColor) {
      if (this.args.underColor.type != 'Color')
        error.push('LABEL_CANVAS_ERROR: Under color is not a Color type.');
      else {
        let errs = this.args.underColor.Errors();
        if (errs.length > 0)
          errors.push(`LABEL_CANVAS_ERROR: Fill color has errors: ${errs.join(' ')}`);
      }
    }

    if (this.args.backgroundColor) {
      if (this.args.backgroundColor.type != 'Color')
        error.push('LABEL_CANVAS_ERROR: Background color is not a Color type.');
      else {
        let errs = this.args.backgroundColor.Errors();
        if (errs.length > 0)
          errors.push(`LABEL_CANVAS_ERROR: Background color has errors: ${errs.join(' ')}`);
      }
    }

    if (this.args.gravity) {
      if (!Validate.IsString(this.args.gravity))
        errors.push('LABEL_CANVAS_ERROR: Gravity is not a string.');
      else {
        if (Validate.IsEmptyString(this.args.font))
          errors.push('LABEL_CANVAS_ERROR: Gravity is empty string.');
        else if (Validate.IsWhitespace(this.args.text))
          error.spush('LABEL_CANVAS_ERROR: Gravity is whitespace.');
        else {
          if (!params.gravity.options.includes(this.args.gravity))
            errors.push(`LABEL_CANVAS_ERROR: Gravity is invalid. Assigned value is : ${this.args.gravity}. Value must be assigned to one of the following: ${params.gravity.options.join(', ')}.`);
        }
      }
    }

    return errors;
  }

  /**
   * @overall
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
      text: {
        type: 'string'
      },
      font: {
        type: string
      },
      fontSize: {
        type: 'number',
        min: 1
      },
      kerning: {
        type: 'number',
        min: -3
      },
      strokeWidth: {
        type: 'number',
        subtype: 'number',
        min: 1
      },
      strokeColor: {
        typer: 'Color'
      },
      fillColor: {
        type: 'Color'
      },
      underColor: {
        type: 'Color'
      },
      backgroundColor: {
        type: 'Color'
      },
      gravity: {
        type: 'string',
        options: [
          "Center",
          "East",
          "North",
          "NorthEast",
          "NorthWest",
          "South",
          "SouthEast",
          "SouthWest",
          "West"
        ]
      }
    };
  }
}

//------------------------------
// EXPORTS

exports.LabelCanvas = LabelCanvas;