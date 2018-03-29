let VALIDATE = require('./validate.js');
let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;

//---------------------------------
// CONSTANTS

const DIMENSIONS_MIN = 1;
const WIDTH_MIN = 1;

//-------------------------------
// VECTOR

class Vector {
  /**
   * @param {Coordinates} start Starting point of vector.
   * @param {coordinates} end Ending point of vector.
   */
  constructor(start, end) {
    this.start_ = start;
    this.end_ = end;
  }

  /**
   * Create a Vector object witht he specified properties.
   * @param {Coordinates} start Start coordinates 
   * @param {Coordinates} end End coordinates
   * @returns {Promise<Vector>} Returns a promise. If it resolves, it return an object. Otherwise, it returns an error.
   */
  static Create(start, end) {
    if (start.constructor.name != 'Coordinates')
      return Promise.reject(`Failed to create vector: start is not valid type.`);

    if (end.constructor.name != 'Coordinates')
      return Promise.reject(`Failed to create vector: end is not valid type.`);

    Promise.resolve(new Vector(start, end));
  }
}

//----------------------------------
// BOUNDING BOX

class BoundingBox {
  /**
   * @param {number} width Width (in pixels)
   * @param {number} height Height (in pixels) 
   * @param {Coordinates} center Coordinates for the center of the bounding box.
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
   * @returns {Promise<BoundingBox>} Returns a Promise. If it resolves, it returns an object. Otherwise, it returns an error.
   */
  static Create(center, width, height) {
    if (center.constructor.name != 'Coordinates')
      return Promise.reject(`Failed to create bounding box: center is invalid type.`);

    let error = VALIDATE.IsNumber(width);
    if (error)
      return Promise.reject(`Failed to create bounding box: width is ${error}`);

    error = VALIDATE.IsIntegerInRange(width, DIMENSIONS_MIN, null);
    if (error)
      return Promise.reject(`Failed to create bounding box: width is ${error}`);

    error = VALIDATE.IsNumber(height);
    if (error)
      return Promise.reject(`Failed to create bounding box: height is ${error}`);

    error = VALIDATE.IsIntegerInRange(height, DIMENSIONS_MIN, null);
    if (error)
      return Promise.reject(`Failed to create bounding box: height is ${error}`);

    return Promise.resolve(new BoundingBox(center, width, height));
  }
}

//----------------------------------
// LINEAR GRADIENT

class LinearGradient {
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
      `gradient:extent=${this.extent_}`
        `gradient:'${this.startColor_}'-'${this.endColor_}'`
    ];
  }

  /**
   * Create a LinearGradient object with the specified properties.
   * @param {string} startColor Start color for linear gradient.
   * @param {string} endColor End color for linear gradient.
   * @param {Vector} vector Vector that defines where the gradient will move through.
   * @param {number} angle Specifies the direction of the gradient going from startColor to endColor in a clockwise positive manner relative to north (up).
   * @param {BoundingBox} boundingBox Limits the gradient to a lrager or smaller region than the image dimensions. If the region defined by the bounding box is smaller than the image, then startColor will be the color of the background.
   * @param {string} direction Specifies the direction of the linear gradient towards the top/bottom/left/right or diagonal corners. Valid values are: NorthWest, North, Northeast, West, East, SouthWest, South, SouthEast.
   * @param {string} extent Specifies the shape of an image centered radial gradient. Valid values are: Circle, Diagonal, Ellipse, Maximum, Minimum.
   * @returns {Promise<LinearGradient>} Returns a Promise. If it resolves, it returns an object. Otherwise, it returns an error.
   */
  Create(startColor, endColor, vector, angle, boundingBox, direction, extent) {
    let error = VALIDATE.IsStringInput(startColor);
    if (error)
      return Promise.reject(`Failed to create linear gradient: start color is ${error}`);

    error = VALIDATE.IsStringInput(endColor);
    if (error)
      return Promise.reject(`Failed to create linear gradient: end color is ${error}`);

    if (vector.constructor.name != 'Vector')
      return Promise.reject(`Failed to draw linear gradient: vector is invalid type.`);

    error = VALIDATE.IsInteger(angle);
    if (error)
      return Promise.reject(`Failed to create linear gradient: start color is ${error}`);

    if (boundingBox.constructor.name != 'BoundingBox')
      return Promise.reject(`Failed to draw linear gradient: bounding box is invalid type.`);

    error = VALIDATE.IsStringInput(direction);
    if (error)
      return Promise.reject(`Failed to create linear gradient: direction is ${error}`);

    error = VALIDATE.IsStringInput(extent);
    if (error)
      return Promise.reject(`Failed to create linear gradient: extent is ${error}`);

    return Promise.resolve(new LinearGradient(startColor, endColor, vector, angle, boundingBox, direction, extent));
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
      `radial-gradient:'${this.startColor_}'-'${this.endColor_}'`
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
   * @returns {Promise<RadialGradiant>} Returns a Promise. If it resolves, it returns an object. Otherwise, it returns an error.
   */
  Create(startColor, endColor, center, radialWidth, radialHeight, angle, boundingBox, extent) {
    let error = VALIDATE.IsStringInput(startColor);
    if (error)
      return Promise.reject(`Failed to create linear gradient: start color is ${error}`);

    error = VALIDATE.IsStringInput(endColor);
    if (error)
      return Promise.reject(`Failed to create linear gradient: end color is ${error}`);

    if (center.constructor.name != 'Coordinates')
      return Promise.reject(`Failed to draw linear gradient: center is invalid type.`);

    error = VALIDATE.IsInteger(radialWidth);
    if (error)
      return Promise.reject(`Failed to create linear gradient: radial width is ${error}`);

    error = VALIDATE.IsIntegerInRange(radialWidth, DIMENSIONS_MIN, null);
    if (error)
      return Promise.reject(`Failed to create linear gradient: radial width is ${error}`);

    error = VALIDATE.IsInteger(radialHeight);
    if (error)
      return Promise.reject(`Failed to create linear gradient: radial height is ${error}`);

    error = VALIDATE.IsIntegerInRange(radialHeight, DIMENSIONS_MIN, null);
    if (error)
      return Promise.reject(`Failed to create linear gradient: radial height is ${error}`);

    error = VALIDATE.IsInteger(angle);
    if (error)
      return Promise.reject(`Failed to create linear gradient: angle is ${error}`);

    if (boundingBox.constructor.name != 'BoundingBox')
      return Promise.reject(`Failed to draw linear gradient: bounding box is invalid type.`);

    error = VALIDATE.IsStringInput(extent);
    if (error)
      return Promise.reject(`Failed to create linear gradient: extent is ${error}`);

    return Promise.resolve(new RadialGradient(startColor, endColor, center, radialWidth, radialHeight, angle, boundingBox, extent));
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
exports.DrawLinearGradient = DrawLinearGradient;
exports.CreateRadialGradient = RadialGradient.Create;
exports.DrawRadialGradient = DrawRadialGradient;