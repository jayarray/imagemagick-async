let PATH = require('path');
let PRIMITIVE_BASECLASS = require(PATH.join(__dirname, 'primitivesbaseclass.js')).PrimitiveBaseClass;

//-----------------------------------

class Point extends PRIMITIVE_BASECLASS {
  /**
   * @param {number} x X-coordinate (Required)
   * @param {number} y Y-coordinate (Required)
   * @param {string} color Valid color format string used in Image Magick. (Optional)
   */
  constructor(x, y, color) {
    super();
    this.x_ = x;
    this.y_ = y;
    this.color_ = color;
  }

  /** 
   * @override
   * @returns {Array<string|number>} Returns an array of arguments needed for drawing the point.
   */
  Args() {
    let args = [];

    if (this.color_)
      args.push('-fill', this.color_); // Default color is black

    args.push('-draw', `point ${this.x_ + this.xOffset_},${this.y_ + this.yOffset_}`);
    return args;
  }

  /**
   * Creates a Point object given the specified x and y coordinates.
   * @param {number} x X-coordinate (Required)
   * @param {number} y Y-coordinate (Required)
   * @param {string} color Valid color format string used in Image Magick. (Optional)
   * @returns {Point} Returns a Path object. If inputs are invalid, it returns null.
   */
  static Create(x, y, color) {
    if (!x || !y)
      return null;

    return new Point(x, y, color);
  }
}

//----------------------------
// EXPORTs

exports.Create = Point.Create;