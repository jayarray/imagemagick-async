let PATH = require('path');

let parts = __dirname.split(PATH.sep);
let index = parts.findIndex(x => x == 'builder_stuff');
let IM_MODULES_DIR = parts.slice(0, index + 1).join(PATH.sep);
let COORDINATES = require(PATH.join(IM_MODULES_DIR, 'Inputs', 'coordinates.js')).Create;
let CHECKS = require(PATH.join(IM_MODULES_DIR, 'Checks', 'check.js'));
let ARG_DICT_BUILDER = require(PATH.join(IM_MODULES_DIR, 'Arguments', 'argdictionary.js')).Builder;
let PRIMITIVES_BASECLASS = require(PATH.join(__dirname, 'primitivesbaseclass.js')).PrimitivesBaseClass;

//----------------------------------

const ARG_INFO = ARG_DICT_BUILDER()
  .add('points', { type: 'Coordinates', isArray: true, min: 3 })
  .add('strokeColor', { type: 'string', default: '#000000' })
  .add('strokeWidth', { type: 'number', subtype: 'integer', min: 1, default: 1 })
  .add('fillColor', { type: 'string', default: 'none' })
  .build();

//------------------------------------

class Bezier extends PRIMITIVES_BASECLASS {
  constructor(builder) {
    super(builder);
  }

  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Bezier';
        this.args = {};
      }

      /**
       * @param {Array<Coordinates>} points A list of points for the bezier curve to travel through.
       */
      points(points) {
        this.args['points'] = points;
        return this;
      }

      /**
       * @param {string} strokeColor The color of the line connecting all the points. Must be a valid color format string used in Image Magick. (Optional)
       */
      strokeColor(strokeColor) {
        this.args['strokeColor'] = strokeColor;
        return this;
      }

      /**
       * 
       * @param {number} strokeWidth Width of the line connecting all the points. Larger values produce thicker lines. (Optional)
       */
      strokeWidth(strokeWidth) {
        this.args['strokeWidth'] = strokeWidth;
        return this;
      }

      /**
       * 
       * @param {string} fillColor The color to fill the bezier curve. Must be a valid color format string used in Image Magick. (Optional)
       */
      fillColor(fillColor) {
        this.args['fillColor'] = fillColor;
        return this;
      }

      build() {
        return new Bezier(this);
      }
    }
    return Builder;
  }

  /** 
   * Get a list of points in string form that have the X and Y offsets applied to them.
   * @returns {string} Returns a space-delimited string representing all points in the bezier curve.
   */
  PointsToString() {
    return this.args.points.map(point => COORDINATES(point.x + this.offset.x, point.y + this.offset.y).String()).join(' ');
  }

  /** 
   * @override
   * @returns {Array} Returns a list of arguments needed for rendering.
   */
  Args() {
    let args = [];

    args.push('-fill');
    if (this.args.fillColor)
      args.push(this.args.fillColor); // Applies fill color to areas where the curve is above or below the line computed between the start and end point.
    else
      args.push(ARG_INFO.fillColor.default); // Outputs lines only

    args.push('-stroke');
    if (this.args.strokeColor)
      args.push(this.args.strokeColor);
    else
      args.push(ARG_INFO.strokeColor.default);

    args.push('-strokewidth');
    if (this.args.strokeWidth)
      args.push(this.args.strokeWidth);
    else
      args.push(ARG_INFO.strokeWidth.default);

    args.push('-draw', `bezier ${this.PointsToString(this.offset.x, this.offset.y)}`);
    return args;
  }

  /**
   * Check for any input errors.
   * @returns {Array<string>} Returns an array of error messages. If array is empty, there were no errors.
   */
  Errors() {
    let errors = [];

    // Check required args

    if (!CHECKS.IsDefined(this.args.points))
      errors.push('POINTS_ERROR: Argument is not defined.');
    else {
      if (!CHECKS.IsArray(this.args.points))
        errors.push(`POINTS_ERROR: Argument is not an array. Assigned value is: ${this.args.points}.`);
      else {
        let failCount = this.args.points.filter(x => x.name != 'Coordinates');

        if (failCount.length > 0)
          errors.push(`POINTS_ERROR: Array contains invalid objects. All objects must be of type 'Coordinates'.`);
        else {
          if (this.args.points.length < ARG_INFO.points.min)
            errors.push(`POINTS_ERROR: Insufficient points. Only ${this.args.points.length} path(s) provided. Must provide at least ${ARG_INFO.points.min} points.`);
        }
      }
    }

    // CONT

    if (!CHECKS.IsDefined(this.args.strokeColor)) {

    }
    else {

    }

    if (!CHECKS.IsDefined(this.args.strokeWidth)) {

    }
    else {

    }

    if (!CHECKS.IsDefined(this.args.fillColor)) {

    }
    else {

    }

    return errors;
  }
}

//-----------------------------------
// EXPORTS

exports.ARG_INFO = ARG_INFO;
exports.Builder = Bezier.Builder;