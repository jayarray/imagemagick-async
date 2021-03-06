let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let SpecialBaseClass = require(Path.join(Filepath.SpecialDir(), 'specialbaseclass.js')).SpecialBaseClass;

let LinuxCommands = require('linux-commands-async');
let LocalCommand = LinuxCommands.Command.LOCAL;

//---------------------------------

class Aura extends SpecialBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'Aura';
        this.args = {};
      }

      /**
       * @param {string} str The path of the image file you are modifying.
       */
      source(str) {
        this.args.source = str;
        return this;
      }

      /**
       * @param {Color} color 
       */
      color(color) {
        this.args.color = color;
        return this;
      }

      /**
       * @param {number} n 
       */
      opacity(n) {
        this.args.opacity = n;
        return this;
      }

      /**
       * Controls how big an area the operator should look at when spreading pixels. Minimum value is 0 or at least double that of sigma.
       * @param {number} n 
       */
      blurRadius(n) {
        this.args.blurRadius = n;
        return this;
      }

      /**
       * A floating point value used as an approximation of how much you want the image to spread/blur in pixels. (Think of it as the size of the brush used to blur the image.) Minimum value is 0.
       * @param {number} n 
       */
      blurSigma(n) {
        this.args.blurSigma = n;
        return this;
      }

      build() {
        return new Aura(this);
      }
    }
    return new Builder();
  }

  /**
   * @override 
   */
  Command() {
    let adjustedOpacity = 100 - this.args.opacity;

    if (adjustedOpacity >= 1)
      adjustedOpacity = Math.min(adjustedOpacity, 100);
    else
      adjustedOpacity = Math.max(adjustedOpacity, 0.1);

    let cmdStr = `convert ${this.args.source}`;
    cmdStr += ` \\( +clone -channel A -blur ${this.args.blurRadius}x${this.args.blurSigma} -level 0,${adjustedOpacity}% +channel +level-colors '${this.args.color.String()}' \\)`;
    cmdStr += ' -compose DstOver -composite';

    return cmdStr;
  }

  /**
   * 
   * @param {string} dest 
   */
  Render(dest) {
    return new Promise((resolve, reject) => {

      // Create command string

      let adjustedOpacity = 100 - this.args.opacity;

      if (adjustedOpacity >= 1)
        adjustedOpacity = Math.min(adjustedOpacity, 100);
      else
        adjustedOpacity = Math.max(adjustedOpacity, 0.1);

      let cmdStr = `convert ${this.args.source}`;
      cmdStr += ` \\( +clone -channel A -blur ${this.args.blurRadius}x${this.args.blurSigma} -level 0,${adjustedOpacity}% +channel +level-colors '${this.args.color.String()}' \\)`;
      cmdStr += ` -compose DstOver -composite ${dest}`;


      // Execute command
      LocalCommand.Execute(cmdStr, []).then(output => {
        if (output.stderr) {
          reject(output.stderr);
          return;
        }

        resolve(dest);
      }).catch(error => reject(error));
    });
  }

  /**
   * @override
   */
  Errors() {
    let params = Aura.Parameters();
    let errors = [];
    let prefix = 'AURA_FX_ERROR';

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

    let colorErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Color')
      .condition(
        new Err.ObjectCondition.Builder(this.args.color)
          .typeName('Color')
          .checkForErrors(true)
          .build()
      )
      .build()
      .String();

    if (colorErr)
      errors.push(colorErr);


    let opacityErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Opacity')
      .condition()
      .build(
        new Err.NumberCondition.Builder(this.args.opacity)
          .min(params.opacity.min)
          .max(params.opacity.max)
          .build()
      )
      .String();

    if (opacityErr)
      errors.push(opacityErr);

    let blurRadiusErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Blur radius')
      .condition(
        new Err.NumberCondition.Builder(this.args.blurRadius)
          .isInteger(true)
          .min(params.blurRadius.min)
          .build()
      )
      .build()
      .String();

    if (blurRadiusErr)
      errors.push(blurRadiusErr);

    let blurSigmaErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Blur sigma')
      .condition(
        new Err.NumberCondition.Builder(this.args.blurSigma)
          .isInteger(true)
          .min(params.blurSigma.min)
          .build()
      )
      .build()
      .String();

    if (blurSigmaErr)
      errors.push(blurSigmaErr);

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      source: {
        type: 'string',
        required: true
      },
      color: {
        type: 'Inputs.Color',
        required: true
      },
      opacity: {
        type: 'number',
        min: 0,
        max: 100,
        required: true
      },
      blurRadius: {
        type: 'number',
        subtype: 'integer',
        min: 0,
        required: true
      },
      blurSigma: {
        type: 'number',
        subtype: 'integer',
        min: 0,
        required: true
      }
    };
  }
}

//----------------------------
// EXPORTS

exports.Aura = Aura;