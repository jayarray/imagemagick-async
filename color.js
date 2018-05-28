let VALIDATE = require('./validate.js');
let LOCAL_COMMAND = require('linux-commands-async').Command.LOCAL;
let ColorBaseClass = require('./colorbaseclass.js').ColorBaseClass;

//-------------------------------------
// CONSTANTS

const RGB_CHARS = ['r', 'g', 'b'];

const RGB1_LENGTH = RGB_CHARS.length;     // #rgb               (reduced, simplified notation)
const RGB2_LENGTH = RGB_CHARS.length * 2; // #rrggbb            (8-bit per channel)
const RGBA2_LENGTH = RGB2_LENGTH + 2;     // #rrggbbaa          (8-bit per channel)
const RGB4_LENGTH = RGB_CHARS.length * 4; // #rrrrggggbbbb      (16-bit per channel)
const RGBA4_LENGTH = RGB4_LENGTH + 4;     // #rrrrggggbbbbaaaa  (16-bit per channel)

const RGB_MIN = 0;
const RGB_8_BIT_MAX = 255;
const RGB_16_BIT_MAX = Math.pow(RGB_8_BIT_MAX, 2);

const PERCENT_MIN = 0;
const PERCENT_MAX = 100;

//-------------------------------------
// ERROR CHECKS

function FormatValidator(hexString) {
  let error = VALIDATE.IsStringInput(hexString);
  if (error)
    return `is ${error}`;

  if (!hexString.startsWith('#'))
    return `is invalid. Must start with a '#' symbol.`;

  let hex = hexString.substring(1);
  if (
    hex.length != RGB1_LENGTH &&
    hex.length != RGB2_LENGTH &&
    hex.length != RGBA2_LENGTH &&
    hex.length != RGB4_LENGTH &&
    hex.length != RGBA4_LENGTH
  )
    return `is invalid. Must have length ${RGB1_LENGTH}, ${RGB2_LENGTH}, ${RGBA2_LENGTH}, ${RGB4_LENGTH}, or ${RGBA4_LENGTH}.`;

  return null;
}

//-------------------------------------
// HELPERS

function IntToHexString(i) {
  return i.toString(16);
}

function HexStringToInt(hexStr) {
  return parseInt(hexStr, 16);
}

function RGBAIntegersToHexString(r, g, b, a) {
  let hexStr = '';

  let rHex = IntToHexString(r);
  if (rHex.length == 1)
    rHex = `0${rHex}`;
  hexStr += rHex;

  let gHex = IntToHexString(g);
  if (gHex.length == 1)
    gHex = `0${gHex}`;
  hexStr += gHex;

  let bHex = IntToHexString(b);
  if (bHex.length == 1)
    bHex = `0${bHex}`;
  hexStr += bHex;

  if (a != RGB_8_BIT_MAX) {
    let aHex = IntToHexString(a);
    if (aHex.length == 1)
      aHex = `0${aHex}`;
    hexStr += aHex;
  }

  return `#${hexStr}`;
}

function RGBAPercentsToHexString(r, g, b, a) {
  let hexStr = '';

  let rHex = IntToHexString(Math.floor(255 * (r / 100)));
  if (rHex.length == 1)
    rHex = `0${rHex}`;
  hexStr += rHex;

  let gHex = IntToHexString(Math.floor(255 * (g / 100)));
  if (gHex.length == 1)
    gHex = `0${gHex}`;
  hexStr += gHex;

  let bHex = IntToHexString(Math.floor(255 * (b / 100)));
  if (bHex.length == 1)
    bHex = `0${bHex}`;
  hexStr += bHex;

  if (a != PERCENT_MAX) {
    let aHex = IntToHexString(Math.floor(255 * (a / 100)));
    if (aHex.length == 1)
      aHex = `0${aHex}`;
    hexStr += aHex;
  }

  return `#${hexStr}`;
}

function ChannelType(hexStr) {
  let hex = hexStr.substring(1);
  let hexLength = hex.length;

  if (hexLength == RGB2_LENGTH)
    return '8';
  else if (hexLength == RGBA2_LENGTH)
    return '8A';
  else if (hexLength == RGB4_LENGTH)
    return '16';
  else if (hexLength == RGBA4_LENGTH)
    return '16A';
  else
    return null;
}

