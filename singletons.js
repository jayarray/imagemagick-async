let VALIDATE = require('./validate.js');
let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;

//----------------------------------
// LABEL

class Label {
  /**
   * @param {number} width (Optional) Width (in pixels)
   * @param {number} height (Optional) Height (in pixels)
   * @param {string} text Text string
   * @param {string} font (Optional) Font name
   * @param {number} strokeWidth (Optional) Thickness of the text outline.
   * @param {string} strokeColor (Optional) The color of the text outline.
   * @param {string} fillColor (Optional) The color inside of the text outline.
   * @param {string} underColor (Optional) The color under the text. (Different than background color).
   * @param {string} backgroundColor (Optional) The background color for the entire label.
   * @param {string} gravity (Optional) Gravity of the text.
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
   * @param {number} width (Optional) Width (in pixels)
   * @param {number} height (Optional) Height (in pixels)
   * @param {string} text Text string
   * @param {string} font (Optional) Font name
   * @param {number} strokeWidth (Optional) Thickness of the text outline.
   * @param {string} strokeColor (Optional) The color of the text outline.
   * @param {string} fillColor (Optional) The color inside of the text outline.
   * @param {string} underColor (Optional) The color under the text. (Different than background color).
   * @param {string} backgroundColor (Optional) The background color for the entire label.
   * @param {string} gravity (Optional) Gravity of the text.
   * @returns {Label} Returns a Label object. If inputs are invalid, it returns null.
   */
  static Create(width, height, text, font, strokeWidth, strokeColor, fillColor, underColor, backgroundColor, gravity) {
    if (
      VALIDATE.IsInteger(width) ||
      VALIDATE.IsInteger(height) ||
      VALIDATE.IsStringInput(text) ||
      VALIDATE.IsStringInput(font) ||
      VALIDATE.IsInteger(strokeWidth) ||
      VALIDATE.IsStringInput(strokeColor) ||
      VALIDATE.IsStringInput(fillColor) ||
      VALIDATE.IsStringInput(underColor) ||
      VALIDATE.IsStringInput(backgroundColor) ||
      VALIDATE.IsStringInput(gravity)
    )
      return null;

    return new Label(width, height, text, font, strokeWidth, strokeColor, fillColor, underColor, backgroundColor, gravity);
  }
}

//---------------------------------
// EXPORTS

exports.CreateLabel = Label.Create;