let VALIDATE = require('./validate.js');

//-----------------------------------
// COORDINATES

class Coordinates {
  /**
   * @param {number} x  X-coordinate
   * @param {number} y  Y-coordinate
   */
  constructor(x, y) {
    this.x_ = x;
    this.y_ = y;
  }

  /** 
   * @returns {string} Returns a string representation of the coordinates as 'x,y'. 
   */
  String() {
    return `${this.x_},${this.y_}`;
  }

  /**
   * Create a Coordinates object given the specifiec x and y values.
   * @param {number} x X-coordinate
   * @param {number} y Y-coordinate
   * @returns {Promise<Coordinates>} Returns a promise. If it resolves, it returns a Coordinates object. Otherwise, it returns an error.
   */
  static Create(x, y) {
    let error = VALIDATE.IsInteger(x);
    if (error)
      return Promise.reject(`Failed to create coordinates: x is ${error}`);

    error = VALIDATE.IsInteger(y);
    if (error)
      return Promise.reject(`Failed to create coordinates: y is ${error}`);

    return Promise.resolve(new Coordinates(x, y));
  }
}

//--------------------------------
// EXPORTS

exports.Create = Coordinates.Create;