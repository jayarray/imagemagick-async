let VALIDATE = require('./validate.js');
let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;

//---------------------------------
// CONSTANTS

const WIDTH_MIN = 1;

//-----------------------------------
// LINE

class Line {
  /**
   * @param {Coordinates} start Start coordinates
   * @param {Coordinates} end End coordinates
   * @param {string} color Valid color format string used in Image Magick.
   * @param {number} width Width of line. As number increases, so does the width.
   */
  constructor(start, end, color, width) {
    this.start_ = start;
    this.end_ = end;
    this.color_ = color;
    this.width_ = width;
  }

  /** 
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    return ['-stroke', this.color_, '-strokewidth', this.width_, '-draw', `line ${this.start_.String()} ${this.end_.String()}`];
  }

  /**
   * Creates a Point object given the specified x and y coordinates.
   * @param {Coordinates} start Start coordinates
   * @param {Coordinates} end End coordinates
   * @param {string} color Valid color format string used in Image Magick.
   * @param {number} width Width of line. (Larger values produce thicker lines.)
   * @returns {Promise<Point>} Returns a promise. If it resolves, it returns a Line object. Otherwise, it returns an error.
   */
  static Create(start, end, color, width) {
    if (start.constructor.name != 'Coordinates')
      return Promise.reject(` Failed to create line: start is not valid type.`);

    if (end.constructor.name != 'Coordinates')
      return Promise.reject(` Failed to create line: end is not valid type.`);

    let error = VALIDATE.IsStringInput(color);
    if (error)
      return Promise.reject(` Failed to create line: color is ${error}`);

    error = VALIDATE.IsInteger(width);
    if (error)
      return Promise.reject(` Failed to create line: width is ${error}`);

    error = VALIDATE.IsIntegerInRange(width, WIDTH_MIN, null);
    if (error)
      return Promise.reject(` Failed to create line: width is ${error}`);

    return Promise.resolve(new Line(start, end, color, width));
  }
}

/**
 * Render a line to the specified destination.
 * @param {Canvas} canvas Canvas object
 * @param {Line} line Line object
 * @param {string} dest Destination
 * @returns {Promise} Returns a promise that resolves if successful, and fails otherwise.
 */
function Draw(canvas, line, dest) {
  if (canvas.constructor.name != 'Canvas')
    return Promise.reject(`Failed to draw line: canvas is invalid type.`);

  if (line.constructor.name != 'Line')
    return Promise.reject(`Failed to draw line: line is invalid type.`);

  let error = VALIDATE.IsStringInput(dest);
  if (error)
    return Promise.reject(`Failed to draw line: dest is ${error}`);

  return new Promise((resolve, reject) => {
    LOCAL_COMMAND.Execute('convert', canvas.Args().concat(line.Args()).concat(dest)).then(output => {
      if (output.stderr) {
        reject(`Failed to draw line: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to draw line: ${error}`);
  });
}

//------------------------------
// EXPORTS

exports.Create = Line.Create;
exports.Draw = Draw;