let PATH = require('path');
let GradientBaseClass = require(PATH.join(__dirname, 'gradientbaseclass.js')).GradientBaseClass;
let Validate = require('./validate.js');

//-----------------------------

class LinearGradient extends GradientBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
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
   * @override
   */
  Errors() {
    let params = LinearGradient.Parameters();
    let errors = [];

    // Check required args

    if (!Validate.IsDefined(this.args.startColor))
      errors.push(`LINEAR_GRADIENT_ERROR: Start color is undefined.`);
    else {
      if (!Validate.IsString(this.args.startColor))
        errors.push(`LINEAR_GRADIENT_ERROR: Start color is not a string.`);
      else {
        if (Validate.IsEmptyString(this.args.startColor))
          errors.push(`LINEAR_GRADIENT_ERROR: Start color is empty string.`);
        else if (Validate.IsWhitespace(this.args.startColor))
          errors.push(`LINEAR_GRADIENT_ERROR: Start color is whitespace.`);
      }
    }

    if (!Validate.IsDefined(this.args.endColor))
      errors.push(`LINEAR_GRADIENT_ERROR: End color is undefined.`);
    else {
      if (!Validate.IsString(this.args.endColor))
        errors.push(`LINEAR_GRADIENT_ERROR: End color is not a string.`);
      else {
        if (Validate.IsEmptyString(this.args.endColor))
          errors.push(`LINEAR_GRADIENT_ERROR: End color is empty string.`);
        else if (Validate.IsWhitespace(this.args.endColor))
          errors.push(`LINEAR_GRADIENT_ERROR: End color is whitespace.`);
      }
    }

    // Check optional args

    if (this.args.vector) {
      if (!Validate.IsDefined(this.args.vector))
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
      if (!Validate.IsDefined(this.args.angle))
        errors.push(`LINEAR_GRADIENT_ERROR: Angle is undefined.`);
      else {
        if (!Validate.IsNumber(this.args.angle))
          errors.push(`LINEAR_GRADIENT_ERROR: Angle is not a number.`);
      }
    }

    if (this.args.boundingBox) {
      if (!Validate.IsDefined(this.args.boundingBox))
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
      if (!Validate.IsDefined(this.args.direction))
        errors.push(`LINEAR_GRADIENT_ERROR: Direction is undefind.`);
      else {
        if (!Validate.IsString(this.args.direction))
          errors.push(`LINEAR_GRADIENT_ERROR: Direction is not a string.`);
        else {
          if (Validate.IsEmptyString(this.args.direction))
            errors.push(`LINEAR_GRADIENT_ERROR: Direction is empty string.`);
          else if (Validate, IsWhitespace(this.args.direction))
            erorrs.push(`LINEAR_GRADIENT_ERROR: Direction is whitespace.`);
          else {
            if (!params.direction.options.includes(this.args.direction))
              erorrs.push(`LINEAR_GRADIENT_ERROR: Direction is invalid. Assigned value is: ${this.args.direction}. Must be assigned one of the following values: ${params.direction.options.join(', ')}`);
          }
        }
      }
    }

    if (this.args.extent) {
      if (!Validate.IsDefined(this.args.extent))
        errors.push(`LINEAR_GRADIENT_ERROR: Extent is undefind.`);
      else {
        if (!Validate.IsString(this.args.extent))
          errors.push(`LINEAR_GRADIENT_ERROR: Extent is not a string.`);
        else {
          if (Validate.IsEmptyString(this.args.extent))
            errors.push(`LINEAR_GRADIENT_ERROR: Extent is empty string.`);
          else if (Validate, IsWhitespace(this.args.extent))
            erorrs.push(`LINEAR_GRADIENT_ERROR: Extent is whitespace.`);
          else {
            if (!params.extent.options.includes(this.args.extent))
              erorrs.push(`LINEAR_GRADIENT_ERROR: Extent is invalid. Assigned value is: ${this.args.extent}. Must be assigned one of the following values: ${params.extent.options.join(', ')}`);
          }
        }
      }
    }

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      startColor: {
        type: 'Color'
      },
      endColor: {
        type: 'Color'
      },
      vector: {
        type: 'Vector'
      },
      boundingBox: {
        type: 'BoundingBox'
      },
      direction: {
        type: 'string',
        options: [
          'NorthWest',
          'North',
          'Northeast',
          'West',
          'East',
          'SouthWest',
          'South',
          'SouthEast'
        ]
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

//-------------------------------
// EXPORTs

exports.LinearGradient = LinearGradient;