let VALIDATE = require('./validate.js');
let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;

//---------------------------------
// CONSTANTS

const DIMENSIONS_MIN = 1;

//-------------------------------
// VECTOR

class Vector extends Primitive {
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

class BoundingBox extends Primitive {
  /**
   * @param {Coordinates} center The center of the bounding box.
   * @param {number} width Width (in pixels)
   * @param {number} height Height (in pixels) 
   */
  constructor(center, width, height) {
    super();
    this.center_ = center;
    this.width_ = width;
    this.height_ = height;
  }

  /** 
   * @returns {string} Returns a string representation of the bounding box args.
   */
  String() {
    return `${this.width_}x${this.height_}+${this.center_.x + this.xOffset_}+${this.center_.y + this.yOffset_}`;
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
      VALIDATE.IsIntegerInRange(width, DIMENSIONS_MIN, null) ||
      VALIDATE.IsNumber(height) ||
      VALIDATE.IsIntegerInRange(height, DIMENSIONS_MIN, null)
    )
      return null;

    return new BoundingBox(center, width, height);
  }
}

//----------------------------------
// LINEAR GRADIENT

class LinearGradient {
  /**
   * @param {string} startColor Start color for linear gradient.
   * @param {string} endColor End color for linear gradient.
   * @param {Vector} vector Vector that defines where the gradient will move through.
   * @param {number} angle Specifies the direction of the gradient going from startColor to endColor in a clockwise positive manner relative to north (up).
   * @param {BoundingBox} boundingBox Limits the gradient to a larger or smaller region than the image dimensions. If the region defined by the bounding box is smaller than the image, then startColor will be the color of the background.
   * @param {string} direction Specifies the direction of the linear gradient towards the top/bottom/left/right or diagonal corners. Valid values are: NorthWest, North, Northeast, West, East, SouthWest, South, SouthEast.
   * @param {string} extent Specifies the shape of an image centered radial gradient. Valid values are: Circle, Diagonal, Ellipse, Maximum, Minimum.
   */
  constructor(startColor, endColor, vector, angle, boundingBox, direction, extent) {
    this.startColor_ = startColor;
    this.endColor_ = endColor;
    this.vector_ = vector;
    this.angle_ = angle;
    this.boundingBox_ = boundingBox;
    this.direction_ = direction;
    this.extent_ = extent;
  }

  /** 
   * @returns {Array<string|number>} Returns an array of arguments. 
   */
  Args() {
    return [
      '-define',
      `gradient:angle=${this.angle_}`,
      `gradient:bounding-box=${this.boundingBox_.String()}`,
      `gradient:direction=${this.direction_}`,
      `gradient:extent=${this.extent_}`,
      `gradient:'${this.startColor_}-${this.endColor_}'`
    ];
  }

  /**
   * Create a LinearGradient object with the specified properties.
   * @param {string} startColor Start color for linear gradient.
   * @param {string} endColor End color for linear gradient.
   * @param {Vector} vector Vector that defines where the gradient will move through.
   * @param {number} angle Specifies the direction of the gradient going from startColor to endColor in a clockwise positive manner relative to north (up).
   * @param {BoundingBox} boundingBox Limits the gradient to a larger or smaller region than the image dimensions. If the region defined by the bounding box is smaller than the image, then startColor will be the color of the background.
   * @param {string} direction Specifies the direction of the linear gradient towards the top/bottom/left/right or diagonal corners. Valid values are: NorthWest, North, Northeast, West, East, SouthWest, South, SouthEast.
   * @param {string} extent Specifies the shape of an image centered radial gradient. Valid values are: Circle, Diagonal, Ellipse, Maximum, Minimum.
   * @returns {LinearGradient} Returns a LinearGradient object. If inputs are invalid, it returns null.
   */
  static Create(startColor, endColor, vector, angle, boundingBox, direction, extent) {
    if (
      VALIDATE.IsStringInput(startColor) ||
      VALIDATE.IsStringInput(endColor) ||
      vector.constructor.name != 'Vector' ||
      VALIDATE.IsInteger(angle) ||
      boundingBox.constructor.name != 'BoundingBox' ||
      VALIDATE.IsStringInput(direction) ||
      VALIDATE.IsStringInput(extent)
    )
      return null;

    return new LinearGradient(startColor, endColor, vector, angle, boundingBox, direction, extent);
  }
}

/**
 * Render linear gradient to the specified destination.
 * @param {Canvas} canvas Canvas object
 * @param {LinearGradient} linearGradient LinearGradient object
 * @param {string} dest Destination
 * @returns {Promise} Returns a promise that resolves if successful, and fails otherwise.
 */
