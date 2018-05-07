let VALIDATE = require('./validate.js');
let CONSTANTS = require('./constants.js');
let COORDINATES = require('./coordinates.js');

//---------------------------------
// PRIMITIVE (Base class)

class Primitive {
  constructor() {
  }

  /**
   * @param {number} xOffset
   * @param {number} yOffset
   * @returns {Array<string|number>} Returns an array of arguments needed for drawing the primitive.
   */
  Args(xOffset, yOffset) {
    // Override
  }
}

//--------------------------------
// BEZIER

class Bezier extends Primitive {
  /**
   * @param {Array<Coordinates>} points A list of points for the bezier curve to travel through. (Required)
   * @param {string} strokeColor The color of the line connecting all the points. (Valid color format string used in Image Magick) (Optional)
   * @param {number} strokeWidth Width of the line connecting all the points. (Larger values produce thicker lines.) (Optional)
   * @param {string} fillColor The color to fill the bezier. (Valid color format string used in Image Magick) (Optional)
   */
  constructor(points, strokeColor, strokeWidth, fillColor) {
    super();
    this.points_ = points;
    this.strokeColor_ = strokeColor;
    this.strokeWidth_ = strokeWidth;
    this.fillColor_ = fillColor;
  }

  /** 
   * Get a list of points in string form that have the X and Y offsets applied to them.
   * @param {number} xOffset
   * @param {number} yOffset
   * @returns {string} Returns a space-delimited string representing all points in the bezier curve.
   */
  PointsToString(xOffset, yOffset) {
    return this.points_.map(point => COORDINATES.Create(point.x_ + xOffset_, point.y_ + yOffset_).String()).join(' ');
  }

  /** 
   * @override
   * @param {number} xOffset
   * @param {number} yOffset
   * @returns {Array<string|number>} Returns an array of arguments needed for drawing the bezier curve.
  */
  Args(xOffset, yOffset) {
    let args = [];

    if (this.fillColor_)
      args.push('-fill', this.fillColor_); // Applies fill color to areas where the curve is above or below the line computed between the start and end point.
    else
      args.push('-fill', 'none'); // Outputs lines only

    if (this.strokeColor_)
      args.push('-stroke', this.strokeColor_);

    if (this.strokeWidth_)
      args.push('-strokewidth', this.strokeWidth_);

    args.push('-draw', `bezier ${this.PointsToString(xOffset, yOffset)}`);
    return args;
  }

  /**
   * Create a Bezier object with the specified properties.
   * @param {Array<Coordinates>} points A list of points for the bezier curve to travel through. (Required)
   * @param {string} strokeColor The color of the line connecting all the points. (Valid color format string used in Image Magick) (Optional)
   * @param {number} strokeWidth Width of the line connecting all the points. (Larger values produce thicker lines.) (Optional)
   * @param {string} fillColor The color to fill the bezier. (Valid color format string used in Image Magick) (Optional)
   * @returns {Bezier} Returns a Bezier object. If inputs are invalid, it returns null.
   */
  static Create(points, strokeColor, strokeWidth, fillColor) {
    if (strokeWidth && VALIDATE.IsIntegerInRange(strokeWidth, CONSTANTS.MIN_WIDTH, null))
      return null;

    return new Bezier(points, strokeColor, strokeWidth, fillColor);
  }
}

//--------------------------------
// CIRCLE

class Circle extends Primitive {
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
   * @param {number} xOffset
   * @param {number} yOffset
   * @returns {Array<string|number>} Returns an array of arguments needed for drawing the circle.
  */
  Args(xOffset, yOffset) {
    args = [];

    if (this.fillColor_)
      args.push('-fill', this.fillColor_);
    else
      args.push('-fill', 'none'); // Prevents default black fill color

    if (this.strokeColor_)
      args.push('-stroke', this.strokeColor_);

    if (this.strokeWidth_)
      args.push('-strokewidth', this.strokeWidth_);

    let center = COORDINATES.Create(this.center_.x_ + xOffset_, this.center_.y_ + yOffset_);
    let edge = COORDINATES.Create(this.edge_.x_ + xOffset_, this.edge_.y_ + yOffset_);
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
    if (strokeWidth && VALIDATE.IsIntegerInRange(strokeWidth, CONSTANTS.MIN_WIDTH, null))
      return null;

    return new Circle(center, edge, strokeColor, strokeWidth, fillColor);
  }
}

//--------------------------------
// ELLIPSE

