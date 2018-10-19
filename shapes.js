let COORDINATES = require('./coordinates.js').Create;
let PRIMITIVES = require('./primitives');
let PrimitivesBaseClass = require('./primitivesbaseclass.js').PrimitiveBaseClass;

//-------------------------------------
// HELPER FUNCTIONS

/**
 * Rotate a point about the specified center.
 * @param {Coordinates} center 
 * @param {Coordinates} point 
 * @returns {Coordinates} Returns a Coordinates object.
 */
function GetRotatedPoint(center, point, degrees) {
  let theta = degrees * (Math.PI / 180); // theta is in radians
  let rotatedPoint = null;

  if (center.x_ == 0 && center.y_ == 0) {
    let newX = (point.x_ * Math.cos(theta)) - (point.y_ * Math.sin(theta));
    newX = parseInt(newX);

    let newY = (point.y_ * Math.cos(theta)) + (point.x_ * Math.sin(theta));
    newY = parseInt(newY);

    rotatedPoint = COORDINATES(newX, newY);
  }
  else {
    // Translate point so that center is at origin
    let translatedPoint = COORDINATES(point.x_ - center.x_, point.y_ - center.y_);

    // Perform rotation
    let newX = (translatedPoint.x_ * Math.cos(theta)) - (translatedPoint.y_ * Math.sin(theta));
    newX = parseInt(newX);

    let newY = (translatedPoint.x_ * Math.sin(theta)) + (translatedPoint.y_ * Math.cos(theta));
    newY = parseInt(newY);

    // Undo the translation
    rotatedPoint = COORDINATES(newX + center.x_, newY + center.y_);
  }

  return rotatedPoint;
}

function GetSlope(a, b) {
  return (a.y_ - b.y_) / (a.x_ - b.x_);
}


//---------------------------------------
// POLYGON

class Polygon extends PrimitivesBaseClass {
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
      let rotatedPoint = GetRotatedPoint(center, vertex, currDegrees);
      vertices.push(rotatedPoint);
    }
    return PRIMITIVES.CreatePath(vertices, strokeColor, strokeWidth, fillColor, true);
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

//---------------------------------------
// STAR

class Star extends PrimitivesBaseClass {
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
      let rotatedPoint = GetRotatedPoint(center, vertex, majorDegrees * (i + 1));
      majorVertices.push(rotatedPoint);
    }

    // Compute minor vertex
    let slope = GetSlope(center, vertex);
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
    let rotatedMinorVertex = GetRotatedPoint(center, minorVertex, minorDegrees);
    let minorVertices = [rotatedMinorVertex];

    for (let i = 0; i < vertices - 1; ++i) {
      let rotatedPoint = GetRotatedPoint(center, rotatedMinorVertex, majorDegrees * (i + 1));
      minorVertices.push(rotatedPoint);
    }

    // Connect major and minor vertices in alternating order
    let combinedVertices = [];
    for (let i = 0; i < vertices; ++i) {
      combinedVertices.push(majorVertices[i], minorVertices[i]);
    }

    // Return path
    return PRIMITIVES.CreatePath(combinedVertices, strokeColor, strokeWidth, fillColor, true);
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
   * @param {number} bloat Factor equal to or greater than zero that affects the thickness of the star. The higher the value, the more "bloated" the star will look, and will eventually invert. (Required)
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

//---------------------------------------
// ANNULUS (Donut)

class Annulus extends PrimitivesBaseClass {
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
    this.minorOutline_ = PRIMITIVES.CreateCircle(center, minorEdge, strokeColor, this.circleStrokeWidth, "none");

    // Major outline
    let majorEdge = COORDINATES(center.x_ + majorRadius, center.y_);
    this.majorOutline_ = PRIMITIVES.CreateCircle(center, majorEdge, strokeColor, this.circleStrokeWidth, "none");

    // Donut
    let ellipseWidth = majorRadius + minorRadius; //Math.abs(center.x_ - majorEdge.x_);
    let ellipseHeight = ellipseWidth;
    let ellipseStrokeColor = fillColor;
    let ellipseStrokeWidth = majorRadius - minorRadius;
    this.ellipse_ = PRIMITIVES.CreateEllipse(center, ellipseWidth, ellipseHeight, ellipseStrokeColor, ellipseStrokeWidth, "none", 0, 360);
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

//-----------------------------------
// EXPORTS

exports.CreatePolygon = Polygon.Create;
exports.CreateStar = Star.Create;
exports.CreateAnnulus = Annulus.Create;