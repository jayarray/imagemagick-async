let PATH = require('path');

let parts = __dirname.split(PATH.sep);
let index = parts.findIndex(x => x == 'im_modules');
let IM_MODULES_DIR = parts.slice(0, index + 1).join(PATH.sep);
let COORDINATES = require(PATH.join(IM_MODULES_DIR, 'Inputs', 'coordinates.js')).Create;
let PATH_PRIMITIVE = require(PATH.join(IM_MODULES_DIR, 'Primitives', 'path.js')).Create;
let PRIMITIVE_BASECLASS = require(PATH.join(IM_MODULES_DIR, 'Primitives', 'primitivesbaseclass.js')).PrimitiveBaseClass;
let HELPER_FUNCTIONS = require(PATH.join(__dirname, 'helperfunctions.js'));

//---------------------------------

class Star extends PRIMITIVE_BASECLASS {
  constructor(vertices, center, vertex, bloat, strokeColor, strokeWidth, fillColor) {
    super();
    this.vertices_ = vertices;
    this.center_ = center;
    this.vertex_ = vertex;
    this.bloat_ = bloat;
    this.strokeColor_ = strokeColor;
    this.strokeWidth_ = strokeWidth;
    this.fillColor_ = fillColor;
    this.path_ = this.BuildPath_(vertices, center, vertex, bloat, strokeColor, strokeWidth, fillColor);
  }

  BuildPath_(vertices, center, vertex, bloat, strokeColor, strokeWidth, fillColor) {
    let majorDegrees = 360 / vertices;

    // Get all major vertices
    let majorVertices = [vertex];

    for (let i = 0; i < vertices - 1; ++i) {
      let rotatedPoint = HELPER_FUNCTIONS.GetRotatedPoint(center, vertex, majorDegrees * (i + 1));
      majorVertices.push(rotatedPoint);
    }

    // Compute minor vertex
    let slope = HELPER_FUNCTIONS.GetSlope(center, vertex);
    let yIntercept = center.y_ - (center.x_ * slope);
    let minorX = null;
    let minorY = null;

    if (center.x_ == vertex.x_) { // Vertical slope
      minorX = center.x_;
      minorY = center.y_ < vertex.y_ ? center.y_ + bloat : center.y_ - bloat;
    }
    else {
      if (center.y_ == vertex.y_) { // Horizontal slope
        minorX = center.x_ > vertex.x_ ? center.x_ - bloat : center.x_ + bloat;
        minorY = center.y_;
      }
      else { // Diagonal slope
        minorX = center.x_ < vertex.x_ ? center.x_ + bloat : center.x_ - bloat;
        minorY = (slope * minorX) + yIntercept;
      }
    }

    // Get all minor vertices
    let minorDegrees = majorDegrees / 2;
    let minorVertex = COORDINATES(parseInt(minorX), parseInt(minorY));
    let rotatedMinorVertex = HELPER_FUNCTIONS.GetRotatedPoint(center, minorVertex, minorDegrees);
    let minorVertices = [rotatedMinorVertex];

    for (let i = 0; i < vertices - 1; ++i) {
      let rotatedPoint = HELPER_FUNCTIONS.GetRotatedPoint(center, rotatedMinorVertex, majorDegrees * (i + 1));
      minorVertices.push(rotatedPoint);
    }

    // Connect major and minor vertices in alternating order
    let combinedVertices = [];
    for (let i = 0; i < vertices; ++i) {
      combinedVertices.push(majorVertices[i], minorVertices[i]);
    }

    // Return path
    return PATH_PRIMITIVE(combinedVertices, strokeColor, strokeWidth, fillColor, true);
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
   * @param {number} vertices Number of points on the star. (Required)
   * @param {Coordinates} center (Required)
   * @param {Coordinates} vertex (Required)
   * @param {number} bloat Factor equal to or greater than zero that affects the thickness of the star. The higher the value, the more 'bloated' the star will look, and will eventually invert. (Required)
   * @param {string} strokeColor The color of the line connecting all the points. (Valid color format string used in Image Magick) (Optional)
   * @param {number} strokeWidth Width of the line connecting all the points. (Larger values produce thicker lines.) (Optional)
   * @param {string} fillColor The color to fill the path with. (Valid color format string used in Image Magick) (Optional)
   * @returns {Star} Returns a Star object. If inputs are invalid, it returns null. Vertices must be equal to or greater than 4.
   */
  static Create(vertices, center, vertex, bloat, strokeColor, strokeWidth, fillColor) {
    if (!vertices || vertices < 4 || !center || !vertex || bloat < 0)
      return null;

    return new Star(vertices, center, vertex, bloat, strokeColor, strokeWidth, fillColor);
  }
}

//---------------------------
// EXPORTS

exports.Create = Star.Create;
exports.Name = 'Star';
exports.Layer = false;
exports.Consolidate = true;
exports.Dependencies = null;
exports.ComponentType = 'drawable';