let AnimationBaseClass = require(PATH.join(__dirname, 'animationbaseclass.js')).AnimationBaseClass;
let Validate = require('./validate.js');

//--------------------------------------
// GIF

class Gif extends AnimationBaseClass {
  constructor(builder) {
    super(builder);
    this.command = builder.command;
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.type = 'Gif';
        this.name = 'Gif';
        this.args = {};
        this.command = 'convert';
      }

      /**
       * List of filepaths.
       * @param {Array<string>} filepaths
       */
      filepaths(filepaths) {
        this.args.filepaths = filepaths;
        return this;
      }

      /**
       * Number of times the GIF will cycle through the image sequence before stopping. (Optional)
       * @param {number} loop
       */
      loop(loop) {
        this.args.loop = loop;
        return this;
      }

      /**
       * The time delay to pause after drawing the images that are read in. (Optional)
       * @param {number} delay
       */
      delay(delay) {
        this.args.delay = delay;
        return this;
      }

      /**
       * What the following image should do with the previous result of the GIF animation. (Optional)
       * @param {string} dispose
       */
      dispose(dispose) {
        this.args.dispose = dispose;
        return this;
      }

      /**
       * The destination for the newly created GIF.
       * @param {string} outputPath
       */
      outputPath(outputPath) {
        this.args.outputPath = outputPath;
        return this;
      }

      build() {
        return new Gif(this);
      }
    }
    return Builder;
  }

  /**
   * @override
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
   * @override
   */
  Errors() {
    let errors = [];

    // Check required args

    if (!Validate.IsDefined(this.args.filepaths))
      errors.push('GIF_ERROR: Filepaths is undefined.');
    else {
      if (!Validate.IsArray(this.args.filepaths))
        errors.push(`GIF_ERROR: Filepaths is not an array.`);
      else {
        if (this.args.filepaths.length == 0)
          errors.push('GIF_ERROR: No filepaths provided.');
        else if (this.args.filepaths.length < ARG_INFO.filepaths.min)
          errors.push(`GIF_ERROR: Insufficient filepaths. Only ${this.args.filepaths.length} path(s) provided. Must provide at least ${ARG_INFO.filepaths.min} filepaths.`);
      }
    }

    if (!Validate.IsDefined(this.args.outputPath))
      error.push(`GIF_ERROR: Output path is undefined.`);
    else {
      if (!Validate.IsString(this.args.outputPath))
        errors.push(`GIF_ERROR: Output path is not a string.`);
      else {
        if (Validate.IsEmptyString(this.args.outputPath))
          errors.push('GIF_ERROR: Output path is empty.');
        else if (Validate.IsWhitespace(this.args.outputPath))
          errors.push('GIF_ERROR: Output path is whitespace.');
      }
    }

    // Check optional args

    if (!Validate.IsDefined(this.args.loop))
      errors.push('GIF_ERROR: Loop is undefined.');
    else {
      if (!Validate.IsNumber(this.args.loop))
        errors.push(`GIF_ERROR: Loop is not a number.`);
      else {
        if (!Validate.IsInteger(this.args.loop))
          errors.push('GIF_ERROR: Loop is not an integer.');
        else {
          if (this.args.loop < ARG_INFO.loop.min)
            errors.push(`GIF_ERROR: Loop is out of bounds. Assigned value is: ${this.args.loop}. Value must be greater than or equal to ${ARG_INFO.loop.min}.`);
        }
      }
    }

    if (!Validate.IsDefined(this.args.delay))
      errors.push('GIF_ERROR: Delay is undefined.');
    else {
      if (!Validate.IsNumber(this.args.delay))
        errors.push(`GIF_ERROR: Delay is not a number.`);
      else {
        if (this.args.delay <= ARG_INFO.delay.min)
          errors.push(`GIF_ERROR: Delay is out of bounds. Assigned value is: ${this.args.delay}. Value must be greater than ${ARG_INFO.delay.min}.`);
      }
    }

    if (!Validate.IsDefined(this.args.dispose))
      errors.push('GIF_ERROR: Dispose is undefined.');
    else {
      if (!Validate.IsString(this.args.dispose))
        errors.push(`GIF_ERROR: Dispose is not a string.`);
      else {
        if (!ARG_INFO.dispose.options.includes(this.args.dispose))
          errors.push(`GIF_ERROR: Dispose is invalid. Assigned value is: ${this.args.dispose}. Must be assigned to one of the following values: ${ARG_INFO.dispose.options.join(', ')}.`);
      }
    }

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      filepaths: {
        type: 'string',
        isArray: true,
        min: 2
      },
      loop: {
        type: 'number',
        subtype: 'integer',
        min: 0,
        default: 0  // infinite loop
      },
      delay: {
        type: 'number',
        min: 0,
        default: 1 // In 1/100th of a second
      },
      dispose: {
        type: 'string',
        default: 'Undefined',
        options: ['Undefined', 'None', 'Previous', 'Background']
      },
      outputPath: {
        type: 'string',
        default: ''
      }
    };
  }
}

//---------------------------------
// EXPORTS

exports.Gif = Gif;