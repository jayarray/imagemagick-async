//-----------------------------
// ELLIPTICAL ARC

class EllipticalArc {
  constructor(radius, angle, largeFlag, sweepFlag, edge) {
    this.radius_ = radius;
    this.angle_ = angle;
    this.largeFlag_ = largeFlag;
    this.sweepFlag_ = sweepFlag;
    this.edge_ = edge;
  }


  String() {
    return `A ${this.radius_.x_},${this.radius_.y_} ${this.angle_} ${this.largeFlag_ ? 1 : 0},${this.sweepFlag_ ? 1 : 0} ${this.edge_.x_},${this.edge_.y_}`;
  }

  /**
   * Create an EllipticArc object.
   * @param {Coordinates} radius
   * @param {number} angle 
   * @param {boolean} largeFlag Set to true if longer path going around the center of the ellipse is desired. False results in a smaller arc not containing the center of the ellipse.
   * @param {boolean} sweepFlag Set to true if 
   * @param {Coordinates} edge
   * @returns {EllipticalArc} Returns an EllipticalArc object. If inputs are invalid, it returns null.
   */
  static Create(radius, angle, largeFlag, sweepFlag, edge) {
    if (!radius || isNaN(angle) || !edge)
      return null;

    return new EllipticalArc(points, strokeColor, strokeWidth, fillColor);
  }
}

//-----------------------------
// LINE

class Line {
  constructor(x, y) {
    this.x_ = x;
    this.y_ = y;
  }

  String() {
    return `L ${this.x_},${this.y_}`;
  }

  /**
   * Create a Line object.
   * @param {number} x 
   * @param {number} y 
   * @returns {Line} Returns a Line object. If inputs are invalid, it returns null.
   */
  static Create(x, y) {
    if (isNaN(x) || isNaN(y))
      return null;

    return new Line(x, y);
  }
}

//-----------------------------
// CUBIC BEZIER

class CubicBezier {
  constructor(control1, control2, endPoint) {
    this.control1_ = control1;
    this.control2_ = control2;
    this.endPoint_ = endPoint;
  }

  String() {
    return `C ${this.control1_.x_},${this.control1_.y_} ${this.control2_.x_},${this.control2_.y_} ${this.endPoint_.x_},${this.endPoint_.y_}`;
  }

  /**
   * Create a CubicBezier object.
   * @param {Coordinates} control1 
   * @param {Coordinates} control2 
   * @param {Coordinates} endPoint
   * @returns {CubicBezier} Returns a CubicBezier object. If inputs are invalid, it returns null.
   */
  static Create(control1, control2, endPoint) {
    if (!control1 || !control2 || !endPoint)
      return null;

    return new CubicBezier(control1, control2, endPoint);
  }
}

//-----------------------------
// SMOOTH  (Used with CubizBezier or QuadraticBezier)

class Smooth {
  constructor(control, endPoint, isQuadraticBezier) {
    this.control_ = control;
    this.endPoint_ = endPoint;
    this.isQuadraticBezier_ = isQuadraticBezier;
  }

  String() {
    let char = 'S';
    if (this.isQuadraticBezier_)
      char = 'T';

    return `${char} ${this.control_.x_},${this.control_.y_} ${this.endPoint_.x_},${this.endPoint_.y_}`;
  }

  /**
   * Create a Smooth object.
   * @param {Coordinates} control
   * @param {Coordinates} endPoint
   * @param {boolean} isQuadraticBezier
   * @returns {Smooth} Returns a Smooth object. If inputs are invalid, it returns null.
   */
  static Create(control, endPoint, isQuadraticBezier) {
    if (!control || !endPoint)
      return null;

    return new Smooth(control, endPoint, isQuadraticBezier);
  }
}

//-----------------------------
// QUADRATIC BEZIER LINE

class QuadraticBezier {
  constructor(control, endPoint) {
    this.control_ = control;
    this.endPoint_ = endPoint;
  }

  String() {
    return `Q ${this.control_.x_},${this.control_.y_} ${this.endPoint_.x_},${this.endPoint_.y_}`;
  }

  /**
   * Create a Smooth object.
   * @param {Coordinates} control
   * @param {Coordinates} endPoint
   * @returns {Smooth} Returns a Smooth object. If inputs are invalid, it returns null.
   */
  static Create(control, endPoint) {
    if (!control || !endPoint)
      return null;

    return new Smooth(control, endPoint);
  }
}

//------------------------------
// EXPORTS

exports.CreateEllipticalArcSegment = EllipticalArc.Create;
exports.CreateLineSegment = Line.Create;
exports.CreateCubicBezierSegment = CubicBezier.Create;
exports.CreateSmoothSegment = Smooth.Create;
exports.CreateQuadraticBezierSegment = QuadraticBezier.Create;