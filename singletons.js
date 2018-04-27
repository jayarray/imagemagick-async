let VALIDATE = require('./validate.js');
let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;

//----------------------------------
// LABEL

class Label {
  /**
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
   */
  constructor(width, height, text, font, strokeWidth, strokeColor, fillColor, underColor, backgroundColor, gravity) {
    this.width_ = width;
    this.height_ = height;
    this.text_ = text;
    this.font_ = font;
    this.strokeWidth_ = strokeWidth;
    this.strokeColor_ = strokeColor;
    this.fillColor_ = fillColor;
    this.underColor_ = underColor;
    this.backgroundColor_ = backgroundColor;
    this.gravity_ = gravity;
  }

  /** 
   * @returns {Array<string|number>} Returns an array of arguments for drawing the label.
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

    return args;
  }

  /**
   * Render a label to the specified path.
   * @param {string} outputPath The path where the resulting image will be rendered to.
   * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
   */
  Draw(outputPath) {
    return new Promise((resolve, reject) => {
      LOCAL_COMMAND.Execute('convert', this.Args().concat(outputPath)).then(output => {
        if (output.stderr) {
          reject(`Failed to draw label: ${output.stderr}`);
          return;
        }
        resolve();
      }).catch(error => `Failed to draw label: ${error}`);
    });
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
    if (
      (!VALIDATE.IsInstance(width) && (VALIDATE.IsInteger(width) || VALID.IsIntegerInRange(width, 1, null))) ||
      (!VALIDATE.IsInstance(height) && (VALIDATE.IsInteger(height) || VALID.IsIntegerInRange(height, 1, null))) ||
      VALIDATE.IsStringInput(text) ||
      (!VALID.IsInstance(font) && VALIDATE.IsStringInput(font)) ||
      (!VALIDATE.IsInstance(strokeWidth) && (VALIDATE.IsInteger(strokeWidth) || VALID.IsIntegerInRange(strokeWidth, 1, null))) ||
      (!VALID.IsInstance(strokeColor) && VALIDATE.IsStringInput(strokeColor)) ||
      (!VALID.IsInstance(fillColor) && VALIDATE.IsStringInput(fillColor)) ||
      (!VALID.IsInstance(underColor) && VALIDATE.IsStringInput(underColor)) ||
      (!VALID.IsInstance(backgroundColor) && VALIDATE.IsStringInput(backgroundColor)) ||
      (!VALID.IsInstance(gravity) && VALIDATE.IsStringInput(gravity))
    )
      return null;

    return new Label(width, height, text, font, strokeWidth, strokeColor, fillColor, underColor, backgroundColor, gravity);
  }
}

//---------------------------------
// EXPORTS

exports.CreateLabel = Label.Create;