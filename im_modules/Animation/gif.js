let PATH = require('path');

let parts = __dirname.split(PATH.sep);
let index = parts.findIndex(x => x == 'im_modules');
let IM_MODULES_DIR = parts.slice(0, index + 1).join(PATH.sep);
let CHECKS = require(PATH.join(IM_MODULES_DIR, 'Checks', 'check.js'));

//--------------------------------------
// CONSTANTS

const MIN_FILEPATHS = 2;
const DISPOSE_OPTIONS = ['Undefined', 'None', 'Previous', 'Background'];
const DISPOSE_DEFAULT = 'Undefined';
const LOOP_DEFAULT = 0;  // Infinite loop
const DELAY_DEFAULT = 1; // In 1/100th of a second

//--------------------------------------
// GIF

class Gif {
  constructor(build) {
    this.filepaths = build.filepaths;
    this.loop = build.loop;
    this.delay = build.delays;
    this.dispose = build.dispose;
    this.outputPath = build.outputPath;
  }

  static get Builder() {
    class Builder {
      constructor() {
      }

      /**
       * List of filepaths.
       * @param {string} filepaths 
       */
      filepaths(filepaths) {
        this.filepaths = filepaths;
        return this;
      }

      /**
       * Number of times the GIF will cycle through the image sequence before stopping.
       * @param {number} loop 
       */
      loop(loop) {
        this.loop = loop;
        return this;
      }

      /**
       * The time delay to pause after drawing the images that are read in.
       * @param {number} delay 
       */
      delay(delay) {
        this.delay = delay;
        return this;
      }

      /**
       * What the following image should do with the previous result of the GIF animation.
       * @param {string} dispose 
       */
      dispose(dispose) {
        this.dispose = dispose;
        return this;
      }

      /**
       * The destination for the newly created GIF.
       * @param {string} outputPath 
       */
      outputPath(outputPath) {
        this.outputPath = outputPath;
        return this;
      }

      build() {
        return new Gif(this);
      }
    }
    return Builder;
  }

  /**
   * @returns {Array} Returns a list of arguments.
   */
  Args() {
    let args = ['delay'];

    // Add delay
    if (this.delay)
      args.push(this.delay)
    else
      args.push(DELAY_DEFAULT);

    // Add dispose
    args.push('-dispose');
    if (this.dispose)
      args.push(this.dispose);
    else
      args.push(DISPOSE_DEFAULT);

    // Add loop
    args.push('-loop');
    if (this.loop)
      args.push(this.loop);
    else
      args.push(LOOP_DEFAULT);

    // Add filepaths
    args = args.concat(this.filepaths).concat(this.outputPath);
  }

  RenderArgs() {
    return ['convert'].concat(this.Args());
  }

  Name() {
    return 'Gif';
  }

  /**
   * Check for any input errors. 
   * @returns {Array<string>} Returns an array of error messages. If array is empty, there were no errors.
   */
  Errors() {
    let errors = [];

    // Check required args

    if (!CHECKS.IsDefined(this.filepaths))
      errors.push('FILEPATHS_ERROR: Argument is undefined.');
    else {
      if (!CHECKS.IsArray(this.filepaths))
        errors.push(`FILEPATHS_ERROR: Argument is not an array. Assigned value is: ${this.filepaths}.`);
      else {
        if (this.filepaths.length == 0)
          errors.push('FILEPATHS_ERROR: No paths provided.');
        else if (this.filepaths.length < MIN_FILEPATHS)
          errors.push(`FILEPATHS_ERROR: Insufficient paths. Only ${this.filepaths.length} path(s) provided. Must provide at least ${MIN_FILEPATHS}.`);
      }
    }

    if (!CHECKS.IsDefined(outputPath))
      error.push(`OUTPUT_PATH_ERROR: Argument is undefined.`);
    else {
      if (!CHECKS.IsString(outputPath))
        errors.push(`OUTPUT_PATH_ERROR: Argument is not a string. Assigned value is: ${outputPath}.`);
      else {
        if (CHECKS.IsEmptyString(outputPath))
          errors.push('OUTPUT_PATH_ERROR: Path is empty.');
        else if (CHECKS.IsWhitespace(outputPath))
          errors.push('OUTPUT_PATH_ERROR: Path is whitespace.');
      }
    }

    // Check optional args

    if (!CHECKS.IsDefined(this.loop))
      errors.push('LOOP_ERROR: Argument is undefined.');
    else {
      if (!CHECKS.IsNumber(this.loop))
        errors.push(`LOOP_ERROR: Argument is not a number. Assigned value is: ${this.loop}.`);
      else {
        if (!CHECKS.IsInteger(this.loop))
          errors.push('LOOP_ERROR: Argument is not an integer.');
      }
    }

    if (!CHECKS.IsDefined(this.delay))
      errors.push('DELAY_ERROR: Argument is undefined.');
    else {
      if (!CHECKS.IsNumber(this.delay))
        errors.push(`DELAY_ERROR: Argument is not a number. Assigned value is: ${this.delay}.`);
      else {
        if (this.delay <= 0)
          errors.push(`DELAY_ERROR: Value is out of bounds. Value must be greater than 0. Assigned value is: ${this.delay}.`);
      }
    }

    if (!CHECKS.IsDefined(this.dispose))
      errors.push('DISPOSE_ERROR: Argument is not defined.');
    else {
      if (!CHECKS.IsString(this.dispose))
        errors.push(`DISPOSE_ERROR: Argument is not a string. Assigned value is: ${this.dispose}.`);
      else {
        if (!DISPOSE_OPTIONS.includes(this.dispose))
          errors.push(`DISPOSE_ERROR: Invalid value. Assigned value is: ${this.dispose}. Must be assigned to one of the following values: ${DISPOSE_OPTIONS.join(', ')}.`);
      }
    }

    return errors;
  }
}

//---------------------------------
// EXPORTS

exports.MIN_FILEPATHS = MIN_FILEPATHS;
exports.DISPOSE_OPTIONS = DISPOSE_OPTIONS;
exports.DISPOSE_DEFAULT = DISPOSE_DEFAULT;
exports.LOOP_DEFAULT = LOOP_DEFAULT;
exports.DELAY_DEFAULT = DELAY_DEFAULT;

exports.Builder = Gif.Builder;

exports.LoaderInfo = {
  CreateGif: Gif,
  Func: Builder,
  Name: 'CreateGif',
  ComponentType: 'function'
}