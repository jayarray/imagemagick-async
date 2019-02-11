let PATH = require('path');

let parts = __dirname.split(PATH.sep);
let index = parts.findIndex(x => x == 'im_modules');
let IM_MODULES_DIR = parts.slice(0, index + 1).join(PATH.sep);
let COORDINATES = require(PATH.join(IM_MODULES_DIR, 'Inputs', 'coordinates.js')).Create;
let PRIMITIVE_BASECLASS = require(PATH.join(__dirname, 'primitivesbaseclass.js')).PrimitiveBaseClass;

//-----------------------------------

class Ellipse extends PRIMITIVE_BASECLASS {
  constructor(center, width, height, strokeColor, strokeWidth, fillColor, angleStart, angleEnd) {
    super();
    this.center_ = center;
    this.width_ = width;
    this.height_ = height;
    this.strokeColor_ = strokeColor;
    this.strokeWidth_ = strokeWidth;
    this.fillColor_ = fillColor;
    this.angleStart_ = angleStart;
    this.angleEnd_ = angleEnd;
  }

  /** 
   * @override
   * @returns {Array<string|number>} Returns an array of arguments needed for drawing the ellipse.
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

    let angleStart = this.angleStart_ || 0;
    let angleEnd = this.angleEnd_ || 360;

    args.push('-draw', `ellipse ${center.String()} ${Math.floor(this.width_ / 2)},${Math.floor(this.height_ / 2)} ${angleStart},${angleEnd}`);
    return args;
  }

  /**
   * Create an Eliipse object with the specified properties.
   * @param {Coordinates} center Coordinates for the center of the ellipse. (Required)
   * @param {number} width Width of of ellipse (in pixels). (Required)
   * @param {number} height Height of ellipse (in pixels.). (Required)
   * @param {string} strokeColor The outline color of the ellipse. (Valid color format string used in Image Magick) (Optional)
   * @param {number} strokeWidth Width of the outline of the ellipse. (Larger value produces a thicker line). (Optional)
   * @param {string} fillColor The color of the inside of the ellipse. (Valid color format string used in Image Magick) (Optional)
   * @param {number} angleStart Angle at which to start drawing the ellipse. (0-degrees starts at 3-o'clock on the screen) (Optional)
   * @param {number} angleEnd Angle at which to stop drawing the ellipse. (360-degrees stops at 3-o'clock on the screen) (Optional)
   * @returns {Ellipse} Returns an Ellipse object. If inputs are invalid, it returns null.
   */
  static Create(center, width, height, strokeColor, strokeWidth, fillColor, angleStart, angleEnd) {
    if (!center || !width || !height)
      return null;

    return new Ellipse(center, width, height, strokeColor, strokeWidth, fillColor, angleStart, angleEnd);
  }
}

//---------------------------------
// EXPORTS

exports.Create = Ellipse.Create;
exports.Name = 'Ellipse';
exports.Layer = false;
exports.Consolidate = true;
exports.Dependencies = null;
exports.ComponentType = 'drawable';