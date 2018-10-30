let PATH = require('path');
let rootDir = PATH.dirname(require.main.filename);
let COORDINATES = require(PATH.join(rootDir, 'im_modules', 'inputs', 'coordinates.js')).Create;
let PRIMITIVE_BASECLASS = require(PATH.join(__dirname, 'primitivesbaseclass.js')).PrimitiveBaseClass;

//------------------------------------

class Circle extends PRIMITIVE_BASECLASS {
  /**
   * @param {Coordinates} center Coordinates for center of circle. (Required)
   * @param {Coordinates} edge  Coordinates for point on edge of circle. (Used for computing the radius.) (Required)
   * @param {string} strokeColor The color of the line that makes up the circle. (Valid color format string used in Image Magick) (Optional)
   * @param {number} strokeWidth The width of the line that makes up the circle. (Larger value produces a thicker line.) (Optional)
   * @param {string} fillColor The color to fill the circle with. (Valid color format string used in Image Magick) (Optional)
   */
  constructor(center, edge, strokeColor, strokeWidth, fillColor) {
    super();
    this.center_ = center;
    this.edge_ = edge;
    this.strokeColor_ = strokeColor;
    this.strokeWidth_ = strokeWidth;
    this.fillColor_ = fillColor;
  }

  /** 
   * @override
   * @returns {Array<string|number>} Returns an array of arguments needed for drawing the circle.
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

    let center = COORDINATES(this.center_.x_ + this.xOffset_, this.center_.y_ + this.yOffset_);
    let edge = COORDINATES(this.edge_.x_ + this.xOffset_, this.edge_.y_ + this.yOffset_);
    args.push('-draw', `circle ${center.String()} ${edge.String()}`);

    return args;
  }

  /**
   * Create a Circle object using the specified properties.
   * @param {Coordinates} center Coordinates for center of circle. (Required)
   * @param {Coordinates} edge  Coordinates for point on edge of circle. (Used for computing the radius.) (Required)
   * @param {string} strokeColor The color of the line that makes up the circle. (Valid color format string used in Image Magick) (Optional)
   * @param {number} strokeWidth The width of the line that makes up the circle. (Larger value produces a thicker line.) (Optional)
   * @param {string} fillColor The color to fill the circle with. (Valid color format string used in Image Magick) (Optional)
   * @returns {Circle} Returns a Circle object. If inputs are invalid, it returns null.
   */
  static Create(center, edge, strokeColor, strokeWidth, fillColor) {
    if (!center || !edge)
      return null;

    return new Circle(center, edge, strokeColor, strokeWidth, fillColor);
  }
}

//------------------------------
// EXPORTS

exports.Create = Circle.Create;