let PATH = require('path');
let CANVAS_BASECLASS = require(PATH.join(__dirname, 'canvasbaseclass.js')).CanvasBaseClass;

//---------------------------

class LabelCanvas extends CANVAS_BASECLASS {
  /**
   * @param {number} width Width in pixels. (Optional) 
   * @param {number} height Height in pixels. (Optional)
   * @param {string} text Text string
   * @param {string} font Font name (Optional) 
   * @param {number} fontSize Font size
   * @param {number} kerning Spacing between glyphs/symbols. Minimum value is 0.
   * @param {number} strokeWidth Thickness of the text outline. (Optional) 
   * @param {string} strokeColor The color of the text outline. (Optional) 
   * @param {string} fillColor The color inside of the text outline. (Optional) 
   * @param {string} underColor The color under the text. (Different than background color). (Optional) 
   * @param {string} backgroundColor The background color for the entire label. (Optional) 
   * @param {string} gravity Gravity of the text. (Optional) 
   */
  constructor(width, height, text, font, fontSize, kerning, strokeWidth, strokeColor, fillColor, underColor, backgroundColor, gravity) {
    super(width, height);
    this.text_ = text;
    this.font_ = font;
    this.fontSize_ = fontSize;
    this.kerning_ = kerning;
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

    args.push('-background');
    if (this.backgroundColor_)
      args.push(this.backgroundColor_);
    else
      args.push('none');

    args.push('-fill');
    if (this.fillColor_)
      args.push(this.fillColor_);
    else
      args.push('none');

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

    if (this.kerning_)
      args.push('-kerning', this.kerning_);

    if (this.fontSize_)
      args.push('-pointsize', this.fontSize_);

    args.push(`label:${this.text_}`);

    if (this.Primitives().length > 0)
      this.Primitives().forEach(p => args = args.concat(p.Args()));

    return args;
  }

  /**
   * @override
   */
  Name() {
    return 'LabelCanvas';
  }

  /**
   * Create a LabelCanvas object with the specified properties.
   * @param {number} width Width in pixels. (Optional) 
   * @param {number} height Height in pixels. (Optional) 
   * @param {string} text Text string
   * @param {string} font Font name (Optional) 
   * @param {number} fontSize Font size (Optional)
   * @param {number} kerning Spacing between glyphs/symbols. Minimum value is 0. (Optional) 
   * @param {number} strokeWidth Thickness of the text outline. (Optional) 
   * @param {string} strokeColor The color of the text outline. (Optional) 
   * @param {string} fillColor The color inside of the text outline. (Optional) 
   * @param {string} underColor The color under the text. (Different than background color). (Optional) 
   * @param {string} backgroundColor The background color for the entire label. (Optional) 
   * @param {string} gravity Gravity of the text. (Optional) 
   * @returns {Label} Returns a Label object. If inputs are invalid, it returns null.
   */
  static Create(width, height, text, font, fontSize, kerning, strokeWidth, strokeColor, fillColor, underColor, backgroundColor, gravity) {
    if (!text)
      return null;

    return new LabelCanvas(width, height, text, font, fontSize, kerning, strokeWidth, strokeColor, fillColor, underColor, backgroundColor, gravity);
  }
}

//------------------------------
// EXPORTS

exports.Create = LabelCanvas.Create;