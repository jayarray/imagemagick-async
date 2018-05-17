let CANVAS = require('./canvas.js');
let PRIMITIVES = require('./primitives.js');

//------------------------------------------
// CANVAS

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
 * Create a label canvas layer.
 * @param {number} width 
 * @param {number} height 
 * @param {string} text 
 * @param {string} font 
 * @param {number} strokeWidth 
 * @param {string} strokeColor 
 * @param {string} fillColor 
 * @param {string} underColor 
 * @param {string} backgroundColor 
 * @param {string} gravity
 * @returns {Layer} Returns a Layer object.
 */
function FromLabel(width, height, text, font, strokeWidth, strokeColor, fillColor, underColor, backgroundColor, gravity) {
  return CANVAS.CreateLabelCanvas(width, height, text, font, strokeWidth, strokeColor, fillColor, underColor, backgroundColor, gravity);
}

//--------------------------------------
// PRIMITIVES

/**
 * Create a bezier curve.
 * @param {Array<Coordinates>} points 
 * @param {string} strokeColor 
 * @param {number} strokeWidth 
 * @param {string} fillColor 
 */
function Bezier(points, strokeColor, strokeWidth, fillColor) {
  return PRIMITIVES.CreateBezier(points, strokeColor, strokeWidth, fillColor);
}

/**
 * Create a circle.
 * @param {Coordinates} center 
 * @param {Coordinates} edge 
 * @param {string} strokeColor 
 * @param {number} strokeWidth 
 * @param {string} fillColor 
 */
function Circle(center, edge, strokeColor, strokeWidth, fillColor) {
  return PRIMITIVES.CreateCircle(center, edge, strokeColor, strokeWidth, fillColor);
}

/**
 * Create an ellipse.
 * @param {Coordinates} center 
 * @param {number} width 
 * @param {number} height 
 * @param {string} strokeColor 
 * @param {number} strokeWidth 
 * @param {string} fillColor 
 * @param {number} angleStart 
 * @param {number} angleEnd 
 */
function Ellipse(center, width, height, strokeColor, strokeWidth, fillColor, angleStart, angleEnd) {
  return PRIMITIVES.CreateEllipse(center, width, height, strokeColor, strokeWidth, fillColor, angleStart, angleEnd);
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

/**
 * Create a path.
 * @param {Array<Coordinates>} points 
 * @param {string} strokeColor 
 * @param {number} strokeWidth 
 * @param {string} fillColor 
 * @param {boolean} isClosed 
 */
function Path(points, strokeColor, strokeWidth, fillColor, isClosed) {
  return PRIMITIVES.CreatePath(points, strokeColor, strokeWidth, fillColor, isClosed);
}

/**
 * Create a point.
 * @param {number} x 
 * @param {number} y 
 * @param {string} color 
 */
function Point(x, y, color) {
  return PRIMITIVES.CreatePoint(x, y, color);
}

/**
 * Create text.
 * @param {string} string 
 * @param {string} font 
 * @param {number} pointSize 
 * @param {string} gravity 
 * @param {string} strokeColor 
 * @param {number} strokeWidth 
 * @param {string} fillColor 
 */
function Text(string, font, pointSize, gravity, strokeColor, strokeWidth, fillColor) {
  return PRIMITIVES.CreatePoint(string, font, pointSize, gravity, strokeColor, strokeWidth, fillColor);
}

//--------------------------------
// MODS




//-------------------------------
// EXPORTS

exports.FromColor = FromColor;
exports.FromGradient = FromGradient;
exports.FromPath = FromPath;
exports.FromLabel = FromLabel;

exports.Bezier = Bezier;
exports.Circle = Circle;
exports.Ellipse = Ellipse;
exports.Line = Line;
exports.Path = Path;
exports.Point = Point;
exports.Text = Text;