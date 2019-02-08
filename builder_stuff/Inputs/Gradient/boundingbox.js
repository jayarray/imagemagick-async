let PATH = require('path');

let parts = __dirname.split(PATH.sep);
let index = parts.findIndex(x => x == 'builder_stuff');
let IM_MODULES_DIR = parts.slice(0, index + 1).join(PATH.sep);
let CHECKS = require(PATH.join(IM_MODULES_DIR, 'Checks', 'check.js'));
let ARG_DICT_BUILDER = require(PATH.join(IM_MODULES_DIR, 'Arguments', 'argdictionary.js')).Builder;

//-----------------------------

const ARG_INFO = ARG_DICT_BUILDER()
  .add('center', { type: 'Coordinates' })
  .add('width', { type: 'number', subtype: 'integer', min: 1 })
  .add('height', { type: 'number', subtype: 'integer', min: 1 })
  .build();

//------------------------------

class BoundingBox {
  constructor(builder) {
    this.name = builder.name;
    this.args = builder.args;
  }

  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'BoundingBox';
        this.args = {};
      }

      /**
       * @param {Coordinates} center Coordinates for the center of the bounding box.
       */
      center(center) {
        this.args['center'] = center;
        return this;
      }

      /**
       * @param {number} width Width (in pixels)
       */
      width(width) {
        this.args['width'] = width;
        return this;
      }

      /**
       * @param {number} height Height (in pixels)
       */
      height(height) {
        this.args['height'] = height;
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
   * Check for any input errors.
   * @returns {Array<string>} Returns an array of error messages. If array is empty, there were no errors.
   */
  Errors() {
    let errors = [];

    if (!CHECKS.IsDefined(this.args.center))
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

    if (!CHECKS.IsDefined(this.args.width))
      errors.push(`BOUNDING_BOX_ERROR: Width is undefined.`);
    else {
      if (!CHECKS.IsNumber(this.args.width))
        errors.push(`BOUNDING_BOX_ERROR: Width is not a number.`);
      else {
        if (!CHECKS.IsInteger(this.args.width))
          errors.push(`BOUNDING_BOX_ERROR: Width is not an integer.`);
        else {
          if (this.args.width < ARG_INFO.width.min)
            errors.push(`BOUNDING_BOX_ERROR: Width is out of bounds. Assigned value is ${this.args.width}. Must be greater than or equal to ${ARG_INFO.width.min}.`);
        }
      }
    }

    if (!CHECKS.IsDefined(this.args.height))
      errors.push(`BOUNDING_BOX_ERROR: Height is undefined.`);
    else {
      if (!CHECKS.IsNumber(this.args.height))
        errors.push(`BOUNDING_BOX_ERROR: Height is not a number.`);
      else {
        if (!CHECKS.IsInteger(this.args.height))
          errors.push(`BOUNDING_BOX_ERROR: Height is not an integer.`);
        else {
          if (this.args.width < ARG_INFO.height.min)
            errors.push(`BOUNDING_BOX_ERROR: Height is out of bounds. Assigned value is ${this.args.height}. Must be greater than or equal to ${ARG_INFO.height.min}.`);
        }
      }
    }

    return errors;
  }
}

//--------------------------
// EXPORTS

exports.ARG_INFO = ARG_INFO;
exports.Create = BoundingBox.Create;