class Ellipse extends Primitive {
  /**
   * @param {Coordinates} center Coordinates for the center of the ellipse. (Required)
   * @param {number} width Width of of ellipse (in pixels). (Required)
   * @param {number} height Height of ellipse (in pixels.). (Required)
   * @param {string} strokeColor The outline color of the ellipse. (Valid color format string used in Image Magick) (Optional)
   * @param {number} strokeWidth Width of the outline of the ellipse. (Larger value produces a thicker line). (Optional)
   * @param {string} fillColor The color of the inside of the ellipse. (Valid color format string used in Image Magick) (Optional)
   * @param {number} angleStart Angle at which to start drawing the ellipse. (0-degrees starts at 3-o'clock on the screen) (Optional)
   * @param {number} angleEnd Angle at which to stop drawing the ellipse. (360-degrees stops at 3-o'clock on the screen) (Optional)
   */
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

    if (this.strokeColor_)
      args.push('-stroke', this.strokeColor_);

    if (this.strokeWidth_)
      args.push('-strokewidth', this.strokeWidth_);

    let center = COORDINATES.Create(this.center_.x_ + this.xOffset_, this.center_.y_ + this.yOffset_);

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
    if (
      center.constructor.name != 'Coordinates' ||
      VALIDATE.IsInteger(width) ||
      VALIDATE.IsIntegerInRange(width, DIMENSIONS_MIN, null) ||
      VALIDATE.IsInteger(height) ||
      VALIDATE.IsIntegerInRange(height, DIMENSIONS_MIN, null) ||
      (!VALIDATE.IsInstance(strokeColor) && VALIDATE.IsStringInput(strokeColor)) ||
      (!VALIDATE.IsInstance(strokeWidth) && (VALIDATE.IsInteger(strokeWidth) || VALIDATE.IsIntegerInRange(strokeWidth, DIMENSIONS_MIN, null))) ||
      (!VALIDATE.IsInstance(fillColor) && VALIDATE.IsStringInput(fillColor)) ||
      (!VALIDATE.IsInstance(angleStart) && VALIDATE.IsInteger(angleStart)) ||
      (!VALIDATE.IsInstance(angleEnd) && VALIDATE.IsInteger(angleEnd))
    )
      return null;

    return new Ellipse(center, width, height, strokeColor, strokeWidth, fillColor, angleStart, angleEnd);
  }
}


//--------------------------------
// LINE

class Line extends Primitive {
  /**
   * @param {Coordinates} start Start coordinates (Required)
   * @param {Coordinates} end End coordinates (Required)
   * @param {string} color Valid color format string used in Image Magick. (Optional)
   * @param {number} width Width of line. Larger values produce thicker lines. (Optional)
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
    let args = [];

    if (this.color_)
      args.push('-stroke', this.color_);

    if (this.width_)
      args.push('-strokewidth', this.width_);

    let start = COORDINATES.Create(this.start_.x_ + this.xOffset_, this.start_.y_ + this.yOffset_);
    let end = COORDINATES.Create(this.end_.x_ + this.xOffset_, this.end_.y_ + this.yOffset_);
    args.push('-draw', `line ${start.String()} ${end_.String()}`);

    return args;
  }

  /**
   * Creates a Line object given the specified x and y coordinates.
   * @param {Coordinates} start Start coordinates (Required)
   * @param {Coordinates} end End coordinates (Required)
   * @param {string} color Valid color format string used in Image Magick. (Optional)
   * @param {number} width Width of line. Larger values produce thicker lines. (Optional)
   * @returns {Line} Returns an Line object. If inputs are invalid, it returns null.
   */
  static Create(start, end, color, width) {
    if (
      start.constructor.name != 'Coordinates' ||
      end.constructor.name != 'Coordinates' ||
      (!VALIDATE.IsInstance(color) && VALIDATE.IsStringInput(color)) ||
      (!VALIDATE.IsInstance(width) && (VALIDATE.IsInteger(width) || VALIDATE.IsIntegerInRange(width, DIMENSIONS_MIN, null)))
    )
      return null;

    return new Line(start, end, color, width);
  }
}

//--------------------------------
// PATH

