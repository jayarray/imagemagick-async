let PATH = require('path');
let rootDir = PATH.dirname(require.main.filename);
let COORDINATES = require(PATH.join(rootDir, 'im_modules', 'Inputs', 'coordinates.js')).Create;
let PRIMITIVE_BASECLASS = require(PATH.join(__dirname, 'primitivesbaseclass.js')).PrimitiveBaseClass;

//----------------------------------

class Bezier extends PRIMITIVE_BASECLASS {
  /**
   * @param {Array<Coordinates>} points A list of points for the bezier curve to travel through. (Required)
   * @param {string} strokeColor The color of the line connecting all the points. (Valid color format string used in Image Magick) (Optional)
   * @param {number} strokeWidth Width of the line connecting all the points. (Larger values produce thicker lines.) (Optional)
   * @param {string} fillColor The color to fill the bezier. (Valid color format string used in Image Magick) (Optional)
   */
  constructor(points, strokeColor, strokeWidth, fillColor) {
    super();
    this.points_ = points;
    this.strokeColor_ = strokeColor;
    this.strokeWidth_ = strokeWidth;
    this.fillColor_ = fillColor;
  }

  /** 
   * Get a list of points in string form that have the X and Y offsets applied to them.
   * @param {number} xOffset
   * @param {number} yOffset
   * @returns {string} Returns a space-delimited string representing all points in the bezier curve.
   */
  PointsToString() {
    return this.points_.map(point => COORDINATES(point.x_ + this.xOffset_, point.y_ + this.yOffset_).String()).join(' ');
  }

  /** 
   * @override
   * @returns {Array<string|number>} Returns an array of arguments needed for drawing the bezier curve.
  */
  Args() {
    let args = [];

    if (this.fillColor_)
      args.push('-fill', this.fillColor_); // Applies fill color to areas where the curve is above or below the line computed between the start and end point.
    else
      args.push('-fill', 'none'); // Outputs lines only

    if (this.strokeColor_)
      args.push('-stroke', this.strokeColor_);

    if (this.strokeWidth_)
      args.push('-strokewidth', this.strokeWidth_);

    args.push('-draw', `bezier ${this.PointsToString(this.xOffset_, this.yOffset_)}`);
    return args;
  }

  /**
   * Create a Bezier object with the specified properties.
   * @param {Array<Coordinates>} points A list of points for the bezier curve to travel through. (Required)
   * @param {string} strokeColor The color of the line connecting all the points. (Valid color format string used in Image Magick) (Optional)
   * @param {number} strokeWidth Width of the line connecting all the points. (Larger values produce thicker lines.) (Optional)
   * @param {string} fillColor The color to fill the bezier. (Valid color format string used in Image Magick) (Optional)
   * @returns {Bezier} Returns a Bezier object. If inputs are invalid, it returns null.
   */
  static Create(points, strokeColor, strokeWidth, fillColor) {
    if (!points || points.length < 3)
      return null;

    return new Bezier(points, strokeColor, strokeWidth, fillColor);
  }
}

//-----------------------------------
// EXPORTS

exports.Create = Bezier.Create;
exports.Name = 'Bezier';
exports.Layer = false;
exports.Consolidate = true;
exports.Dependencies = null;
exports.ComponentType = 'drawable';