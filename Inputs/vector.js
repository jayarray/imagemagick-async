let InputsBaseClass = require(PATH.join(__dirname, 'inputsbaseclass.js')).InputsBaseClass;
let Validate = require('./validate.js');

//-----------------------------

class Vector extends InputsBaseClass {
  constructor(properties) {
    super(properties);
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
       * @param {Coordinates} start 
       */
      start(start) {
        this.args.start = start;
        return this;
      }

      /**
       * @param {Coordinates} end 
       */
      end(end) {
        this.args.end = end;
        return this;
      }

      build() {
        return new Vector(this);
      }
    }
    return Builder;
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

    if (!Validate.IsDefined(this.args.start))
      errors.push('VECTOR_ERROR: Start coordinates are undefined.');
    else {
      if (this.args.start.type != 'Coordinates')
        errors.push(`VECTOR_ERROR: Start is not a Coordinates object.`);
      else {
        let errs = this.args.start.Errors();
        if (errs.length > 0) {
          errors.push(`VECTOR_ERROR: Start coordinates has errors: ${errs.join(' ')}`);
        }
      }
    }

    if (!Validate.IsDefined(this.args.end))
      errors.push('VECTOR_ERROR: End coordinates are undefined.');
    else {
      if (this.args.end.type != 'Coordinates')
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

exports.Vector = Vector;
