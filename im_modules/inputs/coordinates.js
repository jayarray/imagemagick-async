let PATH = require('path');
let rootDir = PATH.dirname(require.main.filename);
let VALIDATE = require(PATH.join(rootDir, 'im_modules', 'validation', 'validate.js'));

//-----------------------------

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
   * @returns {Coordinates} Returns a Coordinates object. If inputs are invalid, it returns null.
   */
  static Create(x, y) {
    if (
      VALIDATE.IsInteger(x) ||
      VALIDATE.IsInteger(y)
    )
      return null;

    return new Coordinates(x, y);
  }
}

//--------------------------------
// EXPORTS

exports.Create = Coordinates.Create;
exports.Name = 'Coordinates';
exports.ComponentType = 'input';