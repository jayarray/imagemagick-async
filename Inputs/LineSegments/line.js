let Path = require('path');
let Validate = require('./validate.js');
let Filepath = require('./filepath.js').Filepath;
let LineSegmentBaseClass = require(Path.join(Filepath.LineSegmentsDir(), 'linesegmentbaseclass.js')).LineSegmentBaseClass;

//------------------------------------

class Line extends LineSegmentBaseClass {
  constructor(properties) {
    super(properties);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Line';
        this.args = {};
      }

      /**
       * @param {number} x 
       */
      x(x) {
        this.x = x;
        return this;
      }

      /**
       * @param {number} y 
       */
      y(y) {
        this.y = y;
        return this;
      }

      build() {
        return new Line(this);
      }
    }
    return Builder;
  }

  /**
   * @override
   */
  String() {
    return `L ${this.args.x},${this.args.y}`;
  }

  /**
   * @override
   */
  Errors() {
    let errors = [];

    if (!Validate.IsDefined(this.args.x))
      errors.push('LINE_LINE_SEGMENT_ERROR: X coordinate is undefined.');
    else {
      if (!Validate.IsNumber(this.args.x))
        errors.push('LINE_LINE_SEGMENT_ERROR: X coordinate is not a number.');
    }

    if (!Validate.IsDefined(this.args.y))
      errors.push('LINE_LINE_SEGMENT_ERROR: Y coordinate is undefined.');
    else {
      if (!Validate.IsNumber(this.args.y))
        errors.push('LINE_LINE_SEGMENT_ERROR: Y coordinate is not a number.');
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
        subtype: 'integer'
      },
      y: {
        type: 'number',
        subtype: 'integer'
      }
    };
  }
}

//----------------------------
// EXPORTS

exports.Line = Line;