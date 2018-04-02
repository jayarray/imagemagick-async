let VALIDATE = require('./validate.js');
let COORDINATES = require('./coordinates.js');

//----------------------------------
// CONSTANTS

const DIMENSIONS_MIN = 1;

//---------------------------------
// PRIMITIVE (Base class)

class Primitive {
  constructor() {
    this.xOffset_ = 0;
    this.yOffset_ = 0;
  }

  /**
   * Set x and y offsets.
   * @param {number} x X-offset
   * @param {number} y Y-offset
   */
  Offset(x, y) {
    this.xOffset_ = x;
    this.yOffset_ = y;
  }

  /** 
   * @returns {Array<string|number>} Returns an array of arguments needed for drawing the primitive.
   */
  Args() {
    // Override
  }
}

//--------------------------------
// BEZIER

class Bezier extends Primitive {
  /**
   * @param {Array<Coordinates>} points A list of points for the bezier curve to travel through.
   * @param {string} strokeColor The color of the line connecting all the points. (Valid color format string used in Image Magick)
   * @param {number} strokeWidth Width of the line connecting all the points. (Larger values produce thicker lines.)
   * @param {string} fillColor The color to fill the bezier. (Valid color format string used in Image Magick)
   */
  constructor(points, strokeColor, strokeWidth, fillColor) {
    super();
    this.points_ = points;
    this.strokeColor_ = strokeColor;
    this.strokeWidth_ = strokeWidth;
    this.fillColor_ = fillColor;
  }

  /** 
   * @returns {string} Returns a space-delimited string representing all points in the bezier curve.
   */
  PointsToString() {
    // Apply offset to all points
    let offsetPoints = this.points_.map(point => COORDINATES.Create(point.x_ + this.xOffset_, point.y_ + this.yOffset_));

    // Convert points to strings
    return this.offsetPoints.map(point => point.String()).join(' ');
  }

  /** 
   * @override
   * @returns {Array<string|number>} Returns an array of arguments needed for drawing the bezier curve.
  */
  Args() {
    return [
      '-fill', this.fillColor_,
      '-stroke', this.strokeColor_,
      '-strokewidth', this.strokeWidth_,
      '-draw', `bezier ${this.PointsToString()}`
    ];
  }

  /**
   * Create a Bezier object with the specified properties.
   * @param {Array<Coordinates>} points A list of points for the bezier curve to travel through.
   * @param {string} strokeColor The color of the line connecting all the points. (Valid color format string used in Image Magick)
   * @param {number} strokeWidth Width of the line connecting all the points. (Larger values produce thicker lines.)
   * @param {string} fillColor The color to fill the bezier. (Valid color format string used in Image Magick)
   * @returns {Bezier} Returns a Bezier object. If inputs are invalid, it returns null.
   */
  static Create(points, strokeColor, strokeWidth, fillColor) {
    if (
      VALIDATE.IsArray(points) ||
      VALIDATE.IsStringInput(strokeColor) ||
      VALIDATE.IsInteger(strokeWidth) ||
      VALIDATE.IsIntegerInRange(strokeWidth, DIMENSIONS_MIN, null) ||
      VALIDATE.IsStringInput(fillColor)
    )
      return null;

    return new Bezier(points, strokeColor, strokeWidth, fillColor);
  }
}

//--------------------------------
// CIRCLE

