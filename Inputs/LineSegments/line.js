let Path = require('path');
let Err = require('./error.js');
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
       * @param {number} n 
       */
      x(n) {
        this.x = n;
        return this;
      }

      /**
       * @param {number} n 
       */
      y(n) {
        this.y = n;
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
    let prefix = 'LINE_LINE_SEGMENT_ERROR';

    let xErr = new Err.ErrorMessage.Builder()
      .prefix(prefix)
      .varName('X coordinate')
      .condition(
        new Err.NumberCondition.Builder(this.args.x)
          .build()
      )
      .build()
      .String();

    if (xErr)
      errors.push(xErr);

    let yErr = new Err.ErrorMessage.Builder()
      .prefix(prefix)
      .varName('Y coordinate')
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