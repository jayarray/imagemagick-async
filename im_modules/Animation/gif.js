let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let AnimationBaseClass = require(Path.join(Filepath.AnimationDir(), 'animationbaseclass.js')).AnimationBaseClass;
let DisposeValues = require(Path.join(Filepath.ConstantsDir(), 'dispose.json')).values;

let LinuxCommands = require('linux-commands-async');
let LocalCommand = LinuxCommands.Command.LOCAL;

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
        this.order = ['args'];
      }

      /**
       * List of filepaths.
       * @param {Array<string>} strArr
       */
      filepaths(strArr) {
        this.args.filepaths = strArr;
        return this;
      }

      /**
       * Number of times the GIF will cycle through the image sequence before stopping. (Optional)
       * @param {number} n
       */
      loop(n) {
        this.args.loop = n;
        return this;
      }

      /**
       * The time delay to pause after drawing the images that are read in. (Optional)
       * @param {number} n
       */
      delay(n) {
        this.args.delay = n;
        return this;
      }

      /**
       * What the following image should do with the previous result of the GIF animation. (Optional)
       * @param {string} str
       */
      dispose(str) {
        this.args.dispose = str;
        return this;
      }

      build() {
        return new Gif(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    let params = Gif.Parameters();

    let args = ['-delay'];

    // Add delay
    if (this.args.delay)
      args.push(this.args.delay);
    else
      args.push(params.delay.default);

    // Add dispose
    args.push('-dispose');
    if (this.args.dispose)
      args.push(this.args.dispose);
    else
      args.push(params.dispose.default);

    // Add loop
    args.push('-loop');
    if (this.args.loop)
      args.push(this.args.loop);
    else
      args.push(params.loop.default);

    // Add filepaths
    args = args.concat(this.args.filepaths);

    return args;
  }

  /**
   * @override
   */
  Errors() {
    let params = Gif.Parameters();
    let errors = [];
    let prefix = 'GIF_ERROR';

    // Check required args

    let filepathsErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Filepaths')
      .condition(
        new Err.ArrayCondition.Builder(this.args.filepaths)
          .minLength(params.filepaths.min)
          .build()
      )
      .build()
      .String();

    if (filepathsErr)
      errors.push(filepathsErr);

    // Check optional args

    if (this.args.loop) {
      let loopErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Loop')
        .condition(
          new Err.NumberCondition.Builder(this.args.loop)
            .isInteger(true)
            .min(params.loop.min)
            .build()
        )
        .build()
        .String();

      if (loopErr)
        errors.push(loopErr);
    }

    if (this.args.delay) {
      let delayErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Delay')
        .condition(
          new Err.NumberCondition.Builder(this.args.delay)
            .min(params.delay.min)
            .build()
        )
        .build()
        .String();

      if (delayErr)
        errors.push(delayErr);
    }

    if (this.args.dispose) {
      let disposeErr = Err.ErrorMessage.Builder
        .prefix(prefix)
        .varName('Dispose')
        .condition(
          new Err.StringCondition.Builder()
            .isEmpty(false)
            .isWhitespace(false)
            .include(params.dispose.options)
            .build()
        )
        .build()
        .String();

      if (disposeErr)
        errors.push(disposeErr);
    }

    return errors;
  }

  /**
   * @param {string} dest The output path for the gif.
   * @returns {Promise<string>} Returns a Promise with the output path for the newly created gif.
   */
  Render(dest) {
    return new Promise((resolve, reject) => {
      let cmd = this.command;
      let args = this.Args().concat(dest);

      LocalCommand.Execute(cmd, args).then(output => {
        if (output.stderr) {
          reject(output.stderr);
          return;
        }

        resolve(dest);
      }).catch(error => reject(`Failed to render '${this.name}' effect: ${error}`));
    });
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      filepaths: {
        type: 'string',
        isArray: true,
        min: 2,
        required: true
      },
      loop: {
        type: 'number',
        subtype: 'integer',
        min: 0,
        default: 0,  // infinite loop
        required: false
      },
      delay: {
        type: 'number',
        min: 0,
        default: 1, // In 1/100th of a second
        required: false
      },
      dispose: {
        type: 'string',
        default: 'Undefined',
        options: DisposeValues,
        required: false
      }
    };
  }
}

//---------------------------------
// EXPORTS

exports.Gif = Gif;