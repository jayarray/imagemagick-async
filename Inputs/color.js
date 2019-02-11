let InputsBaseClass = require(PATH.join(__dirname, 'inputsbaseclass.js')).InputsBaseClass;
let Validate = require('./validate.js');

//-------------------------------------
// CONSTANTS

const HEX_CHARS = Array.from('0123456789abcdef');

const RGB_CHARS = ['r', 'g', 'b'];
const RGBA_CHARS = RGB_CHARS.concat('a');

const RGB1_LENGTH = RGB_CHARS.length;     // #rgb               (reduced, simplified notation)
const RGB1_FORMAT = '#rgb';

const RGB2_LENGTH = RGB_CHARS.length * 2; // #rrggbb            (8-bit per channel)
const RGB2_FORMAT = '#rrggbb';

const RGBA2_LENGTH = RGB2_LENGTH + 2;     // #rrggbbaa          (8-bit per channel)
const RGBA2_FORMAT = '#rrggbbaa';

const RGB4_LENGTH = RGB_CHARS.length * 4; // #rrrrggggbbbb      (16-bit per channel)
const RGB4_FORMAT = '#rrrrggggbbbb';

const RGBA4_LENGTH = RGB4_LENGTH + 4;     // #rrrrggggbbbbaaaa  (16-bit per channel)
const RGBA4_FORMAT = '#rrrrggggbbbbaaaa';

const RGB_MIN = 0;
const RGB_8_BIT_MAX = 255;
const RGB_16_BIT_MAX = Math.pow(RGB_8_BIT_MAX, 2);

const PERCENT_MIN = 0;
const PERCENT_MAX = 100;

const FORMATS = ['string', 'integers', 'percents'];

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

class Color extends InputsBaseClass {
  constructor(properties) {
    super(properties);
    this.format = properties.format;
  }

  /**
   * @override
   */
  static get Builder() {
    class Builder {
      constructor() {
        this.type = 'Color';
        this.name = 'Color';
        this.args = {};
      }

      /**
       * @param {string} hexString Hex string representation of the desired color.
       */
      hexString(hexString) {
        this.args.hexString = hexString;
        return this;
      }

      /**
       * @param {number} red Integer value of red
       */
      red(red) {
        this.args.red = red;
        return this;
      }

      /**
       * @param {number} green Integer value of green
       */
      green(green) {
        this.args.green = green;
        return this;
      }

      /**
       * @param {number} blue Integer value of blue
       */
      blue(blue) {
        this.args.blue = blue;
        return this;
      }

      /**
       * @param {number} alpha Integer value of alpha
       */
      alpha(alpha) {
        this.args.alpha = alpha;
        return this;
      }

      /**
       * @param {string} format The input format that determines how the color is constructed. The formats are: 'string' (for using a hex string), 'integers' (for using rgb values), or 'percents' (for using percent values). 
       */
      format(format) {
        this.format = format;
        return this;
      }

      build() {
        return new Color(this);
      }
    }
  }

  /**
   * @returns {{hex: {r: string, g: string, b:string, a: string, string: string, simplifiedString: string}, numbers: {r: number, g: number, b: number, a: number, string: string}, percents: {r: number, g: number, b: number, a: number, string: string}, alphaChannel: boolean, bitsPerChannel: number}} Returns an object with info pertaining to this color.  
   */
  Info() {
    let parsedInfo = null;

    if (this.format == 'string') {
      parsedInfo = ParseHextString(this.args.hexString.toLowerCase());
    }
    else if (this.format == 'integers') {
      let hexStr = RGBAIntegersToHexString(r, g, b, a);
      parsedInfo = ParseHextString(hexStr.toLowerCase());
    }
    else if (this.format == 'percents') {
      let hexStr = RGBAPercentsToHexString(r, g, b, a);
      parsedInfo = ParseHextString(hexStr.toLowerCase());
    }

    return parsedInfo;
  }

  /**
   * @returns {string} Returns the string representation of this color.
   */
  String() {
    let info = this.Info();
    let str = '';

    if (this.format == 'string')
      str = info.hex.string;
    else if (this.format == 'integers')
      str = info.numbers.string;
    else if (this.format == 'percents')
      str = info.percents.string;

    return str;
  }