function DrawLinearGradient(canvas, linearGradient, dest) {
  if (canvas.constructor.name != 'Canvas')
    return Promise.reject(`Failed to draw linear gradient: canvas is invalid type.`);

  if (linearGradient.constructor.name != 'LinearGradient')
    return Promise.reject(`Failed to draw linear gradient: linear gradient is invalid type.`);

  let error = VALIDATE.IsStringInput(dest);
  if (error)
    return Promise.reject(`Failed to draw linear gradient: dest is ${error}`);

  return new Promise((resolve, reject) => {
    LOCAL_COMMAND.Execute('convert', canvas.Args().concat(linearGradient.Args()).concat(dest)).then(output => {
      if (output.stderr) {
        reject(`Failed to draw linear gradient: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to draw linear gradient: ${error}`);
  });
}

//------------------------------------
// RADIAL GRADIENT

class RadialGradient {
  /**
   * @param {string} startColor Start color of the gradient.
   * @param {string} endColor End color of the gradient.
   * @param {Coordinates} center Coordinates for the center of the radial gradient. 
   * @param {number} radialWidth Width of the radial gradient.
   * @param {number} radialHeight Height of the radial gradient.
   * @param {number} angle Specifies the direction of the gradient going from startColor to endColor in a clockwise positive manner relative to north (up).
   * @param {BoundingBox} boundingBox Limits the gradient to a lrager or smaller region than the image dimensions. If the region defined by the bounding box is smaller than the image, then startColor will be the color of the background.
   * @param {string} extent Specifies the shape of an image centered radial gradient. Valid values are: Circle, Diagonal, Ellipse, Maximum, Minimum.
   */
  constructor(startColor, endColor, center, radialWidth, radialHeight, angle, boundingBox, extent) {
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
   * @returns {Array<string|number>} 
   */
  Args() {
    return [
      '-define',
      `gradient:center=${this.center_.String()}`,
      `gradient:radii=${this.radialWidth_},${this.radialHeight_}`,
      `gradient:angle=${this.angle_}`,
      `gradient:bounding-box=${this.boundingBox_.String()}`,
      `gradient:extent=${this.extent_}`,
      `radial-gradient:'${this.startColor_}-${this.endColor_}'`
    ];
  }

  /**
   * Create a RadialGradient object with the specified properties.
   * @param {string} startColor Start color of the gradient.
   * @param {string} endColor End color of the gradient.
   * @param {Coordinates} center Coordinates for the center of the radial gradient. 
   * @param {number} radialWidth Width of the radial gradient.
   * @param {number} radialHeight Height of the radial gradient.
   * @param {number} angle Specifies the direction of the gradient going from startColor to endColor in a clockwise positive manner relative to north (up).
   * @param {BoundingBox} boundingBox Limits the gradient to a lrager or smaller region than the image dimensions. If the region defined by the bounding box is smaller than the image, then startColor will be the color of the background.
   * @param {string} extent Specifies the shape of an image centered radial gradient. Valid values are: Circle, Diagonal, Ellipse, Maximum, Minimum.
   * @returns {RadialGradient} Returns a RadialGradient object. If inputs are invalid, it returns null.
   */
  static Create(startColor, endColor, center, radialWidth, radialHeight, angle, boundingBox, extent) {
    if (
      VALIDATE.IsStringInput(startColor) ||
      VALIDATE.IsStringInput(endColor) ||
      center.constructor.name != 'Coordinates' ||
      VALIDATE.IsInteger(radialWidth) ||
      VALIDATE.IsIntegerInRange(radialWidth, DIMENSIONS_MIN, null) ||
      VALIDATE.IsInteger(radialHeight) ||
      VALIDATE.IsIntegerInRange(radialHeight, DIMENSIONS_MIN, null) ||
      VALIDATE.IsInteger(angle) ||
      boundingBox.constructor.name != 'BoundingBox' ||
      VALIDATE.IsStringInput(extent)
    )
      return null;

    return new RadialGradient(startColor, endColor, center, radialWidth, radialHeight, angle, boundingBox, extent);
  }
}

/**
 * Render linear gradient to the specified destination.
 * @param {Canvas} canvas Canvas object
 * @param {LinearGradient} linearGradient LinearGradient object
 * @param {string} dest Destination
 * @returns {Promise} Returns a promise that resolves if successful, and fails otherwise.
 */
function DrawRadialGradient(canvas, radialGradient, dest) {
  if (canvas.constructor.name != 'Canvas')
    return Promise.reject(`Failed to draw linear gradient: canvas is invalid type.`);

  if (radialGradient.constructor.name != 'RadialGradient')
    return Promise.reject(`Failed to draw linear gradient: radial gradient is invalid type.`);

  let error = VALIDATE.IsStringInput(dest);
  if (error)
    return Promise.reject(`Failed to draw linear gradient: dest is ${error}`);

  return new Promise((resolve, reject) => {
    LOCAL_COMMAND.Execute('convert', canvas.Args().concat(linearGradient.Args()).concat(dest)).then(output => {
      if (output.stderr) {
        reject(`Failed to draw linear gradient: ${output.stderr}`);
        return;
      }
      resolve();
    }).catch(error => `Failed to draw linear gradient: ${error}`);
  });
}

//-----------------------------------
// EXPORTS

exports.CreateVector = Vector.Create;
exports.CreateBoundingBox = BoundingBox.Create;
exports.CreateLinearGradient = LinearGradient.Create;
exports.CreateRadialGradient = RadialGradient.Create;