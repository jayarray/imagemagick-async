let VALIDATE = require('./validate.js');
let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;

//---------------------------------
// CONSTANTS

const DIMENSIONS_MIN = 1;
const WIDTH_MIN = 1;

//---------------------------------
// Text

class Text {
  /**
   * @param {string} string String containing text.
   * @param {string} font Font name
   * @param {number} pointSize Point size
   * @param {string} gravity Gravity
   * @param {string} strokeColor The color of the outline of the text.
   * @param {number} strokeWidth The width of the outline of the text.
   * @param {string} fillColor The color to fill the text with.  (Valid color format string used in Image Magick)
   */
  constructor(string, font, pointSize, gravity, strokeColor, strokeWidth, fillColor) {
    this.string_ = string;
    this.font_ = font;
    this.pointSize_ = pointSize;
    this.gravity_ = gravity;
    this.strokeColor_ = strokeColor;
    this.strokeWidth_ = strokeWidth;
    this.fillColor_ = fillColor;
  }

  /** 
   * @returns {Array<string|number>} Returns an array of arguments.
  */
  Args() {
    return [
      '-fill', this.fillColor_,
      '-stroke', this.strokeColor_,
      '-strokewidth', this.strokeWidth_,
      '-draw', `text 0,0 '${this.string_}'`
    ];
  }

  /**
   * Create a Text object with the specified properties.
   * @param {string} string String containing text.
   * @param {string} font Font name
   * @param {number} pointSize Point size
   * @param {string} gravity Gravity
   * @param {string} strokeColor The color of the outline of the text.
   * @param {number} strokeWidth The width of the outline of the text.
   * @param {string} fillColor The color to fill the text with.  (Valid color format string used in Image Magick)
   */
  static Create(string, font, pointSize, gravity, strokeColor, strokeWidth, fillColor) {
    let error = VALIDATE.IsStringInput(string);
    if (error)
      return Promise.reject(`Failed to create text: string is ${error}`);

    error = VALIDATE.IsStringInput(font);
    if (error)
      return Promise.reject(`Failed to create text: font is ${error}`);

    error = VALIDATE.IsInteger(pointSize);
    if (error)
      return Promise.reject(`Failed to create path: point size is ${error}`);

    error = VALIDATE.IsIntegerInRange(pointSize, DIMENSIONS_MIN, null);
    if (error)
      return Promise.reject(`Failed to create path: point size is ${error}`);

    error = VALIDATE.IsStringInput(gravity);
    if (error)
      return Promise.reject(`Failed to create text: gravity is ${error}`);

    error = VALIDATE.IsStringInput(strokeColor);
    if (error)
      return Promise.reject(`Failed to create circle: stroke color is ${error}`);

    error = VALIDATE.IsInteger(strokeWidth);
    if (error)
      return Promise.reject(`Failed to create path: stroke width is ${error}`);

    error = VALIDATE.IsIntegerInRange(strokeWidth, WIDTH_MIN, null);
    if (error)
      return Promise.reject(`Failed to create path: stroke width is ${error}`);

    error = VALIDATE.IsStringInput(fillColor);
    if (error)
      return Promise.reject(`Failed to create path: fill color is ${error}`);

    return Promise.resolve(new Text(string, font, pointSize, gravity, strokeColor, strokeWidth, fillColor));
  }
}

/**
 * Render text to the specified destination.
 * @param {Canvas} canvas Canvas object
 * @param {Text} text Ellipse object
 * @param {string} dest Destination
 */
function Draw(canvas, text, dest) {
  if (canvas.constructor.name != 'Canvas')
    return Promise.reject(`Failed to draw ellipse: canvas is invalid type.`);

  if (text.constructor.name != 'Text')
    return Promise.reject(`Failed to draw ellipse: text is invalid type.`);

  let error = VALIDATE.IsStringInput(dest);
  if (error)
    return Promise.reject(`Failed to draw ellipse: dest is ${error}`);

  return new Promise((resolve, reject) => {
    LOCAL_COMMAND.Execute('convert', canvas.Args().concat(text.Args()).concat(dest)).then(output => {
      if (output.stderr) {
        reject(`Failed to draw ellipse: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to draw ellipse: ${error}`);
  });
}

//----------------------------
// EXPORTS

exports.Create = Ellipse.Create;
exports.Draw = Draw;