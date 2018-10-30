let PATH = require('path');
let rootDir = PATH.dirname(require.main.filename);
let VALIDATE = require(PATH.join(rootDir, 'im_modules', 'validation', 'validate.js'));

//-----------------------------

class BoundingBox {
  /**
   * @param {Coordinates} center The center of the bounding box.
   * @param {number} width Width (in pixels)
   * @param {number} height Height (in pixels) 
   */
  constructor(center, width, height) {
    this.center_ = center;
    this.width_ = width;
    this.height_ = height;
  }

  /** 
   * @returns {string} Returns a string representation of the bounding box args.
   */
  String() {
    return `${this.width_}x${this.height_}+${this.center_.x}+${this.center_.y}`;
  }

  /**
   * Create a BoundingBox object with the specified properties.
   * @param {Coordinates} center Coordinates for the center of the bounding box.
   * @param {number} width Width (in pixels)
   * @param {number} height Height (in pixels)
   * @returns {BoundingBox} Returns a BoundingBox object. If inputs are invalid, it returns null.
   */
  static Create(center, width, height) {
    if (
      !center ||
      VALIDATE.IsNumber(width) ||
      VALIDATE.IsIntegerInRange(width, CONSTANTS.MIN_WIDTH, null) ||
      VALIDATE.IsNumber(height) ||
      VALIDATE.IsIntegerInRange(height, CONSTANTS.MIN_HEIGHT, null)
    )
      return null;

    return new BoundingBox(center, width, height);
  }
}

//--------------------------
// EXPORTS

exports.Create = BoundingBox.Create;