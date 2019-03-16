let Path = require('path');
let ProjectDir = Path.resolve('.');

let PathParts = ProjectDir.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let InputsBaseClass = require(Path.join(Filepath.InputsDir(), 'inputsbaseclass.js')).InputsBaseClass;

//-----------------------------

class Offset extends InputsBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.type = 'Offset';
        this.name = 'Offset';
        this.args = {};
      }

      /**
       * @param {number} n 
       */
      x(n) {
        this.args.x = n;
        return this;
      }

      /**
       * @param {number} n 
       */
      y(n) {
        this.args.y = n;
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
  Errors() {
    let errors = [];
    let prefix = 'OFFSET_INPUT_ERROR';

    let xIsDefined = Validate.IsDefined(this.args.x);
    let yIsDefined = Validate.IsDefined(this.args.y);

    if (!xIsDefined || !yIsDefined) {
      errors.push(`${prefix}: One or both x-y values are undefined. Both values must be defined.`);
    }
    else {
      let xErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('X')
        .condition(
          new Err.NumberCondition.Builder(this.args.x)
            .build()
        )
        .build()
        .String();

      if (xErr)
        errors.push(xErr);


      let yErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Y')
        .condition(
          new Err.NumberCondition.Builder(this.args.y)
            .build()
        )
        .build()
        .String();

      if (yErr)
        errors.push(yErr);
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
        subtype: 'integer',
        default: 0
      },
      y: {
        type: 'number',
        subtype: 'integer',
        default: 0
      }
    }
  }
}

//--------------------------------
// EXPORTS

exports.Offset = Offset;
