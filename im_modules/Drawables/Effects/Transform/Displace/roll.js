let Path = require('path');
let RootDir = Path.resolve('.');
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
        this.offset = null;
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

      /**
       * @param {number} x 
       * @param {number} y 
       */
      offset(x, y) {
        this.offset = { x: x, y: y };
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
    let prefix = 'ROLL_TRANSFORM_MOD_ERROR';

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

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      source: {
        type: 'string'
      },
      horizontal: {
        type: 'number',
        subtype: 'integer'
      },
      vertical: {
        type: 'number',
        subtype: 'integer'
      }
    };
  }
}

//------------------------------
// EXPORTS

exports.Roll = Roll;