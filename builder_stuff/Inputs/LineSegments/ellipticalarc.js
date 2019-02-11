let PATH = require('path');

let parts = __dirname.split(PATH.sep);
let index = parts.findIndex(x => x == 'builder_stuff');
let IM_MODULES_DIR = parts.slice(0, index + 1).join(PATH.sep);
let CHECKS = require(PATH.join(IM_MODULES_DIR, 'Checks', 'check.js'));
let ARG_DICT_BUILDER = require(PATH.join(IM_MODULES_DIR, 'Arguments', 'argdictionary.js')).Builder;
let LINE_SEGMENT_BASECLASS = require(PATH.join(__dirname, 'linesegmentbaseclass.js')).PrimitivesBaseClass;

//----------------------------------

const ARG_INFO = ARG_DICT_BUILDER()
  .add('radius', { type: 'coordinates' })
  .add('angle', { type: 'number', default: 0 })
  .add('largeFlag', { type: 'boolean', default: false })
  .add('sweepFlag', { type: 'boolean', default: false })
  .add('edge', { type: 'coordinates' })
  .build();

//------------------------------------

class EllipticalArc extends LINE_SEGMENT_BASECLASS {
  constructor(properties) {
    super(properties);
  }

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
   * @returns {string} Returns a string representation of the elliptical arc line segment.
   */
  String() {
    return `A ${this.args.radius.args.x},${this.args.radius.args.y} ${this.args.angle ? this.args.angle : ARG_INFO.angle.default} ${this.args.largeFlag ? 1 : 0},${this.args.sweepFlag_ ? 1 : 0} ${this.args.edge.args.x},${this.args.edge.args.y}`;
  }

  /**
   * @override
   * @returns {Array<string>} Returns an array of error messages. If array is empty, there were no errors.
   */
  Errors() {
    let errors = [];

    // Check required args

    if (!CHECKS.IsDefined(this.args.radius))
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

    if (!CHECKS.IsDefined(this.args.edge))
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
      if (!CHECKS.IsDefined(this.args.angle))
        errors.push('ELLIPTICAL_ARC_LINE_SEGMENT_ERROR: Angle is undefined.');
      else {
        if (!CHECKS.IsNumber(this.args.angle))
          errors.push(`ELLIPTICAL_ARC_LINE_SEGMENT_ERROR: Angle is not a number.`);
      }
    }

    if (this.args.largeFlag) {
      if (!CHECKS.IsDefined(this.args.largeFlag))
        errors.push('ELLIPTICAL_ARC_LINE_SEGMENT_ERROR: Large flag is undefined');
      else {
        if (!CHECKS.IsBoolean(this.args.largeFlag))
          errors.push('ELLIPTICAL_ARC_LINE_SEGMENT_ERROR: Large flag is not a boolean.');
      }
    }

    if (this.args.sweepFlag) {
      if (!CHECKS.IsDefined(this.args.sweepFlag))
        errors.push('ELLIPTICAL_ARC_LINE_SEGMENT_ERROR: Sweep flag is undefined');
      else {
        if (!CHECKS.IsBoolean(this.args.sweepFlag))
          errors.push('ELLIPTICAL_ARC_LINE_SEGMENT_ERROR: Sweep flag is not a boolean.');
      }
    }

    return errors;
  }
}

//------------------------------
// EXPORTS

exports.ARG_INFO = ARG_INFO;
exports.Builder = EllipticalArc.Builder;
