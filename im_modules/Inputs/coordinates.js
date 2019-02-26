let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let InputsBaseClass = require(Path.join(Filepath.InputsDir(), 'inputsbaseclass.js')).InputsBaseClass;

//-----------------------------

class Coordinates extends InputsBaseClass {
  constructor(properties) {
    super(properties);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.type = 'Coordinates';
        this.name = 'Coordinates';
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
        return new Coordinates(this);
      }
    }
    return new Builder();
  }

  /** 
   * @returns {string} Returns a string representation of the coordinates as 'x,y'. 
   */
  String() {
    return `${this.args.x},${this.args.y}`;
  }

  /**
   * @override
   */
  Errors() {
    let errors = [];
    let prefix = 'COORDINATES_ERROR';

    // Check x-value

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

    // Check y-value

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

exports.Coordinates = Coordinates;
