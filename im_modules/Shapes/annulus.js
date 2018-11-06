let PATH = require('path');

let parts = __dirname.split(PATH.sep);
let index = parts.findIndex(x => x == 'im_modules');
let IM_MODULES_DIR = parts.slice(0, index + 1).join(PATH.sep);
let COORDINATES = require(PATH.join(IM_MODULES_DIR, 'Inputs', 'coordinates.js')).Create;
let ELLIPSE = require(PATH.join(IM_MODULES_DIR, 'Primitives', 'ellipse.js')).Create;
let CIRCLE = require(PATH.join(IM_MODULES_DIR, 'Primitives', 'circle.js')).Create;
let PRIMITIVE_BASECLASS = require(PATH.join(IM_MODULES_DIR, 'Primitives', 'primitivesbaseclass.js')).PrimitiveBaseClass;

//---------------------------------

class Annulus extends PRIMITIVE_BASECLASS {
  constructor(center, minorRadius, majorRadius, strokeColor, strokeWidth, fillColor) {
    super();
    this.center_ = center;
    this.minorRadius_ = minorRadius;
    this.majorRadius_ = majorRadius;
    this.strokeColor_ = strokeColor;
    this.strokeWidth_ = strokeWidth;
    this.circleStrokeWidth = strokeWidth;
    this.fillColor_ = fillColor; // used for ellipse

    // Minor outline
    let minorEdge = COORDINATES(center.x_ + minorRadius, center.y_);
    this.minorOutline_ = CIRCLE(center, minorEdge, strokeColor, this.circleStrokeWidth, "none");

    // Major outline
    let majorEdge = COORDINATES(center.x_ + majorRadius, center.y_);
    this.majorOutline_ = CIRCLE(center, majorEdge, strokeColor, this.circleStrokeWidth, "none");

    // Donut
    let ellipseWidth = majorRadius + minorRadius; //Math.abs(center.x_ - majorEdge.x_);
    let ellipseHeight = ellipseWidth;
    let ellipseStrokeColor = fillColor;
    let ellipseStrokeWidth = majorRadius - minorRadius;
    this.ellipse_ = ELLIPSE(center, ellipseWidth, ellipseHeight, ellipseStrokeColor, ellipseStrokeWidth, "none", 0, 360);
  }

  /** 
   * @override
   * @returns {Array<string|number>} Returns an array of arguments needed for drawing the polygon.
   */
  Args() {
    return this.ellipse_.Args().concat(this.majorOutline_.Args()).concat(this.minorOutline_.Args());
  }

  /** 
   * Create an Annulus object with the specified properties.
   * @param {Coordinates} center (Required)
   * @param {number} minorRadius Length of the inner radius. (Required)
   * @param {number} majorRadius Length of the outer radius. (Required)
   * @param {string} strokeColor The color of the line connecting all the points. (Valid color format string used in Image Magick) (Optional)
   * @param {number} strokeWidth Width of the line connecting all the points. (Larger values produce thicker lines.) (Optional)
   * @param {string} fillColor The color to fill the path with. (Valid color format string used in Image Magick) (Optional)
   * @returns {Annulus} Returns an Annulus object. If inputs are invalid, it returns null.
   */
  static Create(center, minorRadius, majorRadius, strokeColor, strokeWidth, fillColor) {
    if (!center || isNaN(minorRadius) || isNaN(majorRadius))
      return null;

    return new Annulus(center, minorRadius, majorRadius, strokeColor, strokeWidth, fillColor);
  }
}

//-----------------------------
// EXPORTS

exports.Create = Annulus.Create;
exports.Name = 'Annulus';
exports.Layer = false;
exports.Consolidate = true;
exports.Dependencies = null;
exports.ComponentType = 'drawable';