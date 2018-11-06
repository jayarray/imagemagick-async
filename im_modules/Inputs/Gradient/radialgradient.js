let PATH = require('path');

let parts = __dirname.split(PATH.sep);
let index = parts.findIndex(x => x == 'im_modules');
let IM_MODULES_DIR = parts.slice(0, index + 1).join(PATH.sep);
let VALIDATE = require(PATH.join(IM_MODULES_DIR, 'Validation', 'validate.js'));
let GRADIENT_BASECLASS = require(PATH.join(__dirname, 'gradientbaseclass.js')).GradientBaseClass;

//-----------------------------

class RadialGradient extends GRADIENT_BASECLASS {
  constructor(startColor, endColor, center, radialWidth, radialHeight, angle, boundingBox, extent) {
    super();
    this.startColor_ = startColor;
    this.endColor_ = endColor;
    this.center_ = center;
    this.radialWidth_ = radialWidth;
    this.radialHeight_ = radialHeight;
    this.angle_ = angle;
    this.boundingBox_ = boundingBox;
    this.extent_ = extent;
  }

  /** 
   * @override
   * @returns {Array<string|number>} Returns an array of arguments. 
   */
  Args() {
    let args = [];

    if (this.center_)
      args.push('-define', `gradient:center=${this.center_.String()}`);

    if (this.radialWidth_ || this.radialHeight_) {
      if (this.radialWidth_ && this.radialHeight_)
        args.push('-define', `gradient:radii=${this.radialWidth_}, ${this.radialHeight_}`);
      else {
        if (this.radialWidth_)
          args.push('-define', `gradient:radii=${this.radialWidth_}, ${this.radialWidth_}`);
        else
          args.push('-define', `gradient:radii=${this.radialHeight_}, ${this.radialHeight_}`);
      }
    }

    if (this.angle_)
      args.push('-define', `gradient:angle=${this.angle_}`);

    if (this.boundingBox_)
      args.push('-define', `gradient:bounding-box=${this.boundingBox_.String()}`);

    if (this.extent_)
      args.push('-define', `gradient:extent=${this.extent_}`);

    args.push(`radial-gradient:${this.startColor_}-${this.endColor_}`);

    return args;
  }

  /**
   * Create a RadialGradient object with the specified properties.
   * @param {string} startColor Start color of the gradient. (Required)
   * @param {string} endColor End color of the gradient. (Required)
   * @param {Coordinates} center Coordinates for the center of the radial gradient. (Optional)
   * @param {number} radialWidth Width of the radial gradient. (Optional)
   * @param {number} radialHeight Height of the radial gradient. (Optional)
   * @param {number} angle Specifies the direction of the gradient going from startColor to endColor in a clockwise positive manner relative to north (up). (Optional)
   * @param {BoundingBox} boundingBox Limits the gradient to a lrager or smaller region than the image dimensions. If the region defined by the bounding box is smaller than the image, then startColor will be the color of the background. (Optional)
   * @param {string} extent Specifies the shape of an image centered radial gradient. Valid values are: Circle, Diagonal, Ellipse, Maximum, Minimum. (Optional)
   * @returns {RadialGradient} Returns a RadialGradient object. If inputs are invalid, it returns null.
   */
  static Create(startColor, endColor, center, radialWidth, radialHeight, angle, boundingBox, extent) {
    if (
      VALIDATE.IsStringInput(startColor) ||
      VALIDATE.IsStringInput(endColor) ||
      VALIDATE.IsIntegerInRange(radialWidth, CONSTANTS.MIN_WIDTH, null) ||
      VALIDATE.IsIntegerInRange(radialHeight, CONSTANTS.MIN_HEIGHT, null)
    )
      return null;

    return new RadialGradient(startColor, endColor, center, radialWidth, radialHeight, angle, boundingBox, extent);
  }
}

//-----------------------------
// EXPORTs

exports.Create = RadialGradient.Create;
exports.Name = 'RadialGradient';
exports.ComponentType = 'input';