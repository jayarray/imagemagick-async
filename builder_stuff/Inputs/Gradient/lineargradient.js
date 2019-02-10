let PATH = require('path');

let parts = __dirname.split(PATH.sep);
let index = parts.findIndex(x => x == 'builder_stuff');
let IM_MODULES_DIR = parts.slice(0, index + 1).join(PATH.sep);
let GRADIENT_BASECLASS = require(PATH.join(__dirname, 'gradientbaseclass.js')).GradientBaseClass;
let CHECKS = require(PATH.join(IM_MODULES_DIR, 'Checks', 'check.js'));
let ARG_DICT_BUILDER = require(PATH.join(IM_MODULES_DIR, 'Arguments', 'argdictionary.js')).Builder;

//----------------------------------

const ARG_INFO = ARG_DICT_BUILDER()
  .add('startColor', { type: 'string' })
  .add('endColor', { type: 'string' })
  .add('vector', { type: 'Vector' })
  .add('boundinBox', { type: 'BoundingBox' })
  .add('direction', { type: 'string', options: ['NorthWest', 'North', 'Northeast', 'West', 'East', 'SouthWest', 'South', 'SouthEast'] })
  .add('extent', { type: 'string', options: ['Circle', 'Diagonal', 'Ellipse', 'Maximum', 'Minimum'] })
  .build();

//-----------------------------

