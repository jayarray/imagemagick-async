let PATH = require('path');
let rootDir = PATH.dirname(require.main.filename);
let VALIDATE = require(PATH.join(rootDir, 'im_modules', 'validation', 'validate.js'));

//-----------------------------

class LinearGradient {
  constructor(startColor, endColor, vector, angle, boundingBox, direction, extent) {
    super();
    this.startColor_ = startColor;
    this.endColor_ = endColor;
    this.vector_ = vector;
    this.angle_ = angle;
    this.boundingBox_ = boundingBox;
    this.direction_ = direction;
    this.extent_ = extent;
  }

  /** 
   * @override
   * @returns {Array<string|number>} Returns an array of arguments. 
   */
  Args() {
    let args = [];

    if (this.vector_)
      args.push('-define', `gradient:vector=${this.vector_.start_.String()},${this.vector_.end_.String()}`);

    if (this.angle_)
      args.push('-define', `gradient:angle=${this.angle_}`);

    if (this.boundingBox_)
      args.push('-define', `gradient:bounding-box=${this.boundingBox_.String()}`);

    if (this.direction_)
      args.push('-define', `gradient:direction=${this.direction_}`);

    if (this.extent_)
      args.push('-define', `gradient:extent=${this.extent_}`);

    args.push(`gradient:${this.startColor_}-${this.endColor_}`);

    return args;
  }

  /**
   * Create a LinearGradient object with the specified properties.
   * @param {string} startColor Start color for linear gradient. (Required)
   * @param {string} endColor End color for linear gradient. (Required)
   * @param {Vector} vector Vector that defines where the gradient will move through. (Optional)
   * @param {number} angle Specifies the direction of the gradient going from startColor to endColor in a clockwise positive manner relative to north (up). (Optional)
   * @param {BoundingBox} boundingBox Limits the gradient to a larger or smaller region than the image dimensions. If the region defined by the bounding box is smaller than the image, then startColor will be the color of the background. (Optional)
   * @param {string} direction Specifies the direction of the linear gradient towards the top/bottom/left/right or diagonal corners. Valid values are: NorthWest, North, Northeast, West, East, SouthWest, South, SouthEast. (Optional)
   * @param {string} extent Specifies the shape of an image centered radial gradient. Valid values are: Circle, Diagonal, Ellipse, Maximum, Minimum. (Optional)
   * @returns {LinearGradient} Returns a LinearGradient object. If inputs are invalid, it returns null.
   */
  static Create(startColor, endColor, vector, angle, boundingBox, direction, extent) {
    if (VALIDATE.IsStringInput(startColor) || VALIDATE.IsStringInput(endColor))
      return null;

    return new LinearGradient(startColor, endColor, vector, angle, boundingBox, direction, extent);
  }
}

//-------------------------------
// EXPORTs

exports.Create = LinearGradient.Create;
exports.Name = 'LinearGradient';
exports.ComponentType = 'input';