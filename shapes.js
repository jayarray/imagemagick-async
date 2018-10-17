let COORDINATES = require('./coordinates.js').Create;
let PRIMITIVES = require('./primitives');
let PrimitivesBaseClass = require('./primitivesbaseclass.js').PrimitiveBaseClass;

//---------------------------------------

class Polygon extends PrimitivesBaseClass {
  constructor(sides, center, vertex, strokeColor, strokeWidth, fillColor) {
    super();
    this.sides_ = sides;
    this.center_ = center;
    this.vertex_ = vertex;
    this.strokeColor_ = strokeColor;
    this.strokeWidth_ = strokeWidth;
    this.fillColor_ = fillColor;

    // Rotate points
    let degrees = 360 / this.sides_;
    let vertexes = [this.vertex_];

    for (let i = 0; i < this.sides_ - 1; ++i) {
      let v = vertexes[0];
      let theta = degrees * (i + 1) * Math.PI / 180;
      let rotatedVertex = null;

      if (center.x_ == 0 && center.y_ == 0) {
        let newX = (v.x_ * Math.cos(theta)) - (v.y_ * Math.sin(theta));
        newX = parseInt(newX);

        let newY = (v.y_ * Math.cos(theta)) + (v.x_ * Math.sin(theta));
        newY = parseInt(newY);

        rotatedVertex = COORDINATES(newX, newY);
      }
      else {
        // Translate point so that center is at origin
        let translatedPoint = COORDINATES(v.x_ - center.x_, v.y_ - center.y_);

        // Perform rotation
        let newX = (translatedPoint.x_ * Math.cos(theta)) - (translatedPoint.y_ * Math.sin(theta));
        newX = parseInt(newX);

        let newY = (translatedPoint.x_ * Math.sin(theta)) + (translatedPoint.y_ * Math.cos(theta));
        newY = parseInt(newY);

        // Undo the translation
        rotatedVertex = COORDINATES(newX + center.x_, newY + center.y_);
      }
      vertexes.push(rotatedVertex);
    }

    // Create Path object
    this.path_ = PRIMITIVES.CreatePath(vertexes, this.strokeColor_, this.strokeWidth_, this.fillColor_, true);
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
   * @returns {Polygon} Returns a Polygon object. If inputs are invalid, it returns null.
   */
  static Create(sides, center, vertex, strokeColor, strokeWidth, fillColor) {
    if (!sides || sides < 3 || !center || !vertex)
      return null;

    return new Polygon(sides, center, vertex, strokeColor, strokeWidth, fillColor);
  }
}

//-----------------------------------
// EXPORTS

exports.CreatePolygon = Polygon.Create;