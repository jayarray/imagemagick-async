let Path = require('path');
let Validate = require('./validate.js');
let Filepath = require('./filepath.js').Filepath;
let InputsBaseClass = require(Path.join(Filepath.InputsDir(), 'inputsbaseclass.js')).InputsBaseClass;

//------------------------------

class BoundingBox extends InputsBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.type = 'BoundingBox';
        this.name = 'BoundingBox'
        this.args = {};
      }

      /**
       * @param {Coordinates} center Coordinates for the center of the bounding box.
       */
      center(center) {
        this.args.center = center;
        return this;
      }

      /**
       * @param {number} width Width (in pixels)
       */
      width(width) {
        this.args.width = width;
        return this;
      }

      /**
       * @param {number} height Height (in pixels)
       */
      height(height) {
        this.args.height = height;
        return this;
      }

      build() {
        return new BoundingBox(this);
      }
    }
    return Builder;
  }

  /** 
   * @returns {string} Returns a string representation of the bounding box args.
   */
  String() {
    return `${this.args.width}x${this.args.height}+${this.args.center.args.x}+${this.args.center.args.y}`;
  }

  /**
   * @override
   */
  Errors() {
    let params = BoundingBox.Parameters();
    let errors = [];

    if (!Validate.IsDefined(this.args.center))
      errors.push('BOUNDING_BOX_ERROR: Center is undefined.');
    else {
      if (this.args.center.name != 'Coordinates')
        errors.push('BOUNDING_BOX_ERROR: Center is not a Coordinates object.');
      else {
        let errs = this.args.center.Errors();
        if (errs.length > 0)
          errors.push(`BOUNDING_BOX_ERROR: Center has erorrs: ${errs.join(' ')}`);
      }
    }

    if (!Validate.IsDefined(this.args.width))
      errors.push(`BOUNDING_BOX_ERROR: Width is undefined.`);
    else {
      if (!Validate.IsNumber(this.args.width))
        errors.push(`BOUNDING_BOX_ERROR: Width is not a number.`);
      else {
        if (!Validate.IsInteger(this.args.width))
          errors.push(`BOUNDING_BOX_ERROR: Width is not an integer.`);
        else {
          if (this.args.width < params.width.min)
            errors.push(`BOUNDING_BOX_ERROR: Width is out of bounds. Assigned value is ${this.args.width}. Must be greater than or equal to ${params.width.min}.`);
        }
      }
    }

    if (!Validate.IsDefined(this.args.height))
      errors.push(`BOUNDING_BOX_ERROR: Height is undefined.`);
    else {
      if (!Validate.IsNumber(this.args.height))
        errors.push(`BOUNDING_BOX_ERROR: Height is not a number.`);
      else {
        if (!Validate.IsInteger(this.args.height))
          errors.push(`BOUNDING_BOX_ERROR: Height is not an integer.`);
        else {
          if (this.args.width < params.height.min)
            errors.push(`BOUNDING_BOX_ERROR: Height is out of bounds. Assigned value is ${this.args.height}. Must be greater than or equal to ${params.height.min}.`);
        }
      }
    }

    return errors;
  }

  static Parameters() {
    return {
      center: {
        type: 'Coordinates'
      },
      width: {
        type: 'number',
        subtype: 'integer',
        min: 1
      },
      height: {
        type: 'number',
        subtype: 'integer',
        min: 1
      }
    };
  }
}

//--------------------------
// EXPORTS

exports.BoundingBox = BoundingBox;
