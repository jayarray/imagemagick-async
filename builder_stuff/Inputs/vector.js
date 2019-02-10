let PATH = require('path');

let parts = __dirname.split(PATH.sep);
let index = parts.findIndex(x => x == 'builder_stuff');
let IM_MODULES_DIR = parts.slice(0, index + 1).join(PATH.sep);
let INPUTS_BASECLASS = require(PATH.join(__dirname, 'inputsbaseclass.js')).InputsBaseClass;
let CHECKS = require(PATH.join(IM_MODULES_DIR, 'Checks', 'check.js'));
let ARG_DICT_BUILDER = require(PATH.join(IM_MODULES_DIR, 'Arguments', 'argdictionary.js')).Builder;

//-----------------------------

const ARG_INFO = ARG_DICT_BUILDER()
  .add('start', { type: 'Coordinates' })
  .add('end', { type: 'Coordinates' })
  .build();

//-----------------------------

class Vector extends INPUTS_BASECLASS {
  constructor(properties) {
    super(properties);
  }

  /**
   * @returns {string} A String representation in the form of: 'startX,startY,endX,endY'
   */
  String() {
    return `${this.args.start.String()},${this.args.end.String()}`;
  }

  /**
   * @param {Coordinates} start Start coordinates 
   * @param {Coordinates} end End coordinates
   * @returns {Vector} Returns a Vector object.
   */
  static Create(start, end) {
    let properties = {
      type: 'vector',
      name: 'Vector',
      args: { start: start, end: end }
    };

    return new Vector(properties);
  }

  /**
   * @override
   * @returns {Array<string>} Returns an array of error messages. If array is empty, there were no errors.
   */
  Errors() {
    let errors = [];

    if (!CHECKS.IsDefined(this.args.start))
      errors.push('VECTOR_ERROR: Start coordinates are undefined.');
    else {
      if (this.args.start.name != 'Coordinates')
        errors.push(`VECTOR_ERROR: Start is not a Coordinates object.`);
      else {
        let errs = this.args.start.Errors();
        if (errs.length > 0) {
          errors.push(`VECTOR_ERROR: Start coordinates has errors: ${errs.join(' ')}`);
        }
      }
    }

    if (!CHECKS.IsDefined(this.args.end))
      errors.push('VECTOR_ERROR: End coordinates are undefined.');
    else {
      if (this.args.end.name != 'Coordinates')
        errors.push(`VECTOR_ERROR: End is not a Coordinates object.`);
      else {
        let errs = this.args.end.Errors();
        if (errs.length > 0) {
          errors.push(`VECTOR_ERROR: End coordinates has errors: ${errs.join(' ')}`);
        }

      }
    }

    return errors;
  }
}

//---------------------------
// EXPORTS

exports.ARG_INFO = ARG_INFO;
exports.Create = Vector.Create;
