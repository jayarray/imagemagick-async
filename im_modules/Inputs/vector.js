let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let InputsBaseClass = require(Path.join(Filepath.InputsDir(), 'inputsbaseclass.js')).InputsBaseClass;

//-----------------------------

class Vector extends InputsBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.type = 'Vector';
        this.name = 'Vector';
        this.args = {};
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

      build() {
        return new Vector(this);
      }
    }
    return new Builder();
  }

  /**
   * @returns {string} A String representation in the form of: 'startX,startY,endX,endY'
   */
  String() {
    return `${this.args.start.String()},${this.args.end.String()}`;
  }

  /**
   * @override
   */
  Errors() {
    let errors = [];
    let prefix = 'VECTOR_ERROR';

    // Check start

    let startErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Start coordinates')
      .condition(
        new Err.ObjectCondition.Builder(this.args.start)
          .typeName('Coordinates')
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();

    if (startErr)
      errors.push(startErr);

    // Check end

    let endErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('End coordinates')
      .condition(
        new Err.ObjectCondition.Builder(this.args.end)
          .typeName('Coordinates')
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();

    if (endErr)
      errors.push(endErr);

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      start: {
        type: 'Inputs.Coordinates',
        required: true
      },
      end: {
        type: 'Inputs.Coordinates',
        required: true
      }
    };
  }
}

//---------------------------
// EXPORTS

exports.Vector = Vector;
