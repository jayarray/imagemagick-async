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

//----------------------------------------
// EXPORTS

exports.Create = QuadraticBezier.Create;
exports.Name = 'QuadraticBezier';
exports.ComponentType = 'input';