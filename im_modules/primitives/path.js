let PATH = require('path');
let rootDir = PATH.dirname(require.main.filename);
let COORDINATES = require(PATH.join(rootDir, 'im_modules', 'inputs', 'coordinates.js')).Create;
let PRIMITIVE_BASECLASS = require(PATH.join(__dirname, 'primitivesbaseclass.js')).PrimitiveBaseClass;

//-----------------------------------

class Path extends PRIMITIVE_BASECLASS {
  /** 
  * @param {Array<Coordinates>} points A list of coordinates to be connected by a line in the order provided. (Required)
  * @param {string} strokeColor The color of the line connecting all the points. (Valid color format string used in Image Magick) (Optional)
  * @param {number} strokeWidth Width of the line connecting all the points. (Larger values produce thicker lines.) (Optional)
  * @param {string} fillColor The color to fill the path with. (Valid color format string used in Image Magick) (Optional)
  * @param {boolean} isClosed Set to true if you wish to connect the last point back to the first one (if not done already). Else, set to false.
  */
  constructor(points, strokeColor, strokeWidth, fillColor, isClosed) {
    super();
    this.points_ = points;
    this.strokeColor_ = strokeColor;
    this.strokeWidth_ = strokeWidth;
    this.fillColor_ = fillColor;
    this.isClosed_ = isClosed;
  }

  /** 
   * Get a list of points in string form that have the X and Y offsets applied to them.
   * @returns {string} Returns a space-delimited string representing all points in the path.
   */
  PointsToString() {
    return this.points_.map(point => COORDINATES(point.x_ + this.xOffset_, point.y_ + this.yOffset_).String()).join(' ');
  }

  /** 
   * @override
   * @returns {Array<string|number>} Returns an array of arguments needed for drawing the path.
   */
  Args() {
    let args = [];

    if (this.fillColor_)
      args.push('-fill', this.fillColor_);
    else
      args.push('-fill', 'none'); // Prevents default black fill color

    if (this.strokeColor_)
      args.push('-stroke', this.strokeColor_);

    if (this.strokeWidth_)
      args.push('-strokewidth', this.strokeWidth_);

    let pointStringArr = this.PointsToString(this.xOffset_, this.yOffset_).split(' ');

    let drawString = `path 'M ${pointStringArr[0]} L ${pointStringArr[1]}`;
    if (pointStringArr.length > 2)
      drawString += ` ${pointStringArr.slice(2).join(' ')}`;

    if (this.isClosed_)
      drawString += ' Z';
    drawString += `'`;

    args.push('-draw', drawString);
    return args;
  }

  /** 
   * Create a Path object with the specified properties.
   * @param {Array<Coordinates>} points A list of coordinates to be connected by a line in the order provided. (Required)
   * @param {string} strokeColor The color of the line connecting all the points. (Valid color format string used in Image Magick) (Optional)
   * @param {number} strokeWidth Width of the line connecting all the points. (Larger values produce thicker lines.) (Optional)
   * @param {string} fillColor The color to fill the path with. (Valid color format string used in Image Magick) (Optional)
   * @param {boolean} isClosed Set to true if you wish to connect the last point back to the first one (if not done already). Else, set to false.
   * @returns {Path} Returns a Path object. If inputs are invalid, it returns null.
   */
  static Create(points, strokeColor, strokeWidth, fillColor, isClosed) {
    if (!points || points.length < 2)
      return null;

    return new Path(points, strokeColor, strokeWidth, fillColor, isClosed);
  }
}

//-------------------------
// EXPORTS

exports.Create = Path.Create;
exports.Name = 'Path';
exports.Layer = false;
exports.Consolidate = true;
exports.Dependencies = null;
exports.ComponentType = 'drawable';