class Vector {
  /**
   * @param {Coordinates} start Start coordinates
   * @param {Coordinates} end End coordinates
   */
  constructor(start, end) {
    this.start_ = start;
    this.end_ = end;
  }

  /**
   * Create a Vector object with the specified properties.
   * @param {Coordinates} start Start coordinates 
   * @param {Coordinates} end End coordinates
   * @returns {Vector} Returns a Vector object. If inputs are invalid, it returns null.
   */
  static Create(start, end) {
    if (!start || !end)
      return null;

    return new Vector(start, end);
  }
}

//---------------------------
// EXPORTS

exports.Create = Vector.Create;
exports.Name = 'Vector';
exports.ComponentType = 'input';