function SimplifiedHexString(hexStr) {
  let channelType = ChannelType(hexStr);
  let hex = hexStr.substring(1);

  if (channelType.includes('8')) {
    let pairs = [];

    for (let i = 0; i < hex.length / 2; ++i) {
      let start = i * 2;
      let end = start + 2;
      pairs.push(hex.substring(start, end));
    }

    let simplifiedHexStr = '';

    for (let i = 0; i < pairs.length; ++i) {
      let currPair = pairs[i];
      if (currPair.charAt(0) != currPair.charAt(1))
        return hexStr;
      else
        simplifiedHexStr += currPair.charAt(0);
    }

    if (simplifiedHexStr.endsWith('0'))
      simplifiedHexStr = simplifiedHexStr.substring(0, simplifiedHexStr.length - 1);

    return `#${simplifiedHexStr}`;
  }
  else if (channelType.includes('16')) {
    let tuples = [];

    for (let i = 0; i < hex.length / 4; ++i) {
      let start = i * 4;
      let end = start + 4;
      tuples.push(hex.substring(start, end));
    }

    let simplifiedHexStr = '';

    for (let i = 0; i < tuples.length; ++i) {
      let currTuple = tuples[0];
      if (
        currTuple.charAt(0) != currTuple.charAt(1) &&
        currTuple.charAt(0) != currTuple.charAt(2) &&
        currTuple.charAt(0) != currTuple.charAt(3)
      )
        return hexStr;
      else
        simplifiedHexStr += currTuple.charAt(0);
    }

    if (simplifiedHexStr.endsWith('0'))
      simplifiedHexStr = simplifiedHexStr.substring(0, -1);

    return `#${simplifiedHexStr}`;
  }
  else
    return null;
}

function ParseHextString(hexStr) {
  let object = {};

  let channelType = ChannelType(hexStr);

  let hexStrNoHash = hexStr.substring(1);

  if (channelType.includes('8')) {
    object.bitsPerChannel = 8;
    object.alphaChannel = false;

    // Hex strings
    let hex = {};
    hex.r = hexStrNoHash.substring(0, 2);
    hex.g = hexStrNoHash.substring(2, 4);
    hex.b = hexStrNoHash.substring(4, 6);
    hex.a = '00';

    if (channelType.includes('A')) {
      object.alphaChannel = true;
      hex.a = hexStrNoHash.substring(6, 8);
    }

    hex.simplifiedString = SimplifiedHexString(hexStr);
    hex.string = hexStr;
    object.hex = hex;

    // Get numbers:  rgba(r, g, b, a)
    let numbers = {};
    numbers.r = HexStringToInt(hex.r);
    numbers.g = HexStringToInt(hex.g);
    numbers.b = HexStringToInt(hex.b);
    let args = [numbers.r, numbers.g, numbers.b];

    numbers.a = 0.0;

    if (channelType.includes('A')) {
      numbers.a = HexStringToInt(hex.a) / RGB_8_BIT_MAX;
      numbers.a = parseFloat(numbers.a.toFixed(2));
      args.push(numbers.a);
    }
    numbers.string = `rgb(${args.join(', ')})`;

    object.numbers = numbers;

    // Get percents: rgba(r%, g%, b%, a)
    let percents = {};

    let pArgs = [];

    let rPercent = numbers.r / RGB_8_BIT_MAX;
    rPercent = parseFloat(rPercent.toFixed(1)) * 100;
    percents.r = rPercent;
    pArgs.push(`${percents.r}%`);

    let gPercent = numbers.g / RGB_8_BIT_MAX;
    gPercent = parseFloat(gPercent.toFixed(1)) * 100;
    percents.g = gPercent;
    pArgs.push(`${percents.g}%`);

    let bPercent = numbers.b / RGB_8_BIT_MAX;
    bPercent = parseFloat(bPercent.toFixed(1)) * 100;
    percents.b = bPercent;
    pArgs.push(`${percents.b}%`);

    percents.a = 0.0;

    if (channelType.includes('A')) {
      percents.a = numbers.a;
      pArgs.push(percents.a);
    }
    percents.string = `rgb(${pArgs.join(', ')})`;

    object.percents = percents;

    return object;
  }
  else if (channelType.includes('16')) {
    object.bitsPerChannel = 16;
    object.alphaChannel = false;

    // Hex strings
    let hex = {};
    hex.r = hex.substring(0, 4);
    hex.g = hex.substring(4, 8);
    hex.b = hex.substring(8, 12);
    hex.a = '0000';

    if (channelType.includes('A')) {
      object.alphaChannel = true;
      hex.a = hex.substring(12, 16);
    }

    hex.simplifiedString = SimplifiedHexString(hexStr);
    hex.string = hexStr;
    object.hex = hex;

    // Get numbers:  rgba(r, g, b, a)
    let numbers = {};
    numbers.r = HexStringToInt(hex.r);
    numbers.g = HexStringToInt(hex.g);
    numbers.b = HexStringToInt(hex.b);
    let args = [numbers.r, numbers.g, numbers.b];

    numbers.a = 0.0;

    if (channelType.includes('A')) {
      numbers.a = HexStringToInt(hex.a) / RGB_16_BIT_MAX;
      numbers.a = parseFloat(numbers.a.toFixed(2));
      args.push(numbers.a);
    }
    numbers.string = `rgb(${args.join(', ')})`;

    object.numbers = numbers;

    // Get percents: rgba(r%, g%, b%, a)
    let percents = {};

    let pArgs = [];

    let rPercent = numbers.r / RGB_16_BIT_MAX;
    rPercent = parseFloat(rPercent.toFixed(1));
    percents.r = rPercent;
    pArgs.push(`${percents.r}%`);

    let gPercent = numbers.g / RGB_16_BIT_MAX;
    gPercent = parseFloat(gPercent.toFixed(1));
    percents.g = gPercent;
    pArgs.push(`${percents.g}%`);

    let bPercent = numbers.b / RGB_16_BIT_MAX;
    bPercent = parseFloat(bPercent.toFixed(1));
    percents.b = bPercent;
    pArgs.push(`${percents.b}%`);

    percents.a = 0.0;

    if (channelType.includes('A')) {
      percents.a = numbers.a;
      pArgs.push(percents.a);
    }
    percents.string = `rgb(${pArgs.join(', ')})`;

    object.percents = percents;

    return object;
  }
  else
    return null;
}

