let Path = require('path');
let Validate = require('./validate.js');
let Filepath = require('./filepath.js').Filepath;
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
       * @param {number} x 
       */
      x(x) {
        this.args.x = x;
        return this;
      }

      /**
       * @param {number} y 
       */
      y(y) {
        this.args.y = y;
        return this;
      }

      build() {
        return new Coordinates(this);
      }
    }
    return Builder;
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

    if (!Validate.IsDefined(this.args.x))
      errors.push('COORDINATES_ERROR: X-coordinate is undefined.');
    else {
      if (!Validate.IsNumber(this.args.x))
        errors.push(`COORDINATES_ERROR: X-coordinate is not a number.`);
    }

    if (!Validate.IsDefined(this.args.y))
      errors.push('COORDINATES_ERROR: Y-coordinate is undefined.');
    else {
      if (!Validate.IsNumber(this.args.y))
        errors.push(`COORDINATES_ERROR: Y-coordinate is not a number.`);
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

exports.Coordinates = Coordinates;
