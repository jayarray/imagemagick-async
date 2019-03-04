let Path = require('path');
let RootDir = Path.resolve('.');
let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let FxBaseClass = require(Path.join(Filepath.FxDir(), 'fxbaseclass.js')).FxBaseClass;

//---------------------------------

class Wave extends FxBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Wave';
        this.args = {};
        this.offset = null;
      }

      /**
       * @param {string} str The path of the image file you are modifying.
       */
      source(str) {
        this.args.source = str;
        return this;
      }

      /**
       * @param {number} n Total height of the wave in pixels. Uses formula F(x) = A * sin(Bx), where A is the amplitude and B is the frequency.
       */
      amplitude(n) {
        this.args.amplitude = n;
        return this;
      }

      /**
       * @param {number} n The number of pixels in one cycle. Values greater than 1 result in tighter waves. Values less than 1 result in wider waves. Uses formula F(x) = A * sin(Bx), where A is the amplitude and B is the frequency.
       */
      frequency(n) {
        this.args.frequency = n;
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
        return new Wave(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    return ['-background', 'transparent', '-wave', `${this.args.amplitude}x${this.args.frequency}`];
  }

  /**
    * @override
    */
  Errors() {
    let params = Wave.Parameters();
    let errors = [];
    let prefix = 'WAVE_FX_ERROR';

    let sourceErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Source')
      .condition(
        new Err.StringCondition.Builder(this.args.source)
          .isEmpty(false)
          .isWhitespace(false)
          .build()
      )
      .build()
      .String();

    if (sourceErr)
      errors.push(sourceErr);

    let amplitudeErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Amplitude')
      .condition(
        new Err.NumberCondition.Builder(this.args.amplitude)
          .build()
      )
      .build()
      .String();

    if (amplitudeErr)
      errors.push(amplitudeErr);

    let frequencyErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Frequency')
      .condition(
        new Err.NumberCondition.Builder(this.args.frequency)
          .build()
      )
      .build()
      .String();

    if (frequencyErr)
      errors.push(frequencyErr);

    return errors;
  }

  /**
   * @override
   */
  static IsConsolidatable() {
    return true;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      source: {
        type: 'string'
      },
      amplitude: {
        type: 'number'
      },
      frequency: {
        type: 'number'
      }
    };
  }
}

//---------------------------
// EXPORTS

exports.Wave = Wave;