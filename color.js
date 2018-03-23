let VALIDATE = require('./validate.js');

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

  let
  if (
    hexString.length != RGB1_LENGTH &&
    hexString.length != RGB2_LENGTH &&
    hexString.length != RGBA2_LENGTH &&
    hexString.length != RGB4_LENGTH &&
    hexString.length != RGBA4_LENGTH
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

  return hexStr;
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

  return hexStr;
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
      let currPair = pairs[0];
      if (currPair.charAt(0) != currPair.charAt(1))
        return hexStr;
      else
        simplifiedHexStr += currPair.charAt(0);
    }

    if (simplifiedHexStr.endsWith('0'))
      simplifiedHexStr = simplifiedHexStr.substring(0, -1);

    return simplifiedHexStr;
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

    return simplifiedHexStr;
  }
  else
    return null;
}

function ParseHextString(hexStr) {
  let object = {};

  let channelType = ChannelType(hexStr);

  let hexStrNoHash = hexStr.substring(1);

  if (channelType.includes('8')) {
    // Hex strings
    let hex = {};
    hex.bitsPerChannel = 8;
    hex.r = hex.substring(0, 2);
    hex.g = hex.substring(2, 4);
    hex.b = hex.substring(4, 6);
    hex.a = '00';
    hex.alphaChannel = false;

    if (channelType.includes('A')) {
      hex.alphaChannel = true;
      hex.a = hex.substring(6, 8);
    }
    hex.string = SimplifiedHexString(`${hex.r}${hex.g}${hex.b}${hex.a}`);

    object.hex = hex;

    // Get numbers:  rgba(r, g, b, a)
    let numbers = {};
    numbers.r = HexStringToInt(rHex);
    numbers.g = HexStringToInt(gHex);
    numbers.b = HexStringToInt(bHex);
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
    rPercent = parseFloat(rPercent.toFixed(1));
    percents.r = rPercent;
    pArgs.push(`${percents.r}%`);

    let gPercent = numbers.g / RGB_8_BIT_MAX;
    gPercent = parseFloat(gPercent.toFixed(1));
    percents.g = gPercent;
    pArgs.push(`${percents.g}%`);

    let bPercent = numbers.b / RGB_8_BIT_MAX;
    bPercent = parseFloat(bPercent.toFixed(1));
    percents.b = bPercent;
    pArgs.push(`${percents.b}%`);

    percents.a = 0.0;

    if (channelType.includes('A')) {
      percents.a = numbers.a;
      pArgs.push(percents.a);
    }
    percents.string = `rgb(${args.join(', ')})`;

    object.percents = percents;

    return object;
  }
  else if (channelType.includes('16')) {
    // Hex strings
    let hex = {};
    hex.bitsPerChannel = 16;
    hex.r = hex.substring(0, 4);
    hex.g = hex.substring(4, 8);
    hex.b = hex.substring(8, 12);
    hex.a = '0000';
    hex.alphaChannel = false;

    if (channelType.includes('A')) {
      hex.alphaChannel = true;
      hex.a = hex.substring(12, 16);
    }

    hex.string = SimplifiedHexString(`${hex.r}${hex.g}${hex.b}${hex.a}`);

    object.hex = hex;

    // Get numbers:  rgba(r, g, b, a)
    let numbers = {};
    numbers.r = HexStringToInt(rHex);
    numbers.g = HexStringToInt(gHex);
    numbers.b = HexStringToInt(bHex);
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
    percents.string = `rgb(${args.join(', ')})`;

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
    let o = ParseHextString(hexStr);

    this.hex = o.hex;
    this.numbers = o.numbers;
    this.percents = o.percents;
  }

  /**
   * Create a Color object using RGB integers.
   * @param {number} r Red integer value between 0 and 255.
   * @param {number} g Green integer value between 0 and 255.
   * @param {number} b Blue integer value between 0 and 255.
   * @param {number} a Alpha float value between 0 (fully transparent) and 225 (fully opaque).
   * @returns {Promise<Color>} Returns a promise. If it resolves, it returns a Color object. Otherwise, it returns an error.
   */
  static CreateUsingRGBIntgers(r, g, b, a) {
    // Validate r
    let error = VALIDATE.IsInteger(r);
    if (error)
      return Promise.reject(`Failed to create Color object: r is ${error}`);

    error = VALIDATE.IsIntegerInRange(r, RGB_MIN, RGB_8_BIT_MAX);
    if (error)
      return Promise.reject(`Failed to create Color object: r is ${error}`);

    // Validate g
    error = VALIDATE.IsInteger(g);
    if (error)
      return Promise.reject(`Failed to create Color object: g is ${error}`);

    error = VALIDATE.IsIntegerInRange(g, RGB_MIN, RGB_8_BIT_MAX);
    if (error)
      return Promise.reject(`Failed to create Color object: g is ${error}`);

    // Validate b
    error = VALIDATE.IsInteger(b);
    if (error)
      return Promise.reject(`Failed to create Color object: b is ${error}`);

    error = VALIDATE.IsIntegerInRange(b, RGB_MIN, RGB_8_BIT_MAX);
    if (error)
      return Promise.reject(`Failed to create Color object: b is ${error}`);

    // Validate a
    error = VALIDATE.IsInteger(a);
    if (error)
      return Promise.reject(`Failed to create Color object: a is ${error}`);

    error = VALIDATE.IsIntegerInRange(a, RGB_MIN, RGB_8_BIT_MAX);
    if (error)
      return Promise.reject(`Failed to create Color object: a is ${error}`);

    // Create object
    let hexStr = RGBAIntegersToHexString(r, g, b, a);
    return Promise.resolve(new Color(hexStr));
  }

  /**
   * Create a Color object using RGB percents.
   * @param {number} r Red float value between 0 and 100.
   * @param {number} g Green float value between 0 and 100.
   * @param {number} b Blue float value between 0 and 100.
   * @param {number} a Alpha float value between 0 (fully transparent) and 100 (fully opaque).
   * @returns {Promise<Color>} Returns a promise. If it resolves, it returns a Color object. Otherwise, it returns an error.
   */
  static CreateUsingPercents(r, g, b, a) {
    // Validate r
    let error = VALIDATE.IsNumber(r);
    if (error)
      return Promise.reject(`Failed to create Color object: r is ${error}`);

    error = VALIDATE.IsNumberInRange(r, PERCENT_MIN, PERCENT_MAX);
    if (error)
      return Promise.reject(`Failed to create Color object: r is ${error}`);

    // Validate g
    error = VALIDATE.IsNumber(g);
    if (error)
      return Promise.reject(`Failed to create Color object: g is ${error}`);

    error = VALIDATE.IsNumberInRange(g, PERCENT_MIN, PERCENT_MAX);
    if (error)
      return Promise.reject(`Failed to create Color object: g is ${error}`);

    // Validate b
    error = VALIDATE.IsNumber(b);
    if (error)
      return Promise.reject(`Failed to create Color object: b is ${error}`);

    error = VALIDATE.IsNumberInRange(b, PERCENT_MIN, PERCENT_MAX);
    if (error)
      return Promise.reject(`Failed to create Color object: b is ${error}`);

    // Validate a
    error = VALIDATE.IsNumber(a);
    if (error)
      return Promise.reject(`Failed to create Color object: a is ${error}`);

    error = VALIDATE.IsNumberInRange(a, PERCENT_MIN, PERCENT_MAX);
    if (error)
      return Promise.reject(`Failed to create Color object: a is ${error}`);

    // Create object
    let hexStr = RGBAPercentsToHexString(r, g, b, a);
    return Promise.resolve(new Color(hexStr));
  }

  /**
   * Create a Color object using RGB hex string.
   * @param {string} hexStr Must follow one of the following formats: #rgb, #rrggbb, #rrggbbaa, #rrrrggggbbbb, #rrrrggggbbbbaaaa.
   * @returns {Promise<Color>} Returns a promise. If it resolves, it returns a Color object. Otherwise, it returns an error.
   */
  static CreateUsingRGBHexString(hexStr) {
    let error = FormatValidator(hexStr);
    if (error)
      return Promise.reject(`Failed to create Color object: hex string ${error}`);

    return Promise.resolve(new Color(hexStr));
  }
}

//------------------------------

let hexStr = '#0000ff';
Color.CreateUsingRGBHexString(hexStr).then(o => {
  console.log(`OUTPUT: ${JSON.stringify(o)}`);
}).catch(error => {
  console.log(`ERROR: ${error}`);
})


//------------------------------
// EXPORTS

exports.CreateUsingRGBIntegers = Color.CreateUsingRGBIntgers;
exports.CreateUsingPercents = Color.CreateUsingPercents;
exports.CreateUsingRGBHexString = Color.CreateUsingRGBHexString;

