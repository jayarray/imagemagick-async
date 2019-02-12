let PATH = require('path');
let LineSegmentBaseClass = require(PATH.join(__dirname, 'linesegmentbaseclass.js')).LineSegmentBaseClass;
let Validate = require('./validate.js');

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
       * @param {Coordinates} radius Location of radius
       */
      radius(radius) {
        this.args.radius = radius;
        return this;
      }

      /**
       * @param {number} angle (Optional)
       */
      angle(angle) {
        this.args.angle = angle;
        return this;
      }

      /**
       * @param {boolean} largeFlag Set to true if longer path going around the center of the ellipse is desired. False results in a smaller arc not containing the center of the ellipse. (Optional)
       */
      largeFlag(largeFlag) {
        this.args.largeFlag = largeFlag;
        return this;
      }

      /**
       * @param {boolean} sweepFlag Set to true if path should go below the center of the ellipse. False results in the path going above the center of the ellipse. (Optional)
       */
      sweepFlag(sweepFlag) {
        this.args.sweepFlag = sweepFlag;
        return this;
      }

      /**
       * @param {Coordinates} edge Location of edge
       */
      edge(edge) {
        this.args.edge = edge;
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

    // Check required args

    if (!Validate.IsDefined(this.args.radius))
      errors.push('ELLIPTICAL_ARC_LINE_SEGMENT_ERROR: Radius coordinates are undefined.');
    else {
      if (this.args.radius.type == 'coordinates')
        errors.push('ELLIPTICAL_ARC_LINE_SEGMENT_ERROR: Radius coordinates are not a Coordinates object.');
      else {
        let errs = this.args.radius.Errors();
        if (errs.length > 0)
          errors.push(`ELLIPTICAL_ARC_LINE_SEGMENT_ERROR: Radius coordinates has errors: ${err.join(' ')}`);
      }
    }

    if (!Validate.IsDefined(this.args.edge))
      errors.push('ELLIPTICAL_ARC_LINE_SEGMENT_ERROR: Edge coordinates are undefined.');
    else {
      if (this.args.edge.type == 'coordinates')
        errors.push('ELLIPTICAL_ARC_LINE_SEGMENT_ERROR: Edge coordinates are not a Coordinates object.');
      else {
        let errs = this.args.edge.Errors();
        if (errs.length > 0)
          errors.push(`ELLIPTICAL_ARC_LINE_SEGMENT_ERROR: Edge coordinates has errors: ${err.join(' ')}`);
      }
    }

    // Checks optional args

    if (this.args.angle) {
      if (!Validate.IsDefined(this.args.angle))
        errors.push('ELLIPTICAL_ARC_LINE_SEGMENT_ERROR: Angle is undefined.');
      else {
        if (!Validate.IsNumber(this.args.angle))
          errors.push(`ELLIPTICAL_ARC_LINE_SEGMENT_ERROR: Angle is not a number.`);
      }
    }

    if (this.args.largeFlag) {
      if (!Validate.IsDefined(this.args.largeFlag))
        errors.push('ELLIPTICAL_ARC_LINE_SEGMENT_ERROR: Large flag is undefined');
      else {
        if (!Validate.IsBoolean(this.args.largeFlag))
          errors.push('ELLIPTICAL_ARC_LINE_SEGMENT_ERROR: Large flag is not a boolean.');
      }
    }

    if (this.args.sweepFlag) {
      if (!Validate.IsDefined(this.args.sweepFlag))
        errors.push('ELLIPTICAL_ARC_LINE_SEGMENT_ERROR: Sweep flag is undefined');
      else {
        if (!Validate.IsBoolean(this.args.sweepFlag))
          errors.push('ELLIPTICAL_ARC_LINE_SEGMENT_ERROR: Sweep flag is not a boolean.');
      }
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