  /**
   * @override
   */
  Errors() {
    let params = Color.Parameters();
    let errors = [];

    if (!Validate.IsDefined(this.format))
      errors.push('COLOR_ERROR: Format is undefined.');
    else {
      if (FORMATS.includes(this.format))
        errors.push(`COLOR_ERROR: Format is invalid. Assigned value is: ${this.format}. Must be assigned one of the following values: ${FORMATS.join(' ')}.`);
      else {
        if (this.format == 'string') {
          // Check formatting as well
          if (!Validate.IsDefined(this.args.hexString))
            errors.push(`COLOR_ERROR: Hex string is undefined.`);
          else {
            if (!Validate.IsString(this.args.hexString))
              errors.push(`COLOR_ERROR: Hex string is not a string.`);
            else {
              if (Validate.IsEmptyString(this.args.hexString))
                errors.push(`COLOR_ERROR: Hex string is empty string.`);
              else if (Validate.IsWhitespace(this.args.hexString))
                errors.push(`COLOR_ERROR: Hex string is whitespace.`);
              else {
                // Check if hex string format is correct

                if (!this.args.hexString.startsWith('#'))
                  errors.push(`COLOR_ERROR: Hex string is invalid. Must start with a '#' symbol.`);

                let hex = this.args.hexString.substring(1);
                let supposeToContainAlpha = this.args.hexString.length == RGBA2_LENGTH || this.args.hexString == RGBA4_LENGTH;
                let lengthIsInvalid = hex.length != RGB1_LENGTH
                  || hex.length != RGB2_LENGTH
                  || hex.length != RGBA2_LENGTH
                  || hex.length != RGB4_LENGTH
                  || hex.length != RGBA4_LENGTH;

                if (!lengthIsInvalid)
                  errors.push(`COLOR_ERROR: Hex string length is invalid. Must have the following number of alphanumeric characters: ${RGB1_LENGTH}, ${RGB2_LENGTH}, ${RGBA2_LENGTH}, ${RGB4_LENGTH}, or ${RGBA4_LENGTH}.`);
                else {
                  let invalidChars = Array.from(hex).filter(x => !HEX_CHARS.includes(x));
                  invalidChars = Array.from(new Set(invalidChars));

                  if (invalidChars.length > 0)
                    errors.push(`COLOR_ERROR: Hex string is invalid. Contains the following invalid characters: ${invalidChars.join(', ')}.`);
                }
              }
            }
          }
        }
        else if (this.format == 'integers') {
          // Check if all inputs are integers
          if (!Validate.IsDefined(this.args.red))
            errors.push('COLOR_ERROR: Red value is undefined.');
          else {
            if (!Validate.IsNumber(this.args.red))
              errors.push('COLOR_ERROR: Red value is not a number.');
            else {
              if (!Validate.IsInteger(this.args.red))
                errors.push('COLOR_ERROR: Red value is not an integer.');
              else {
                if (this.args.red < params.red.min)
                  errors.push(`COLOR_ERROR: Red value is out of bounds. Assigned value is: ${this.args.red}. Value must be greater than or equal to ${params.red.min}.`);
                else if (this.args.green < params.green.min)
                  errors.push(`COLOR_ERROR: Green value is out of bounds. Assigned value is: ${this.args.green}. Value must be greater than or equal to ${params.green.min}.`);
                else if (this.args.blue < params.blue.min)
                  errors.push(`COLOR_ERROR: Blue value is out of bounds. Assigned value is: ${this.args.blue}. Value must be greater than or equal to ${params.blue.min}.`);
                else if (this.args.alpha && this.args.alpha < params.alpha.min)
                  errors.push(`COLOR_ERROR: Alpha value is out of bounds. Assigned value is: ${this.args.alpha}. Value must be greater than or equal to ${params.alpha.min}.`);
              }
            }
          }
        }
        else if (this.format == 'percents') {
          // Check if all inputs are numbers
          if (!Validate.IsDefined(this.args.red))
            errors.push('COLOR_ERROR: Red value is undefined.');
          else {
            if (!Validate.IsNumber(this.args.red))
              errors.push('COLOR_ERROR: Red value is not a number.');
            else {
              if (this.args.red < params.red.min)
                errors.push(`COLOR_ERROR: Red value is out of bounds. Assigned value is: ${this.args.red}. Value must be greater than or equal to ${params.red.min}.`);
              else if (this.args.green < params.green.min)
                errors.push(`COLOR_ERROR: Green value is out of bounds. Assigned value is: ${this.args.green}. Value must be greater than or equal to ${params.green.min}.`);
              else if (this.args.blue < params.blue.min)
                errors.push(`COLOR_ERROR: Blue value is out of bounds. Assigned value is: ${this.args.blue}. Value must be greater than or equal to ${params.blue.min}.`);
              else if (this.args.alpha && this.args.alpha < params.alpha.min)
                errors.push(`COLOR_ERROR: Alpha value is out of bounds. Assigned value is: ${this.args.alpha}. Value must be greater than or equal to ${params.alpha.min}.`);
            }
          }
        }
      }
    }

    return errors;
  }

  /**
   * @override
   */
  static Parameters() {
    return {
      red: {
        type: 'number',
        min: RGB_MIN,
        default: 0
      },
      green: {
        type: 'number',
        min: RGB_MIN,
        default: 0
      },
      blue: {
        type: 'number',
        min: RGB_MIN,
        default: 0
      },
      alpha: {
        type: 'number',
        min: RGB_MIN,
        default: 0
      },
      hextString: {
        type: 'string'
      }
    };
  }
}

//----------------------------
// EXPORTS

exports.HEX_CHARS = HEX_CHARS;
exports.RGB_CHARS = RGB_CHARS;
exports.RGBA_CHARS = RGBA_CHARS;
exports.RGB1_LENGTH = RGB1_LENGTH;
exports.RGB1_FORMAT = RGB1_FORMAT;
exports.RGB2_LENGTH = RGB2_LENGTH
exports.RGB2_FORMAT = RGB2_FORMAT;
exports.RGBA2_LENGTH = RGBA2_LENGTH;
exports.RGBA2_FORMAT = RGBA2_FORMAT;
exports.RGB4_LENGTH = RGB4_LENGTH
exports.RGB4_FORMAT = RGB4_FORMAT;
exports.RGBA4_LENGTH = RGBA4_LENGTH;
exports.RGBA4_FORMAT = RGBA4_FORMAT;
exports.RGB_MIN = RGB_MIN;
exports.RGB_8_BIT_MAX = RGB_8_BIT_MAX;
exports.RGB_16_BIT_MAX = RGB_16_BIT_MAX;
exports.PERCENT_MIN = PERCENT_MIN;
exports.PERCENT_MAX = PERCENT_MAX;

exports.Color = Color;

