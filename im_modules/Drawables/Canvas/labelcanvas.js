let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let GravityValues = require(Path.join(Filepath.ConstantsDir(), 'gravity.json')).values;
let CanvasBaseClass = require(Path.join(Filepath.CanvasDir(), 'canvasbaseclass.js')).CanvasBaseClass;

//---------------------------

class LabelCanvas extends CanvasBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'LabelCanvas';
        this.args = {};
        this.primitives = [];
      }

      /**
       * @param {number} n Width in pixels. (Optional) 
       */
      width(n) {
        this.args.width = n;
        return this;
      }

      /**
       * @param {number} n Height in pixels. (Optional) 
       */
      height(n) {
        this.args.height = n;
        return this;
      }

      /**
       * @param {string} str The text that makes up the label.
       */
      text(str) {
        this.args.text = str;
        return this;
      }

      /**
       * @param {string} name Font name (Optional) 
       */
      font(name) {
        this.args.font = name;
        return this;
      }

      /**
       * @param {number} n Font size (Optional)
       */
      fontSize(n) {
        this.args.fontSize = n;
        return this;
      }

      /**
       * @param {number} n Spacing between glyphs/symbols. (Optional)
       */
      kerning(n) {
        this.args.kerning = n;
        return this;
      }

      /**
       * @param {number} n Thickness of the text outline. (Optional) 
       */
      strokeWidth(n) {
        this.args.strokeWidth = n;
        return this;
      }

      /**
       * @param {Color} color The color of the text outline. (Optional) 
       */
      strokeColor(color) {
        this.args.strokeColor = color;
        return this;
      }

      /**
       * @param {Color} color The color inside of the text outline. (Optional) 
       */
      fillColor(color) {
        this.args.fillColor = color;
        return this;
      }

      /**
       * @param {Color} color The color under the text. (Different than background color). (Optional) 
       */
      underColor(color) {
        this.args.underColor = color;
        return this;
      }

      /**
       * @param {Color} color The background color for the entire label. (Optional) 
       */
      backgroundColor(color) {
        this.args.backgroundColor = color;
        return this;
      }

      /**
       * @param {string} str Gravity of the text. (Optional)
       */
      gravity(str) {
        this.args.gravity = str;
        return this;
      }

      build() {
        return new LabelCanvas(this);
      }
    }
    return new Builder();
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
      args.push(this.args.backgroundColor.String());
    else
      args.push('none');

    args.push('-fill');
    if (this.args.fillColor)
      args.push(this.args.fillColor.String());
    else
      args.push('none');

    if (this.args.font)
      args.push('-font', this.args.font);

    if (this.args.strokeWidth)
      args.push('-strokewidth', this.args.strokeWidth);

    if (this.args.strokeColor)
      args.push('-stroke', this.args.strokeColor.String());

    if (this.args.underColor)
      args.push('-undercolor', this.args.underColor.String());

    if (this.args.gravity)
      args.push('-gravity', this.args.gravity);

    if (this.args.kerning)
      args.push('-kerning', this.args.kerning);

    if (this.args.fontSize)
      args.push('-pointsize', this.args.fontSize);

    args.push(`label:${this.args.text}`);

    return args;
  }

  /**
   * @override
   */
  Errors() {
    let params = LabelCanvas.Parameters();
    let errors = [];
    let prefix = 'LABEL_CANVAS_ERROR';

    // Check required args

    let textErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Text')
      .condition(
        new Err.StringCondition.Builder(this.args.text)
          .isEmpty(false)
          .isWhitespace(false)
          .build()
      )
      .build()
      .String();

    if (textErr)
      errors.push(textErr);

    // Check optional args

    if (this.args.width) {
      let widthErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Width')
        .condition(
          new Err.NumberCondition.Builder(this.args.width)
            .isInteger(true)
            .min(params.width.min)
            .build()
        )
        .build()
        .String();

      if (widthErr)
        errors.push(widthErr);
    }

    if (this.args.height) {
      let heightErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Height')
        .condition(
          new Err.NumberCondition.Builder(this.args.height)
            .isInteger(true)
            .min(params.height.min)
            .build()
        )
        .build()
        .String();

      if (heightErr)
        errors.push(heightErr);
    }

    if (this.args.font) {
      let fontErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Font')
        .condition(
          new Err.StringCondition.Builder(this.args.font)
            .isEmpty(false)
            .isWhitespace(false)
            .build()
        )
        .build()
        .String();

      if (fontErr)
        errors.push(fontErr);
    }

    if (this.args.fontSize) {
      let fontSizeErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Font size')
        .condition(
          new Err.NumberCondition.Builder(this.args.fontSize)
            .min(params.fontSize.min)
            .build()
        )
        .build()
        .String();

      if (fontSizeErr)
        errors.push(fontSizeErr);
    }

    if (this.args.kerning) {
      let kerningErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Kerning')
        .condition(
          new Err.NumberCondition.Builder(this.args.kerning)
            .min(params.kerning.min)
            .build()
        )
        .build()
        .String();

      if (kerningErr)
        errors.push(kerningErr);
    }

    if (this.args.strokeWidth) {
      let strokeWidthErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Stroke width')
        .condition(
          new Err.NumberCondition.Builder(this.args.strokeWidth)
            .min(params.strokeWidth.min)
            .build()
        )
        .build()
        .String();

      if (strokeWidthErr)
        errors.push(strokeWidthErr);
    }

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

    if (this.args.underColor) {
      let underColorErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Under color')
        .condition(
          new Err.ObjectCondition.Builder(this.args.underColor)
            .typeName('Color')
            .checkForErrors(true)
            .build()
        )
        .build()
        .String();

      if (underColorErr)
        errors.push(underColorErr);
    }

    if (this.args.backgroundColor) {
      let backgroundColorErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Background color')
        .condition(
          new Err.ObjectCondition.Builder(this.args.backgroundColor)
            .typeName('Color')
            .checkForErrors(true)
            .build()
        )
        .build()
        .String();

      if (backgroundColorErr)
        errors.push(backgroundColorErr);
    }

    if (this.args.gravity) {
      let gravityErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Gravity')
        .condition(
          new Err.StringCondition.Builder(this.args.gravity)
            .isEmpty(false)
            .isWhitespace(false)
            .include(GravityValues)
            .build()
        )
        .build()
        .String();

      if (gravityErr)
        errors.push(gravityErr);
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
      text: {
        type: 'string'
      },
      font: {
        type: 'string'
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
        options: GravityValues
      }
    };
  }
}

//------------------------------
// EXPORTS

exports.LabelCanvas = LabelCanvas;