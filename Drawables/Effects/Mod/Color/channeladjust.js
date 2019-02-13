let PATH = require('path');
let COLOR_BASECLASS = require(PATH.join(__dirname, 'colorbaseclass.js')).ColorBaseClass;

//------------------------------

class ChannelAdjust extends COLOR_BASECLASS {
  constructor(src, channel, value) {
    super();
    this.src_ = src;
    this.channel_ = channel;
    this.value_ = value;
  }

  /**
   * @returns {Array<string|number>} Returns an array of image magick arguments associated with this layer.
   */
  Args() {
    return ['-alpha', 'set', '-channel', this.channel_, '-evaluate', 'set', this.value_];
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments used for rendering this layer.
   */
  RenderArgs() {
    return [this.src_].concat(this.Args());
  }

  /**
   * @override
   */
  Name() {
    return 'ChannelAdjust';
  }

  /**
   * Create a ChannelAdjust object. Adjusts color channel saturation.
   * @param {string} src
   * @param {string} channel A valid Image Magick channel.
   * @param {string|number} value Can be an rgba value 0-255 or a percent string (e.g. 10%, 15%, etc).
   * @returns {ChannelAdjust} Returns a ChannelAdjust object. If inputs are invalid, it returns null.
   */
  static Create(src, channel, value) {
    if (!src || !channel || !value)
      return null;

    return new ChannelAdjust(src, channel, value);
  }
}

//------------------------
// EXPORTS

exports.Create = ChannelAdjust.Create;
exports.Name = 'ChannelAdjust';
exports.Layer = true;
exports.Consolidate = false;
exports.Dependencies = null;
exports.ComponentType = 'drawable';