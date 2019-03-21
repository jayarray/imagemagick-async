let Path = require('path');

let PathParts = __dirname.split(Path.sep);
let index = PathParts.indexOf('imagemagick-async');
let RootDir = PathParts.slice(0, index + 1).join(Path.sep);

let Err = require(Path.join(RootDir, 'error.js'));
let Validate = require(Path.join(RootDir, 'validate.js'));
let Filepath = require(Path.join(RootDir, 'filepath.js')).Filepath;
let ColorChannels = require(Path.join(Filepath.ConstantsDir(), 'color_channels.json')).values;
let ColorBaseClass = require(Path.join(Filepath.ModColorDir(), 'colorbaseclass.js')).ColorBaseClass;

//------------------------------

class ChannelAdjust extends ColorBaseClass {
  constructor(builder) {
    super(builder);
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.name = 'ChannelAdjust';
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
       * @param {string} str The name of the channel
       */
      channel(str) {
        this.args.channel = str;
        return this;
      }

      /**
       * @param {object} o Can be an rgba value 0-255 or a percent string (e.g. 10%, 15%, etc).
       */
      value(o) {
        this.args.value = o;
        return this;
      }

      build() {
        return new ChannelAdjust(this);
      }
    }
    return new Builder();
  }

  /**
   * @override
   */
  Args() {
    return ['-alpha', 'set', '-channel', this.args.channel, '-evaluate', 'set', this.args.value];
  }

  /**
   * @override
   */
  Errors() {
    let params = ChannelAdjust.Parameters();
    let errors = [];
    let prefix = 'CHANNEL_ADJUST_COLOR_MOD_ERROR';

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

    let channelErr = Err.ErrorMessage.Builder
      .prefix(prefix)
      .varName('Channel')
      .condition(
        new Err.StringCondition.Builder(this.args.channel)
          .isEmpty(false)
          .isWhitespace(false)
          .include(params.channel.options)
          .build()
      )
      .build()
      .String();

    if (channelErr)
      errors.push(channelErr);


    let valueIsNumber = Validate.IsNumber(this.args.value);
    let valueIsString = Validate.IsString(this.args.value);

    if (valueIsNumber || valueIsString) {
      if (valueIsNumber) {
        let valueErr = Err.ErrorMessage.Builder
          .prefix(prefix)
          .varName('Value')
          .condition(
            new Err.NumberCondition.Builder(this.args.value)
              .isInteger(true)
              .min(params.value.min)
              .max(params.value.max)
              .build()
          )
          .build()
          .String();

        if (valueErr)
          errors.push(valueErr);
      }
      else if (valueIsString) {
        // Check if it's a valid string

        let valueErr = Err.ErrorMessage.Builder
          .prefix(prefix)
          .varName('Value')
          .condition(
            new Err.StringCondition.Builder(this.args.value)
              .isEmpty(false)
              .isWhitespace(false)
              .endsWith('%')
              .minLength(2)
              .build()
          )
          .build()
          .String();

        if (valueErr)
          errors.push(valueErr);
        else {
          // Check if it is a properly formatted percent string

          let numericalStr = this.args.value.substring(0, this.args.value.length - 1);
          let numericalObj = Number(numericalStr);

          let err = Err.ErrorMessage.Builder
            .prefix(prefix)
            .varName('Value')
            .condition(
              new Err.NumberCondition.Builder(numericalObj)
                .build()
            )
            .build()
            .String();

          if (err)
            errors.push(`${prefix}: Value is not formatted correctly. Must have a number followed by a percent sign. Examples: 1%, 33.3%, 100%.`);
          else {
            // Check if percent value is between 0 and 100

            if (numericalObj < 0 || numericalObj > 100)
              errors.push(`${prefix}: Value is out of bounds. Assigned value is: ${this.args.value}. Must be equal to or greater than 0% and equal to or less than 100%.`);
          }
        }
      }
    }
    else
      errors.push(`${prefix}: Value is an invalid type. Must be a string or a number.`);

    return errors;
  }

  /**
   * @override
   */
  IsConsolidatable() {
    return false;
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
      channel: {
        type: 'string',
        options: ColorChannels,
        required: true
      },
      value: {
        type: 'number',
        subtype: 'integer',
        min: 0,
        max: 255,
        required: true
      }
    };
  }
}

//------------------------
// EXPORTS

exports.ChannelAdjust = ChannelAdjust;