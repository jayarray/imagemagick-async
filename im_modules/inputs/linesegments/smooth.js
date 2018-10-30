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
   * Create a Smooth object. (Used with CubizBezier or QuadraticBezier)
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

//----------------------------
// EXPORTs

exports.Create = Smooth.Create;
exports.Name = 'Smooth';
exports.ComponentType = 'input';