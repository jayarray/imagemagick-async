let Path_ = require('path');
let Validate = require('./validate.js');
let Filepath = require('./filepath.js').Filepath;
let PrimitivesBaseClass = require(Path_.join(Filepath.PrimitivesDir(), 'primitivesbaseclass.js')).PrimitivesBaseClass;

//-----------------------------------

class Point extends PrimitivesBaseClass {
  constructor(properties) {
    super(properties);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Point';
        this.args = {};
      }

      /**
       * @param {number} x X-coordinate
       */
      x(x) {
        this.args.x = x;
        return this;
      }

      /**
       * @param {number} y Y-coordinate
       */
      y(y) {
        this.args.y = y;
        return this;
      }

      /**
       * @param {Color} color Valid color format string used in Image Magick. (Optional)
       */
      color(color) {
        this.args.color = color;
        return this;
      }

      /**
       * @param {number} x 
       * @param {number} y 
       */
      offset(x, y) {
        this.offset = { x: x, y: y };
        return this;
      }

      build() {
        return new Point(this);
      }
    }
    return Builder;
  }

  /** 
   * @override
   */
  Args() {
    let args = [];

    if (this.args.color)
      args.push('-fill', this.args.color.Info().hex.string); // Default color is black

    args.push('-draw', `point ${this.args.x + this.offset.x},${this.args.y + this.offset.y}`);
    return args;
  }

  /**
   * @override
   */
  Errors() {
    let errors = [];

    // Check required args

    if (!Validate.IsDefined(this.args.x))
      errors.push('POINT_PRIMITIVE_ERROR: X is undefined.');
    else {
      if (!Validate.IsInteger(this.args.x))
        errors.push('POINT_PRIMITIVE_ERROR: X is not an integer.');
    }

    if (!Validate.IsDefined(this.args.y))
      errors.push('POINT_PRIMITIVE_ERROR: Y is undefined.');
    else {
      if (!Validate.IsInteger(this.args.y))
        errors.push('POINT_PRIMITIVE_ERROR: Y is not an integer.');
    }

    // Check optional args

    if (this.args.color) {
      if (this.args.color.type != 'Color')
        errors.push('POINT_PRIMITIVE_ERROR: Color is not a Color object.');
      else {
        let errs = this.args.color.Errors();
        if (errs.length > 0)
          errors.push(`POINT_PRIMITIVE_ERROR: Color has errors: ${errs.join(' ')}`);
      }
    }

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      x: {
        type: 'number',
        subtype: 'integer'
      },
      y: {
        type: 'number',
        subtype: 'integer'
      },
      color: {
        type: 'Color'
      }
    };
  }
}

//----------------------------
// EXPORTs

exports.Point = Point;