class Circle extends Primitive {
  /**
   * @param {Coordinates} center Coordinates for center of circle.
   * @param {Coordinates} edge  Coordinates for point on edge of circle. (Used for computing the radius.)
   * @param {string} strokeColor The color of the line that makes up the circle. (Valid color format string used in Image Magick)
   * @param {number} strokeWidth The width of the line that makes up the circle. (Larger value produces a thicker line.)
   * @param {string} fillColor The color to fill the circle with. (Valid color format string used in Image Magick)
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
    let center = COORDINATES.Create(this.center_.x_ + this.xOffset_, this.center_.y_ + this.yOffset_);
    let edge = COORDINATES.Create(this.edge_.x_ + this.xOffset_, this.edge_.y_ + this.yOffset_);

    return [
      '-fill', this.fillColor_,
      '-stroke', this.strokeColor_,
      '-strokewidth', this.strokeWidth_,
      '-draw', `circle ${center.String()} ${edge.String()}`
    ];
  }

  /**
   * Create a Circle object using the specified properties.
   * @param {Coordinates} center Coordinates for center of circle.
   * @param {Coordinates} edge  Coordinates for point on edge of circle. (Used for computing the radius.)
   * @param {string} strokeColor The color of the line that makes up the circle. (Valid color format string used in Image Magick)
   * @param {number} strokeWidth The width of the line that makes up the circle. (Larger value produces a thicker line.)
   * @param {string} fillColor The color to fill the circle with. (Valid color format string used in Image Magick)
   * @returns {Circle} Returns a Circle object. If inputs are invalid, it returns null.
   */
  static Create(center, edge, strokeColor, strokeWidth, fillColor) {
    if (
      center.constructor.name != 'Coordinates' ||
      edge.constructor.name != 'Coordinates' ||
      VALIDATE.IsStringInput(strokeColor) ||
      VALIDATE.IsInteger(strokeWidth) ||
      VALIDATE.IsIntegerInRange(strokeWidth, DIMENSIONS_MIN, null) ||
      VALIDATE.IsStringInput(fillColor)
    )
      return null;

    return new Circle(center, edge, strokeColor, strokeWidth, fillColor);
  }
}

//--------------------------------
// ELLIPSE

class Ellipse extends Primitive {
  /**
   * @param {Coordinates} center Coordinates for the center of the ellipse.
   * @param {number} width Width of of ellipse (in pixels).
   * @param {number} height Height of ellipse (in pixels.).
   * @param {string} strokeColor The outline color of the ellipse. (Valid color format string used in Image Magick)
   * @param {number} strokeWidth Width of the outline of the ellipse. (Larger value produces a thicker line).
   * @param {string} fillColor The color of the inside of the ellipse. (Valid color format string used in Image Magick)
   * @param {number} angleStart Angle at which to start drawing the ellipse. (0-degrees starts at 3-o'clock on the screen)
   * @param {number} angleEnd Angle at which to stop drawing the ellipse. (360-degrees stops at 3-o'clock on the screen)
   */
  constructor(center, width, height, strokeColor, strokeWidth, fillColor, angleStart, angleEnd) {
    super();
    this.center_ = center;
    this.width_ = width;
    this.height_ = height;
    this.strokeColor_ = strokeColor;
    this.strokeWidth_ = strokeWidth;
    this.fillColor_ = fillColor;
    this.angleStart_ = angleStart; //Starts at 3 o'clock position (on screen) and goes clockwise
    this.angleEnd_ = angleEnd;
  }

  /** 
   * @override
   * @returns {Array<string|number>} Returns an array of arguments needed for drawing the ellipse.
  */
  Args() {
    let center = COORDINATES.Create(this.center_.x_ + this.xOffset_, this.center_.y_ + this.yOffset_);

    return [
      '-fill', this.fillColor_,
      '-stroke', this.strokeColor_,
      '-strokewidth', this.strokeWidth_,
      '-draw', `ellipse ${center.String()} ${Math.floor(this.width_ / 2)},${Math.floor(this.height_ / 2)} ${this.angleStart_},${this.angleEnd_}`
    ];
  }

  /**
   * Create an Eliipse object with the specified properties.
   * @param {Coordinates} center Coordinates for the center of the ellipse.
   * @param {number} width Width of of ellipse (in pixels).
   * @param {number} height Height of ellipse (in pixels.).
   * @param {string} strokeColor The outline color of the ellipse. (Valid color format string used in Image Magick)
   * @param {number} strokeWidth Width of the outline of the ellipse. (Larger value produces a thicker line).
   * @param {string} fillColor The color of the inside of the ellipse. (Valid color format string used in Image Magick)
   * @param {number} angleStart Angle at which to start drawing the ellipse. (0-degrees starts at 3-o'clock on the screen)
   * @param {number} angleEnd Angle at which to stop drawing the ellipse. (360-degrees stops at 3-o'clock on the screen)
   * @returns {Ellipse} Returns an Ellipse object. If inputs are invalid, it returns null.
   */
  static Create(center, width, height, strokeColor, strokeWidth, fillColor, angleStart, angleEnd) {
    if (
      center.constructor.name != 'Coordinates' ||
      VALIDATE.IsInteger(width) ||
      VALIDATE.IsIntegerInRange(width, DIMENSIONS_MIN, null) ||
      VALIDATE.IsInteger(height) ||
      VALIDATE.IsIntegerInRange(height, DIMENSIONS_MIN, null) ||
      VALIDATE.IsStringInput(strokeColor) ||
      VALIDATE.IsInteger(strokeWidth) ||
      VALIDATE.IsIntegerInRange(strokeWidth, DIMENSIONS_MIN, null) ||
      VALIDATE.IsStringInput(fillColor) ||
      VALIDATE.IsInteger(angleStart) ||
      VALIDATE.IsInteger(angleEnd)
    )
      return null;

    return new Ellipse(center, width, height, strokeColor, strokeWidth, fillColor, angleStart, angleEnd);
  }
}


