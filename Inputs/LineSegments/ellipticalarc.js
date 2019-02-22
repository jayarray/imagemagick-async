let Path = require('path');
let Err = require('./error.js');
let Filepath = require('./filepath.js').Filepath;
let LineSegmentBaseClass = require(Path.join(Filepath.LineSegmentsDir(), 'linesegmentbaseclass.js')).LineSegmentBaseClass;

//------------------------------------

class EllipticalArc extends LineSegmentBaseClass {
  constructor(properties) {
    super(properties);
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
      edge(edge) {
        this.args.edge = coordinates;
        return this;
      }

      build() {
        return new EllipticalArc(this);
      }
    }
    return Builder;
  }

  /**
   * @override
   */
  String() {
    return `A ${this.args.radius.args.x},${this.args.radius.args.y} ${this.args.angle ? this.args.angle : ARG_INFO.angle.default} ${this.args.largeFlag ? 1 : 0},${this.args.sweepFlag_ ? 1 : 0} ${this.args.edge.args.x},${this.args.edge.args.y}`;
  }

  /**
   * @override
   */
  Errors() {
    let errors = [];
    let prefix = 'ELLIPTICAL_ARC_LINE_SEGMENT_ERROR';

    // Check required args

    let radiusErr = new Err.ErrorMessage.Builder()
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

    let edgeErr = new Err.ErrorMessage.Builder()
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
      let angleErr = new Err.ErrorMessage.Builder()
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
      let largeFlagErr = new Err.ErrorMessage.Builder()
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
      let sweepFlagErr = new Err.ErrorMessage.Builder()
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
      }
    };
  }
}

//------------------------------
// EXPORTS

exports.EllipticalArc = EllipticalArc;
