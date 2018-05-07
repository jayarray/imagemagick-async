let VALIDATE = require('./validate.js');
let CONSTANTS = require('./constants.js');
let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;

//-------------------------------
// VECTOR

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
    if (
      start.constructor.name != 'Coordinates' ||
      end.constructor.name != 'Coordinates'
    )
      return null;

    return new Vector(start, end);
  }
}

//----------------------------------
// BOUNDING BOX

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
      center.constructor.name != 'Coordinates' ||
      VALIDATE.IsNumber(width) ||
      VALIDATE.IsIntegerInRange(width, CONSTANTS.MIN_WIDTH, null) ||
      VALIDATE.IsNumber(height) ||
      VALIDATE.IsIntegerInRange(height, CONSTANTS.MIN_HEIGHT, null)
    )
      return null;

    return new BoundingBox(center, width, height);
  }
}

//----------------------------------
// GRADIENT

class Gradient {
  constructor() {
  }

  /** 
   * @returns {Array<string|number>} Returns an array of arguments. 
   */
  Args() {
    // Override
  }
}

//----------------------------------
// LINEAR GRADIENT

class LinearGradient extends Gradient {
  /**
   * @param {string} startColor Start color for linear gradient. (Required)
   * @param {string} endColor End color for linear gradient. (Required)
   * @param {Vector} vector Vector that defines where the gradient will move through. (Optional)
   * @param {number} angle Specifies the direction of the gradient going from startColor to endColor in a clockwise positive manner relative to north (up). (Optional)
   * @param {BoundingBox} boundingBox Limits the gradient to a larger or smaller region than the image dimensions. If the region defined by the bounding box is smaller than the image, then startColor will be the color of the background. (Optional)
   * @param {string} direction Specifies the direction of the linear gradient towards the top/bottom/left/right or diagonal corners. Valid values are: NorthWest, North, Northeast, West, East, SouthWest, South, SouthEast. (Optional)
   * @param {string} extent Specifies the shape of an image centered radial gradient. Valid values are: Circle, Diagonal, Ellipse, Maximum, Minimum. (Optional)
   */
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

    if (this.vector_) {
      args.push('-define', `gradient:vector=${this.vector_.start_.String()},${this.vector_.end_.String()}`);
      optionCount++;
    }

    if (this.angle_) {
      args.push('-define', `gradient:angle=${this.angle_}`);
      optionCount++;
    }

    if (this.boundingBox_) {
      args.push('-define', `gradient:bounding-box=${this.boundingBox_.String()}`);
      optionCount++;
    }

    if (this.direction_) {
      args.push('-define', `gradient:direction=${this.direction_}`);
      optionCount++;
    }

    if (this.extent_) {
      args.push('-define', `gradient:extent=${this.extent_}`);
      optionCount++;
    }

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
    if (
      VALIDATE.IsStringInput(startColor) ||
      VALIDATE.IsStringInput(endColor) ||
      (vector != null && vector.constructor.name != 'Vector') ||
      (angle != null && VALIDATE.IsInteger(angle)) ||
      (boundingBox != null && boundingBox.constructor.name != 'BoundingBox') ||
      (direction != null && VALIDATE.IsStringInput(direction)) ||
      (extent != null && VALIDATE.IsStringInput(extent))
    )
      return null;

    return new LinearGradient(startColor, endColor, vector, angle, boundingBox, direction, extent);
  }
}

//------------------------------------
// RADIAL GRADIENT

class RadialGradient extends Gradient {
  /**
   * @param {string} startColor Start color of the gradient. (Required)
   * @param {string} endColor End color of the gradient. (Required)
   * @param {Coordinates} center Coordinates for the center of the radial gradient. (Optional)
   * @param {number} radialWidth Width of the radial gradient. (Optional)
   * @param {number} radialHeight Height of the radial gradient. (Optional)
   * @param {number} angle Specifies the direction of the gradient going from startColor to endColor in a clockwise positive manner relative to north (up). (Optional)
   * @param {BoundingBox} boundingBox Limits the gradient to a lrager or smaller region than the image dimensions. If the region defined by the bounding box is smaller than the image, then startColor will be the color of the background. (Optional)
   * @param {string} extent Specifies the shape of an image centered radial gradient. Valid values are: Circle, Diagonal, Ellipse, Maximum, Minimum. (Optional)
   */
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

    if (this.center_) {
      args.push('-define', `gradient:center=${this.center_.String()}`);
      optionCount++;
    }

    if (this.radialWidth_ || this.radialHeight_) {
      if (this.radialWidth_ && this.radialHeight_)
        args.push('-define', `gradient:radii=${this.radialWidth_}, ${this.radialHeight_}`);
      else {
        if (this.radialWidth_)
          args.push('-define', `gradient:radii=${this.radialWidth_}, ${this.radialWidth_}`);
        else
          args.push('-define', `gradient:radii=${this.radialHeight_}, ${this.radialHeight_}`);
      }
      optionCount++;
    }

    if (this.angle_) {
      args.push('-define', `gradient:angle=${this.angle_}`);
      optionCount++;
    }

    if (this.boundingBox_) {
      args.push('-define', `gradient:bounding-box=${this.boundingBox_.String()}`);
      optionCount++;
    }

    if (this.extent_) {
      args.push('-define', `gradient:extent=${this.extent_}`);
      optionCount++;
    }

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
      (center != null && center.constructor.name != 'Coordinates') ||
      (radialWidth != null && VALIDATE.IsInteger(radialWidth)) ||
      VALIDATE.IsIntegerInRange(radialWidth, CONSTANTS.MIN_WIDTH, null) ||
      (radialHeight != null && VALIDATE.IsInteger(radialHeight)) ||
      VALIDATE.IsIntegerInRange(radialHeight, CONSTANTS.MIN_HEIGHT, null) ||
      (angle != null && VALIDATE.IsInteger(angle)) ||
      (boundingBox != null && boundingBox.constructor.name != 'BoundingBox') ||
      (extent != null && VALIDATE.IsStringInput(extent))
    )
      return null;

    return new RadialGradient(startColor, endColor, center, radialWidth, radialHeight, angle, boundingBox, extent);
  }
}

//-----------------------------------
// EXPORTS

exports.CreateVector = Vector.Create;
exports.CreateBoundingBox = BoundingBox.Create;
exports.CreateLinearGradient = LinearGradient.Create;
exports.CreateRadialGradient = RadialGradient.Create;