//--------------------------------
// LINE

class Line extends Primitive {
  /**
   * @param {Coordinates} start Start coordinates
   * @param {Coordinates} end End coordinates
   * @param {string} color Valid color format string used in Image Magick.
   * @param {number} width Width of line. As number increases, so does the width.
   */
  constructor(start, end, color, width) {
    super();
    this.start_ = start;
    this.end_ = end;
    this.color_ = color;
    this.width_ = width;
  }

  /** 
   * @override
   * @returns {Array<string|number>} Returns an array of arguments needed for drawing the line.
   */
  Args() {
    let start = COORDINATES.Create(this.start_.x_ + this.xOffset_, this.start_.y_ + this.yOffset_);
    let end = COORDINATES.Create(this.end_.x_ + this.xOffset_, this.end_.y_ + this.yOffset_);

    return [
      '-stroke', this.color_,
      '-strokewidth', this.width_,
      '-draw', `line ${start.String()} ${end_.String()}`
    ];
  }

  /**
   * Creates a Line object given the specified x and y coordinates.
   * @param {Coordinates} start Start coordinates
   * @param {Coordinates} end End coordinates
   * @param {string} color Valid color format string used in Image Magick.
   * @param {number} width Width of line. (Larger values produce thicker lines.)
   * @returns {Line} Returns an Line object. If inputs are invalid, it returns null.
   */
  static Create(start, end, color, width) {
    if (
      start.constructor.name != 'Coordinates' ||
      end.constructor.name != 'Coordinates' ||
      VALIDATE.IsStringInput(color) ||
      VALIDATE.IsInteger(width) ||
      VALIDATE.IsIntegerInRange(width, DIMENSIONS_MIN, null)
    )
      return null;

    return new Line(start, end, color, width);
  }
}

//--------------------------------
// PATH

class Path extends Primitive {
  /** 
  * @param {Array<Coordinates>} points A list of coordinates to be connected by a line in the order provided.
  * @param {string} strokeColor The color of the line connecting all the points. (Valid color format string used in Image Magick)
  * @param {number} strokeWidth Width of the line connecting all the points. (Larger values produce thicker lines.)
  * @param {string} fillColor The color to fill the path with. (Valid color format string used in Image Magick) 
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
   * @returns {string} Returns a space-delimited string representing all points in the path.
   */
  PointsToString() {
    // Apply offset to all points
    let offsetPoints = this.points_.map(point => COORDINATES.Create(point.x_ + this.xOffset_, point.y_ + this.yOffset_));

    // Convert points to strings
    return this.offsetPoints.map(point => point.String()).join(' ');
  }

  /** 
   * @override
   * @returns {Array<string|number>} Returns an array of arguments needed for drawing the path.
   */
  Args() {
    let pointsStr = `M ${this.PointsToString()}`;
    if (this.isClosed_)
      pointsStr += ' Z';
    return ['-fill', this.fillColor_, '-stroke', this.strokeColor_, '-strokewidth', this.strokeWidth_, '-draw', `path '${pointsStr}'`];
  }

  /** 
   * Create a Path object with the specified properties.
   * @param {Array<Coordinates>} points A list of coordinates to be connected by a line in the order provided.
   * @param {string} strokeColor The color of the line connecting all the points. (Valid color format string used in Image Magick)
   * @param {string} strokeWidth Width of the line connecting all the points. (Larger values produce thicker lines.)
   * @param {string} fillColor The color to fill the path with. (Valid color format string used in Image Magick) 
   * @param {boolean} isClosed Set to true if you wish to connect the last point back to the first one (if not done already). Else, set to false.
   * @returns {Path} Returns a Path object. If inputs are invalid, it returns null.
   */
  static Create(points, strokeColor, strokeWidth, fillColor, isClosed) {
    if (
      VALIDATE.IsArray(points) ||
      VALIDATE.IsStringInput(strokeColor) ||
      VALIDATE.IsInteger(strokeWidth) ||
      VALIDATE.IsIntegerInRange(strokeWidth, DIMENSIONS_MIN, null) ||
      VALIDATE.IsStringInput(fillColor) ||
      (isClosed === true || isClosed === false)
    )
      return null;

    return new Path(points, strokeColor, strokeWidth, fillColor, isClosed);
  }
}