class LinearGradient extends GRADIENT_BASECLASS {
  constructor(builder) {
    super(builder);
  }

  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'LinearGradient';
        this.args = {};
      }

      /**
       * @param {string} startColor Start color for linear gradient.
       */
      startColor(startColor) {
        this.args.startColor = startColor;
        return this;
      }

      /**
       * @param {string} endColor End color for linear gradient.
       */
      endColor(endColor) {
        this.args.endColor = endColor;
        return this;
      }

      /**
       * @param {Vector} vector Vector that defines where the gradient will move through. (Optional)
       */
      vector(vector) {
        this.args.vector = vector;
        return this;
      }

      /**
       * @param {number} angle Specifies the direction of the gradient going from startColor to endColor in a clockwise positive manner relative to north (up). (Optional)
       */
      angle(angle) {
        this.args.angle = angle;
        return this;
      }

      /**
       * @param {BoundingBox} boundingBox Limits the gradient to a larger or smaller region than the image dimensions. If the region defined by the bounding box is smaller than the image, then startColor will be the color of the background. (Optional)
       */
      boundingBox(boundingBox) {
        this.args.boundingBox = boundingBox;
        return this;
      }

      /**
       * @param {string} direction Specifies the direction of the linear gradient towards the top/bottom/left/right or diagonal corners. Valid values are: NorthWest, North, Northeast, West, East, SouthWest, South, SouthEast. (Optional)
       */
      direction(direction) {
        this.args.direction = direction;
        return this;
      }

      /**
       * @param {string} extent Specifies the shape of an image centered radial gradient. Valid values are: Circle, Diagonal, Ellipse, Maximum, Minimum. (Optional)
       */
      extent(extent) {
        this.args.extent = extent;
        return this;
      }

      build() {
        return new LinearGradient(this);
      }
    }
    return Builder;
  }

  /** 
   * @override
   * @returns {Array} Returns a list of arguments needed for rendering.
   */
  Args() {
    let args = [];

    if (this.args.vector)
      args.push('-define', `gradient:vector=${this.args.vector.String()}`);

    if (this.args.angle)
      args.push('-define', `gradient:angle=${this.args.angle}`);

    if (this.args.boundingBox)
      args.push('-define', `gradient:bounding-box=${this.args.boundingBox.String()}`);

    if (this.args.direction)
      args.push('-define', `gradient:direction=${this.args.direction}`);

    if (this.args.extent)
      args.push('-define', `gradient:extent=${this.args.extent}`);

    args.push(`gradient:${this.args.startColor}-${this.args.endColor}`);

    return args;
  }

  /**
   * Check for any input errors.
   * @returns {Array<string>} Returns an array of error messages. If array is empty, there were no errors.
   */
  Errors() {
    let errors = [];

    // Check required args

    if (!CHECKS.IsDefined(this.args.startColor))
      errors.push(`LINEAR_GRADIENT_ERROR: Start color is undefined.`);
    else {
      if (!CHECKS.IsString(this.args.startColor))
        errors.push(`LINEAR_GRADIENT_ERROR: Start color is not a string.`);
      else {
        if (CHECKS.IsEmptyString(this.args.startColor))
          errors.push(`LINEAR_GRADIENT_ERROR: Start color is empty string.`);
        else if (CHECKS.IsWhitespace(this.args.startColor))
          errors.push(`LINEAR_GRADIENT_ERROR: Start color is whitespace.`);
      }
    }

    if (!CHECKS.IsDefined(this.args.endColor))
      errors.push(`LINEAR_GRADIENT_ERROR: End color is undefined.`);
    else {
      if (!CHECKS.IsString(this.args.endColor))
        errors.push(`LINEAR_GRADIENT_ERROR: End color is not a string.`);
      else {
        if (CHECKS.IsEmptyString(this.args.endColor))
          errors.push(`LINEAR_GRADIENT_ERROR: End color is empty string.`);
        else if (CHECKS.IsWhitespace(this.args.endColor))
          errors.push(`LINEAR_GRADIENT_ERROR: End color is whitespace.`);
      }
    }

    // Check optional args

    if (this.args.vector) {
      if (!CHECKS.IsDefined(this.args.vector))
        errors.push(`LINEAR_GRADIENT_ERROR: Vector is undefined.`);
      else {
        if (this.args.vector.name != 'vector')
          errors.push(`LINEAR_GRADIENT_ERROR: Vector is not a vector object.`);
        else {
          let errs = this.args.vector.Erorrs();
          if (errs.length > 0)
            errors.push(`LINEAR_GRADIENT_ERROR: Vector has errors: ${err.sjoin(' ')}`);
        }
      }
    }

    if (this.args.angle) {
      if (!CHECKS.IsDefined(this.args.angle))
        errors.push(`LINEAR_GRADIENT_ERROR: Angle is undefined.`);
      else {
        if (!CHECKS.IsNumber(this.args.angle))
          errors.push(`LINEAR_GRADIENT_ERROR: Angle is not a number.`);
      }
    }

    if (this.args.boundingBox) {
      if (!CHECKS.IsDefined(this.args.boundingBox))
        errors.push(`LINEAR_GRADIENT_ERROR: Bounding box is undefined.`);
      else {
        if (this.args.boundingBox.name != 'BoundinBox')
          erorrs.push(`LINEAR_GRADIENT_ERROR: Bounding box is not a BoundingBox object.`);
        else {
          let errs = this.args.boundingBox.Errors();
          if (errs.length > 0)
            errors.push(`LINEAR_GRADIENT_ERROR: Bounding box has errors: ${errs.join(' ')}`);
        }
      }
    }

    if (this.args.direction) {
      if (!CHECKS.IsDefined(this.args.direction))
        errors.push(`LINEAR_GRADIENT_ERROR: Direction is undefind.`);
      else {
        if (!CHECKS.IsString(this.args.direction))
          errors.push(`LINEAR_GRADIENT_ERROR: Direction is not a string.`);
        else {
          if (CHECKS.IsEmptyString(this.args.direction))
            errors.push(`LINEAR_GRADIENT_ERROR: Direction is empty string.`);
          else if (CHECKS, IsWhitespace(this.args.direction))
            erorrs.push(`LINEAR_GRADIENT_ERROR: Direction is whitespace.`);
          else {
            if (!ARG_INFO.direction.options.includes(this.args.direction))
              erorrs.push(`LINEAR_GRADIENT_ERROR: Direction is invalid. Assigned value is: ${this.args.direction}. Must be assigned one of the following values: ${ARG_INFO.direction.options.join(', ')}`);
          }
        }
      }
    }

    if (this.args.extent) {
      if (!CHECKS.IsDefined(this.args.extent))
        errors.push(`LINEAR_GRADIENT_ERROR: Extent is undefind.`);
      else {
        if (!CHECKS.IsString(this.args.extent))
          errors.push(`LINEAR_GRADIENT_ERROR: Extent is not a string.`);
        else {
          if (CHECKS.IsEmptyString(this.args.extent))
            errors.push(`LINEAR_GRADIENT_ERROR: Extent is empty string.`);
          else if (CHECKS, IsWhitespace(this.args.extent))
            erorrs.push(`LINEAR_GRADIENT_ERROR: Extent is whitespace.`);
          else {
            if (!ARG_INFO.extent.options.includes(this.args.extent))
              erorrs.push(`LINEAR_GRADIENT_ERROR: Extent is invalid. Assigned value is: ${this.args.extent}. Must be assigned one of the following values: ${ARG_INFO.extent.options.join(', ')}`);
          }
        }
      }
    }

    return errors;
  }
}

//-------------------------------
// EXPORTs

exports.ARG_INFO = ARG_INFO;
exports.Builder = LinearGradient.Builder;