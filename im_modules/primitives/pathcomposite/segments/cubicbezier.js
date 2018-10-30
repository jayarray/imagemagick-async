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

//------------------------
// EXPORTS

exports.Create = CubicBezier.Create;