//------------------------------------
// COLOR

class Color {
  /**
   * @param {string} hexStr
   */
  constructor(hexStr) {
    let o = ParseHextString(hexStr.toLowerCase());

    this.hex = o.hex;
    this.numbers = o.numbers;
    this.percents = o.percents;
    this.alphaChannel = o.alphaChannel;
    this.bitsPerChannel = o.bitsPerChannel;
  }

  /**
   * Create a Color object using RGB integers.
   * @param {number} r Red integer value between 0 and 255.
   * @param {number} g Green integer value between 0 and 255.
   * @param {number} b Blue integer value between 0 and 255.
   * @param {number} a Alpha float value between 0 (fully transparent) and 225 (fully opaque).
   * @returns {Color} Returns a Color object. If inputs are invalid, it returns null.
   */
  static CreateUsingRGBIntgers(r, g, b, a) {
    // Validate rgb values
    if (
      VALIDATE.IsInteger(r) ||
      VALIDATE.IsIntegerInRange(r, RGB_MIN, RGB_8_BIT_MAX) ||
      VALIDATE.IsInteger(g) ||
      VALIDATE.IsIntegerInRange(g, RGB_MIN, RGB_8_BIT_MAX) ||
      VALIDATE.IsInteger(b) ||
      VALIDATE.IsIntegerInRange(b, RGB_MIN, RGB_8_BIT_MAX) ||
      VALIDATE.IsInteger(a) ||
      VALIDATE.IsIntegerInRange(a, RGB_MIN, RGB_8_BIT_MAX)
    )
      return null;

    // Create object
    let hexStr = RGBAIntegersToHexString(r, g, b, a);
    return new Color(hexStr);
  }