//--------------------------------
// POINT

class Point extends Primitive {
  /**
   * @param {number} x X-coordinate
   * @param {number} y Y-coordinate
   * @param {string} color Valid color format string used in Image Magick.
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
    return [
      '-fill', this.color_,
      '-draw', `point ${this.x_ + this.xOffset_},${this.y_ + this.yOffset_}`
    ];
  }

  /**
   * Creates a Point object given the specified x and y coordinates.
   * @param {number} x X-ccordinate
   * @param {number} y Y-coordinate
   * @param {string} color Valid color format string used in Image Magick.
   * @returns {Point} Returns a Path object. If inputs are invalid, it returns null.
   */
  static Create(x, y, color) {
    if (
      VALIDATE.IsInteger(x) ||
      VALIDATE.IsInteger(y) ||
      VALIDATE.IsStringInput(color)
    )
      return null;

    return new Point(x, y, color);
  }
}

//--------------------------------
// TEXT

class Text extends Primitive {
  /**
   * @param {string} string String containing text.
   * @param {string} font Font name
   * @param {number} pointSize Point size
   * @param {string} gravity Gravity
   * @param {string} strokeColor The color of the outline of the text.
   * @param {number} strokeWidth The width of the outline of the text.
   * @param {string} fillColor The color to fill the text with.  (Valid color format string used in Image Magick)
   */
  constructor(string, font, pointSize, gravity, strokeColor, strokeWidth, fillColor) {
    super();
    this.string_ = string;
    this.font_ = font;
    this.pointSize_ = pointSize;
    this.gravity_ = gravity;
    this.strokeColor_ = strokeColor;
    this.strokeWidth_ = strokeWidth;
    this.fillColor_ = fillColor;
  }

  /** 
   * @override
   * @returns {Array<string|number>} Returns an array of arguments needed for drawing the point.
   */
  Args() {
    return [
      '-fill', this.fillColor_,
      '-stroke', this.strokeColor_,
      '-strokewidth', this.strokeWidth_,
      '-font', this.font_,
      '-pointsize', this.pointSize_,
      '-gravity', this.gravity_,
      '-draw', `text ${this.xOffset_},${this.yOffset_} '${this.string_}'`
    ];
  }

  /**
   * Create a Text object with the specified properties.
   * @param {string} string String containing text.
   * @param {string} font Font name
   * @param {number} pointSize Point size
   * @param {string} gravity Gravity
   * @param {string} strokeColor The color of the outline of the text.
   * @param {number} strokeWidth The width of the outline of the text.
   * @param {string} fillColor The color to fill the text with.  (Valid color format string used in Image Magick)
   * @returns {Text} Returns a Text object. If inputs are invalid, it returns null.
   */
  static Create(string, font, pointSize, gravity, strokeColor, strokeWidth, fillColor) {
    if (
      VALIDATE.IsStringInput(string) ||
      VALIDATE.IsStringInput(font) ||
      VALIDATE.IsInteger(pointSize) ||
      VALIDATE.IsIntegerInRange(pointSize, DIMENSIONS_MIN, null) ||
      VALIDATE.IsStringInput(gravity) ||
      VALIDATE.IsStringInput(strokeColor) ||
      VALIDATE.IsInteger(strokeWidth) ||
      VALIDATE.IsIntegerInRange(strokeWidth, DIMENSIONS_MIN, null) ||
      VALIDATE.IsStringInput(fillColor)
    )
      return null;

    return new Text(string, font, pointSize, gravity, strokeColor, strokeWidth, fillColor);
  }
}



//--------------------------------
// EXPORTS

exports.CreateBezier = Bezier.Create;
exports.CreateCircle = Circle.Create;
exports.CreateEllipse = Ellipse.Create;
exports.CreateLine = Line.Create;
exports.CreatePath = Path.Create;
exports.CreatePoint = Point.Create;
exports.CreateText = Text.Create;