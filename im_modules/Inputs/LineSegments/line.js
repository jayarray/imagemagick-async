let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, './error.js'));
let Filepath = require(Path.join(RootDir, './filepath.js')).Filepath;
let LineSegmentBaseClass = require(Path.join(Filepath.LineSegmentsDir(), 'linesegmentbaseclass.js')).LineSegmentBaseClass;

//------------------------------------

class Line extends LineSegmentBaseClass {
  constructor(builder) {
    super(builder);
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

      /**
       * @param {Offset} offset
       */
      offset(offset) {
        this.args.offset = offset;
        return this;
      }

      build() {
        return new Line(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  String() {
    let x = this.args.x;
    let y = this.args.y;

    if (this.args.offset) {
      x += this.args.offset.args.x;
      y += this.args.offset.args.y;
    }

    return `L ${x},${y}`;
  }

  /**
   * @override
   */
  Errors() {
    let errors = [];
    let prefix = 'LINE_LINE_SEGMENT_ERROR';

    let xErr = Err.ErrorMessage.Builder
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

    let yErr = Err.ErrorMessage.Builder
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
        subtype: 'integer',
        required: true
      },
      y: {
        type: 'number',
        subtype: 'integer',
        required: true
      },
      offset: {
        type: 'Inputs.Offset',
        required: false
      }
    };
  }
}

//----------------------------
// EXPORTS

exports.Line = Line;