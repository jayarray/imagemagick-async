let PATH = require('path');
let parts = __dirname.split(PATH.sep);
let index = parts.findIndex(x => x == 'builder_stuff');
let IM_MODULES_DIR = parts.slice(0, index + 1).join(PATH.sep);
let ARG_DICT_BUILDER = require(PATH.join(IM_MODULES_DIR, 'Arguments', 'argdictionary.js')).Builder;
let CHECKS = require(PATH.join(IM_MODULES_DIR, 'Checks', 'check.js'));

//--------------------------------------
// CONSTANTS

const ARG_INFO = ARG_DICT_BUILDER()
  .add('filepaths', { type: 'string', isArray: true, min: 2 })
  .add('loop', { type: 'number', subtype: 'integer', min: 0, default: 0 }) // 0 = Infinite loop
  .add('delay', { type: 'number', min: 0, default: 1 }) // In 1/100th of a second
  .add('dispose', { type: 'string', min: 0, default: 'Undefined', options: ['Undefined', 'None', 'Previous', 'Background'] })
  .add('outputPath', { type: 'string', default: '' })
  .build();

//--------------------------------------
// GIF

class Gif {
  constructor(builder) {
    this.name = builder.name;
    this.command = builder.command;
    this.args = builder.args;
  }

  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Gif';
        this.args = {};
        this.command = 'convert';
      }

      /**
       * List of filepaths.
       * @param {Array<string>} filepaths
       */
      filepaths(filepaths) {
        this.args['filepaths'] = filepaths;
        return this;
      }

      /**
       * Number of times the GIF will cycle through the image sequence before stopping. (Optional)
       * @param {number} loop
       */
      loop(loop) {
        this.args['loop'] = loop;
        return this;
      }

      /**
       * The time delay to pause after drawing the images that are read in. (Optional)
       * @param {number} delay
       */
      delay(delay) {
        this.args['delay'] = delay;
        return this;
      }

      /**
       * What the following image should do with the previous result of the GIF animation. (Optional)
       * @param {string} dispose
       */
      dispose(dispose) {
        this.args['dispose'] = dispose;
        return this;
      }

      /**
       * The destination for the newly created GIF.
       * @param {string} outputPath
       */
      outputPath(outputPath) {
        this.args['outputPath'] = outputPath;
        return this;
      }

      build() {
        return new Gif(this);
      }
    }
    return Builder;
  }

  /**
   * @returns {Array} Returns a list of arguments needed for rendering.
   */
  Args() {
    let args = ['delay'];

    // Add delay
    if (this.args.delay)
      args.push(this.args.delay);
    else
      args.push(DELAY_DEFAULT);

    // Add dispose
    args.push('-dispose');
    if (this.args.dispose)
      args.push(this.args.dispose);
    else
      args.push(DISPOSE_DEFAULT);

    // Add loop
    args.push('-loop');
    if (this.args.loop)
      args.push(this.args.loop);
    else
      args.push(LOOP_DEFAULT);

    // Add filepaths
    args = args.concat(this.args.filepaths).concat(this.args.outputPath);
  }

  /**
   * Check for any input errors.
   * @returns {Array<string>} Returns an array of error messages. If array is empty, there were no errors.
   */
  Errors() {
    let errors = [];

    // Check required args

    if (!CHECKS.IsDefined(this.args.filepaths))
      errors.push('GIF_ERROR: Filepaths is undefined.');
    else {
      if (!CHECKS.IsArray(this.args.filepaths))
        errors.push(`GIF_ERROR: Filepaths is not an array.`);
      else {
        if (this.args.filepaths.length == 0)
          errors.push('GIF_ERROR: No filepaths provided.');
        else if (this.args.filepaths.length < ARG_INFO.filepaths.min)
          errors.push(`GIF_ERROR: Insufficient filepaths. Only ${this.args.filepaths.length} path(s) provided. Must provide at least ${ARG_INFO.filepaths.min} filepaths.`);
      }
    }

    if (!CHECKS.IsDefined(this.args.outputPath))
      error.push(`GIF_ERROR: Output path is undefined.`);
    else {
      if (!CHECKS.IsString(this.args.outputPath))
        errors.push(`GIF_ERROR: Output path is not a string.`);
      else {
        if (CHECKS.IsEmptyString(this.args.outputPath))
          errors.push('GIF_ERROR: Output path is empty.');
        else if (CHECKS.IsWhitespace(this.args.outputPath))
          errors.push('GIF_ERROR: Output path is whitespace.');
      }
    }

    // Check optional args

    if (!CHECKS.IsDefined(this.args.loop))
      errors.push('GIF_ERROR: Loop is undefined.');
    else {
      if (!CHECKS.IsNumber(this.args.loop))
        errors.push(`GIF_ERROR: Loop is not a number.`);
      else {
        if (!CHECKS.IsInteger(this.args.loop))
          errors.push('GIF_ERROR: Loop is not an integer.');
        else {
          if (this.args.loop < ARG_INFO.loop.min)
            errors.push(`GIF_ERROR: Loop is out of bounds. Assigned value is: ${this.args.loop}. Value must be greater than or equal to ${ARG_INFO.loop.min}.`);
        }
      }
    }

    if (!CHECKS.IsDefined(this.args.delay))
      errors.push('GIF_ERROR: Delay is undefined.');
    else {
      if (!CHECKS.IsNumber(this.args.delay))
        errors.push(`GIF_ERROR: Delay is not a number.`);
      else {
        if (this.args.delay <= ARG_INFO.delay.min)
          errors.push(`GIF_ERROR: Delay is out of bounds. Assigned value is: ${this.args.delay}. Value must be greater than ${ARG_INFO.delay.min}.`);
      }
    }

    if (!CHECKS.IsDefined(this.args.dispose))
      errors.push('GIF_ERROR: Dispose is undefined.');
    else {
      if (!CHECKS.IsString(this.args.dispose))
        errors.push(`GIF_ERROR: Dispose is not a string.`);
      else {
        if (!ARG_INFO.dispose.options.includes(this.args.dispose))
          errors.push(`GIF_ERROR: Dispose is invalid. Assigned value is: ${this.args.dispose}. Must be assigned to one of the following values: ${ARG_INFO.dispose.options.join(', ')}.`);
      }
    }

    return errors;
  }
}

//---------------------------------
// EXPORTS

exports.ARG_INFO = ARG_INFO;
exports.Builder = Gif.Builder;