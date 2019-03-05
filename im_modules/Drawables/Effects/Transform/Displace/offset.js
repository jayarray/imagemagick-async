let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let DisplaceBaseClass = require(Path.join(Filepath.TransformDisplaceDir(), 'displacebaseclass.js')).DisplaceBaseClass;

//-----------------------------------

class Offset extends DisplaceBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Offset';
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
       * @param {Coordinates} coordinates 
       */
      start(coordinates) {
        this.args.start = coordinates;
        return this;
      }

      /**
       * @param {Coordinates} coordinates 
       */
      end(coordinates) {
        this.args.end = coordinates;
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
        return new Offset(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    return ['-virtual-pixel', 'transparent', '-distort', 'Affine', `${this.args.start.String()} ${this.args.end.String()}`];
  }

  /**
   * @override
   */
  Errors() {
    let params = Offset.Parameters();
    let errors = [];
    let prefix = 'OFFSET_TRANSFORM_MOD_ERROR';

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
      start: {
        type: 'Coordinates'
      },
      end: {
        type: 'Coordinates'
      }
    };
  }
}

//----------------------------
// EXDPORTS

exports.Offset = Offset;