  /**
   * Create a Color object using RGB percents.
   * @param {number} r Red float value between 0 and 100.
   * @param {number} g Green float value between 0 and 100.
   * @param {number} b Blue float value between 0 and 100.
   * @param {number} a Alpha float value between 0 (fully transparent) and 100 (fully opaque).
   * @returns {Color} Returns a Color object. If inputs are invalid, it returns null.
   */
  static CreateUsingPercents(r, g, b, a) {
    // Validate percent values
    if (
      VALIDATE.IsNumber(r) ||
      VALIDATE.IsNumberInRange(r, PERCENT_MIN, PERCENT_MAX) ||
      VALIDATE.IsNumber(g) ||
      VALIDATE.IsNumberInRange(g, PERCENT_MIN, PERCENT_MAX) ||
      VALIDATE.IsNumber(b) ||
      VALIDATE.IsNumberInRange(b, PERCENT_MIN, PERCENT_MAX) ||
      VALIDATE.IsNumber(a) ||
      VALIDATE.IsNumberInRange(a, PERCENT_MIN, PERCENT_MAX)
    )
      return null;

    // Create object
    let hexStr = RGBAPercentsToHexString(r, g, b, a);
    return new Color(hexStr);
  }

  /**
   * Create a Color object using RGB hex string.
   * @param {string} hexStr Must follow one of the following formats: #rgb, #rrggbb, #rrggbbaa, #rrrrggggbbbb, #rrrrggggbbbbaaaa.
   * @returns {Color} Returns a Color object. If inputs are invalid, it returns null.
   */
  static CreateUsingRGBHexString(hexStr) {
    if (FormatValidator(hexStr))
      return null;

    return new Color(hexStr);
  }
}

//-------------------------------
// NEGATE

class Negate extends ColorBaseClass {
  constructor(src) {
    super();
    this.src_ = src;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    return [this.src_, '-negate'];
  }

  /**
   * @override
   */
  Name() {
    return 'Negate';
  }

  /**
   * Create a Negate object. Negates all image colors.
   * @param {string} src
   * @returns {Negate} Returns a Negate object. If inputs are invalid, it returns null.
   */
  static Create(src) {
    if (!src)
      return null;

    return new Negate(src);
  }
}

//-------------------------------
// COLORIZE

class Colorize extends ColorBaseClass {
  constructor(src, fillColor, percent) {
    super();
    this.src_ = src;
    this.fillColor_ = fillColor;
    this.percent_ = percent;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    return [this.src_, '-fill', this.fillColor_, '-colorize', `${this.percent_}%`];
  }

  /**
   * @override
   */
  Name() {
    return 'Colorize';
  }

  /**
   * Create a Colorize object. Creates a veil of color over an image.
   * @param {string} src
   * @returns {Colorize} Returns a Colorize object. If inputs are invalid, it returns null.
   */
  static Create(src, fillColor, percent) {
    if (!src || !fillColor || !percent)
      return null;

    return new Colorize(src, fillColor, percent);
  }
}

//-------------------------------
// GRAYSCALE

class GrayscaleFormat extends ColorBaseClass {
  constructor(src) {
    super();
    this.src_ = src;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    return [this.src_, '-colorspace', 'Gray'];
  }

  /**
   * @override
   */
  Name() {
    return 'GrayscaleFormat';
  }

  /**
   * Create a GrayscaleFormat object. Converts an image to grayscale format.
   * @param {string} src
   * @returns {GrayscaleFormat} Returns a Grayscale object. If inputs are invalid, it returns null.
   */
  static Create(src) {
    if (!src)
      return null;

    return new GrayscaleFormat(src);
  }
}

//------------------------------
// RGB

/**
 * Convert an image to RGB.
 * @param {string} src Source
 * @param {string} outputPath The path where the image will be rendered to.
 * @returns {Promise} Returns a Promise that resolves if successful. Otherwise, it returns an error.
 */
class RgbFormat extends ColorBaseClass {
  constructor(src) {
    super();
    this.src_ = src;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    return [this.src_, '-colorspace', 'RGB'];
  }

  /**
   * @override
   */
  Name() {
    return 'RgbFormat';
  }

  /**
   * Create a RgbFormat object. Converts an image to grayscale format.
   * @param {string} src
   * @returns {RgbFormat} Returns a RgbFormat object. If inputs are invalid, it returns null.
   */
  static Create(src) {
    if (!src)
      return null;

    return new RgbFormat(src);
  }
}

//--------------------------------------
// REPLACE

