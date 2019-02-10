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
   * @param {boolean} sweepFlag Set to true if path should go below the center of the ellipse. False results in the path going above the center of the ellipse.
   * @param {Coordinates} edge
   * @returns {EllipticalArc} Returns an EllipticalArc object. If inputs are invalid, it returns null.
   */
  static Create(radius, angle, largeFlag, sweepFlag, edge) {
    if (!radius || isNaN(angle) || !edge)
      return null;

    return new EllipticalArc(radius, angle, largeFlag, sweepFlag, edge);
  }
}

//------------------------------
// EXPORTS

exports.Create = EllipticalArc.Create;
exports.Name = 'EllipticalArc';
exports.ComponentType = 'input';