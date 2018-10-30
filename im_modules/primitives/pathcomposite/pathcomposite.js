let PATH = require('path');
let PRIMITIVE_BASECLASS = require(PATH.join(__dirname, 'primitivesbaseclass.js')).PrimitiveBaseClass;

//-----------------------------------

class PathComposite extends PRIMITIVE_BASECLASS {
  /** 
  * @param {Coordinates} start The start coordinates of your path. (Required)
  * @param {Array<>} lineSegments A list of LineSegment objects to be connected in the order provided. (Required)
  * @param {string} strokeColor The color of the line connecting all the points. (Valid color format string used in Image Magick) (Optional)
  * @param {number} strokeWidth Width of the line connecting all the points. (Larger values produce thicker lines.) (Optional)
  * @param {string} fillColor The color to fill the path with. (Valid color format string used in Image Magick) (Optional)
  * @param {boolean} isClosed Set to true if you wish to connect the last point back to the first one (if not done already) with a straight line. Else, set to false.
  */
  constructor(start, lineSegments, strokeColor, strokeWidth, fillColor, isClosed) {
    super();
    this.start_ = start;
    this.lineSegments_ = lineSegments;
    this.strokeColor_ = strokeColor;
    this.strokeWidth_ = strokeWidth;
    this.fillColor_ = fillColor;
    this.isClosed_ = isClosed;
  }

  /** 
   * Get a list of points in string form that have the X and Y offsets applied to them.
   * @returns {string} Returns a space-delimited string representing all points in the path.
   */
  LineSegmentsToString() {
    return this.lineSegments_.map(l => l.String()).join(' ');
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

    let drawString = `path 'M ${this.start_.x_},${this.start_.y_} ${this.LineSegmentsToString()}`;

    if (this.isClosed_)
      drawString += ' Z';
    drawString += `'`;

    args.push('-draw', drawString);
    return args;
  }

  /** 
   * Create a Path object with the specified properties.
   * @param {Coordinates} start The start coordinates of your path. (Required)
   * @param {Array<>} lineSegments A list of LineSegment objects to be connected in the order provided. (Required)
   * @param {string} strokeColor The color of the line connecting all the points. (Valid color format string used in Image Magick) (Optional)
   * @param {number} strokeWidth Width of the line connecting all the points. (Larger values produce thicker lines.) (Optional)
   * @param {string} fillColor The color to fill the path with. (Valid color format string used in Image Magick) (Optional)
   * @param {boolean} isClosed Set to true if you wish to connect the last point back to the first one (if not done already) with a straight line. Else, set to false.
   * @returns {PathComposite} Returns a Path object. If inputs are invalid, it returns null.
   */
  static Create(start, lineSegments, strokeColor, strokeWidth, fillColor, isClosed) {
    if (!start || !lineSegments || lineSegments.length < 1)
      return null;

    return new PathComposite(start, lineSegments, strokeColor, strokeWidth, fillColor, isClosed);
  }
}

//----------------------
// EXPORTS

exports.Create = PathComposite.Create;