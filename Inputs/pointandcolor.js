let Path = require('path');
let Validate = require('./validate.js');
let Filepath = require('./filepath.js').Filepath;
let InputsBaseClass = require(Path.join(Filepath.InputsDir(), 'inputsbaseclass.js')).InputsBaseClass;

//-----------------------------

class PointAndColor extends InputsBaseClass {
  constructor(properties) {
    super(properties);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.type = 'PointAndColor';
        this.name = 'PointAndColor';
        this.args = {};
      }

      /**
       * @param {Coordinates} point 
       */
      point(point) {
        this.args.point = point;
        return this;
      }

      /**
       * @param {Color} color 
       */
      color(color) {
        this.args.color = color;
        return this;
      }

      build() {
        return new PointAndColor(this);
      }
    }
    return Builder;
  }

  /** 
   * @returns {string} Returns a string representation of the point and color as 'x,y #rrggbb'. 
   */
  String() {
    let hexStr = this.args.color.Info().hex.string;
    return `${this.args.point.args.x},${this.point.args.y} ${hexStr}`;
  }

  /**
   * @override
   */
  Errors() {
    let errors = [];

    if (!Validate.IsDefined(this.args.point))
      errors.push('POINT_AND_COLOR_ERROR: Point is undefined.');
    else {
      if (this.args.point.name != 'Coordinates')
        errors.push(`POINT_AND_COLOR_ERROR: Point is not a Coordinates object.`);
      else {
        let errs = this.args.point.Errors();
        if (errs.length > 0)
          errors.push(`POINT_AND_COLOR_ERROR: Point has errors: ${errs.join(' ')}`);
      }
    }

    if (!Validate.IsDefined(this.args.color))
      errors.push('POINT_AND_COLOR_ERROR: Color is undefined.');
    else {
      if (!Validate.IsString(this.args.color))
        errors.push(`POINT_AND_COLOR_ERROR: Color is not a string.`);
      else {
        if (Validate.IsEmptyString(this.args.color))
          errors.push(`POINT_AND_COLOR_ERROR: Color is empty string.`);
        else if (Validate.IsWhitespace(this.args.color))
          errors.push(`POINT_AND_COLOR_ERROR: Color is whitespace.`);
      }
    }

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      point: {
        type: 'Coordinates'
      },
      color: {
        type: 'Color'
      }
    };
  }
}

//--------------------------------
// EXPORTS

exports.PointAndColor = PointAndColor;