class Path extends Primitive {
  /** 
  * @param {Array<Coordinates>} points A list of coordinates to be connected by a line in the order provided. (Required)
  * @param {string} strokeColor The color of the line connecting all the points. (Valid color format string used in Image Magick) (Optional)
  * @param {number} strokeWidth Width of the line connecting all the points. (Larger values produce thicker lines.) (Optional)
  * @param {string} fillColor The color to fill the path with. (Valid color format string used in Image Magick) (Optional)
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
    let args = [];

    if (this.fillColor_)
      args.push('-fill', this.fillColor_);

    if (this.strokeColor_)
      args.push('-stroke', this.strokeColor_);

    if (this.strokeWidth_)
      args.push('-strokewidth', this.strokeWidth_);

    let pointsStr = `M ${this.PointsToString()}`;
    if (this.isClosed_)
      pointsStr += ' Z';

    args.push('-draw', `path '${pointsStr}'`);
    return args;
  }

  /** 
   * Create a Path object with the specified properties.
   * @param {Array<Coordinates>} points A list of coordinates to be connected by a line in the order provided. (Required)
   * @param {string} strokeColor The color of the line connecting all the points. (Valid color format string used in Image Magick) (Optional)
   * @param {number} strokeWidth Width of the line connecting all the points. (Larger values produce thicker lines.) (Optional)
   * @param {string} fillColor The color to fill the path with. (Valid color format string used in Image Magick) (Optional)
   * @param {boolean} isClosed Set to true if you wish to connect the last point back to the first one (if not done already). Else, set to false.
   * @returns {Path} Returns a Path object. If inputs are invalid, it returns null.
   */
  static Create(points, strokeColor, strokeWidth, fillColor, isClosed) {
    if (
      VALIDATE.IsArray(points) ||
      (!VALIDATE.IsInstance(strokeColor) && VALIDATE.IsStringInput(strokeColor)) ||
      (!VALIDATE.IsInstance(strokeWidth) && (VALIDATE.IsInteger(strokeWidth) || VALIDATE.IsIntegerInRange(strokeWidth, DIMENSIONS_MIN, null))) ||
      (!VALIDATE.IsInstance(fillColor) && VALIDATE.IsStringInput(fillColor)) ||
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
      args.push('-fill', this.color_);

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
    if (
      VALIDATE.IsInteger(x) ||
      VALIDATE.IsInteger(y) ||
      (!VALIDATE.IsInstance(color) && VALIDATE.IsStringInput(color))
    )
      return null;

    return new Point(x, y, color);
  }
}

//--------------------------------
// TEXT

class Text extends Primitive {
  /**
   * @param {string} string String containing text. (Required)
   * @param {string} font Font name (Optional)
   * @param {number} pointSize Point size (Optional)
   * @param {string} gravity Gravity (Optional)
   * @param {string} strokeColor The color of the outline of the text. (Optional)
   * @param {number} strokeWidth The width of the outline of the text. (Optional)
   * @param {string} fillColor The color to fill the text with.  (Valid color format string used in Image Magick) (Optional)
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
    let args = [];

    if (this.fillColor_)
      args.push('-fill', this.fillColor_);

    if (this.strokeColor_)
      args.push('-stroke', this.strokeColor_);

    if (this.strokeWidth_)
      args.push('-strokewidth', this.strokeWidth_);

    if (this.font_)
      args.push('-font', this.font_);

    if (this.pointSize_)
      args.push('-pointsize', this.pointSize_);

    if (this.gravity_)
      args.push('-gravity', this.gravity_);

    args.push('-draw', `text ${this.xOffset_},${this.yOffset_} '${this.string_}'`);
    return args;
  }

  /**
   * Create a Text object with the specified properties.
   * @param {string} string String containing text. (Required)
   * @param {string} font Font name (Optional)
   * @param {number} pointSize Point size (Optional)
   * @param {string} gravity Gravity (Optional)
   * @param {string} strokeColor The color of the outline of the text. (Optional)
   * @param {number} strokeWidth The width of the outline of the text. (Optional)
   * @param {string} fillColor The color to fill the text with.  (Valid color format string used in Image Magick) (Optional)
   * @returns {Text} Returns a Text object. If inputs are invalid, it returns null.
   */
  static Create(string, font, pointSize, gravity, strokeColor, strokeWidth, fillColor) {
    if (
      VALIDATE.IsStringInput(string) ||
      (!VALIDATE.IsInstance(font) && VALIDATE.IsStringInput(font)) ||
      (!VALIDATE.IsInstance(pointSize) && (VALIDATE.IsInteger(pointSize) || VALIDATE.IsIntegerInRange(pointSize, DIMENSIONS_MIN, null))) ||
      (!VALIDATE.IsInstance(gravity) && VALIDATE.IsStringInput(gravity)) ||
      (!VALIDATE.IsInstance(strokeColor) && VALIDATE.IsStringInput(strokeColor)) ||
      (!VALIDATE.IsInstance(strokeWidth) && (VALIDATE.IsInteger(strokeWidth) || VALIDATE.IsIntegerInRange(strokeWidth, DIMENSIONS_MIN, null))) ||
      (!VALIDATE.IsInstance(fillColor) && VALIDATE.IsStringInput(fillColor))
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