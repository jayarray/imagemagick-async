let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let DisplaceBaseClass = require(Path.join(Filepath.TransformDisplaceDir(), 'displacebaseclass.js')).DisplaceBaseClass;

//-----------------------------------

class Roll extends DisplaceBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Roll';
        this.args = {};

        this.args.horizontal = 0;
        this.args.vertical = 0;
      }

      /**
       * @param {string} str
       */
      source(str) {
        this.args.source = str;
        return this;
      }

      /**
       * @param {number} n Number of pixels to roll in this direction.
       */
      horizontal(n) {
        this.args.horizontal = n;
        return this;
      }

      /**
       * @param {number} n Number of pixels to roll in this direction.
       */
      vertical(n) {
        this.args.vertical = n;
        return this;
      }

      build() {
        return new Roll(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    let args = ['-roll'];

    let rollStr = '';

    if (this.args.horizontal >= 0)
      rollStr += `+${this.args.horizontal}`;
    else
      rollStr += this.args.horizontal;

    if (this.args.vertical > 0)
      rollStr += `-${this.args.vertical}`;
    else
      rollStr += `+${Math.abs(this.args.vertical)}`;

    args.push(rollStr);

    return args;
  }

  /**
   * @override
   */
  Errors() {
    let params = Roll.Parameters();
    let errors = [];
    let prefix = 'ROLL_DISPLACE_TRANSFORM_ERROR';

    let sourceErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Source')
      .condition(
        new Err.StringCondition.Builder(this.args.source)
          .isempty(false)
          .isWhitespace(false)
          .build()
      )
      .build()
      .String();

    if (sourceErr)
      errors.push(sourceErr);

    if (Validate.IsDefined(this.args.horizontal)) {
      let horizontalErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Horizontal')
        .condition(
          new Err.NumberCondition.Builder(this.args.horizontal)
            .isInteger(true)
            .build()
        )
        .build()
        .String();

      if (horizontalErr)
        errors.push(horizontalErr);
    }

    if (Validate.IsDefined(this.args.vertical)) {
      let verticalErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Vertical')
        .condition(
          new Err.NumberCondition.Builder(this.args.vertical)
            .isInteger(true)
            .build()
        )
        .build()
        .String();

      if (verticalErr)
        errors.push(verticalErr);
    }

    return errors;
  }

  /**
   * @override
   */
  IsConsolidatable() {
    return true;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      source: {
        type: 'string',
        required: true
      },
      horizontal: {
        type: 'number',
        subtype: 'integer',
        required: false
      },
      vertical: {
        type: 'number',
        subtype: 'integer',
        required: false
      }
    };
  }
}

//------------------------------
// EXPORTS

exports.Roll = Roll;