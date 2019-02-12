let Path = require('path');
let Validate = require('./validate.js');
let Filepath = require('./filepath.js').Filepath;
let GradientBaseClass = require(Path.join(Filepath.GradientDir(), 'gradientbaseclass.js')).GradientBaseClass;

//-----------------------------

class RadialGradient extends GradientBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
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
        this.args.startColor = startColor;
        return this;
      }

      /**
       * @param {string} endColor End color for radial gradient.
       */
      endColor(endColor) {
        this.args.endColor = endColor;
        return this;
      }

      /**
       * @param {Coordinates} center Coordinates for the center of the radial gradient. (Optional)
       */
      center(center) {
        this.args.center = center;
        return this;
      }

      /**
       * 
       * @param {number} radialWidth Width of the radial gradient. (Optional)
       */
      radialWidth(radialWidth) {
        this.args.radialWidth = radialWidth;
        return this;
      }

      /**
       * 
       * @param {number} radialHeight Height of the radial gradient. (Optional)
       */
      radialHeight(radialHeight) {
        this.args.radialHeight = radialHeight;
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
       * @param {string} extent Specifies the shape of an image centered radial gradient. Valid values are: Circle, Diagonal, Ellipse, Maximum, Minimum. (Optional)
       */
      extent(extent) {
        this.args.extent = extent;
        return this;
      }

      build() {
        return new RadialGradient(this);
      }
    }
    return Builder;
  }

  /** 
   * @override
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
   * @override
   */
  Errors() {
    let params = RadialGradient.Parameters();
    let errors = [];

    // Check required args

    if (!Validate.IsDefined(this.args.startColor))
      errors.push(`RADIAL_GRADIENT_ERROR: Start color is undefined.`);
    else {
      if (!Validate.IsString(this.args.startColor))
        errors.push(`RADIAL_GRADIENT_ERROR: Start color is not a string.`);
      else {
        if (Validate.IsEmptyString(this.args.startColor))
          errors.push(`RADIAL_GRADIENT_ERROR: Start color is empty string.`);
        else if (Validate.IsWhitespace(this.args.startColor))
          errors.push(`RADIAL_GRADIENT_ERROR: Start color is whitespace.`);
      }
    }

    if (!Validate.IsDefined(this.args.endColor))
      errors.push(`RADIAL_GRADIENT_ERROR: End color is undefined.`);
    else {
      if (!Validate.IsString(this.args.endColor))
        errors.push(`RADIAL_GRADIENT_ERROR: End color is not a string.`);
      else {
        if (Validate.IsEmptyString(this.args.endColor))
          errors.push(`RADIAL_GRADIENT_ERROR: End color is empty string.`);
        else if (Validate.IsWhitespace(this.args.endColor))
          errors.push(`RADIAL_GRADIENT_ERROR: End color is whitespace.`);
      }
    }

    // Check optional args

    if (this.args.center) {
      if (!Validate.IsDefined(this.args.center))
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
      if (!Validate.IsDefined(this.args.radialWidth))
        errors.push(`RADIAL_GRADIENT_ERROR: Radial width is undefined.`);
      else {
        if (!Validate.IsNumber(this.args.radialWidth))
          errors.push(`RADIAL_GRADIENT_ERROR: Radial width is not a number.`);
        else {
          if (!Validate.IsInteger(this.args.radialWidth))
            errors.push(`RADIAL_GRADIENT_ERROR: Radial width is not an integer.`);
          else {
            if (this.args.radialWidth < params.radialWidth.min)
              errors.push(`RADIAL_GRADIENT_ERROR: Radial width is out of bounds. Assigned value is : ${this.args.radialWidth}. Value must be greater than or equal to ${params.radialWidth.min}.`);
          }
        }
      }
    }

    if (this.args.radialHeight) {
      if (!Validate.IsDefined(this.args.radialHeight))
        errors.push(`RADIAL_GRADIENT_ERROR: Radial height is undefined.`);
      else {
        if (!Validate.IsNumber(this.args.radialHeight))
          errors.push(`RADIAL_GRADIENT_ERROR: Radial height is not a number.`);
        else {
          if (!Validate.IsInteger(this.args.radialHeight))
            errors.push(`RADIAL_GRADIENT_ERROR: Radial height is not an integer.`);
          else {
            if (this.args.radialHeight < params.radialHeight.min)
              errors.push(`RADIAL_GRADIENT_ERROR: Radial height is out of bounds. Assigned value is : ${this.args.radialHeight}. Value must be greater than or equal to ${params.radialHeight.min}.`);
          }
        }
      }
    }

    if (this.args.angle) {
      if (!Validate.IsDefined(this.args.angle))
        errors.push(`RADIAL_GRADIENT_ERROR: Angle is undefined.`);
      else {
        if (!Validate.IsNumber(this.args.angle))
          errors.push(`RADIAL_GRADIENT_ERROR: Angle is not a number.`);
      }
    }

    if (this.args.boundinBox) {
      if (!Validate.IsDefined(this.args.boundingBox))
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
    }

    if (this.args.extent) {
      if (!Validate.IsDefined(this.args.extent))
        errors.push(`RADIAL_GRADIENT_ERROR: Extent is undefind.`);
      else {
        if (!Validate.IsString(this.args.extent))
          errors.push(`RADIAL_GRADIENT_ERROR: Extent is not a string.`);
        else {
          if (Validate.IsEmptyString(this.args.extent))
            errors.push(`RADIAL_GRADIENT_ERROR: Extent is empty string.`);
          else if (Validate, IsWhitespace(this.args.extent))
            erorrs.push(`RADIAL_GRADIENT_ERROR: Extent is whitespace.`);
          else {
            if (!params.extent.options.includes(this.args.extent))
              erorrs.push(`RADIAL_GRADIENT_ERROR: Extent is invalid. Assigned value is: ${this.args.extent}. Must be assigned one of the following values: ${params.extent.options.join(', ')}`);
          }
        }
      }
    }

    return errors;
  }

  static Parameters() {
    return {
      startColor: {
        type: 'Color'
      },
      endColor: {
        type: 'Color'
      },
      center: {
        type: 'Coordinates'
      },
      radialWidth: {
        type: 'number',
        subtype: 'integer',
        min: 1
      },
      radialHeight: {
        type: 'number',
        subtype: 'integer',
        min: 1
      },
      angle: {
        type: 'number'
      },
      boundinBox: {
        type: 'BoundingBox'
      },
      extent: {
        type: 'string',
        options: [
          'Circle',
          'Diagonal',
          'Ellipse',
          'Maximum',
          'Minimum'
        ]
      }
    };
  }
}

//-----------------------------
// EXPORTS

exports.RadialGradient = RadialGradient;