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
  .add('center', { type: 'Coordinates' })
  .add('radialWidth', { type: 'number', subtype: 'integer', min: 1 })
  .add('radialHeight', { type: 'number', subtype: 'integer', min: 1 })
  .add('angle', { type: 'number' })
  .add('boundinBox', { type: 'BoundingBox' })
  .add('extent', { type: 'string', options: ['Circle', 'Diagonal', 'Ellipse', 'Maximum', 'Minimum'] })
  .build();

//-----------------------------

class RadialGradient extends GRADIENT_BASECLASS {
  constructor(builder) {
    super(builder);
  }

  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'RadialGradient';
        this.args = {};
      }

      /**
       * @param {string} startColor Start color for radial gradient.
       */
      startColor(startColor) {
        this.args['startColor'] = startColor;
        return this;
      }

      /**
       * @param {string} endColor End color for radial gradient.
       */
      endColor(endColor) {
        this.args['endColor'] = endColor;
        return this;
      }

      /**
       * @param {Coordinates} center Coordinates for the center of the radial gradient. (Optional)
       */
      center(center) {
        this.center = center;
        return this;
      }

      /**
       * 
       * @param {number} radialWidth Width of the radial gradient. (Optional)
       */
      radialWidth(radialWidth) {
        this.radialWidth = radialWidth;
        return this;
      }

      /**
       * 
       * @param {number} radialHeight Height of the radial gradient. (Optional)
       */
      radialHeight(radialHeight) {
        this.radialHeight = radialHeight;
        return this;
      }

      /**
       * @param {number} angle Specifies the direction of the gradient going from startColor to endColor in a clockwise positive manner relative to north (up). (Optional)
       */
      angle(angle) {
        this.args['angle'] = angle;
        return this;
      }

      /**
       * @param {BoundingBox} boundingBox Limits the gradient to a larger or smaller region than the image dimensions. If the region defined by the bounding box is smaller than the image, then startColor will be the color of the background. (Optional)
       */
      boundingBox(boundingBox) {
        this.args['boundingBox'] = boundingBox;
        return this;
      }

      /**
       * @param {string} extent Specifies the shape of an image centered radial gradient. Valid values are: Circle, Diagonal, Ellipse, Maximum, Minimum. (Optional)
       */
      extent(extent) {
        this.args['extent'] = extent;
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

    if (this.args.center)
      args.push('-define', `gradient:center=${this.args.center.String()}`);

    if (this.args.radialWidth || this.args.radialHeight) {
      if (this.args.radialWidth && this.args.radialHeight)
        args.push('-define', `gradient:radii=${this.args.radialWidth}, ${this.args.radialHeight}`);
      else {
        if (this.args.radialWidth)
          args.push('-define', `gradient:radii=${this.args.radialWidth}, ${this.args.radialWidth}`);
        else
          args.push('-define', `gradient:radii=${this.args.radialHeight}, ${this.args.radialHeight}`);
      }
    }

    if (this.args.angle)
      args.push('-define', `gradient:angle=${this.args.angle}`);

    if (this.args.boundingBox)
      args.push('-define', `gradient:bounding-box=${this.args.boundingBox.String()}`);

    if (this.args.extent)
      args.push('-define', `gradient:extent=${this.args.extent}`);

    args.push(`radial-gradient:${this.args.startColor}-${this.args.endColor}`);

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
      errors.push(`RADIAL_GRADIENT_ERROR: Start color is undefined.`);
    else {
      if (!CHECKS.IsString(this.args.startColor))
        errors.push(`RADIAL_GRADIENT_ERROR: Start color is not a string.`);
      else {
        if (CHECKS.IsEmptyString(this.args.startColor))
          errors.push(`RADIAL_GRADIENT_ERROR: Start color is empty string.`);
        else if (CHECKS.IsWhitespace(this.args.startColor))
          errors.push(`RADIAL_GRADIENT_ERROR: Start color is whitespace.`);
      }
    }

    if (!CHECKS.IsDefined(this.args.endColor))
      errors.push(`RADIAL_GRADIENT_ERROR: End color is undefined.`);
    else {
      if (!CHECKS.IsString(this.args.endColor))
        errors.push(`RADIAL_GRADIENT_ERROR: End color is not a string.`);
      else {
        if (CHECKS.IsEmptyString(this.args.endColor))
          errors.push(`RADIAL_GRADIENT_ERROR: End color is empty string.`);
        else if (CHECKS.IsWhitespace(this.args.endColor))
          errors.push(`RADIAL_GRADIENT_ERROR: End color is whitespace.`);
      }
    }

    // Check optional args

    if (this.args.center) {
      if (!CHECKS.IsDefined(this.args.center))
        errors.push(`RADIAL_GRADIENT_ERROR: Center is undefined.`);
      else {
        if (this.args.center.name != 'Coordinates')
          errors.push(`RADIAL_GRADIENT_ERROR: Center is not a Coordinates object.`);
        else {
          let errs = this.args.center.Errors();
          if (errs.length > 0)
            errors.push(`RADIAL_GRADIENT_ERROR: Center has errors: ${errs.join(' ')}`);
        }
      }
    }

    if (this.args.radialWidth) {
      if (!CHECKS.IsDefined(this.args.radialWidth))
        errors.push(`RADIAL_GRADIENT_ERROR: Radial width is undefined.`);
      else {
        if (!CHECKS.IsNumber(this.args.radialWidth))
          errors.push(`RADIAL_GRADIENT_ERROR: Radial width is not a number.`);
        else {
          if (!CHECKS.IsInteger(this.args.radialWidth))
            errors.push(`RADIAL_GRADIENT_ERROR: Radial width is not an integer.`);
          else {
            if (this.args.radialWidth < ARG_INFO.radialWidth.min)
              errors.push(`RADIAL_GRADIENT_ERROR: Radial width is out of bounds. Assigned value is : ${this.args.radialWidth}. Value must be greater than or equal to ${ARG_INFO.radialWidth.min}.`);
          }
        }
      }
    }

    if (this.args.radialHeight) {
      if (!CHECKS.IsDefined(this.args.radialHeight))
        errors.push(`RADIAL_GRADIENT_ERROR: Radial height is undefined.`);
      else {
        if (!CHECKS.IsNumber(this.args.radialHeight))
          errors.push(`RADIAL_GRADIENT_ERROR: Radial height is not a number.`);
        else {
          if (!CHECKS.IsInteger(this.args.radialHeight))
            errors.push(`RADIAL_GRADIENT_ERROR: Radial height is not an integer.`);
          else {
            if (this.args.radialHeight < ARG_INFO.radialHeight.min)
              errors.push(`RADIAL_GRADIENT_ERROR: Radial height is out of bounds. Assigned value is : ${this.args.radialHeight}. Value must be greater than or equal to ${ARG_INFO.radialHeight.min}.`);
          }
        }
      }
    }

    if (!CHECKS.IsDefined(this.args.angle))
      errors.push(`RADIAL_GRADIENT_ERROR: Angle is undefined.`);
    else {
      if (!CHECKS.IsNumber(this.args.angle))
        errors.push(`RADIAL_GRADIENT_ERROR: Angle is not a number.`);
    }

    if (!CHECKS.IsDefined(this.args.boundingBox))
      errors.push(`RADIAL_GRADIENT_ERROR: Bounding box is undefined.`);
    else {
      if (this.args.boundingBox.name != 'BoundinBox')
        erorrs.push(`RADIAL_GRADIENT_ERROR: Bounding box is not a BoundingBox object.`);
      else {
        let errs = this.args.boundingBox.Errors();
        if (errs.length > 0)
          errors.push(`RADIAL_GRADIENT_ERROR: Bounding box has errors: ${errs.join(' ')}`);
      }
    }

    if (!CHECKS.IsDefined(this.args.extent))
      errors.push(`RADIAL_GRADIENT_ERROR: Extent is undefind.`);
    else {
      if (!CHECKS.IsString(this.args.extent))
        errors.push(`RADIAL_GRADIENT_ERROR: Extent is not a string.`);
      else {
        if (CHECKS.IsEmptyString(this.args.extent))
          errors.push(`RADIAL_GRADIENT_ERROR: Extent is empty string.`);
        else if (CHECKS, IsWhitespace(this.args.extent))
          erorrs.push(`RADIAL_GRADIENT_ERROR: Extent is whitespace.`);
        else {
          if (!ARG_INFO.extent.options.includes(this.args.extent))
            erorrs.push(`RADIAL_GRADIENT_ERROR: Extent is invalid. Assigned value is: ${this.args.extent}. Must be assigned one of the following values: ${ARG_INFO.extent.options.join(', ')}`);
        }
      }
    }

    return errors;
  }
}

//-----------------------------
// EXPORTs

exports.ARG_INFO = ARG_INFO;
exports.Builder = RadialGradient.Builder;