class Replace extends ColorBaseClass {
  constructor(src, targetColor, desiredColor, fuzz) {
    super();
    this.src_ = src;
    this.targetColor_ = targetColor;
    this.desiredColor_ = desiredColor;
    this.fuzz_ = fuzz;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    let args = [this.src_, '-alpha', 'on', '-channel', 'rgba'];

    if (this.fuzz_ && this.fuzz_ > 0)
      args.push('-fuzz', `${this.fuzz_}%`);
    args.push('-fill', this.desiredColor_, '-opaque', this.targetColor_);

    return args;
  }

  /**
   * @override
   */
  Name() {
    return 'Replace';
  }

  /**
   * Create a Replace object. Replaces one color with another.
   * @param {string} src
   * @param {string} targetColor The color you want to change. (Valid color format string used in Image Magick)
   * @param {string} desiredColor The color that will replace the target color. (Valid color format string used in Image Magick)
   * @param {number} fuzz (Optional) A value between 0 and 100 that determines which other colors similar to the target color will be removed. (The higher the value, the more colors will disappear)
   * @returns {Replace} Returns a Replace object. If inputs are invalid, it returns null.
   */
  static Create(src, targetColor, desiredColor, fuzz) {
    if (!src || !targetColor || !desiredColor)
      return null;

    return new Replace(src, targetColor, desiredColor, fuzz);
  }
}

//---------------------------------------
// TRANSPARENCY

class Transparency extends ColorBaseClass {
  constructor(src, percent) {
    super();
    this.src_ = src;
    this.percent_ = percent;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    return [this.src_, '-alpha', 'on', '-channel', 'a', '-evaluate', 'set', `${this.percent_}%`];
  }

  /**
   * @override
   */
  Name() {
    return 'Transparency';
  }

  /**
   * Create a Transparency object. Makes an image transparent.
   * @param {string} src
   * @param {number} percent
   * @returns {Replace} Returns a Transparency object. If inputs are invalid, it returns null.
   */
  static Create(src, percent) {
    if (!src || !percent)
      return null;

    return new Transparency(src, percent);
  }
}

//-------------------------------
// CHANNEL ADJUST

class ChannelAdjust extends ColorBaseClass {
  constructor(src, channel, value) {
    super();
    this.src_ = src;
    this.channel_ = channel;
    this.value_ = value;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    return [this.src_, '-alpha', 'set', '-channel', this.channel_, '-evaluate', 'set', this.value_];
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

//------------------------------------
// AUTO LEVEL

class AutoLevel extends ColorBaseClass {
  constructor(src) {
    super();
    this.src_ = src;
  }

  /**
   * @returns {Array<string|number>} Returns an array of arguments.
   */
  Args() {
    return [this.src_, '-auto-level'];
  }

  /**
   * @override
   */
  Name() {
    return 'AutoLevel';
  }

  /**
   * Create a AutoLevel object. Renders an image whose colors are normalized (brightened). Makes really dark compare/difference images easier to analyze.
   * @param {string} src
   * @returns {AutoLevel} Returns a AutoLevel object. If inputs are invalid, it returns null.
   */
  static Create(src) {
    if (!src)
      return null;

    return new ChannelAdjust(src);
  }
}

//----------------------------
// CHANNELS

/**
 * @returns {Promise<Array<string>>} Returns a Promise. If it resolves, it returns a list of color channel names. Otherwise, it returns an error.
 */
function Channels() {
  let args = ['-list', 'channel']; // convert:  prints newline delimited list of channels

  LOCAL_COMMAND.Execute('convert', args).then(output => {
    if (output.stderr) {
      reject(`Failed to make transparent: ${output.stderr}`);
      return;
    }

    let names = output.stdout.split('\n').filter(line => line && line != '' && line.trim() != '').map(line => line.trim());
    resolve(names);
  }).catch(error => `Failed to make transparent: ${error}`);
}


//------------------------------
// EXPORTS

exports.Color = Color;

exports.CreateNegateMod = Negate.Create;
exports.CreateColorizeMod = Colorize.Create;
exports.CreateGrayscaleFormatMod = GrayscaleFormat.Create;
exports.CreateRgbFormatMod = RgbFormat.Create;
exports.CreateReplaceMod = Replace.Create;
exports.CreateTransparencyMod = Transparency.Create;
exports.CreateChannelAdjustMod = ChannelAdjust.Create;
exports.CreateAutoLevelMod = AutoLevel.Create;

exports.Channels = Channels;