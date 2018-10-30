let PATH = require('path');
let PRIMITIVE_BASECLASS = require(PATH.join(__dirname, 'primitivesbaseclass.js')).PrimitiveBaseClass;

//-------------------------------------

class Text extends PRIMITIVE_BASECLASS {
  /**
   * @param {string} string String containing text. (Required)
   * @param {string} font Font name (Optional)
   * @param {number} pointSize Point size (Optional)
   * @param {string} gravity Gravity (Optional)
   * @param {string} strokeColor The color of the outline of the text. (Optional)
   * @param {number} strokeWidth The width of the outline of the text. (Optional)
   * @param {string} fillColor The color to fill the text with.  (Valid color format string used in Image Magick) (Optional)
   */
  constructor(string, font, pointSize, gravity, strokeColor, strokeWidth, fillColor) {
    super();
    this.string_ = string;
    this.font_ = font;
    this.pointSize_ = pointSize;
    this.gravity_ = gravity;
    this.strokeColor_ = strokeColor;
    this.strokeWidth_ = strokeWidth;
    this.fillColor_ = fillColor;
  }

  /** 
   * @override
   * @returns {Array<string|number>} Returns an array of arguments needed for drawing the point.
   */
  Args() {
    let args = [];

    if (this.fillColor_)
      args.push('-fill', this.fillColor_); // Default color is black

    if (this.strokeColor_)
      args.push('-stroke', this.strokeColor_);

    if (this.strokeWidth_)
      args.push('-strokewidth', this.strokeWidth_);

    if (this.font_)
      args.push('-font', this.font_);

    if (this.pointSize_)
      args.push('-pointsize', this.pointSize_);

    if (this.gravity_)
      args.push('-gravity', this.gravity_);

    args.push('-draw', `text ${this.xOffset_},${this.yOffset_} '${this.string_}'`);
    return args;
  }

  /**
   * Create a Text object with the specified properties.
   * @param {string} string String containing text. (Required)
   * @param {string} font Font name (Optional)
   * @param {number} pointSize Point size (Optional)
   * @param {string} gravity Gravity (Optional)
   * @param {string} strokeColor The color of the outline of the text. (Optional)
   * @param {number} strokeWidth The width of the outline of the text. (Optional)
   * @param {string} fillColor The color to fill the text with.  (Valid color format string used in Image Magick) (Optional)
   * @returns {Text} Returns a Text object. If inputs are invalid, it returns null.
   */
  static Create(string, font, pointSize, gravity, strokeColor, strokeWidth, fillColor) {
    if (!string)
      return null;

    return new Text(string, font, pointSize, gravity, strokeColor, strokeWidth, fillColor);
  }
}

//----------------------------
// EXPORTS

exports.Create = Text.Create;