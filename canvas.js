let VALIDATE = require('./validate.js');
let CanvasBaseClass = require('./canvasbaseclass.js').CanvasBaseClass;

//----------------------------------------
// COLOR CANVAS

class ColorCanvas extends CanvasBaseClass {
  /**
   * @param {number} width Width (in pixels)
   * @param {number} height Height (in pixels)
   * @param {string} color The color of the canvas. (Valid color format string used in Image Magick)
   */
  constructor(width, height, color) {
    super();
    this.width_ = width;
    this.height_ = height;
    this.color_ = color;
  }

  /**
   * @override
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    let args = ['-size', `${this.width_}x${this.height_}`, `canvas:${this.color_}`];

    if (this.PrimitiveTuples().length > 0)
      this.PrimitiveTuples().forEach(tuple => args = args.concat(tuple.primitive.Args(tuple.xOffset, tuple.yOffset)));

    return args;
  }

  /**
   * @override
   */
  Name() {
    return 'ColorCanvas';
  }

  /**
   * Create a Colorcanvas object with the specified properties.
   * @param {number} width Width (in pixels)
   * @param {number} height Height (in pixels)
   * @param {string} color The color of the canvas. (Valid color format string used in Image Magick)
   * @returns {ColorCanvas} Returns a PlainCanvas object. If inputs are invalid, it returns null.
   */
  static Create(width, height, color) {
    if (width < CONSTANTS.MIN_WIDTH || height < CONSTANTS.MIN_HEIGHT)
      return null;

    return new ColorCanvas(width, height, color);
  }
}

//----------------------------------------
// GRADIENT CANVAS

class GradientCanvas extends CanvasBaseClass {
  /**
   * @param {number} width in pixels
   * @param {number} height in pixels
   * @param {LinearGradient|RadialGradient} gradient
   */
  constructor(width, height, gradient) {
    super();
    this.width_ = width;
    this.height_ = height;
    this.gradient_ = gradient;
  }

  /**
   * @override
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    let args = ['-size', `${this.width_}x${this.height_}`].concat(this.gradient_.Args());

    if (this.PrimitiveTuples().length > 0)
      this.PrimitiveTuples().forEach(tuple => args = args.concat(tuple.primitive.Args(tuple.xOffset, tuple.yOffset)));

    return args;
  }

  /**
   * @override
   */
  Name() {
    return 'GradientCanvas';
  }

  /**
   * Create a GradientCanvas object with the specified gradient.
   * @param {number} width Width (in pixels)
   * @param {number} height Height (in pixels)
   * @param {Gradient} gradient
   * @returns {GradientCanvas} Returns a GradientCanvas object. If inputs are invalid, it returns null.
   */
  static Create(width, height, gradient) {
    if (width < CONSTANTS.MIN_WIDTH || height < CONSTANTS.MIN_HEIGHT || !gradient)
      return null;

    return new GradientCanvas(width, height, gradient);
  }
}

//------------------------------------
// IMAGE CANVAS

class ImageCanvas extends CanvasBaseClass {
  /**
   * @param {string} src Source
   */
  constructor(src) {
    super();
    this.src_ = src;
  }

  /** 
   * @override 
   * @returns {Array<string|number>} Returns an array of arguments.
   * */
  Args() {
    let args = [this.src_];

    if (this.PrimitiveTuples().length > 0)
      this.PrimitiveTuples().forEach(tuple => args = args.concat(tuple.primitive.Args(tuple.xOffset, tuple.yOffset)));

    return args;
  }

  /**
   * @override
   */
  Name() {
    return 'ImageCanvas';
  }

  /**
   * Create an ImageCanvas object. If inputs are invalid it returns null.
   * @param {string} src Source
   */
  static Create(src) {
    if (VALIDATE.IsStringInput(src))
      return null;

    return new ImageCanvas(src);
  }
}

//----------------------------------
// LABEL

class Label extends CanvasBaseClass {
  /**
   * @param {string} text Text string
   * @param {number} width Width in pixels. (Optional) 
   * @param {number} height Height in pixels. (Optional) 
   * @param {string} font Font name (Optional) 
   * @param {number} strokeWidth Thickness of the text outline. (Optional) 
   * @param {string} strokeColor The color of the text outline. (Optional) 
   * @param {string} fillColor The color inside of the text outline. (Optional) 
   * @param {string} underColor The color under the text. (Different than background color). (Optional) 
   * @param {string} backgroundColor The background color for the entire label. (Optional) 
   * @param {string} gravity Gravity of the text. (Optional) 
   */
  constructor(text, width, height, font, strokeWidth, strokeColor, fillColor, underColor, backgroundColor, gravity) {
    this.text_ = text;
    this.width_ = width;
    this.height_ = height;
    this.font_ = font;
    this.strokeWidth_ = strokeWidth;
    this.strokeColor_ = strokeColor;
    this.fillColor_ = fillColor;
    this.underColor_ = underColor;
    this.backgroundColor_ = backgroundColor;
    this.gravity_ = gravity;
  }

  /** 
   * @override
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    let args = [];

    if (this.width_ && this.height_)
      args.push('-size', `${this.width_}x${this.height_}`);

    if (this.backgroundColor_)
      args.push('-background', this.backgroundColor_);

    if (this.fillColor_)
      args.push('-fill', this.backgroundColor_);

    if (this.font_)
      args.push('-font', this.font_);

    if (this.strokeWidth_)
      args.push('-strokewidth', this.strokeWidth_);

    if (this.strokeColor_)
      args.push('-stroke', this.strokeColor_);

    if (this.underColor_)
      args.push('-undercolor', this.underColor_);

    if (this.gravity_)
      args.push('-gravity', this.gravity_);

    args.push(`label:${this.text_}`);

    if (this.PrimitiveTuples().length > 0)
      this.PrimitiveTuples().forEach(tuple => args = args.concat(tuple.primitive.Args(tuple.xOffset, tuple.yOffset)));

    return args;
  }

  /**
   * @override
   */
  Name() {
    return 'Label';
  }

  /**
   * Create a Label object with the specified properties.
   * @param {number} width Width in pixels. (Optional) 
   * @param {number} height Height in pixels. (Optional) 
   * @param {string} text Text string
   * @param {string} font Font name (Optional) 
   * @param {number} strokeWidth Thickness of the text outline. (Optional) 
   * @param {string} strokeColor The color of the text outline. (Optional) 
   * @param {string} fillColor The color inside of the text outline. (Optional) 
   * @param {string} underColor The color under the text. (Different than background color). (Optional) 
   * @param {string} backgroundColor The background color for the entire label. (Optional) 
   * @param {string} gravity Gravity of the text. (Optional) 
   * @returns {Label} Returns a Label object. If inputs are invalid, it returns null.
   */
  static Create(width, height, text, font, strokeWidth, strokeColor, fillColor, underColor, backgroundColor, gravity) {
    if (!text)
      return null;

    return new Label(width, height, text, font, strokeWidth, strokeColor, fillColor, underColor, backgroundColor, gravity);
  }
}

//--------------------------------
// EXPORTS

exports.CreateColorCanvas = ColorCanvas.Create;
exports.CreateGradientCanvas = GradientCanvas.Create;
exports.CreateImageCanvas = ImageCanvas.Create;
exports.CreateLabelCanvas = Label.Create;