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

//----------------------------
// EXPORTs

exports.Create = Line.Create;