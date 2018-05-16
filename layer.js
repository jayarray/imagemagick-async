let CANVAS = require('./canvas.js');
let PRIMITIVES = require('./primitives.js');

//------------------------------------------

/**
 * Create a color canvas layer.
 * @param {number} width 
 * @param {number} height 
 * @param {string} color Hex string
 * @returns {Layer} Returns a Layer object.
 */
function FromColor(width, height, color) {
  return CANVAS.CreateColorCanvas(width, height, color);
}

/**
 * Create a gradient canvas layer.
 * @param {number} width 
 * @param {number} height 
 * @param {Gradient} gradient 
 * @returns {Layer} Returns a Layer object.
 */
function FromGradient(width, height, gradient) {
  return CANVAS.CreateGradientCanvas(width, height, gradient);
}

/**
 * Create an image canvas layer.
 * @param {string} path Image location
 * @returns {Layer} Returns a Layer object.
 */
function FromPath(path) {
  return CANVAS.CreateImageCanvas(path);
}

/**
 * Create a line.
 * @param {Coordinates} start 
 * @param {Coordinates} end 
 * @param {string} color Hex string
 * @param {number} width 
 * @returns {Layer} Returns a Layer object.
 */
function Line(start, end, color, width) {
  return PRIMITIVES.CreateLine(start, end, color, width);
}

//-------------------------------
// EXPORTS

exports.FromColor = FromColor;
exports.FromGradient = FromGradient;
exports.FromPath = FromPath;

exports.Line = Line;