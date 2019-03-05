let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let ComposeBaseClass = require(Path.join(Filepath.ModComposeDir(), 'composebaseclass.js')).ComposeBaseClass;

//------------------------------

class ChangedPixels extends ComposeBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'ChangedPixels';
        this.args = {};
        this.offset = null;
      }

      /**
       * @param {string} str The first path of the image file you are adding.
       */
      source1(str) {
        this.args.source1 = str;
        return this;
      }

      /**
       * @param {string} str The second path of the other image file you are adding.
       */
      source2(str) {
        this.args.source2 = str;
        return this;
      }

      /**
       * @param {number} n Value between 1 and 100 that helps group similar colors together. Small values help with slight color variations. (Optional)
       */
      fuzz(n) {
        this.args.fuzz = n;
        return this;
      }

      /**
       * @param {number} x 
       * @param {number} y 
       */
      offset(x, y) {
        this.offset = { x: x, y: y };
        return this;
      }

      build() {
        return new ChangedPixels(this);
      }
    }
    return new Builder();
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    let args = [this.args.source1, this.args.source2];

    if (this.args.fuzz)
      args.push('-fuzz', `${this.args.fuzz}%`);
    args.push('-compose', 'ChangeMask', '-composite');

    return args;
  }

  /**
   * @override
   */
  Errors() {
    let params = ChangedPixels.Parameters();
    let errors = [];
    let prefix = 'CHANGED_PIXELS_COMPOSE_MOD_ERROR';

    // CONT
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      source1: {
        type: 'string'
      },
      source2: {
        type: 'string'
      },
      fuzz: {
        type: 'number',
        min: 1,
        max: 100
      }
    };
  }
}

//-------------------------
// EXPORTS

exports.ChangedPixels = ChangedPixels;