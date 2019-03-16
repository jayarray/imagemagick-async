let Path = require('path');
let ProjectDir = Path.resolve('.');

let PathParts = ProjectDir.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, './error.js'));
let Filepath = require(Path.join(RootDir, './filepath.js')).Filepath;
let LineSegmentBaseClass = require(Path.join(Filepath.LineSegmentsDir(), 'linesegmentbaseclass.js')).LineSegmentBaseClass;

//------------------------------------

class EllipticalArc extends LineSegmentBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'EllipticalArc';
        this.args = {};
      }

      /**
       * @param {Coordinates} coordinates Location of radius
       */
      radius(coordinates) {
        this.args.radius = coordinates;
        return this;
      }

      /**
       * @param {number} n (Optional)
       */
      angle(n) {
        this.args.angle = n;
        return this;
      }

      /**
       * @param {boolean} bool Set to true if longer path going around the center of the ellipse is desired. False results in a smaller arc not containing the center of the ellipse. (Optional)
       */
      largeFlag(bool) {
        this.args.largeFlag = bool;
        return this;
      }

      /**
       * @param {boolean} bool Set to true if path should go below the center of the ellipse. False results in the path going above the center of the ellipse. (Optional)
       */
      sweepFlag(bool) {
        this.args.sweepFlag = bool;
        return this;
      }

      /**
       * @param {Coordinates} coordinates Location of edge
       */
      edge(coordinates) {
        this.args.edge = coordinates;
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
        return new EllipticalArc(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  String() {
    let params = EllipticalArc.Parameters();

    let rX = this.args.radius.args.x + this.args.offset.args.x;
    let rY = this.args.radius.args.y + this.args.offset.args.y;
    let angle = this.args.angle ? this.args.angle : params.angle.default;
    let largeFlag = this.args.largeFlag ? 1 : 0;
    let sweepFlag = this.args.sweepFlag ? 1 : 0;

    return `A ${rX},${rY} ${angle} ${largeFlag},${sweepFlag} ${this.args.edge.String()}`;
  }

  /**
   * @override
   */
  Errors() {
    let errors = [];
    let prefix = 'ELLIPTICAL_ARC_LINE_SEGMENT_ERROR';

    // Check required args

    let radiusErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Radius')
      .condition(
        new Err.ObjectCondition.Builder(this.args.radius)
          .typeName('Coordinates')
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();

    if (radiusErr)
      errors.push(radiusErr);

    let edgeErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Edge')
      .condition(
        new Err.ObjectCondition.Builder(this.args.edge)
          .typeName('Coordinates')
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();

    if (edgeErr)
      errors.push(edgeErr);

    // Checks optional args

    if (this.args.angle) {
      let angleErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Angle')
        .condition(
          new Err.NumberCondition.Builder(this.args.angle)
            .build()
        )
        .build()
        .String();

      if (angleErr)
        errors.push(angleErr);
    }

    if (this.args.largeFlag) {
      let largeFlagErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Large flag')
        .condition(
          new Err.BooleanCondition.Builder(this.args.largeFlag)
            .build()
        )
        .build()
        .String();

      if (largeFlagErr)
        errors.push(largeFlagErr);
    }

    if (this.args.sweepFlag) {
      let sweepFlagErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Sweep flag')
        .condition(
          new Err.BooleanCondition.Builder(this.args.sweepFlag)
            .build()
        )
        .build()
        .String();

      if (sweepFlagErr)
        errors.push(sweepFlagErr);
    }

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      radius: {
        type: 'Coordinates'
      },
      angle: {
        type: 'number',
        default: 0
      },
      largeFlag: {
        type: 'boolean',
        default: false
      },
      sweepFlag: {
        type: 'boolean',
        default: false
      },
      edge: {
        type: 'Coordinates'
      },
      offset: {
        type: 'Offset'
      }
    };
  }
}

//------------------------------
// EXPORTS

exports.EllipticalArc = EllipticalArc;
