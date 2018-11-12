let PATH = require('path');

let parts = __dirname.split(PATH.sep);
let index = parts.findIndex(x => x == 'im_modules');
let IM_MODULES_DIR = parts.slice(0, index + 1).join(PATH.sep);
let VALIDATE = require(PATH.join(IM_MODULES_DIR, 'Validation', 'validate.js'));

//-----------------------------
// (For use with Barycentric Canvas)

class PointAndColor {
  constructor(point, color) {
    this.ppint_ = point;
    this.color_ = color;
  }

  /** 
   * @returns {string} Returns a string representation of the coordinates as 'x,y'. 
   */
  String() {
    return `${this.point_.x_},${this.point_.y_} ${this.color_}`;
  }

  /**
   * Create a PointAndColor object. (For use with Barycentric Canvas)
   * @param {Coordinates} point
   * @param {string} color
   * @returns {Coordinates} Returns a PointAndColor object. If inputs are invalid, it returns null.
   */
  static Create(point, color) {
    if (!point || !color)
      return null;

    return new PointAndColor(point, color);
  }
}

//--------------------------------
// EXPORTS

exports.Create = PointAndColor.Create;
exports.Name = 'PointAndColor';
exports.ComponentType = 'input';