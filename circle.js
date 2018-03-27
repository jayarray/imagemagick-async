let VALIDATE = require('./validate.js');
let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;

//---------------------------------
// CONSTANTS

const WIDTH_MIN = 1;

//---------------------------------

class Circle {
  /**
   * @param {Coordinates} center Coordinates for center of circle.
   * @param {Coordinates} edge  Coordinates for point on edge of circle. (Used for computing the radius.)
   * @param {string} strokeColor The color of the line that makes up the circle. (Valid color format string used in Image Magick)
   * @param {number} strokeWidth The width of the line that makes up the circle. (Larger value produces a thicker line.)
   * @param {string} fillColor The color to fill the circle with. (Valid color format string used in Image Magick)
   */
  constructor(center, edge, strokeColor, strokeWidth, fillColor) {
    this.center_ = center;
    this.edge_ = edge;
    this.strokeColor_ = strokeColor;
    this.strokeWidth_ = strokeWidth;
    this.fillColor_ = fillColor;
  }

  /** 
   * @returns {Array<string|number>} Returns an array of arguments.
  */
  Args() {
    return ['-fill', this.fillColor_, '-stroke', this.strokeColor_, '-strokewidth', this.strokeWidth_,
      '-draw', `circle ${this.center_.String()} ${this.edge_.String()}`];
  }

  /**
   * Create a Circle object using the specified properties.
   * @param {Coordinates} center Coordinates for center of circle.
   * @param {Coordinates} edge  Coordinates for point on edge of circle. (Used for computing the radius.)
   * @param {string} strokeColor The color of the line that makes up the circle. (Valid color format string used in Image Magick)
   * @param {number} strokeWidth The width of the line that makes up the circle. (Larger value produces a thicker line.)
   * @param {string} fillColor The color to fill the circle with. (Valid color format string used in Image Magick)
   * @returns {Promise<Circle>} Returns a promise. If it resolves, it returns a Circle object. Otherwise, it returns an error.
   */
  static Create(center, edge, strokeColor, strokeWidth, fillColor) {
    if (center.constructor.name != 'Coordinates')
      return Promise.reject(`Failed to create circle: center is not valid type.`);

    if (edge.constructor.name != 'Coordinates')
      return Promise.reject(`Failed to create circle: edge is not valid type.`);

    let error = VALIDATE.IsStringInput(strokeColor);
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

    return Promise.resolve(new Circle(center, edge, strokeColor, strokeWidth, fillColor));
  }
}

/**
 * Render a circle to the specified destination.
 * @param {Canvas} canvas Canvas object
 * @param {Circle} circle Circle object
 * @param {string} dest Destination
 * @returns {Promise} Returns a promise that resolves if successful, and fails otherwise.
 */
function Draw(canvas, circle, dest) {
  if (canvas.constructor.name != 'Canvas')
    return Promise.reject(`Failed to draw circle: canvas is invalid type.`);

  if (circle.constructor.name != 'Circle')
    return Promise.reject(`Failed to draw circle: circle is invalid type.`);

  let error = VALIDATE.IsStringInput(dest);
  if (error)
    return Promise.reject(`Failed to draw circle: dest is ${error}`);

  return new Promise((resolve, reject) => {
    LOCAL_COMMAND.Execute('convert', canvas.Args().concat(circle.Args()).concat(dest)).then(output => {
      if (output.stderr) {
        reject(`Failed to draw circle: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to draw circle: ${error}`);
  });
}

//-----------------------------------
// EXPORTS

exports.Create = Circle.Create;
exports.Draw = Draw;