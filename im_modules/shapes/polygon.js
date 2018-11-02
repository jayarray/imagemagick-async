let PATH = require('path');
let rootDir = PATH.dirname(require.main.filename);
let PATH_PRIMITIVE = require(PATH.join(rootDir, 'im_modules', 'primitives', 'path.js')).Create;
let PRIMITIVE_BASECLASS = require(PATH.join(rootDir, 'im_modules', 'primitives', 'primitivesbaseclass.js')).PrimitiveBaseClass;
let HELPER_FUNCTIONS = require(PATH.join(__dirname, 'helperfunctions.js'));

//-------------------------------

class Polygon extends PRIMITIVE_BASECLASS {
  constructor(sides, center, vertex, strokeColor, strokeWidth, fillColor) {
    super();
    this.sides_ = sides;
    this.center_ = center;
    this.vertex_ = vertex;
    this.strokeColor_ = strokeColor;
    this.strokeWidth_ = strokeWidth;
    this.fillColor_ = fillColor;
    this.path_ = this.BuildPath_(sides, center, vertex, strokeColor, strokeWidth, fillColor);
  }

  BuildPath_(sides, center, vertex, strokeColor, strokeWidth, fillColor) {
    // Rotate points
    let degrees = 360 / sides;
    let vertices = [vertex];

    for (let i = 0; i < sides - 1; ++i) {
      let currDegrees = degrees * (i + 1);
      let rotatedPoint = HELPER_FUNCTIONS.GetRotatedPoint(center, vertex, currDegrees);
      vertices.push(rotatedPoint);
    }
    return PATH_PRIMITIVE(vertices, strokeColor, strokeWidth, fillColor, true);
  }

  /** 
   * @override
   * @returns {Array<string|number>} Returns an array of arguments needed for drawing the polygon.
   */
  Args() {
    return this.path_.Args();
  }

  /** 
   * Create a Polygon object with the specified properties.
   * @param {number} sides Number of sides. (Required)
   * @param {Coordinates} center (Required)
   * @param {Coordinates} vertex (Required)
   * @param {string} strokeColor The color of the line connecting all the points. (Valid color format string used in Image Magick) (Optional)
   * @param {number} strokeWidth Width of the line connecting all the points. (Larger values produce thicker lines.) (Optional)
   * @param {string} fillColor The color to fill the path with. (Valid color format string used in Image Magick) (Optional)
   * @returns {Polygon} Returns a Polygon object. If inputs are invalid, it returns null. Sides must be equal to or greater than 3.
   */
  static Create(sides, center, vertex, strokeColor, strokeWidth, fillColor) {
    if (!sides || sides < 3 || !center || !vertex)
      return null;

    return new Polygon(sides, center, vertex, strokeColor, strokeWidth, fillColor);
  }
}

//-----------------------
// EXPORTS

exports.Create = Polygon.Create;
exports.Name = 'Polygon';
exports.Layer = false;
exports.Consolidate = true;
exports.Dependencies = null;
exports.ComponentType = 'drawable';